import { test } from "node:test";
import assert from "node:assert/strict";
import { reveal } from "../src/lib/reveal.ts";

test("reveal keeps a plain command whole", () => {
  assert.deepEqual(reveal("git push origin HEAD:master"), [{ text: "git push origin HEAD:master", hidden: false }]);
});

test("reveal names a bidi override instead of applying it", () => {
  assert.deepEqual(reveal("rm -rf ./‮txt.sh"), [
    { text: "rm -rf ./", hidden: false },
    { text: "U+202E", hidden: true },
    { text: "txt.sh", hidden: false },
  ]);
});

test("reveal names each control and zero-width character in a run", () => {
  assert.deepEqual(reveal("a\r​\u0007b"), [
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
