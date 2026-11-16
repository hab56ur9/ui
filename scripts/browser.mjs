import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const CHROMES = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].filter(Boolean);
export const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

export async function openSite(name) {
  if (!existsSync(join(root, "index.html"))) {
    console.error(`${name}: build the site first (npm run check)`);
    process.exit(1);
  }
  const chromePath = CHROMES.find((path) => existsSync(path));
  if (!chromePath) {
    console.error(`${name}: no Chrome found; set CHROME to its path`);
    process.exit(1);
  }

  const server = createServer((request, response) => {
    const path = normalize(decodeURIComponent(new URL(request.url, "http://x").pathname)).replace(/^(\.\.[/\\])+/, "");
    const file = join(root, path.endsWith("/") ? `${path}index.html` : path);
    if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
      response.writeHead(404).end();
      return;
    }
    response.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" }).end(readFileSync(file));
  });
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const origin = `http://127.0.0.1:${server.address().port}`;

  const profile = mkdtempSync(join(tmpdir(), `${name}-`));
  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome = spawn(chromePath, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore", detached: true });
  let targets;
  for (let i = 0; i < 100 && !targets; i++) {
    await sleep(100);
    targets = await fetch(`http://127.0.0.1:${port}/json/list`)
      .then((r) => r.json())
      .catch(() => undefined);
  }
  const socket = new WebSocket(targets.find((t) => t.type === "page").webSocketDebuggerUrl);
  await new Promise((done) => socket.addEventListener("open", done));
  let seq = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id && pending.has(message.id)) pending.get(message.id)(message);
  });
  const send = (method, params = {}) =>
    new Promise((done) => {
      const id = ++seq;
      pending.set(id, done);
      socket.send(JSON.stringify({ id, method, params }));
    });
  const evaluate = async (expression) => (await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true })).result?.result?.value;

  const close = async () => {
    socket.close();
    const exited = new Promise((done) => chrome.once("exit", done));
    try {
      process.kill(-chrome.pid, "SIGKILL");
    } catch {
      chrome.kill("SIGKILL");
    }
    await exited;
    server.close();
    await sleep(300);
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 10, retryDelay: 200 });
    } catch {
      console.log(`${name}: left ${profile} behind`);
    }
  };

  return { origin, send, evaluate, close };
}
