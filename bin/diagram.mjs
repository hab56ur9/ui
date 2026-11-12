import { spawn } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";

const CHROMES = [
  process.env.UI_CHROME,
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
  "/usr/bin/google-chrome",
  "/usr/bin/chromium",
  "/usr/bin/chromium-browser",
];

const sleep = (ms) => new Promise((done) => setTimeout(done, ms));

const DIST = resolve(import.meta.dirname, "../dist");

const codes = (range) =>
  range.split(",").map((part) => {
    const [from, to = from] = part.trim().replace(/^U\+/i, "").split("-");
    return [parseInt(from, 16), parseInt(to, 16)];
  });

const faces = [...readFileSync(join(DIST, "tokens.css"), "utf8").matchAll(/@font-face\s*\{([^}]*)\}/g)].map(([, body]) => ({
  body,
  file: resolve(DIST, body.match(/url\("?([^")]+)"?\)/)[1]),
  ranges: codes(body.match(/unicode-range:\s*([^;]+)/)?.[1] ?? "U+0-10FFFF"),
}));

function fontsFor(svg) {
  const text = svg
    .replace(/<style>[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&(amp|lt|gt|quot);/g, (_, name) => ({ amp: "&", lt: "<", gt: ">", quot: '"' })[name]);
  const used = [...new Set(text.replace(/\s/g, ""))].map((char) => char.codePointAt(0));
  const covers = (face) => used.some((code) => face.ranges.some(([from, to]) => from <= code && code <= to));
  return faces
    .filter((face) => covers(face) && existsSync(face.file))
    .map((face) => `@font-face {${face.body.replace(/url\([^)]+\)/, `url(data:font/woff2;base64,${readFileSync(face.file).toString("base64")})`).replace(/font-display:[^;]+;/, "")}}`)
    .join("\n");
}

async function browser() {
  const path = CHROMES.find((candidate) => candidate && existsSync(candidate));
  if (!path) throw new Error("diagram build needs Chrome or Chromium; set UI_CHROME to its path");
  const profile = mkdtempSync(join(tmpdir(), "ui-diagram-"));
  const port = 9400 + Math.floor(Math.random() * 400);
  const chrome = spawn(path, ["--headless=new", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, "about:blank"], { stdio: "ignore", detached: true });
  let targets;
  for (let i = 0; i < 100 && !targets; i++) {
    await sleep(100);
    targets = await fetch(`http://127.0.0.1:${port}/json/list`)
      .then((r) => r.json())
      .catch(() => undefined);
  }
  if (!targets) throw new Error("Chrome did not start");
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
  const evaluate = async (expression) => {
    const reply = await send("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (reply.result?.exceptionDetails) throw new Error(reply.result.exceptionDetails.exception?.description ?? "page error");
    return reply.result?.result?.value;
  };
  const close = async () => {
    socket.close();
    const exited = new Promise((done) => chrome.once("exit", done));
    process.kill(-chrome.pid);
    await exited;
    rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  };
  return { send, evaluate, close };
}

function serialize() {
  const XHTML = "http://www.w3.org/1999/xhtml";
  const LOOPS = 3;
  const STYLE = ["display", "box-sizing", "width", "height", "margin", "padding", "border", "border-radius", "background-color", "color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "white-space", "gap", "flex-direction", "flex-wrap", "align-items", "justify-content", "flex", "grid-template-columns", "overflow", "opacity", "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "vertical-align", "text-overflow", "position", "inset", "top", "left", "right", "bottom"];
  const escape = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  const xml = new XMLSerializer();
  const root = getComputedStyle(document.documentElement);

  const globalRules = [];
  for (const sheet of document.styleSheets) {
    if (sheet.ownerNode?.closest?.(".diagram")) continue;
    let list = [];
    try {
      list = [...sheet.cssRules];
    } catch {
      continue;
    }
    for (const rule of list) {
      if (rule instanceof CSSKeyframesRule && rule.name.startsWith("diagram")) globalRules.push(rule.cssText);
      if (rule instanceof CSSStyleRule && /\.diagram-(group|arrow|line|arrowhead|label|step|packet|spark|pulse)|\.diagram-node(?![-\w])/.test(rule.selectorText) && !rule.selectorText.includes("::after")) globalRules.push(rule.cssText);
      if (rule instanceof CSSMediaRule && rule.conditionText.includes("prefers-reduced-motion")) {
        const inner = [...rule.cssRules].filter((child) => child.selectorText?.startsWith("*")).map((child) => child.cssText);
        if (inner.length) globalRules.push(`@media ${rule.conditionText} { ${inner.join(" ")} }`);
      }
    }
  }

  const inline = (source, target) => {
    const style = getComputedStyle(source);
    target.setAttribute("style", STYLE.map((name) => `${name}: ${style.getPropertyValue(name)}`).join("; "));
    target.removeAttribute("class");
    [...source.children].forEach((child, i) => inline(child, target.children[i]));
  };

  return [...document.querySelectorAll(".diagram")].map((figure, index) => {
    const canvas = figure.querySelector(".diagram-canvas");
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    const scale = canvas.getBoundingClientRect().width / width;
    const name = figure.dataset.diagram;
    const own = [...(figure.querySelector("style")?.sheet?.cssRules ?? [])].map((rule) => rule.cssText.replace(/::after/g, " .diagram-hit").replace(/outline-color/g, "stroke"));
    const cycle = parseFloat(figure.style.getPropertyValue("--diagram-cycle")) || 900;
    const slow = parseFloat(root.getPropertyValue("--motion-duration-slow")) || 280;
    const total = Math.max(LOOPS * cycle, 10000);
    const march = Math.ceil(total / (slow * 3));
    const rules = [...globalRules, ...own];
    const looped = rules.map((rule) => rule.replace(/ infinite;/g, (match) => (rule.includes("diagram-march") ? ` ${march};` : ` ${LOOPS};`)));
    const font = getComputedStyle(figure).fontFamily;
    const rel = (element, base) => {
      const a = element.getBoundingClientRect();
      const b = base.getBoundingClientRect();
      return { x: (a.left - b.left) / scale, y: (a.top - b.top) / scale, w: a.width / scale, h: a.height / scale };
    };
    const textOf = (element, base, extra = "") => {
      const style = getComputedStyle(element);
      const box = rel(element, base);
      return `<text x="${box.x}" y="${box.y + box.h / 2}" dominant-baseline="central" font-size="${style.fontSize}" font-weight="${style.fontWeight}" fill="${style.color}"${extra}>${escape(element.textContent ?? "")}</text>`;
    };
    const badges = (body, node) =>
      [...body.querySelectorAll(".badge")]
        .map((badge) => {
          const style = getComputedStyle(badge);
          const box = rel(badge, node);
          const text = rel(badge.querySelector(".badge-text") ?? badge, node);
          const before = getComputedStyle(badge, "::before");
          const size = parseFloat(before.width) || 0;
          const gap = parseFloat(style.columnGap) || 4;
          const dot = before.content !== "none" && size > 0 ? `<circle cx="${text.x - gap - size / 2}" cy="${box.y + box.h / 2}" r="${size / 2}" fill="${before.backgroundColor}"/>` : "";
          return `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" rx="${Math.min(parseFloat(style.borderRadius) || 0, box.h / 2)}" fill="${style.backgroundColor}" stroke="${style.borderTopColor}" stroke-width="${parseFloat(style.borderTopWidth) || 0}"/>${dot}<text x="${text.x}" y="${box.y + box.h / 2}" dominant-baseline="central" font-size="${style.fontSize}" font-weight="${style.fontWeight}" fill="${style.color}">${escape(badge.textContent ?? "")}</text>`;
        })
        .join("");
    const nodes = [...canvas.querySelectorAll(".diagram-node")].map((node) => {
      const style = getComputedStyle(node);
      const w = node.offsetWidth;
      const h = node.offsetHeight;
      const radius = parseFloat(style.borderRadius) || 0;
      const icon = node.querySelector(".diagram-node-head > svg");
      const iconSvg = icon
        ? (() => {
            const box = rel(icon, node);
            const clone = icon.cloneNode(true);
            clone.removeAttribute("class");
            for (const [key, value] of Object.entries({ x: box.x, y: box.y, width: box.w, height: box.h, fill: "none", stroke: getComputedStyle(icon).color, "stroke-width": getComputedStyle(icon).strokeWidth, "stroke-linecap": "round", "stroke-linejoin": "round" })) clone.setAttribute(key, String(value));
            return xml.serializeToString(clone);
          })()
        : "";
      const label = node.querySelector(".diagram-node-label");
      const caption = node.querySelector(".diagram-node-caption");
      const body = node.querySelector(".diagram-node-body");
      const onlyBadges = body && [...body.querySelectorAll("*")].every((element) => element.closest(".badge"));
      const bodySvg = !body
        ? ""
        : onlyBadges
          ? badges(body, node)
          : (() => {
              const box = rel(body, node);
              const clone = body.cloneNode(true);
              inline(body, clone);
              const wrap = document.createElementNS(XHTML, "div");
              wrap.setAttribute("style", `width: ${box.w}px; height: ${box.h}px; font-family: ${font};`);
              wrap.append(clone);
              return `<foreignObject x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}">${xml.serializeToString(wrap)}</foreignObject>`;
            })();
      const order = node.style.getPropertyValue("--order");
      const tone = node.style.getPropertyValue("--diagram-tone");
      return `<g class="diagram-node" data-node="${escape(node.dataset.node ?? "")}" style="--order: ${order};${tone ? ` --diagram-tone: ${tone};` : ""}"><g transform="translate(${node.offsetLeft} ${node.offsetTop})"><rect width="${w}" height="${h}" rx="${radius}" fill="${style.backgroundColor}" stroke="${style.borderTopColor}" stroke-width="${parseFloat(style.borderTopWidth) || 1}"/>${iconSvg}${label ? textOf(label, node) : ""}${caption ? textOf(caption, node) : ""}${bodySvg}<rect class="diagram-hit" x="-1" y="-1" width="${w + 2}" height="${h + 2}" rx="${radius + 1}"/></g></g>`;
    });
    canvas.querySelectorAll(".diagram-pulse").forEach((pulse) => pulse.style.setProperty("animation-iteration-count", String(Math.ceil(total / (parseFloat(pulse.style.animationDuration) || 1600)))));
    const layer = (selector) => [...canvas.querySelector(selector).children].map((child) => xml.serializeToString(child)).join("");
    const base = `.diagram-hit { fill: none; stroke: transparent; stroke-width: 2.5; }`;
    const content = `${layer(".diagram-lines")}${nodes.join("")}${layer(".diagram-flow")}</svg>`;
    const names = new Set([...(rules.join(" ") + content).matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));
    const vars = [...names].map((key) => [key, root.getPropertyValue(key).trim()]).filter(([, value]) => value).map(([key, value]) => `${key}: ${value};`).join(" ");
    const open = (css) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-diagram="${name}" role="img" aria-label="${escape(figure.getAttribute("aria-label") ?? "")}" style="${vars} --diagram-cycle: ${cycle}ms; font-family: ${escape(font)}; background: ${root.getPropertyValue("--color-bg-page").trim()};"><title>${escape(figure.getAttribute("aria-label") ?? "")}</title><style>${css}</style>`;
    return {
      file: figure.dataset.name || (figure.getAttribute("aria-label") ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `diagram-${index + 1}`,
      animated: open([...looped, base].join("\n")) + content,
      still: open([...rules, base, "* { animation: none !important; }"].join("\n")) + content,
    };
  });
}

export async function buildDiagrams(file, { out, theme = "light", handler }) {
  const page = resolve(file);
  if (!existsSync(page)) throw new Error(`no such file: ${file}`);
  const root = dirname(page);
  const target = resolve(out ?? root);
  mkdirSync(target, { recursive: true });
  const server = createServer(handler(root));
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const chrome = await browser();
  try {
    await chrome.send("Page.enable");
    await chrome.send("Emulation.setDeviceMetricsOverride", { width: 4000, height: 3000, deviceScaleFactor: 1, mobile: false });
    await chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
    await chrome.send("Page.navigate", { url: `http://127.0.0.1:${server.address().port}/${relative(root, page)}` });
    await sleep(1500);
    await chrome.evaluate("document.fonts.ready.then(() => document.getAnimations().forEach((a) => a.animationName === 'diagram-enter' && a.finish()))");
    await sleep(300);
    const diagrams = await chrome.evaluate(`(${serialize.toString()})()`);
    if (!diagrams?.length) throw new Error(`no Diagram found in ${basename(page)}`);
    for (const diagram of diagrams) {
      const fonts = fontsFor(diagram.still);
      const embed = (svg) => svg.replace("<style>", `<style>${fonts}\n`);
      writeFileSync(join(target, `${diagram.file}.svg`), embed(diagram.animated));
      writeFileSync(join(target, `${diagram.file}.still.svg`), embed(diagram.still));
      console.log(`built ${relative(process.cwd(), join(target, diagram.file))}.svg and .still.svg`);
    }
  } finally {
    await chrome.close();
    server.close();
  }
}
