# Contributing

Help operators finish a task with NetRatel. Public documentation should be accurate enough to follow and short enough to find the answer.

## Before writing

Read `src/version.json` and inspect the corresponding product tag. Search the existing website pages before adding another explanation. Use product source, configuration types, release artifacts and help output to resolve uncertain behavior.

Decide who the page is for and what they should accomplish. Someone installing the server needs a sequence and success checks. Someone looking up a flag needs exact syntax. Keep those reading tasks distinct.

## Choose the page shape

| Page | Include |
| --- | --- |
| Tutorial | Result, prerequisites, ordered actions, expected observations and a final verification |
| Task guide | The problem, required access, procedure, common failure and next useful link |
| Configuration or CLI reference | Intent, exact syntax, values and defaults, a useful example |
| Architecture | Component responsibilities, a readable diagram, data flow and relevant boundaries |
| Integration | Both ends of the connection, authentication, required permissions and an end-to-end check |

Add Markdown under `src/content/docs/docs/` with title and description frontmatter. Its path determines the public route. For example, `deployment/docker-compose.md` appears at `/docs/deployment/docker-compose/`.

Use root-relative internal links with a trailing slash. When changing a heading, check links to its fragment. Update the explicit Starlight sidebar in `astro.config.mjs` when adding a navigable page.

## Write the useful part first

Start with what the reader can do or which option to choose. Prefer “Set the mode on API and Web” to a paragraph introducing authentication configuration.

Keep commands complete. Name the terminal or container where they run. Show how to obtain required tooling and files, and explain the result the reader should see. Do not use a short example that hides essential setup steps.

Use a table for alternatives, options or mappings. Explain only the behavior that the table does not make clear. Link to an existing guide instead of reproducing its configuration.

Use natural contractions, sentence-case headings and direct verbs. Reserve bold for UI labels and occasional defined terms. Remove promotional language from procedures and omit generic closing summaries.

Screenshots must come from the documented product version and contain no real credentials or private deployment information. Use explanatory diagrams where a screenshot would obscure the relationship. Identify illustrative product displays as examples.

## Review the page

Read it three ways:

1. **Accuracy:** compare commands, option names and behavior with the release source. Run examples when feasible and record what was actually executed.
2. **Usability:** check prerequisites, execution locations, expected results and the next useful step. Read the page as someone who has never used NetRatel.
3. **Editing:** remove repeated information, vague advice and sentences that neither explain a decision nor help complete the task.

Do not pad a page to reach a word count. A compact reference can be shorter than a deployment guide. Do not publish empty pages or promises of future content.

## Build and submit

```bash
npm ci
npm run build
npm run check
npm run dev
```

Check the rendered page in the production preview. Exercise search and changed controls. Review mobile wrapping, code blocks, tables and heading navigation.

Explain the reader's problem, what changed and how it was verified in the pull request. GitHub validation runs the build and local checks. Publication to the existing ChatGPT Site is a separate native Sites workflow described in [README.md](README.md).
