import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, extname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const requested = process.argv.slice(2).map((path) => resolve(path));
const inRoot = (...paths) => paths.map((path) => join(root, path));

const RULES = [
  {
    name: "raw color literal — use a var(--color-*) token",
    pattern: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?|oklch|oklab|lab|lch)\(/,
    extensions: new Set([".css", ".ts", ".tsx", ".html"]),
    scanned: requested.length ? requested : inRoot("src", "blocks"),
  },
  {
    name: "local machine path — the repository is public; link the published site or a relative path",
    pattern: /file:\/\/\/|\/Users\/|~\/Developer/,
    extensions: new Set([".css", ".ts", ".tsx", ".html", ".md", ".json", ".mjs", ".yml"]),
    scanned: requested.length ? requested : inRoot("src", "blocks", "docs", "plugin", "scripts", "bin", "tokens", ".github", "README.md", "AGENTS.md", "index.html", "package.json", "release-please-config.json"),
  },
];

const filesIn = (path, extensions) => {
  if (!statSync(path).isDirectory()) return [path];
  return readdirSync(path, { withFileTypes: true }).flatMap((entry) => {
    const child = join(path, entry.name);
    if (entry.isDirectory()) return filesIn(child, extensions);
    return extensions.has(extname(entry.name)) ? [child] : [];
  });
};

const findings = RULES.flatMap((rule) =>
  rule.scanned
    .flatMap((path) => filesIn(path, rule.extensions))
    .flatMap((file) =>
      readFileSync(file, "utf8")
        .split("\n")
        .map((text, i) => ({ rule: rule.name, file: relative(process.cwd(), file), line: i + 1, text: text.trim() }))
        .filter(({ text }) => rule.pattern.test(text)),
    ),
);

findings.forEach(({ rule, file, line, text }) => console.error(`${file}:${line}  ${rule}\n    ${text}`));
if (findings.length) process.exit(1);
console.log(`lint: no raw color literals or local paths (${RULES.map((rule) => rule.scanned.length).join(" + ")} roots)`);
