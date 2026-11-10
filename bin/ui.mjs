#!/usr/bin/env node
import { existsSync, readFileSync, statSync, watch, writeFileSync, readdirSync, mkdirSync } from "node:fs";
import { createServer } from "node:http";
import { networkInterfaces } from "node:os";
import { dirname, extname, join, relative, resolve, sep } from "node:path";
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
const REVIEW_CLIENT = `<script type="module" src="${REVIEW}.js"></script>`;
const isGenerated = (html) => html.includes('<meta name="generator" content="ui spec build">');
const REVIEW_BLOCK = /<script type="application\/json" id="ui-review">[\s\S]*?<\/script>\n?/;

const HELP = `ui ${pkg.version}

Usage
  ui serve [dir] [--port 4321] [--host] [--no-reload]
  ui new <file.html> [--lang en|ko] [--medium app|doc|slide] [--cdn]
  ui spec check <spec.json>
  ui spec build <spec.json> [--out app.html] [--lang en|ko] [--cdn]
  ui help

serve   Serves [dir] (default: current folder) at / and this design system at /ui/.
        Pages import "/ui/dist/ui.js". HTML reloads when a file in [dir] changes.
        --host also listens on the local network so a phone can open the page.
new     Writes a starter page that imports the design system in one line.
        --cdn imports the released module from ${pkg.homepage} instead of /ui/.
spec    check validates an app spec against the components and its own data,
        formats, actions, screens and overlays. The schema is dist/spec.schema.json.
        build checks the spec, then writes one editable HTML file: a function per
        screen and overlay, example data inline, widgets marked with data-id.
        --lang sets the page language, number and date formats (default en).`;

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

function listing(dir, root) {
  const rows = readdirSync(dir, { withFileTypes: true })
    .filter((entry) => !entry.name.startsWith("."))
    .sort((a, b) => Number(b.isDirectory()) - Number(a.isDirectory()) || a.name.localeCompare(b.name))
    .map((entry) => {
      const href = `/${relative(root, join(dir, entry.name)).split(sep).join("/")}${entry.isDirectory() ? "/" : ""}`;
      return `<li><a href="${href}">${entry.name}${entry.isDirectory() ? "/" : ""}</a></li>`;
    })
    .join("");
  return `<!doctype html><html lang="en" data-medium="doc"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="/ui/dist/tokens.css"><link rel="stylesheet" href="/ui/dist/ui.css"><title>${relative(root, dir) || "."}</title></head><body><main class="page"><h1 class="page-title">/${relative(root, dir).split(sep).join("/")}</h1><ul>${rows}</ul></main></body></html>`;
}

function addresses(port, host) {
  const urls = [`http://localhost:${port}/`];
  if (!host) return urls;
  for (const nets of Object.values(networkInterfaces())) {
    for (const net of nets ?? []) if (net.family === "IPv4" && !net.internal) urls.push(`http://${net.address}:${port}/`);
  }
  return urls;
}

function saveReview(req, res, root, send) {
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

function serve(args) {
  const root = resolve(args._[1] ?? ".");
  if (!existsSync(root) || !statSync(root).isDirectory()) throw new Error(`not a folder: ${root}`);
  const reload = !args["no-reload"];
  const clients = new Set();
  const localModule = existsSync(join(pkgRoot, "dist/ui.js"));

  const send = (res, status, body, type = TYPES[".txt"]) => {
    res.writeHead(status, { "content-type": type, "cache-control": "no-store", "access-control-allow-origin": "*" });
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

  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://localhost").pathname);
    if (path === RELOAD) {
      res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive" });
      res.write(": connected\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }
    if (path === `${REVIEW}.js`) return send(res, 200, readFileSync(join(pkgRoot, "bin/review.js")), TYPES[".js"]);
    if (path === REVIEW && req.method === "POST") return saveReview(req, res, root, send);
    if (path.startsWith("/ui/")) {
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
  });

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
  <div id="theme"></div>
  <script type="module">
    import { render, h, Button, Stat, ThemePicker } from "${from}";

    render(
      "#app",
      h("main", { className: "page" },
        h("h1", { className: "page-title" }, "${t.title}"),
        h("p", { className: "page-lede" }, "${t.lede}"),
        h(Stat, { label: "${t.visitors}", value: "1,204", delta: { change: 0.12 } }),
        h(Button, { variant: "primary" }, "${t.start}"),
      ),
    );
    render("#theme", h(ThemePicker, { floating: true }));
  </script>
</body>
</html>
`,
  );
  console.log(`created ${path}`);
  if (!args.cdn) console.log(`open it with: ui serve ${relative(process.cwd(), dirname(path)) || "."}`);
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
  else if (command === "spec" && args._[1] === "check") checkFile(args._[2]);
  else if (command === "spec" && args._[1] === "build") buildFile(args._[2], args);
  else console.log(HELP);
} catch (error) {
  console.error(`ui: ${error.message}`);
  process.exit(1);
}
