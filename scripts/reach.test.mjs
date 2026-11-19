import { test } from "node:test";
import assert from "node:assert/strict";
import { reach } from "../src/lib/reach.ts";

test("reach leaves an item that already clears the faded edges", () => {
  assert.equal(reach({ start: 0, size: 194 }, { start: 40, size: 50 }, 32), undefined);
});

test("reach scrolls an item under the end fade past the fade", () => {
  assert.equal(reach({ start: 0, size: 194 }, { start: 150, size: 49 }, 32), 37);
});

test("reach scrolls an item under the start fade past the fade", () => {
  assert.equal(reach({ start: 120, size: 194 }, { start: 130, size: 40 }, 32), 98);
});

test("reach stops at the start of the list", () => {
  assert.equal(reach({ start: 20, size: 194 }, { start: 0, size: 40 }, 32), 0);
});
