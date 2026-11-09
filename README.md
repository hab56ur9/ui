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

A page without a bundler links the two stylesheets and imports the component module in a module script. The module leaves react out, so an importmap points `react` at a CDN.

```html
<link rel="stylesheet" href="https://hab56ur9.github.io/ui/dist/tokens.css">
<link rel="stylesheet" href="https://hab56ur9.github.io/ui/dist/ui.css">
<script type="importmap">
{ "imports": {
  "react": "https://esm.sh/react@19.3.1",
  "react/jsx-runtime": "https://esm.sh/react@19.3.1/jsx-runtime",
  "react-dom": "https://esm.sh/react-dom@19.3.1?external=react",
  "react-dom/client": "https://esm.sh/react-dom@19.3.1/client?external=react",
  "ui": "https://hab56ur9.github.io/ui/dist/ui.js"
} }
</script>
<script type="module">
  import { createElement as h } from "react";
  import { createRoot } from "react-dom/client";
  import { Calendar } from "ui";
  createRoot(document.querySelector("#app")).render(h(Calendar));
</script>
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
