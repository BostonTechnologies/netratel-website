import { readFile } from 'node:fs/promises';

const manifestUrl = new URL('../src/version.json', import.meta.url);

function stableVersion(value) {
  const match = /^v?(\d+)\.(\d+)\.(\d+)$/.exec(String(value));
  if (!match) throw new Error(`Expected a stable semantic version, received ${JSON.stringify(value)}.`);
  return match.slice(1).map(Number);
}

function compare(left, right) {
  for (let index = 0; index < 3; index++) {
    if (left[index] !== right[index]) return Math.sign(left[index] - right[index]);
  }
  return 0;
}

try {
  const manifest = JSON.parse(await readFile(manifestUrl, 'utf8'));
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(manifest.sourceRepo ?? '')) {
    throw new Error('src/version.json must contain a valid sourceRepo in owner/repository form.');
  }
  const documented = stableVersion(manifest.documentedVersion);
  const headers = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'netratel-website-release-check',
  };
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`https://api.github.com/repos/${manifest.sourceRepo}/releases/latest`, {
    headers,
    signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) {
    throw new Error(`GitHub returned HTTP ${response.status}; no release comparison was completed.`);
  }
  const release = await response.json();
  if (release.draft || release.prerelease || !release.published_at) {
    throw new Error('GitHub did not return a published stable release.');
  }
  const latest = stableVersion(release.tag_name);
  const direction = compare(documented, latest);
  console.log(`Documented: ${manifest.documentedVersion} (${manifest.sourceRef})`);
  console.log(`Latest stable: ${release.tag_name}`);
  console.log(`Source: https://github.com/${manifest.sourceRepo}/releases/tag/${encodeURIComponent(release.tag_name)}`);

  if (direction === 0) {
    console.log('Documentation version matches the latest stable release.');
  } else {
    console.error(direction < 0
      ? 'The product has a newer stable release. Review its changes before updating src/version.json.'
      : 'The documented version is ahead of the latest published stable release. Review the manifest.');
    process.exitCode = 1;
  }
} catch (error) {
  console.error(`Release check unavailable: ${error.message}`);
  process.exitCode = 2;
}
