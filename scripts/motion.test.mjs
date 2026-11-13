import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const styles = new URL("../src/lib/styles/", import.meta.url);
const sheets = [
  ...readdirSync(styles)
    .filter((file) => file.endsWith(".css"))
    .map((file) => ({ name: file, url: new URL(file, styles) })),
  { name: "docs.css", url: new URL("../src/site/docs.css", import.meta.url) },
];

const declarations = sheets.flatMap(({ name, url }) => {
  const text = readFileSync(url, "utf8");
  return [...text.matchAll(/(?<![\w-])(transition|transition-duration|animation|animation-duration)\s*:\s*([^;{}]+)/g)].map((match) => ({
    at: `${name}:${text.slice(0, match.index).split("\n").length}`,
    value: match[2].trim(),
  }));
});

const timed = declarations.filter(({ value }) => !/^none\b/.test(value) && !/\binfinite\b/.test(value));

test("transitions and one-shot animations never use a literal duration", () => {
  const literal = timed.filter(({ value }) => /(^|[\s(,])\d*\.?\d+m?s\b/.test(value)).map(({ at }) => at);
  assert.deepEqual(literal, []);
});

test("transitions and one-shot animations always scale with motion intensity", () => {
  const unscaled = timed
    .filter(({ value }) => /var\(--motion-duration-[a-z]+\)(?!(\s*\*\s*\d*\.?\d+)*\s*\*\s*var\(--motion-intensity\))/.test(value))
    .map(({ at }) => at);
  assert.deepEqual(unscaled, []);
});
