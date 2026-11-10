---
name: ui-dev
description: Develops the ui design system repository itself — components, tokens, the docs site, the CLI, the app spec builder and the plugin. Invoke when changing code in this repository, on "ui 개발", "디자인 시스템 수정", or "ui dev".
---

# ui development

This skill is the working procedure for changes inside the ui repository. Project facts live in AGENTS.md and working notes in `context/`.

## Before a change

- Read `context/` and trust the code over a note that disagrees; fix the note.
- Find the closest existing component, block or script and follow its shape.
- Agree on the interface first when a change adds a new layer, axis or file format.

## While changing

- Components take props and emit events; they never read storage or know which document they serve.
- Style with `var(--*)` tokens only; a new visual value becomes a token before CSS uses it.
- Code ships without comments.
- Docs text lives in `src/site/text/{ko,en}.json`; a component page needs pages, api and example entries in both languages.

## Verify

- `npm run check` passes before every commit.
- `npm run check:slides` passes after any change to slides, layout or type tokens.
- Look at the result in a headless browser: build the site, serve `site/`, and capture the changed pages through the Chrome DevTools Protocol, following `scripts/slides-check.mjs`.
- App spec changes: `ui spec check`, `ui spec build`, then open the page under `ui serve` and exercise review, save and reload.

```bash
npm run check
npm run check:slides
node bin/ui.mjs spec build src/blocks/fitnote/spec.en.json --out /tmp/fitnote.html
```

## Commit

- Commit each verified unit with a Conventional Commits message, and push when a line of work is done.
- Release only when the maintainer asks: merge the release pull request, wait for the deploy job, then check the published files.
- Write what you learned into `context/` before you finish.
