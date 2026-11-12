import { readFileSync, readdirSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const load = (file) => JSON.parse(readFileSync(join(root, "tokens", file), "utf8"));
const modeFiles = (axis) =>
  Object.fromEntries(
    readdirSync(join(root, "tokens", axis))
      .filter((file) => file.endsWith(".json"))
      .sort()
      .map((file) => [basename(file, ".json"), `${axis}/${file}`]),
  );

const DEFAULT = { medium: "app", lang: "en" };
const layers = {
  global: ["primitive/color.json", "primitive/base.json"],
  theme: { light: "theme/light.json", dark: "theme/dark.json" },
  medium: modeFiles("medium"),
  lang: modeFiles("lang"),
};

const isToken = (node) => node !== null && typeof node === "object" && "$value" in node;
const isMeta = (key) => key.startsWith("$");
const aliasOf = (value) => typeof value === "string" && value.match(/^\{([^}]+)\}$/)?.[1];

function flatten(tree, path = [], inheritedType) {
  const type = tree.$type ?? inheritedType;
  if (isToken(tree)) return [{ path: path.join("."), type, value: tree.$value, description: tree.$description }];
  return Object.entries(tree)
    .filter(([key]) => !isMeta(key))
    .flatMap(([key, child]) => flatten(child, [...path, key], type));
}

const tokensOf = (...files) => files.flatMap((file) => flatten(load(file)));
const cssName = (path) => `--${path.replaceAll(".", "-")}`;
const dimension = ({ value, unit }) => `${value}${unit}`;

function css(value, type) {
  const alias = aliasOf(value);
  if (alias) return `var(${cssName(alias)})`;
  const format = {
    dimension,
    duration: dimension,
    fontFamily: (v) => v.map((f) => (f.includes(" ") ? `"${f}"` : f)).join(", "),
    cubicBezier: (v) => `cubic-bezier(${v.join(", ")})`,
    shadow: (v) => [v.offsetX, v.offsetY, v.blur, v.spread].map((d) => css(d, "dimension")).concat(css(v.color, "color")).join(" "),
  }[type];
  return format ? format(value) : String(value);
}

function resolver(tokens) {
  const byPath = new Map(tokens.map((t) => [t.path, t]));
  const resolve = (value, type, seen = []) => {
    const alias = aliasOf(value);
    if (!alias) return type === "shadow" ? { ...value, color: resolve(value.color, "color", seen) } : value;
    if (seen.includes(alias)) throw new Error(`alias cycle: ${[...seen, alias].join(" → ")}`);
    const target = byPath.get(alias);
    if (!target) throw new Error(`unresolved alias {${alias}}`);
    return resolve(target.value, target.type, [...seen, alias]);
  };
  return (token) => css(resolve(token.value, token.type), token.type);
}

function assertSameKeys(group) {
  const [first, ...rest] = Object.entries(group).map(([mode, tokens]) => [mode, tokens.map((t) => t.path).sort().join()]);
  const drifted = rest.filter(([, keys]) => keys !== first[1]).map(([mode]) => mode);
  if (drifted.length) throw new Error(`modes ${drifted.join(", ")} define a different token set than ${first[0]}`);
}

const { version, homepage } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const global = tokensOf(...layers.global);
const themes = Object.fromEntries(Object.entries(layers.theme).map(([mode, file]) => [mode, tokensOf(file)]));
const media = Object.fromEntries(Object.entries(layers.medium).map(([mode, file]) => [mode, tokensOf(file)]));
const langs = Object.fromEntries(Object.entries(layers.lang).map(([mode, file]) => [mode, tokensOf(file)]));
assertSameKeys(themes);
assertSameKeys(media);
assertSameKeys(langs);
const others = (group, fallback) => Object.entries(group).filter(([mode]) => mode !== fallback);

const block = (selector, tokens, extra = []) =>
  `${selector} {\n${[...extra, ...tokens.map((t) => `${cssName(t.path)}: ${css(t.value, t.type)};`)].map((l) => `  ${l}`).join("\n")}\n}`;

const pretendard = [...readFileSync(join(root, "assets/fonts/pretendard/subset.css"), "utf8").matchAll(/url\(\.\/woff2-dynamic-subset\/([^)]+)\)[^;]*;\s*unicode-range:\s*([^;]+);/g)].map(([, file, range]) => ({
  family: "Pretendard Variable",
  file: `pretendard/${file}`,
  weight: "45 920",
  range: range.trim(),
  adjust: "96%",
}));
const FONTS = [
  ...pretendard,
  {
    family: "Inter",
    file: "InterVariable.woff2",
    weight: "100 900",
    range: "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD",
  },
];
const fontFace = ({ family, file, weight, range, adjust }) =>
  [`@font-face {`, `  font-family: "${family}";`, `  src: url("../assets/fonts/${file}") format("woff2");`, `  font-weight: ${weight};`, `  font-display: swap;`, ...(adjust ? [`  size-adjust: ${adjust};`] : []), ...(range ? [`  unicode-range: ${range};`] : []), `}`].join("\n");

const stylesheet = [
  ...FONTS.map(fontFace),
  block(":root", global, [`--tokens-version: "${version}";`]),
  block(`:root,\n[data-medium="${DEFAULT.medium}"]`, media[DEFAULT.medium]),
  block(`:root,\n:lang(${DEFAULT.lang})`, langs[DEFAULT.lang]),
  block(':root,\n[data-theme="light"]', themes.light, ["color-scheme: light;"]),
  `@media (prefers-color-scheme: dark) {\n${block(':root:not([data-theme="light"])', themes.dark, ["color-scheme: dark;"]).replace(/^/gm, "  ")}\n}`,
  block('[data-theme="dark"]', themes.dark, ["color-scheme: dark;"]),
  ...others(media, DEFAULT.medium).map(([mode, tokens]) => block(`[data-medium="${mode}"]`, tokens)),
  ...others(langs, DEFAULT.lang).map(([mode, tokens]) => block(`:lang(${mode})`, tokens)),
].join("\n\n");

const mapValues = (object, fn) => Object.fromEntries(Object.entries(object).map(([key, value]) => [key, fn(value)]));
const resolveAll = (scope, tokens) => {
  const value = resolver(scope);
  return Object.fromEntries(tokens.map((t) => [cssName(t.path), value(t)]));
};
const themeDependent = (token) => token.type === "shadow";
const snapshot = {
  global: resolveAll(global, global.filter((t) => !themeDependent(t))),
  theme: mapValues(themes, (tokens) => resolveAll([...global, ...tokens], [...tokens, ...global.filter(themeDependent)])),
  medium: mapValues(media, (tokens) => resolveAll([...global, ...tokens], tokens)),
  lang: mapValues(langs, (tokens) => resolveAll([...global, ...tokens], tokens)),
};

const isGroup = (node) => node !== null && typeof node === "object" && !Array.isArray(node) && !isToken(node);
const groupsOf = (tree, path = []) =>
  Object.entries(tree)
    .filter(([key, child]) => !isMeta(key) && isGroup(child))
    .flatMap(([key, child]) => [
      ...(child.$description ? [[[...path, key].join("."), child.$description]] : []),
      ...groupsOf(child, [...path, key]),
    ]);

const chainer = (scope) => {
  const byPath = new Map(scope.map((t) => [t.path, t]));
  const chain = (value) => {
    const alias = aliasOf(value);
    return alias ? [alias, ...chain(byPath.get(alias).value)] : [];
  };
  return (token) => chain(token.value);
};

function catalogOf(layerOf, tokensByMode, scopeOf) {
  const modes = Object.entries(tokensByMode).map(([mode, tokens]) => ({
    mode,
    byPath: new Map(tokens.map((t) => [t.path, t])),
    value: resolver(scopeOf(mode)),
    chain: chainer(scopeOf(mode)),
  }));
  return [...modes[0].byPath.values()].map((token) => ({
    name: cssName(token.path),
    path: token.path,
    type: token.type,
    layer: layerOf(token),
    description: token.description,
    values: Object.fromEntries(modes.map((m) => [m.mode, m.value(m.byPath.get(token.path))])),
    chains: Object.fromEntries(modes.map((m) => [m.mode, m.chain(m.byPath.get(token.path))])),
  }));
}

const globalLayer = (token) => (token.path.startsWith("color.") ? "primitive" : "foundation");
const themeScope = (mode) => [...global, ...themes[mode]];
const catalog = [
  ...catalogOf(globalLayer, { all: global.filter((t) => !themeDependent(t)) }, () => global),
  ...catalogOf(globalLayer, mapValues(themes, () => global.filter(themeDependent)), themeScope),
  ...catalogOf(() => "theme", themes, themeScope),
  ...catalogOf(() => "medium", media, (mode) => [...global, ...media[mode]]),
  ...catalogOf(() => "lang", langs, (mode) => [...global, ...langs[mode]]),
];
const files = [...layers.global, ...Object.values(layers.theme), ...Object.values(layers.medium), ...Object.values(layers.lang)];
const review = {
  version,
  homepage,
  modes: { theme: Object.keys(themes), medium: Object.keys(media), lang: Object.keys(langs) },
  media: mapValues(layers.medium, (file) => load(file).$description ?? ""),
  groups: files
    .flatMap((file) => groupsOf(load(file)))
    .reduce((all, [path, text]) => ({ ...all, [path]: [...new Set([...(all[path] ?? "").split(" · ").filter(Boolean), text])].join(" · ") }), {}),
  catalog,
};

const iconsDir = join(root, "assets", "icons");
const SHAPES = /<(path|circle|rect|line|polyline|polygon)\b([^>]*?)\/>/g;
const ATTRS = /([\w-]+)="([^"]*)"/g;
const icons = Object.fromEntries(
  readdirSync(iconsDir)
    .filter((file) => file.endsWith(".svg"))
    .sort()
    .map((file) => {
      const source = readFileSync(join(iconsDir, file), "utf8");
      const shapes = [...source.matchAll(SHAPES)].map(([, tag, attrs]) => [tag, Object.fromEntries([...attrs.matchAll(ATTRS)].map(([, k, v]) => [k, v]))]);
      if (!shapes.length) throw new Error(`icon ${file} has no drawable shapes`);
      return [basename(file, ".svg"), shapes];
    }),
);
const sprite = Object.entries(icons)
  .map(([name, shapes]) => `  <symbol id="${name}" viewBox="0 0 24 24">${shapes.map(([tag, attrs]) => `<${tag} ${Object.entries(attrs).map(([k, v]) => `${k}="${v}"`).join(" ")}/>`).join("")}</symbol>`)
  .join("\n");

mkdirSync(join(root, "dist"), { recursive: true });
writeFileSync(join(root, "dist/icons.json"), `${JSON.stringify(icons)}\n`);
writeFileSync(
  join(root, "dist/icons.svg"),
  `<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">\n${sprite}\n</svg>\n`,
);
writeFileSync(join(root, "dist/catalog.json"), `${JSON.stringify(review)}\n`);
writeFileSync(join(root, "dist/tokens.css"), `${stylesheet}\n`);

const themePaths = new Set(themes.light.map((t) => t.path));
mkdirSync(join(root, "dist/presets"), { recursive: true });
const presets = readdirSync(join(root, "tokens/preset"))
  .filter((file) => file.endsWith(".json"))
  .sort()
  .map((file) => {
    const name = basename(file, ".json");
    const doc = load(`preset/${file}`);
    const light = flatten(doc.light);
    const dark = flatten(doc.dark);
    const stray = [...light, ...dark].filter((t) => !themePaths.has(t.path)).map((t) => t.path);
    if (stray.length) throw new Error(`preset ${name} sets tokens the themes don't define: ${stray.join(", ")}`);
    const selector = `[data-preset="${name}"]`;
    const css = [
      `/* ${name}: ${doc.label.en} */`,
      block(selector, light),
      `@media (prefers-color-scheme: dark) {\n${block(`${selector}:not([data-theme="light"]),\n:root:not([data-theme="light"]) ${selector}`, dark).replace(/^/gm, "  ")}\n}`,
      block(`${selector}[data-theme="dark"],\n${selector} [data-theme="dark"],\n[data-theme="dark"] ${selector}`, dark),
    ].join("\n\n");
    writeFileSync(join(root, "dist/presets", `${name}.css`), `${css}\n`);
    return { name, label: doc.label, css };
  });
writeFileSync(join(root, "dist/presets.css"), `${presets.map((p) => p.css).join("\n\n")}\n`);
writeFileSync(join(root, "dist/presets.json"), `${JSON.stringify(presets.map(({ name, label }) => ({ name, label })))}\n`);
const globalPaths = new Map(global.map((t) => [t.path, t.type]));
mkdirSync(join(root, "dist/styles"), { recursive: true });
const looks = readdirSync(join(root, "tokens/style"))
  .filter((file) => file.endsWith(".json"))
  .sort((a, b) => (a === "minimal.json" ? -1 : b === "minimal.json" ? 1 : a.localeCompare(b)))
  .map((file) => {
    const name = basename(file, ".json");
    const doc = load(`style/${file}`);
    const tokens = flatten(doc.tokens);
    const stray = tokens.filter((t) => globalPaths.get(t.path) !== t.type).map((t) => t.path);
    if (stray.length) throw new Error(`style ${name} sets tokens the global layer doesn't define with that type: ${stray.join(", ")}`);
    const css = [`/* ${name}: ${doc.label.en} */`, ...(tokens.length ? [block(`[data-style="${name}"]`, tokens)] : [])].join("\n\n");
    writeFileSync(join(root, "dist/styles", `${name}.css`), `${css}\n`);
    return { name, label: doc.label, css };
  });
writeFileSync(join(root, "dist/styles.css"), `${looks.map((s) => s.css).join("\n\n")}\n`);
writeFileSync(join(root, "dist/styles.json"), `${JSON.stringify(looks.map(({ name, label }) => ({ name, label })))}\n`);
const STYLES = ["base", "motion", "charts", "overlay", "slides", "document", "article"];
writeFileSync(join(root, "dist/ui.css"), STYLES.map((name) => readFileSync(join(root, "src/lib/styles", `${name}.css`), "utf8")).join("\n"));
writeFileSync(join(root, "dist/tokens.json"), `${JSON.stringify({ version, ...snapshot }, null, 2)}\n`);
console.log(`built ${global.length} global, ${themes.light.length} theme, ${media[DEFAULT.medium].length} medium, ${langs[DEFAULT.lang].length} lang tokens (${Object.keys(langs).join(", ")}), ${Object.keys(icons).length} icons → dist/`);
