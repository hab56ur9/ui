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
  const STYLE = ["--motion-order", "--motion-base", "--digit", "translate", "scale", "transform-origin", "font-variant-numeric", "display", "box-sizing", "width", "height", "margin", "padding", "border", "border-radius", "background-color", "color", "font-family", "font-size", "font-weight", "line-height", "letter-spacing", "text-align", "white-space", "gap", "flex-direction", "flex-wrap", "align-items", "justify-content", "flex", "grid-template-columns", "overflow", "opacity", "fill", "stroke", "stroke-width", "stroke-dasharray", "stroke-linecap", "stroke-linejoin", "vertical-align", "text-overflow", "position", "inset", "top", "left", "right", "bottom"];
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
      if (rule instanceof CSSKeyframesRule && /^(diagram|motion)-/.test(rule.name)) globalRules.push(rule.cssText);
      if (rule instanceof CSSStyleRule && /\[data-(motion|digit)/.test(rule.selectorText)) globalRules.push(rule.cssText);
      if (rule instanceof CSSStyleRule && /\.diagram-(group|arrow|tags|line|arrowhead|label|step|packet|spark|pulse)|\.diagram-node(?![-\w])/.test(rule.selectorText) && !rule.selectorText.includes("::after")) globalRules.push(rule.cssText);
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

  const diagram = (figure, index) => {
    const here = getComputedStyle(figure);
    const panelTone = figure.closest(".infographic-panel") ? getComputedStyle(figure.closest(".infographic-panel")).getPropertyValue("--panel-tone").trim() : "";
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
      return `<g class="diagram-node" data-node="${escape(node.dataset.node ?? "")}"${node.dataset.motion ? ` data-motion="${node.dataset.motion}"` : ""} style="--motion-order: ${order};${tone ? ` --diagram-tone: ${tone};` : ""}"><g transform="translate(${node.offsetLeft} ${node.offsetTop})"><rect width="${w}" height="${h}" rx="${radius}" fill="${style.backgroundColor}" stroke="${style.borderTopColor}" stroke-width="${parseFloat(style.borderTopWidth) || 1}"/>${iconSvg}${label ? textOf(label, node) : ""}${caption ? textOf(caption, node) : ""}${bodySvg}<rect class="diagram-hit" x="-1" y="-1" width="${w + 2}" height="${h + 2}" rx="${radius + 1}"/></g></g>`;
    });
    canvas.querySelectorAll(".diagram-line.is-dots").forEach((line) => line.style.animationDuration && line.style.setProperty("animation-iteration-count", String(Math.ceil(total / parseFloat(line.style.animationDuration)))));
    canvas.querySelectorAll(".diagram-pulse:not(.is-bead)").forEach((pulse) => pulse.style.setProperty("animation-iteration-count", String(Math.ceil(total / (parseFloat(pulse.style.animationDuration) || 1600)))));
    const layer = (selector) => [...canvas.querySelector(selector).children].map((child) => xml.serializeToString(child)).join("");
    const base = `.diagram-hit { fill: none; stroke: transparent; stroke-width: 2.5; }`;
    const drawn = `${layer(".diagram-lines")}${nodes.join("")}${layer(".diagram-flow")}</svg>`;
    const content = panelTone ? drawn.replace(/--diagram-tone: [^;"]+/g, `--diagram-tone: ${panelTone}`) : drawn;
    const names = new Set([...(rules.join(" ") + content).matchAll(/var\((--[\w-]+)/g)].map((match) => match[1]));
    const vars = [...names].map((key) => [key, here.getPropertyValue(key).trim()]).filter(([, value]) => value).map(([key, value]) => `${key}: ${value};`).join(" ");
    const open = (css) => `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" data-diagram="${name}" role="img" aria-label="${escape(figure.getAttribute("aria-label") ?? "")}" style="${vars} --diagram-cycle: ${cycle}ms; font-family: ${escape(font)}; background: ${root.getPropertyValue("--color-bg-page").trim()};"><title>${escape(figure.getAttribute("aria-label") ?? "")}</title><style>${css}</style>`;
    return {
      file: figure.dataset.name || (figure.getAttribute("aria-label") ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `diagram-${index + 1}`,
      animated: open([...looped, base].join("\n")) + content,
      still: open([...rules, base, "* { animation: none !important; }"].join("\n")) + content,
    };
  };

  const poster = (figure, index, built) => {
    const MARGIN = 32;
    const box = figure.getBoundingClientRect();
    const at = (element) => {
      const r = element.getBoundingClientRect();
      return { x: r.left - box.left, y: r.top - box.top, w: r.width, h: r.height };
    };
    const lines = (element) => {
      const style = getComputedStyle(element);
      const found = [];
      const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        for (let k = 0; k < node.textContent.length; k++) {
          const range = document.createRange();
          range.setStart(node, k);
          range.setEnd(node, k + 1);
          const r = range.getBoundingClientRect();
          if (!r.width && !r.height) continue;
          const last = found[found.length - 1];
          const sameLine = last && Math.abs(last.top - r.top) < r.height / 2;
          if (sameLine) last.text += node.textContent[k];
          if (!sameLine) found.push({ text: node.textContent[k], left: r.left, top: r.top, height: r.height });
        }
      }
      return found.map((line) => `<text x="${line.left - box.left}" y="${line.top - box.top + line.height / 2}" dominant-baseline="central" font-size="${style.fontSize}" font-weight="${style.fontWeight}" fill="${style.color}">${escape(line.text.trim())}</text>`).join("");
    };
    const glyph = (icon) => {
      const r = at(icon);
      const clone = icon.cloneNode(true);
      clone.removeAttribute("class");
      for (const [key, value] of Object.entries({ x: r.x, y: r.y, width: r.w, height: r.h, fill: "none", stroke: getComputedStyle(icon).color, "stroke-width": getComputedStyle(icon).strokeWidth, "stroke-linecap": "round", "stroke-linejoin": "round" })) clone.setAttribute(key, String(value));
      return xml.serializeToString(clone);
    };
    const file = figure.dataset.name || (figure.getAttribute("aria-label") ?? "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || `infographic-${index + 1}`;
    const page = root.getPropertyValue("--color-bg-page").trim();
    const draw = (variant) => {
      const head = figure.querySelector(".infographic-head");
      const panels = [...figure.querySelectorAll(".infographic-panel")].map((section, i) => {
        const s = getComputedStyle(section);
        const r = at(section);
        const radius = parseFloat(s.borderTopLeftRadius) || 0;
        const border = parseFloat(s.borderTopWidth) || 0;
        const top = section.querySelector(".infographic-panel-head");
        const hs = getComputedStyle(top);
        const hr = at(top);
        const clip = `${file}-panel-${i}`;
        const divider = parseFloat(hs.borderRightWidth) > 0 ? `<line x1="${hr.x + hr.w}" y1="${hr.y}" x2="${hr.x + hr.w}" y2="${hr.y + hr.h}" stroke="${hs.borderRightColor}" stroke-width="${hs.borderRightWidth}"/>` : `<line x1="${hr.x}" y1="${hr.y + hr.h}" x2="${hr.x + hr.w}" y2="${hr.y + hr.h}" stroke="${hs.borderBottomColor}" stroke-width="${hs.borderBottomWidth}"/>`;
        const icon = top.querySelector(":scope > svg");
        const diagrams = [...section.querySelectorAll(".diagram")].map((inner) => {
          const canvas = at(inner.querySelector(".diagram-canvas"));
          return (built.get(inner)?.[variant] ?? "").replace("<svg ", `<svg x="${canvas.x}" y="${canvas.y}" `).replace(/ width="[^"]*" height="[^"]*"/, ` width="${canvas.w}" height="${canvas.h}"`).replace(/ background: [^;"]+;/, "");
        });
        const words = [...top.querySelectorAll(".infographic-panel-title, .infographic-panel-message")].map(lines).join("");
        return `<clipPath id="${clip}"><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${radius}"/></clipPath><rect x="${r.x}" y="${r.y}" width="${r.w}" height="${r.h}" rx="${radius}" fill="${s.backgroundColor}"/><g clip-path="url(#${clip})"><rect x="${hr.x}" y="${hr.y}" width="${hr.w}" height="${hr.h}" fill="${hs.backgroundColor}"/>${divider}</g><rect x="${r.x + border / 2}" y="${r.y + border / 2}" width="${r.w - border}" height="${r.h - border}" rx="${radius}" fill="none" stroke="${s.borderTopColor}" stroke-width="${border}"/>${icon ? glyph(icon) : ""}${words}${diagrams.join("")}`;
      });
      const width = box.width + MARGIN * 2;
      const height = box.height + MARGIN * 2;
      return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${escape(figure.getAttribute("aria-label") ?? "")}" style="font-family: ${escape(getComputedStyle(figure).fontFamily)}; background: ${page};"><title>${escape(figure.getAttribute("aria-label") ?? "")}</title><style></style><rect width="${width}" height="${height}" fill="${page}"/><g transform="translate(${MARGIN} ${MARGIN})">${head ? [...head.children].map(lines).join("") : ""}${panels.join("")}</g></svg>`;
    };
    return { file, animated: draw("animated"), still: draw("still") };
  };

  const built = new Map([...document.querySelectorAll(".diagram")].map((figure, index) => [figure, diagram(figure, index)]));
  const posters = [...document.querySelectorAll(".infographic")].map((figure, index) => poster(figure, index, built));
  return [...posters, ...[...built].filter(([figure]) => !figure.closest(".infographic")).map(([, result]) => result)];
}

function inspect() {
  const problems = [];
  const inside = (p, box, pad) => p.x > box.x + pad && p.x < box.x + box.w - pad && p.y > box.y + pad && p.y < box.y + box.h - pad;
  const overlaps = (a, b) => a.x < b.x + b.w - 1 && b.x < a.x + a.w - 1 && a.y < b.y + b.h - 1 && b.y < a.y + a.h - 1;
  for (const figure of document.querySelectorAll(".diagram")) {
    const title = figure.getAttribute("aria-label") ?? "diagram";
    const canvas = figure.querySelector(".diagram-canvas");
    const nodes = [...canvas.querySelectorAll(".diagram-node")].map((node) => ({ id: node.dataset.node, element: node, box: { x: node.offsetLeft, y: node.offsetTop, w: node.offsetWidth, h: node.offsetHeight } }));
    const arrows = [...canvas.querySelectorAll(".diagram-arrow")].map((group, index) => {
      const path = group.querySelector(".diagram-line");
      const length = path.getTotalLength();
      const points = Array.from({ length: Math.ceil(length / 4) + 1 }, (_, k) => path.getPointAtLength(Math.min(length, k * 4)));
      const tags = canvas.querySelector(`.diagram-tags[data-arrow="${group.dataset.arrow}"]`);
      const labels = [...(tags?.querySelectorAll(".diagram-label > rect, .diagram-step > circle") ?? [])].map((shape) => {
        const b = shape.getBBox();
        return { text: shape.parentElement.textContent.trim(), box: { x: b.x, y: b.y, w: b.width, h: b.height } };
      });
      return { index, points, labels };
    });
    const labels = arrows.flatMap((arrow) => arrow.labels.map((label) => ({ ...label, arrow: arrow.index })));
    labels.forEach((label, i) => {
      labels.slice(i + 1).filter((other) => other.arrow !== label.arrow && overlaps(label.box, other.box)).forEach((other) => problems.push(`${title}: label "${label.text}" overlaps label "${other.text}"`));
      nodes.filter((node) => overlaps(label.box, node.box)).forEach((node) => problems.push(`${title}: label "${label.text}" overlaps node "${node.id}"`));
      const crossing = arrows.find((arrow) => arrow.index !== label.arrow && arrow.points.some((point) => inside(point, label.box, 2)));
      if (crossing) problems.push(`${title}: label "${label.text}" is crossed by arrow ${crossing.index + 1}${crossing.labels[0] ? ` ("${crossing.labels.map((tag) => tag.text).join(" ")}")` : ""}`);
    });
    arrows.forEach((arrow) => {
      nodes.filter((node) => arrow.points.some((point) => inside(point, node.box, 3))).forEach((node) => problems.push(`${title}: arrow ${arrow.index + 1} runs through node "${node.id}"`));
    });
    nodes.forEach((node) => {
      const cut = [...node.element.querySelectorAll("*")].filter((element) => element.children.length === 0 && element.textContent.trim() && !element.closest(".sr-only, [data-digit]") && element.scrollWidth > element.clientWidth + 1 && getComputedStyle(element).overflow !== "visible");
      cut.forEach((element) => problems.push(`${title}: text "${element.textContent.trim()}" is cut off in node "${node.id}"`));
    });
  }
  return problems;
}

async function render(file, theme, handler) {
  const page = resolve(file);
  if (!existsSync(page)) throw new Error(`no such file: ${file}`);
  const root = dirname(page);
  const server = createServer(handler(root));
  await new Promise((done) => server.listen(0, "127.0.0.1", done));
  const chrome = await browser();
  await chrome.send("Page.enable");
  await chrome.send("Emulation.setDeviceMetricsOverride", { width: 4000, height: 3000, deviceScaleFactor: 1, mobile: false });
  await chrome.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-color-scheme", value: theme }] });
  await chrome.send("Page.navigate", { url: `http://127.0.0.1:${server.address().port}/${relative(root, page)}` });
  await sleep(1500);
  await chrome.evaluate("document.querySelectorAll('.infographic').forEach((poster) => { poster.style.maxWidth = '1280px'; })");
  await sleep(800);
  await chrome.evaluate("document.fonts.ready.then(() => document.getAnimations().forEach((a) => a.animationName === 'motion-enter' && a.finish()))");
  await sleep(300);
  const close = async () => {
    await chrome.close();
    server.close();
  };
  return { page, root, evaluate: chrome.evaluate, close };
}

export async function checkDiagrams(file, { theme = "light", handler }) {
  const session = await render(file, theme, handler);
  try {
    const problems = await session.evaluate(`(${inspect.toString()})()`);
    for (const problem of problems) console.log(`  ✗ ${problem}`);
    console.log(problems.length ? `${problems.length} problems` : "diagram check: clean");
    return problems;
  } finally {
    await session.close();
  }
}

export async function buildDiagrams(file, { out, theme = "light", handler }) {
  const session = await render(file, theme, handler);
  try {
    const problems = await session.evaluate(`(${inspect.toString()})()`);
    if (problems.length) {
      for (const problem of problems) console.log(`  ✗ ${problem}`);
      throw new Error(`${problems.length} layout problems; fix them before building`);
    }
    const target = resolve(out ?? session.root);
    mkdirSync(target, { recursive: true });
    const diagrams = await session.evaluate(`(${serialize.toString()})()`);
    if (!diagrams?.length) throw new Error(`no Diagram or Infographic found in ${basename(session.page)}`);
    for (const diagram of diagrams) {
      const fonts = fontsFor(diagram.still);
      const embed = (svg) => svg.replace("<style>", `<style>${fonts}\n`);
      writeFileSync(join(target, `${diagram.file}.svg`), embed(diagram.animated));
      writeFileSync(join(target, `${diagram.file}.still.svg`), embed(diagram.still));
      console.log(`built ${relative(process.cwd(), join(target, diagram.file))}.svg and .still.svg`);
    }
  } finally {
    await session.close();
  }
}
