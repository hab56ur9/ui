import { join } from "node:path";
import { openSite, sleep } from "./browser.mjs";

const THEMES = ["light", "dark"];
const DIMMED = [".comment-card.is-resolved"];
const { pages } = await import(join(import.meta.dirname, "..", "src/site/pages.ts"));
const { origin, send, evaluate, close } = await openSite("contrast-check");
await send("Emulation.setDeviceMetricsOverride", { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
await send("Page.navigate", { url: `${origin}/` });
await sleep(1500);
await evaluate("document.fonts.ready.then(() => true)");

const MEASURE = `(skip) => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const rgb = (color) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
  const alpha = (color) => {
    if (color === "transparent") return 0;
    const match = color.match(/\\/\\s*([\\d.]+%?)\\s*\\)$/) || color.match(/rgba\\([^,]+,[^,]+,[^,]+,\\s*([\\d.]+)\\)/);
    if (!match) return 1;
    return match[1].endsWith("%") ? parseFloat(match[1]) / 100 : parseFloat(match[1]);
  };
  const luminance = (color) => {
    const channel = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    const [r, g, b] = color.map(channel);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const blend = (top, a, bottom) => top.map((v, i) => v * a + bottom[i] * (1 - a));
  const backdrop = (el) => {
    const layers = [];
    for (let e = el; e; e = e.parentElement) {
      const style = getComputedStyle(e);
      if (style.backgroundImage !== "none") return null;
      const a = alpha(style.backgroundColor);
      if (a > 0) layers.push([rgb(style.backgroundColor), a]);
      if (a >= 1) break;
    }
    return layers.reduceRight((under, [color, a]) => blend(color, a, under), rgb(getComputedStyle(document.body).backgroundColor));
  };
  const opacity = (el) => {
    let o = 1;
    for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
    return o;
  };
  const seen = new Set();
  const failures = [];
  let checked = 0;
  const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const el = node.parentElement;
    if (!node.textContent.trim() || seen.has(el)) continue;
    seen.add(el);
    if (el.closest(skip)) continue;
    const box = el.getBoundingClientRect();
    const style = getComputedStyle(el);
    if (!box.width || !box.height || style.visibility !== "visible" || alpha(style.color) === 0) continue;
    const o = opacity(el);
    const under = backdrop(el);
    if (o < 0.05 || !under) continue;
    checked++;
    const text = blend(rgb(style.color), alpha(style.color) * o, under);
    const [hi, lo] = [luminance(text), luminance(under)].sort((a, b) => b - a);
    const ratio = (hi + 0.05) / (lo + 0.05);
    const size = parseFloat(style.fontSize);
    const large = size >= 24 || (parseInt(style.fontWeight) >= 700 && size >= 18.66);
    const need = large ? 3 : 4.5;
    if (ratio < need) failures.push({ tag: el.tagName.toLowerCase(), cls: typeof el.className === "string" ? el.className.split(" ")[0] : "", text: node.textContent.trim().slice(0, 32), ratio: Math.floor(ratio * 100) / 100, need });
  }
  return { checked, failures };
}`;

const skip = ["svg", "[aria-hidden=true]", ":disabled", "[aria-disabled=true]", ".is-disabled", "label:has(:disabled):not(.is-locked)", "code.mermaid", ...DIMMED].join(",");
const failures = [];
let checked = 0;
for (const theme of THEMES) {
  for (const page of pages) {
    await evaluate(`location.hash = "#/${page.id}"`);
    await sleep(450);
    await evaluate(`document.documentElement.dataset.theme = ${JSON.stringify(theme)}`);
    await sleep(120);
    const result = await evaluate(`(${MEASURE})(${JSON.stringify(skip)})`);
    checked += result.checked;
    for (const f of result.failures) failures.push(`${theme} ${page.id}: <${f.tag}${f.cls ? `.${f.cls}` : ""}> "${f.text}" ${f.ratio}:1, needs ${f.need}:1`);
  }
}
await close();

console.log(`contrast-check: ${checked} text elements on ${pages.length} pages (${THEMES.join(", ")}) against WCAG AA`);
for (const failure of failures) console.log(`  ✗ ${failure}`);
process.exit(failures.length ? 1 : 0);
