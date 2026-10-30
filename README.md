# NetRatel website

The NetRatel product home and public documentation, built with Astro and Starlight. [BostonTechnologies/netratel-website](https://github.com/BostonTechnologies/netratel-website) is the canonical source repository. The published site is managed through [ChatGPT Sites](https://chatgpt.com/space/sites).

**Live website:** [netratel.hello43031.chatgpt.site](https://netratel.hello43031.chatgpt.site)

Documentation targets the release recorded in [`src/version.json`](src/version.json). Change that manifest only after reviewing the corresponding product release. It records the product tag, source commit and review date independently of the website package version.

## Local development

Use Node.js 22.12 or later and npm. Install the locked dependencies:

```bash
npm ci
npm run build
npm run check
npm run dev
```

Open the address printed by Astro. In this repository, **`dev` previews the built `dist/` output** so the preview includes Pagefind search. Build before starting it, and rebuild after content or code changes.

For live source updates while writing:

```bash
npm run watch
```

The live development server does not produce the complete production search index. Return to a production build and preview when checking search or preparing a publication.

| Command | Result |
| --- | --- |
| `npm ci` | Install exact dependencies from the lockfile |
| `npm run watch` | Start Astro's live source server |
| `npm run build` | Generate the static website in `dist/` |
| `npm run check` | Check built pages, local links, anchors, images and search files |
| `npm run dev` or `npm run preview` | Serve the existing production build |
| `npm run check:release` | Compare the documented version with the newest stable GitHub release |

The release check reads GitHub and changes nothing. It exits with code 1 for version drift and 2 when it cannot establish the release state. Set `GITHUB_TOKEN` or `GH_TOKEN` in the shell if an authenticated GitHub read is needed. The script never prints the token.

## Content and design

```text
src/content/docs/docs/   Task-based documentation at /docs/
src/pages/              Product and other custom pages
src/components/         Shared navigation and Starlight overrides
src/styles/             Product and documentation styles
src/version.json        Documented NetRatel release and source identity
public/brand/           Boston Technologies / NetRatel branding
scripts/                Lightweight build and release checks
.openai/hosting.json    Existing ChatGPT Site identity and static output directory
```

Start with [CONTRIBUTING.md](CONTRIBUTING.md) before adding documentation. Use the tagged NetRatel source to verify commands and behavior. The product's internal Markdown is research material; public pages should help a reader finish a task without carrying internal campaign or implementation history into the site.

Keep pages short enough to scan. Link to the existing explanation when another page already owns a topic. Use examples with reserved domains, invented tenant names and no real credentials or private deployment details.

## Validation

Pull requests and pushes to `main` run dependency installation, a production build and the local site checks. The workflow has a ten-minute limit. It does not deploy to Sites or contact a running NetRatel instance.

`scripts/check-site.mjs` checks all built HTML pages, verifies documentation bodies exist, resolves local links and fragments, checks referenced assets and confirms that Pagefind generated its runtime and index. It makes no external requests and requires no browser installation.

Before publishing a visible change, also review the homepage and a representative documentation page at desktop and mobile widths. Check the menu, search, keyboard focus and copy controls. Validate changed product examples against the documented release. Record whether they were executed or checked against source.

## Publish through ChatGPT Sites

The tracked `.openai/hosting.json` identifies the existing Site and its `dist` static output. Preserve that identity when updating the site.

1. Edit this repository and run the build and checks.
2. Push the reviewed source to GitHub.
3. Use the native Sites workflow to synchronize the same source with the existing Site, package the build, save a version and deploy it.
4. Confirm the deployment result and retain its version information.

A GitHub push alone does **not** deploy the ChatGPT Site. The Sites workflow keeps its own source and version records. Source changes in either environment must be reconciled into this GitHub repository before the next publication.

Do not commit deployment credentials, short-lived repository tokens, `.env` files or generated `dist/` output. The hosting manifest contains Site identity and configuration, not authentication material.

## Add the permanent domain

When the domain is ready, attach it to the existing Site through the native Sites domain controls and configure the DNS records returned by that operation. Set the canonical origin at build time:

```bash
SITE_URL=https://your-product-domain.example npm run build
npm run check
```

Use an origin with no trailing path. Rebuild and deploy through Sites after changing the origin so canonical URLs and sharing metadata use the new address. A runtime environment change does not rewrite a previously built static site.

The Astro build generates `sitemap.xml` and `robots.txt` from the configured origin. Include the complete final `dist/` output in the Site publication.

## Ownership and reference

Site source is Apache-2.0. NetRatel and Boston Technologies brand assets remain the property of Boston Technologies. Product licensing is documented in the [NetRatel repository](https://github.com/BostonTechnologies/netratel).

The [NetClaw website](https://github.com/netclaw-dev/netclaw-website) informed the choice of Astro/Starlight and the editorial approach. This site's implementation and NetRatel documentation were written independently.
