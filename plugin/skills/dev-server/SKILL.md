---
name: dev-server
description: Runs the ui CLI to start a local development server for HTML pages built on the ui design system, or to create a starter page. Invoke on "개발 서버 띄워", "로컬 서버", "페이지 띄워줘", "휴대폰에서 보게", "새 페이지 만들어", "ui serve", or "dev server".
user-invocable: true
---

# ui Dev Server

The ui CLI serves a folder of HTML pages together with the design system, and reloads the browser when a file changes.

## Commands

- `ui serve [dir]` serves the folder at `/` and the design system at `/ui/`. The default folder is the current one and the default port is 4321; a busy port moves to the next one.
- `ui serve [dir] --host` also listens on the local network and prints the network address, so a phone on the same Wi-Fi opens the page.
- `ui serve [dir] --no-reload` turns live reload off.
- `ui new <file.html>` writes a starter page. `--lang en`, `--medium doc|slide` and `--cdn` change the language, the medium and the import source.
- `ui help` prints the usage.

## Running it

- Inside the ui repository, run `node bin/ui.mjs` or `npm run serve -- <dir>`.
- In a project that installed ui from GitHub, run `npx ui`.
- Elsewhere, run `npx github:hab56ur9/ui` with the same arguments.

```bash
npx github:hab56ur9/ui new pages/report.html
npx github:hab56ur9/ui serve pages --host
```

## Pages

- A page imports the design system in one line from `/ui/dist/ui.js`. The module carries React, loads the stylesheets and exports every component with `render` and `h`.
- `/ui/dist/ui.js` is the local build when one exists, otherwise a redirect to the latest release on the docs site.
- A page meant to work without the server imports from the docs site instead, which `ui new --cdn` writes.

```html
<div id="app"></div>
<script type="module">
  import { render, h, Calendar } from "/ui/dist/ui.js";
  render("#app", h(Calendar));
</script>
```

## Rules

- Start the server in the background and report the printed address.
- Use `--host` only when the user asks to open the page from another device; the default listens on this machine only.
- Stop the server when the user is done with it.
- Build pages with the components and tokens as the design-system skill describes.
