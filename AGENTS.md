# Working on the NetRatel website

## Scope and ownership

This repository owns the public product site and user documentation. The NetRatel application lives in `BostonTechnologies/netratel`. Keep application implementation, internal test campaigns and deployment-specific records out of public pages.

GitHub is the canonical source. `.openai/hosting.json` identifies the existing ChatGPT Site. Preserve its `project_id` and current access setting. GitHub CI validates the site; a GitHub push does not publish it. Use the native Sites workflow for source synchronization, saving versions and deployment.

Do not commit credentials, environment files, generated output or private screenshots. Use existing brand assets from `public/brand/` and preserve their ownership. No NetClaw source, assets or prose are included in this independently authored site.

## Verify product facts

`src/version.json` records the documented product version, tag and source commit. Verify behavior against that tag before changing commands, configuration, defaults or platform support. A later `main` implementation is not proof that a feature exists in the documented release.

Prefer release source, schemas, published artifacts and actual help output when repository prose disagrees. Make exact platform and runtime requirements clear. Distinguish verified execution from source review. Never describe an example as tested unless it was run.

Bump the documentation version only after reviewing the target release and updating affected pages together. Do not use the website package version as the product version. The manual `check:release` command reports drift and does not rewrite content or open issues.

## Write for the reader

Read `CONTRIBUTING.md`. Each page should answer one practical question or support one task. Put the action or decision first. Use commands and tables for structured material; use prose to explain the details the example cannot show.

Choose familiar search terms for page titles. Use sentence-case headings, direct instructions and short paragraphs. Name UI controls exactly. Give prerequisites, the command's execution location and a way to recognize success.

Remove generic introductions, repeated summaries, inflated claims and explanations of familiar platform concepts. Keep one canonical explanation of a topic and link to it from related pages. Do not copy the product's internal docs verbatim.

Use synthetic public domains and invented examples. Make illustrative interfaces identifiable as examples. Do not invent customer counts, uptime claims, testimonials, benchmarks or unsupported product behavior.

## Implement and validate

Keep the site static unless the requested behavior requires otherwise. Astro builds to `dist/`; Starlight supplies documentation navigation and Pagefind search. Preserve accessible labels, keyboard focus, semantic headings and reduced-motion behavior.

Use these commands after a content or implementation change:

```bash
npm run build
npm run check
```

`npm run dev` serves the existing production output. Build before using it. `npm run watch` starts the live source server, where the complete production search index is unavailable.

The local check covers rendered content, internal links, fragments, assets and Pagefind output. Add a focused check only to address a concrete failure risk. Avoid external crawlers, new browser dependencies and long-running product integration tests in website CI.

For visible changes, inspect relevant desktop and mobile pages and exercise the changed interaction. Keep the GitHub validation workflow within its ten-minute limit. Report a verification limit directly instead of silently treating an unexecuted check as successful.

## Publication

Publish when the user's instruction authorizes it. Preserve the Site identity and audience, synchronize the reviewed source, and deploy the build matching that source. Confirm the native deployment result before reporting a live URL.

Set `SITE_URL` at build time when changing the canonical hostname. Use the native Sites custom-domain operation for domain attachment and its returned DNS records. Rebuild metadata and deploy after changing the origin.
