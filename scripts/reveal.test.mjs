import { test } from "node:test";
import assert from "node:assert/strict";
import { reveal } from "../src/lib/reveal.ts";

test("reveal keeps a plain command whole", () => {
  assert.deepEqual(reveal("git push origin HEAD:master"), [{ text: "git push origin HEAD:master", hidden: false }]);
});

test("reveal names a bidi override instead of applying it", () => {
  assert.deepEqual(reveal("rm -rf ./\u202Etxt.sh"), [
    { text: "rm -rf ./", hidden: false },
    { text: "U+202E", hidden: true },
    { text: "txt.sh", hidden: false },
  ]);
});

test("reveal names each control and zero-width character in a run", () => {
  assert.deepEqual(reveal("a\r\u200B\u0007b"), [
    { text: "a", hidden: false },
    { text: "U+000D", hidden: true },
    { text: "U+200B", hidden: true },
    { text: "U+0007", hidden: true },
    { text: "b", hidden: false },
  ]);
});

test("reveal leaves tabs and line breaks visible as layout", () => {
  assert.deepEqual(reveal("a\tb\nc"), [{ text: "a\tb\nc", hidden: false }]);
});

test("reveal names tag characters, variation selectors and filler letters", () => {
  assert.deepEqual(reveal("a\u{E0041}\uFE0F\u3164\u2028b"), [
    { text: "a", hidden: false },
    { text: "U+E0041", hidden: true },
    { text: "U+FE0F", hidden: true },
    { text: "U+3164", hidden: true },
    { text: "U+2028", hidden: true },
    { text: "b", hidden: false },
  ]);
});

test("reveal names the halfwidth filler, grapheme joiner and Mongolian selectors", () => {
  assert.deepEqual(
    reveal("a\uFFA0\u034F\u180Bb").map((part) => part.text),
    ["a", "U+FFA0", "U+034F", "U+180B", "b"],
  );
});
