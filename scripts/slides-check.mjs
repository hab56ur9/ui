import { spawn } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { extname, join, normalize } from "node:path";

const root = join(import.meta.dirname, "..", "site");
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".json": "application/json", ".svg": "image/svg+xml", ".woff2": "font/woff2" };
const CHROMES = [process.env.CHROME, "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", "/usr/bin/google-chrome", "/usr/bin/chromium", "/usr/bin/chromium-browser"].filter(Boolean);
const TOLERANCE = 1;
const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

if (!existsSync(join(root, "index.html"))) {
  console.error("slides-check: build the site first (npm run check)");
  process.exit(1);
}
const chromePath = CHROMES.find((path) => existsSync(path));
if (!chromePath) {
  console.error("slides-check: no Chrome found; set CHROME to its path");
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

const profile = mkdtempSync(join(tmpdir(), "slides-check-"));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(chromePath, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore" });
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
const go = async (hash, lang) => {
  await send("Page.navigate", { url: `${origin}/?lang=${lang}&theme=light#/${hash}` });
  await sleep(1500);
  await evaluate("document.fonts.ready.then(() => true)");
};
await send("Emulation.setDeviceMetricsOverride", { width: 1600, height: 1200, deviceScaleFactor: 1, mobile: false });

const MEASURE = `async (deck) => {
  if (!deck.querySelector('.slide-grid')) deck.dispatchEvent(new KeyboardEvent('keydown', { key: 'g', bubbles: true }));
  await new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)));
  const slide = deck.querySelector('.deck-page.is-current .slide');
  const base = slide.getBoundingClientRect();
  const k = base.width / 1920;
  const box = (el) => { const r = el.getBoundingClientRect(); return { y: Math.round((r.top - base.top) / k), b: Math.round((r.bottom - base.top) / k), r: Math.round((r.right - base.left) / k), h: r.height / k }; };
  const lines = (el) => Math.round(box(el).h / parseFloat(getComputedStyle(el).lineHeight));
  const body = slide.querySelector('.slide-body');
  const head = body.querySelector(':scope > .slide-head');
  const hero = body.querySelector(':scope > .slide-hero-kicker');
  const title = head?.querySelector('.slide-title');
  const takeaway = body.querySelector(':scope > .takeaway');
  const content = [...body.children].filter((el) => el !== head && el !== takeaway && el !== hero).sort((a, b) => box(a).y - box(b).y);
  const visible = [...body.querySelectorAll('*')].filter((el) => el.getBoundingClientRect().width > 0 && !el.closest('svg, .sr-only'));
  const line = (name) => box(slide.querySelector('.slide-grid-line[data-line="' + name + '"]')).y;
  const columns = slide.querySelector('.slide-grid-columns');
  const foot = slide.querySelector('.slide-foot');
  return {
    grid: { top: line('top'), content: line('content'), hero: line('hero'), foot: line('foot'), right: box(columns).r },
    kind: hero ? 'hero' : head ? 'content' : 'other',
    title: title ? { y: box(title).y, lines: lines(title) } : null,
    takeaway: takeaway ? { y: box(takeaway).y, lines: lines(takeaway) } : null,
    content: content[0] ? box(content[0]).y : null,
    hero: hero && hero.nextElementSibling ? box(hero.nextElementSibling).y : null,
    right: Math.max(...visible.map((el) => box(el).r)),
    bottom: Math.max(...visible.map((el) => box(el).b)),
    limit: foot ? line('foot') : box(columns).b,
  };
}`;

const slides = [];
for (const lang of ["ko", "en"]) {
  await go("slide-templates", lang);
  const decks = await evaluate(`[...document.querySelectorAll('.docs-templates > .card')].map((b) => b.querySelector('.docs-template-title').textContent)`);
  for (const [d, name] of decks.entries()) {
    await evaluate(`document.querySelectorAll('.docs-templates > .card')[${d}].click()`);
    await sleep(800);
    const total = await evaluate(`Number([...document.querySelectorAll('.deck')].at(-1).querySelector('.deck-count').textContent.split('/')[1])`);
    for (let n = 1; n <= total; n++) {
      slides.push({ where: `${lang} ${name} ${n}`, ...(await evaluate(`(${MEASURE})([...document.querySelectorAll('.deck')].at(-1))`)) });
      await evaluate(`[...document.querySelectorAll('.deck')].at(-1).querySelectorAll('.deck-button')[1].click()`);
      await sleep(150);
    }
  }
  await go("slide-layouts", lang);
  const layouts = await evaluate(`[...document.querySelectorAll('.docs-gallery-item h3')].map((h) => h.textContent)`);
  for (const [i, name] of layouts.entries()) {
    slides.push({ where: `${lang} layout ${name}`, ...(await evaluate(`(${MEASURE})(document.querySelectorAll('.docs-gallery-item')[${i}].querySelector('.deck'))`)) });
  }
}

socket.close();
const exited = new Promise((done) => chrome.once("exit", done));
chrome.kill();
await exited;
server.close();
rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 });

const failures = [];
const near = (value, line) => Math.abs(value - line) <= TOLERANCE;
for (const s of slides) {
  const { grid } = s;
  if (s.kind === "content") {
    if (s.title && !near(s.title.y, grid.top)) failures.push(`${s.where}: title at y${s.title.y}, off the top line y${grid.top}`);
    if (s.title && s.title.lines > 1) failures.push(`${s.where}: title runs ${s.title.lines} lines; keep it to one and move the message to Takeaway`);
    if (s.takeaway && s.takeaway.lines > 1) failures.push(`${s.where}: takeaway runs ${s.takeaway.lines} lines; keep it to one`);
    const first = s.takeaway?.y ?? s.content;
    if (first !== null && !near(first, grid.content)) failures.push(`${s.where}: content starts at y${first}, off the content line y${grid.content}`);
  }
  if (s.kind === "hero" && s.hero !== null && !near(s.hero, grid.hero)) failures.push(`${s.where}: main line at y${s.hero}, off the hero line y${grid.hero}`);
  if (s.right > grid.right + TOLERANCE) failures.push(`${s.where}: reaches x${s.right}, past the right margin x${grid.right}`);
  if (s.bottom > s.limit + TOLERANCE) failures.push(`${s.where}: reaches y${s.bottom}, past the bottom line y${s.limit}`);
}
const { grid } = slides[0];

console.log(`slides-check: ${slides.length} slides (ko, en) against the slide grid: top y${grid.top}, content y${grid.content}, hero y${grid.hero}, foot y${grid.foot}, right x${grid.right}`);
for (const failure of failures) console.log(`  ✗ ${failure}`);
process.exit(failures.length ? 1 : 0);
