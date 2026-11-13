#!/usr/bin/env node
import { existsSync, readFileSync, statSync, watch, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
import { buildDiagrams, checkDiagrams } from "./diagram.mjs";
import { buildHtml, checkSpec } from "./spec.mjs";

const pkgRoot = resolve(import.meta.dirname, "..");
const pkg = JSON.parse(readFileSync(join(pkgRoot, "package.json"), "utf8"));
const RELOAD = "/__ui/reload";
const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};
const CLIENT = `<script type="module">new EventSource("${RELOAD}").onmessage = () => location.reload();</script>`;
const REVIEW = "/__ui/review";
const EDITOR = `<!doctype html><html lang="en" data-medium="app"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>ui editor</title></head><body><div id="editor"></div><script type="module" src="/__ui/editor.js"></script></body></html>`;
const REVIEW_CLIENT = `<script type="module" src="${REVIEW}.js"></script>`;
const isGenerated = (html) => html.includes('<meta name="generator" content="ui spec build">');
const REVIEW_BLOCK = /<script type="application\/json" id="ui-review">[\s\S]*?<\/script>\n?/;

const HELP = `ui ${pkg.version}

Usage
  ui serve [dir] [--port 4321] [--host] [--no-reload]
  ui new <file.html> [--lang en|ko] [--medium app|doc|slide] [--cdn]
  ui lint <file…>
  ui spec check <spec.json>
  ui spec build <spec.json> [--out app.html] [--lang en|ko] [--cdn]
  ui diagram build <page.html> [--out dir] [--theme light|dark]
  ui diagram check <page.html>
  ui help

serve   Serves [dir] (default: current folder) at / and this design system at /ui/.
        Pages import "/ui/dist/ui.js". HTML reloads when a file in [dir] changes.
        --host also listens on the local network so a phone can open the page.
new     Writes a starter page that imports the design system in one line.
        --cdn imports the released module from ${pkg.homepage} instead of /ui/.
lint    Checks app pages and code against the ui contract: no raw colors, ui tokens,
        ui class names, ui stylesheet imports, hand-set theme attributes, style
        props on components or local machine paths. Apps use component props only.
spec    check validates an app spec against the components and its own data,
        formats, actions, screens and overlays. The schema is dist/spec.schema.json.
        Built pages open in the editor at /__ui/edit?file=/<page>.html under ui serve.
        build checks the spec, then writes one editable HTML file: a function per
        screen and overlay, example data inline, widgets marked with data-id.
        --lang sets the page language, number and date formats (default en).
diagram build renders every Diagram on the page in headless Chrome and writes
        <id>.svg (moves three times, then rests) and <id>.still.svg (no motion)
        for documents. Needs Chrome or Chromium; UI_CHROME overrides the path.
        --theme picks light (default) or dark. The build stops when the check fails.
diagram check renders the page and fails when labels overlap each other or a node,
        an arrow crosses a label or runs through a node, or text in a node is cut off.`;

function parse(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (!arg.startsWith("--")) {
      args._.push(arg);
      continue;
    }
    const [key, inline] = arg.slice(2).split("=");
    if (!["port", "lang", "medium", "out"].includes(key)) {
      args[key] = true;
      continue;
    }
    if (inline !== undefined) {
      args[key] = inline;
      continue;
    }
    args[key] = argv[i + 1];
    i += 1;
  }
  return args;
}

const inside = (root, path) => path === root || path.startsWith(root + sep);
const hidden = (path) => path.split("/").some((part) => part.startsWith("."));
const escape = (text) => text.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

function listing(dir, root) {
  const rows = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name))
    .map((entry) => {
      const href = `/${relative(root, join(dir, entry.name)).split(sep).join("/")}${entry.isDirectory() ? "/" : ""}`;
      return `<li><a href="${escape(href)}">${escape(entry.name)}${entry.isDirectory() ? "/" : ""}</a></li>`;
    })
    .join("");
  return `<!doctype html><html lang="en" data-medium="doc"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/ui/dist/tokens.css"><link rel="stylesheet" href="/ui/dist/ui.css"><title>${escape(relative(root, dir) || ".")}</title></head><body><main class="page"><h1 class="page-title">/${escape(relative(root, dir).split(sep).join("/"))}</h1><ul>${rows}</ul></main></body></html>`;
}

function lanAddresses() {
  return Object.values(networkInterfaces())
    .flatMap((nets) => nets ?? [])
    .filter((net) => net.family === "IPv4" && !net.internal)
    .map((net) => net.address);
}

const addresses = (port, host) => ["localhost", ...(host ? lanAddresses() : [])].map((name) => `http://${name}:${port}/`);
const hostnameOf = (req) => (req.headers.host ?? "").replace(/:\d+$/, "").replace(/^\[(.*)\]$/, "$1").toLowerCase();

const sameOrigin = (req) => req.headers.origin === `http://${req.headers.host}`;
const isJson = (req) => (req.headers["content-type"] ?? "").split(";")[0].trim() === "application/json";

function saveReview(req, res, root, send) {
  if (!sameOrigin(req) || !isJson(req)) return send(res, 403, "reviews come from pages on this server as JSON");
  const target = resolve(root, `.${new URL(req.url, "http://localhost").searchParams.get("file") ?? ""}`);
  if (!inside(root, target) || extname(target) !== ".html" || !existsSync(target)) return send(res, 404, "not a page under this folder");
  const html = readFileSync(target, "utf8");
  if (!isGenerated(html)) return send(res, 403, "only pages built by ui spec build take reviews");
  let body = "";
  req.on("data", (chunk) => (body += chunk));
  req.on("end", () => {
    let review;
    try {
      review = JSON.parse(body);
    } catch {
      return send(res, 400, "review is not JSON");
    }
    const block = `<script type="application/json" id="ui-review">\n${JSON.stringify(review, null, 2).replace(/<\//g, "<\\/")}\n</script>\n`;
    const next = REVIEW_BLOCK.test(html) ? html.replace(REVIEW_BLOCK, () => block) : html.replace('<div id="app"></div>\n', () => `<div id="app"></div>\n${block}`);
    writeFileSync(target, next);
    send(res, 200, "saved");
  });
}

function site(root, { reload = false, clients = new Set(), hosts = new Set(["localhost", "127.0.0.1", "::1"]) } = {}) {
  const send = (res, status, body, type = TYPES[".txt"]) => {
    res.writeHead(status, { "content-type": type, "cache-control": "no-store" });
    res.end(body);
  };

  const file = (res, path) => {
    const type = TYPES[extname(path).toLowerCase()] ?? "application/octet-stream";
    let body = readFileSync(path);
    if (type.startsWith("text/html")) {
      const html = body.toString("utf8");
      const inject = `${reload ? CLIENT : ""}${isGenerated(html) ? REVIEW_CLIENT : ""}`;
      if (inject) body = html.includes("</body>") ? html.replace("</body>", `${inject}</body>`) : html + inject;
    }
    send(res, 200, body, type);
  };

  return (req, res) => {
    if (!hosts.has(hostnameOf(req))) return send(res, 421, "unknown host");
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    if (hidden(path)) return send(res, 404, "not found");
    if (path === RELOAD) {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
      res.write(": connected\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (path === `${REVIEW}.js`) return send(res, 200, readFileSync(join(pkgRoot, "bin/review.js")), TYPES[".js"]);
    if (path === "/__ui/editor.js") return send(res, 200, readFileSync(join(pkgRoot, "bin/editor.js")), TYPES[".js"]);
    if (path === "/__ui/edit") return send(res, 200, EDITOR, TYPES[".html"]);
    if (path === REVIEW && req.method === "POST") return saveReview(req, res, root, send);
    if (path.startsWith("/ui/")) {
      res.setHeader("access-control-allow-origin", "*");
      const rest = path.slice(4);
      const target = resolve(pkgRoot, rest);
      const allowed = ["dist", "assets"].some((dir) => inside(join(pkgRoot, dir), target));
      if (!allowed) return send(res, 404, "not found");
      if (existsSync(target) && statSync(target).isFile()) return file(res, target);
      if (rest.startsWith("dist/")) {
        res.writeHead(302, { location: new URL(rest, pkg.homepage).href });
        return res.end();
      }
      return send(res, 404, "not found");
    }
    const target = resolve(root, `.${path}`);
    if (!inside(root, target) || !existsSync(target)) return send(res, 404, "not found");
    if (statSync(target).isDirectory()) {
      if (!path.endsWith("/")) {
        res.writeHead(301, { location: `${path}/` });
        return res.end();
      }
      const index = join(target, "index.html");
      if (existsSync(index)) return file(res, index);
      const page = listing(target, root);
      return send(res, 200, reload ? page.replace("</body>", `${CLIENT}</body>`) : page, TYPES[".html"]);
    }
    return file(res, target);
  };
}

function serve(args) {
  const root = resolve(args._[1] ?? ".");
  if (!existsSync(root) || !statSync(root).isDirectory()) throw new Error(`not a folder: ${root}`);
  const reload = !args["no-reload"];
  const clients = new Set();
  const localModule = existsSync(join(pkgRoot, "dist/ui.js"));
  const hosts = new Set(["localhost", "127.0.0.1", "::1", ...(args.host ? lanAddresses() : [])]);
  const server = createServer(site(root, { reload, clients, hosts }));

  if (reload) {
    let timer;
    const notify = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        for (const client of clients) client.write("data: reload\n\n");
      }, 80);
    };
    watch(root, { recursive: true }, (_, name) => name && !String(name).split(sep).some((part) => part.startsWith(".") || part === "node_modules") && notify());
    if (localModule) watch(join(pkgRoot, "dist"), { recursive: true }, notify);
  }

  const host = args.host ? "0.0.0.0" : "127.0.0.1";
  const listen = (port, tries) => {
    server.once("error", (error) => {
      if (error.code === "EADDRINUSE" && tries > 0) return listen(port + 1, tries - 1);
      throw error;
    });
    server.listen(port, host, () => {
      console.log(`ui ${pkg.version} serving ${root}`);
      for (const url of addresses(port, args.host)) console.log(`  ${url}`);
      console.log(`  design system at /ui/ (${localModule ? "local build" : `latest release from ${pkg.homepage}`})`);
      if (reload) console.log("  reloads on change; Ctrl+C stops");
      if (args.host) console.warn("  warning: anyone on this network can read every file in this folder except hidden ones");
    });
  };
  listen(Number(args.port ?? 4321), 10);
}

function create(args) {
  const name = args._[1];
  if (!name) throw new Error("ui new <file.html>");
  const path = resolve(name.endsWith(".html") ? name : `${name}.html`);
  if (existsSync(path)) throw new Error(`already exists: ${path}`);
  const lang = args.lang === "ko" ? "ko" : "en";
  const medium = ["app", "doc", "slide"].includes(args.medium) ? args.medium : "app";
  const from = args.cdn ? new URL("dist/ui.js", pkg.homepage).href : "/ui/dist/ui.js";
  const t = lang === "ko" ? { title: "새 페이지", lede: "디자인 시스템 컴포넌트로 만든 페이지입니다.", visitors: "방문자", start: "시작하기" } : { title: "New page", lede: "A page built from the design system components.", visitors: "Visitors", start: "Get started" };
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(
    path,
    `<!doctype html>
<html lang="${lang}" data-medium="${medium}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${t.title}</title>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    import { render, h, themes, Button, Page, Stat } from "${from}";

    render(
      "#app",
      h(Page, { title: "${t.title}", lede: "${t.lede}", actions: h(Button, { variant: "primary" }, "${t.start}") },
        h(Stat, { label: "${t.visitors}", value: "1,204", delta: { change: 0.12 } }),
      ),
      { theme: themes.lime.minimal },
    );
  </script>
</body>
</html>
`,
  );
  console.log(`created ${path}`);
  if (!args.cdn) console.log(`open it with: ui serve ${relative(process.cwd(), dirname(path)) || "."}`);
}

const LINT = [
  ["raw color literal; colors come from components, so pass a tone or variant prop", /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/],
  ["local machine path; link the published site or a relative path", /file:\/\/\/|\/Users\/|~\/Developer/],
  ["ui token used directly; tokens are private, so style through component props", /var\(--[a-z]/],
  ["ui stylesheet imported; ui loads its own CSS through UIProvider or render", /ui\/(?:tokens|ui|presets|styles)\.css|dist\/(?:tokens|ui|presets|styles)(?:\/[\w-]+)?\.css/],
  ["theme or medium attribute set by hand; pass themes.<preset>.<style> to UIProvider, and templates set the medium", /data-(?:preset|style|medium)=/],
  ["motion attribute set by hand; turn motion on with the motion prop of Diagram, Infographic or Board", /data-(?:motion|digit)\b/],
  ["style passed to a component; components take props only", /\bh\([A-Z][\w.]*,\s*\{[^}]*\bstyle\s*:|<[A-Z][\w.]*\b[^>]*\sstyle=\{/],
];

const uiClasses = () => new Set([...readFileSync(join(pkgRoot, "dist/ui.css"), "utf8").matchAll(/\.(-?[a-z][\w-]*)/g)].map((match) => match[1]));

function classProblems(line, classes) {
  const named = [...line.matchAll(/\bclass(?:Name)?\s*[=:]\s*\{?\s*["'`]([^"'`]+)["'`]/g)].flatMap((match) => match[1].split(/\s+/));
  const selector = line.match(/^\s*([^{}();="'`]+)\{/)?.[1] ?? "";
  const selected = [...selector.matchAll(/\.([a-z][\w-]*)/g)].map((match) => match[1]);
  return [...new Set([...named, ...selected])].filter((name) => classes.has(name));
}

function lint(files) {
  if (!files.length) throw new Error("ui lint <file…>");
  const classes = uiClasses();
  let count = 0;
  for (const file of files) {
    readFileSync(resolve(file), "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const [message, pattern] of LINT) {
          if (!pattern.test(line)) continue;
          count += 1;
          console.log(`  ✗ ${file}:${i + 1} ${message}: ${line.trim().slice(0, 120)}`);
        }
        const leaked = classProblems(line, classes);
        if (leaked.length === 0) return;
        count += 1;
        console.log(`  ✗ ${file}:${i + 1} ui class name used (${leaked.join(", ")}); class names are private, so use the component: ${line.trim().slice(0, 120)}`);
      });
  }
  console.log(count ? `${count} problems` : "lint: clean");
  if (count) process.exitCode = 1;
}

function checkFile(file) {
  if (!file) throw new Error("ui spec check <spec.json>");
  const { components } = JSON.parse(readFileSync(join(pkgRoot, "dist/components.json"), "utf8"));
  const errors = checkSpec(JSON.parse(readFileSync(resolve(file), "utf8")), components);
  for (const error of errors) console.log(`  ✗ ${error}`);
  console.log(errors.length ? `${file}: ${errors.length} problems` : `${file}: valid`);
  if (errors.length) process.exitCode = 1;
}

function buildFile(file, args) {
  if (!file) throw new Error("ui spec build <spec.json> [--out app.html] [--cdn]");
  checkFile(file);
  if (process.exitCode) return;
  const spec = JSON.parse(readFileSync(resolve(file), "utf8"));
  const out = resolve(args.out ?? file.replace(/\.json$/, "") + ".html");
  const module = args.cdn ? new URL("dist/ui.js", pkg.homepage).href : "/ui/dist/ui.js";
  writeFileSync(out, buildHtml(spec, { module, lang: args.lang === "ko" ? "ko" : "en" }));
  console.log(`built ${relative(process.cwd(), out)}`);
  if (!args.cdn) console.log(`open it with: ui serve ${relative(process.cwd(), dirname(out)) || "."}`);
}

const args = parse(process.argv.slice(2));
const command = args._[0] ?? "help";
try {
  if (command === "serve") serve(args);
  else if (command === "new") create(args);
  else if (command === "lint") lint(args._.slice(1));
  else if (command === "spec" && args._[1] === "check") checkFile(args._[2]);
  else if (command === "spec" && args._[1] === "build") buildFile(args._[2], args);
  else if (command === "diagram" && args._[1] === "build") await buildDiagrams(args._[2], { out: args.out, theme: args.theme, handler: site });
  else if (command === "diagram" && args._[1] === "check") process.exitCode = (await checkDiagrams(args._[2], { theme: args.theme, handler: site })).length ? 1 : 0;
  else console.log(HELP);
} catch (error) {
  console.error(`ui: ${error.message}`);
  process.exit(1);
}
