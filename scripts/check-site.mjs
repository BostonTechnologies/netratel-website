import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const docs = join(root, 'src/content/docs');
const problems = new Set();

function walk(directory) {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? walk(path) : entry.isFile() ? [path] : [];
  });
}

function decode(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: ' ' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (original, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] ?? original;
    const code = entity[1].toLowerCase() === 'x' ? parseInt(entity.slice(2), 16) : Number(entity.slice(1));
    return code >= 0 && code <= 0x10ffff ? String.fromCodePoint(code) : original;
  });
}

function attributes(source) {
  const result = new Map();
  const pattern = /([^\s=/'"<>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s'"=<>`]+)))?/g;
  for (const match of source.matchAll(pattern)) result.set(match[1].toLowerCase(), decode(match[2] ?? match[3] ?? match[4] ?? ''));
  return result;
}

function tags(html) {
  const result = [];
  const pattern = /<(\/?[a-z][\w:-]*)\b((?:[^"'<>]|"[^"]*"|'[^']*')*)>/gi;
  for (const match of html.matchAll(pattern)) {
    result.push({ tag: match[1].toLowerCase(), attrs: attributes(match[2]), start: match.index, end: match.index + match[0].length });
  }
  return result;
}

function docsBody(html, elements) {
  const start = elements.findIndex(({ attrs }) => (attrs.get('class') ?? '').split(/\s+/).includes('sl-markdown-content'));
  if (start === -1) return null;
  const container = elements[start];
  let depth = 1;
  for (const item of elements.slice(start + 1)) {
    if (item.tag === container.tag) depth++;
    if (item.tag === `/${container.tag}`) depth--;
    if (depth === 0) return html.slice(container.end, item.start);
  }
  return null;
}

function textOnly(html) {
  return decode(html
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]+>/g, ' '))
    .replace(/\s+/g, ' ').trim();
}

function routeFor(file) {
  const path = relative(dist, file).split(sep).join('/');
  return `/${path.replace(/(?:^|\/)index\.html$/, (part) => part.startsWith('/') ? '/' : '')}`;
}

function resolveFile(pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch { return null; }
  const path = resolve(dist, `.${decoded}`);
  if (path !== dist && !path.startsWith(`${dist}${sep}`)) return null;
  return [path, join(path, 'index.html'), `${path}.html`].find((candidate) => existsSync(candidate) && statSync(candidate).isFile());
}

if (!existsSync(join(dist, 'index.html'))) {
  console.error('dist/index.html is missing. Run npm run build before npm run check.');
  process.exit(1);
}

const files = walk(dist);
const pages = files.filter((path) => path.endsWith('.html'));
const parsed = new Map();
const origins = new Set();
if (process.env.SITE_URL) {
  try { origins.add(new URL(process.env.SITE_URL).origin); }
  catch { problems.add('SITE_URL is not a valid URL.'); }
}

for (const page of pages) {
  const html = readFileSync(page, 'utf8');
  const elements = tags(html);
  const ids = new Set();
  for (const item of elements) {
    if (item.attrs.has('id')) ids.add(item.attrs.get('id'));
    if (item.tag === 'a' && item.attrs.has('name')) ids.add(item.attrs.get('name'));
    if (item.tag === 'link' && item.attrs.get('rel') === 'canonical') {
      try { origins.add(new URL(item.attrs.get('href')).origin); } catch {}
    }
  }
  if (!/<title>\s*[^<]+<\/title>/i.test(html)) problems.add(`${routeFor(page)}: missing page title.`);
  if (!elements.some(({ tag }) => tag === 'main')) problems.add(`${routeFor(page)}: missing main content.`);
  parsed.set(page, { html, elements, ids });
}

let docCount = 0;
for (const source of walk(docs).filter((file) => /\.mdx?$/.test(file))) {
  const slug = relative(docs, source).split(sep).join('/').replace(/\.mdx?$/, '').replace(/(?:^|\/)index$/, '');
  const built = join(dist, slug, 'index.html');
  docCount++;
  const page = parsed.get(built);
  if (!page) { problems.add(`${relative(root, source)}: built documentation page is missing.`); continue; }
  const body = docsBody(page.html, page.elements);
  if (body === null || textOnly(body).length === 0) problems.add(`${routeFor(built)}: documentation body is missing or empty.`);
  if (/\b(?:content coming soon|TODO|TBD)\b/i.test(textOnly(body ?? ''))) problems.add(`${routeFor(built)}: visible unfinished documentation text.`);
}
if (docCount === 0) problems.add('No documentation source pages were found.');

let references = 0;
const referenceAttributes = new Map([
  ['a', ['href']], ['img', ['src']], ['source', ['src']],
  ['script', ['src']], ['link', ['href']], ['video', ['src', 'poster']], ['audio', ['src']],
]);

function checkReference(raw, from, fragmentRequired) {
  if (!raw || /^(?:mailto:|tel:|data:|javascript:|blob:)/i.test(raw)) return;
  const fallbackOrigin = [...origins][0] || 'https://site.invalid';
  let url;
  try { url = new URL(raw, `${fallbackOrigin}${routeFor(from)}`); }
  catch { problems.add(`${routeFor(from)}: invalid URL ${JSON.stringify(raw)}.`); return; }
  if (!['http:', 'https:'].includes(url.protocol)) return;
  if (url.origin !== fallbackOrigin && !origins.has(url.origin)) return;
  references++;
  const target = resolveFile(url.pathname);
  if (!target) { problems.add(`${routeFor(from)}: missing local target ${raw}.`); return; }
  if (fragmentRequired && url.hash && parsed.has(target)) {
    let fragment;
    try { fragment = decodeURIComponent(url.hash.slice(1)); }
    catch { problems.add(`${routeFor(from)}: invalid fragment ${raw}.`); return; }
    if (fragment && !parsed.get(target).ids.has(fragment)) problems.add(`${routeFor(from)}: missing anchor ${raw}.`);
  }
}

for (const [page, value] of parsed) {
  for (const item of value.elements) {
    for (const attr of referenceAttributes.get(item.tag) ?? []) checkReference(item.attrs.get(attr), page, item.tag === 'a');
    if (['img', 'source'].includes(item.tag) && item.attrs.has('srcset') && !item.attrs.get('srcset').startsWith('data:')) {
      for (const candidate of item.attrs.get('srcset').split(',')) checkReference(candidate.trim().split(/\s+/)[0], page, false);
    }
  }
}

const searchRuntime = files.find((file) => /[\/]_?pagefind[\/]pagefind\.js$/.test(file));
if (!searchRuntime) problems.add('Pagefind runtime is missing from the production build.');
if (!files.some((file) => /\.(?:pf_index|pf_meta)$/.test(file))) problems.add('Pagefind search index is missing from the production build.');

console.log(`Checked ${pages.length} HTML pages, ${docCount} documentation pages and ${references} local references.`);
if (problems.size) {
  console.error(`Found ${problems.size} problem${problems.size === 1 ? '' : 's'}:`);
  for (const problem of problems) console.error(`- ${problem}`);
  process.exitCode = 1;
} else {
  console.log('Rendered content, internal links, anchors, assets and Pagefind output passed.');
}
