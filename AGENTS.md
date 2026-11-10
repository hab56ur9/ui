# ui Agent Guide

Working knowledge for coding agents; README.md stays a short public introduction.

## Map

```text
tokens/primitive/*.json        raw palette, space, chart marks
tokens/theme/{light,dark}.json semantic colors per theme
tokens/medium/{app,doc,slide}  type, layout, widget sizes per medium
tokens/lang/{ko,en}.json       font family and spacing per language
tokens/preset/*.json           main and sub color pairs
assets/icons/*.svg             icon sources on the 24 grid
assets/fonts/                  Pretendard (92 subsets) and Inter, OFL
src/                           components, exported from src/index.ts
src/styles/*.css               component styles, concatenated into dist/ui.css
blocks/<id>/                   compositions the docs render inline
blocks/sdui/                   SDUI renderer, app view, sample apps
docs/                          the single docs page (index.html → docs/main.tsx)
scripts/build.mjs              token build
scripts/components.mjs         prop schema from TypeScript types
scripts/lint.mjs               color-literal and local-path lint
bin/ui.mjs                     CLI: dev server and starter pages
plugin/                        Claude Code and Codex plugin, one shared skill
```

## Tokens

- Pages consume the semantic layer only; the primitive layer exists so the semantic layer has something to point at.
- Theme (`data-theme`), medium (`data-medium`) and language (`lang`) are independent mode axes. A token added to one file of an axis appears in every file of that axis, or the build fails.
- A new language is one stack in `font.stack` plus one file in `tokens/lang`. Korean is set like English: Inter for Latin and digits, Pretendard Hangul at 96% `size-adjust`.
- Text never wears a series color. Status colors always pair with an icon and a label.
- The series palette passes the dataviz validator in both modes (adjacent CVD ΔE ≥ 8, normal-vision ΔE ≥ 15); slots 2–5 sit below 3:1 on light, so charts ship direct labels or a table. Re-run it on any categorical change.
- `layout.compact.*` holds tighter inset, gap, section and stack values; an element with `data-density="compact"` swaps them in.
- Files follow DTCG Format Module 2025.10; colors are hex.

## Presets

- A preset redefines `color.main.*`, `color.sub.*`, `color.chart.emphasis` and the `sequential-main` ramp. Components use only these roles for brand color, so a preset restyles everything.
- The build writes `dist/presets/<name>.css` and `dist/presets.css` and checks every preset path exists in the theme.
- Each preset keeps 3:1 for the main color on every surface and 4.5:1 for text on its fills, in both themes.

## Build

- `npm run check` runs the token build, the prop schema, the lint, `tsc`, the library build and the site build. Run it before every commit.
- `scripts/build.mjs` writes `dist/tokens.css` (with one `@font-face` per font subset), `tokens.json`, `catalog.json`, `icons.svg`, `icons.json`, `ui.css` and the presets.
- `scripts/components.mjs` reads every exported component's props through the TypeScript API and writes `dist/components.json`.
- `vite.lib.config.ts` builds `dist/ui.js` from `src/standalone.ts`: one module with React that loads `tokens.css`, `ui.css` and `presets.css` beside itself and exports every component plus `render`, `h` and hooks. Only it stays out of git.
- Vite builds the docs into `site/`.

## Components

- Runtime libraries are react and react-dom only, as peer dependencies; build tools stay in devDependencies. The package ships TSX source and the app's bundler compiles it.
- Components take props only and do not know storage: initial values arrive as props and changes leave as events. Persisting is the app's job.
- Time series are `{ t, v }`; colors are a series slot or token name; formats group under `format`. Component text lives in `src/i18n.tsx`.
- Style colors with `var(--color-*)` only; the lint rejects raw color literals and local machine paths.
- Icons: add or redraw `assets/icons/<name>.svg` on the 24 grid with round-capped `currentColor` strokes; the build bundles them.
- `Board` with `Widget` tags is the draggable 12-column board. It takes `initialLayout` and emits `onLayoutChange` and a debounced `onLayoutCommit`. A `Widget` outside a board is a static card; `frame="plain"` drops the card, an untitled widget drops its header.
- `Modal` and `Sheet` are controlled native dialogs with an `inline` docs mode; `UIProvider` hosts toasts and confirms.
- `AppShell` takes `mobileNav="tabs"` to show `TabBar` instead of the drawer below 1024px, and `tabBar` for its `variant` (`bar`, `floating`) and `labels` (`show`, `active`, `hide`). An SDUI app sets the same through `navBar`.
- `ThemePicker` opens the preset palette and mode switch, sets `data-preset` and `data-theme` on the root, and reports through `onChange`.
- Each preset's sub color is a gray tinted toward its main hue (`lime-gray`, `sky-gray`); the theme's default sub matches the lime preset.
- `Image` draws a gradient placeholder without `src`; portrait is 3:4. `Carousel` takes `size` `full`, `card` or `mini`.
- `Badge`, `Card` and `Callout` are the shared status label, bordered group and notice; `DataTable` takes `fit` and column `wrap` for documents.
- `Markdown` is one Notion-style block editor for CommonMark + GFM (shortcuts, `/` menu, drag, `onChange` markdown); `readOnly` shows the same blocks without editing. No raw HTML; `ui` fences use `JsonUI`.

## Templates

- The repository manages templates only; writing rules live in a separate docs plugin.
- Components never assume the document they serve. Every part (table, card, badge, callout, steps, figure) is a component in `src/`; a template only composes them, and its CSS keeps layout.
- A template is a block whose `block.json` sets `category` and `kind` (`deck` or `doc`); a `templates` section shows live thumbnail cards and the picked one.
- Slides: `Deck` scales a 1920×1080 canvas with keys, presenter view and notes; layouts in `src/slides/layouts.tsx`. The slide grid (`--slide-*` vars, shown with G) fixes the top, content, hero and footer lines; `npm run check:slides` fails on drift. PDF is print CSS only.
- Frames `Doc`, `Resume` and `Portfolio` print to A4 via `src/print.tsx`; content parts live in `src/content.tsx` and `src/records.tsx`.

## SDUI

- SDUI belongs to the platform; the design system ships one engine, `JsonUI` (`src/JsonUI.tsx`): a root that draws a JSON template with exported components. Components never know they came from JSON; an app adds an adapter from its server format to this one.
- A node is `{ "type": "<ExportedName>", "props", "children" }`; props resolve `$data`, `$format`, `$each`/`$as`/`$field` and `$action` (a primitive argument arrives as `params.value`). Components are looked up at render time because of the circular import.
- JSON is the source; it renders at request time in the browser and can be pre-rendered on the server with the same engine.
- `Page` and `WidgetGrid` make the page frame and static grid expressible as nodes.
- `blocks/dashboard-mobile` (TSX) and `blocks/sdui-dashboard` (JSON) draw the same screen; their HTML must match.
- `blocks/sdui` holds the sample app protocol (`AppView`) and two sample apps; the builder reads `dist/components.json`.

## Docs

- The docs are one page; new examples and blocks become sections or tabs, never HTML entry points.
- Components group into inputs, navigation, feedback, data, content, renderers and frames; Templates holds templates and slide layouts.
- Components take one value per prop and inherit the language from `UIProvider lang`. Example text lives in `docs/text/{ko,en}.json`; an example reads one language with `useText(name)`, as if a server sent it.
- A component page needs an example file in `docs/examples/`, an entry in `docs/pages.ts` and `docs/pages.en.ts`, and an API table in `docs/api.ts` and `docs/api.en.ts`.
- Examples show without clicks, one per row. Overlays and screen-anchored parts render `inline` in `docs/Mockup.tsx`: a text-free app in a browser or phone (`device`, `place`). A demo with both screens uses `variants` (desktop, mobile) as one demo with a device switch.
- The Theme tab (`docs/TokenReview.tsx`) lists contrast failures, low-contrast series slots, misordered type scales and unused primitives.

## Release

- Commit messages follow Conventional Commits; release-please derives versions (alpha prereleases from 0.3.0) and the changelog, and moves the version in both plugin manifests.
- A push to master updates the release pull request only. Merging it tags the release and runs the deploy job.
- The deploy job attaches `ui.js`, the CSS files and `components.json` to the release, collects the latest 100 releases into `site/v/<tag>/`, and deploys Pages.
- Addresses: site `https://hab56ur9.github.io/ui/`, latest module `dist/ui.js`, pinned module `v/<tag>/ui.js`.
- Versioned folders share the site's fonts; renamed or removed font files keep their old paths until those versions leave the latest 100.
- The site address lives in `package.json` as `homepage`.

## CLI

- `bin/ui.mjs` is dependency-free. `ui serve [dir]` serves the folder at `/` and `dist/` and `assets/` at `/ui/`, injects live reload, and falls back to the docs site for `/ui/dist/*` without a local build. `--host` listens on the local network. `ui new <file>` writes a starter page.

## Plugin

- `plugin/skills/design-system/SKILL.md` and `plugin/skills/dev-server/SKILL.md` are the shared skills. `plugin/.claude-plugin` and `plugin/.codex-plugin` hold the manifests, and the root `.claude-plugin/` and `.agents/plugins/` hold the marketplaces.
- The skill links the live stylesheet for pages and inlines `dist/tokens.json` values for decks and Artifacts.

## Rules

- The repository is public: no local machine paths, personal names in prose, or company data.
- README.md stays under 3,000 characters and this file under 10,000.
- Code ships comment-free.
