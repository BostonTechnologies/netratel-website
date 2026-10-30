import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import version from '../version.json';
export const GET: APIRoute = async ({ site }) => {
 const docs = await getCollection('docs');
 const lines = docs.filter(d => !d.data.draft).sort((a,b) => a.id.localeCompare(b.id)).map(d => `- [${d.data.title}](${new URL(`/${d.id.replace(/\/index$/, '')}/`,site)}): ${d.data.description || ''}`);
 return new Response(`# NetRatel\n\n> Self-hosted automation orchestrator by Boston Technologies. Documentation targets v${version.documentedVersion}, source commit ${version.sourceCommit}.\n\n## Documentation\n\n${lines.join('\n')}\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
