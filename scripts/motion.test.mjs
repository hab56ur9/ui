import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";

const dir = new URL("../src/lib/styles/", import.meta.url);
const transitions = readdirSync(dir)
  .filter((file) => file.endsWith(".css"))
  .flatMap((file) =>
    readFileSync(new URL(file, dir), "utf8")
      .split("\n")
      .map((line, index) => ({ at: `${file}:${index + 1}`, line: line.trim() }))
      .filter(({ line }) => /^transition(-duration)?\s*:/.test(line) && !/:\s*none\b/.test(line)),
  );

test("transition times never use a literal duration", () => {
  const literal = transitions.filter(({ line }) => /[\s(]\d*\.?\d+m?s\b/.test(line)).map(({ at }) => at);
  assert.deepEqual(literal, []);
});

test("transition durations always scale with motion intensity", () => {
  const unscaled = transitions
    .filter(({ line }) => [...line.matchAll(/var\(--motion-duration-[a-z]+\)(?!\s*\*\s*var\(--motion-intensity\))/g)].length > 0)
    .map(({ at }) => at);
  assert.deepEqual(unscaled, []);
});
