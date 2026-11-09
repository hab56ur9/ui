# ui

ui is a personal design system: design tokens and React components for apps, technical documents and slide decks. The documentation site shows every token, component, block and template with live examples.

<https://hab56ur9.github.io/ui/>

## Contents

| Part | What it gives |
| --- | --- |
| Tokens | Color, type, space and motion in the DTCG format, built into CSS variables and a JSON snapshot |
| Components | React components for controls, charts, boards, overlays, navigation, images and social screens |
| Templates | Slide decks, technical documents and dashboards built from the components |
| SDUI | An example of drawing server-driven screens with the components, with a visual builder |
| Presets | Main and sub color pairs that restyle every component |

## Use

A React app installs the package and loads the token stylesheet once.

```bash
npm install github:hab56ur9/ui react react-dom
```

```tsx
import "ui/tokens.css";
import { Button, UIProvider } from "ui";
```

A page without a bundler imports one module. It carries React, loads the stylesheets itself, and exports every component with `render` and `h`.

```html
<div id="app"></div>
<script type="module">
  import { render, h, Calendar } from "https://hab56ur9.github.io/ui/dist/ui.js";
  render("#app", h(Calendar));
</script>
```

A local server serves a folder of such pages with the design system and live reload.

```bash
npx github:hab56ur9/ui serve pages
```

## Develop

The check builds the tokens, lints, type-checks and builds the documentation site.

```bash
npm install
npm run dev
npm run check
```

## Release

Releases run through release-please. Merging a release pull request publishes a new version of the site and the component module.

## Agent plugin

The repository also installs as a plugin for Claude Code and Codex, so an agent builds pages and decks with the same system.

```bash
claude plugin marketplace add hab56ur9/ui
claude plugin install design-system@ui
```

## License

The bundled fonts, Pretendard and Inter, ship under the SIL Open Font License with their license files.
