import { test } from "node:test";
import assert from "node:assert/strict";
import { bytes, durationMs, milliseconds, percentOf } from "../src/lib/format.ts";

test("percentOf gives the share of max", () => {
  assert.equal(percentOf(3, 5), "60%");
});

test("percentOf clamps a value above max to full", () => {
  assert.equal(percentOf(7, 5), "100%");
});

test("percentOf draws nothing when max is zero", () => {
  assert.equal(percentOf(0, 0), "0%");
  assert.equal(percentOf(3, 0), "0%");
});

test("percentOf draws nothing when max is negative", () => {
  assert.equal(percentOf(3, -5), "0%");
});

test("bytes keeps small sizes in bytes", () => {
  assert.equal(bytes(0), "0 B");
  assert.equal(bytes(1023), "1023 B");
});

test("bytes shows one decimal below ten units", () => {
  assert.equal(bytes(1536), "1.5 KB");
  assert.equal(bytes(2.4 * 1024 * 1024), "2.4 MB");
});

test("bytes rounds from ten units up", () => {
  assert.equal(bytes(50 * 1024 * 1024), "50 MB");
  assert.equal(bytes(5 * 1024 ** 5), "5120 TB");
});

test("bytes moves to the next unit when rounding reaches it", () => {
  assert.equal(bytes(10239), "10 KB");
  assert.equal(bytes(1048575), "1.0 MB");
  assert.equal(bytes(1023.6), "1.0 KB");
});

test("milliseconds reads both units a minified stylesheet may use", () => {
  assert.equal(milliseconds("240ms"), 240);
  assert.equal(milliseconds(".24s"), 240);
  assert.equal(milliseconds("1.2s"), 1200);
  assert.equal(milliseconds("0s"), 0);
});

test("durationMs keeps a zero duration instead of the fallback", () => {
  assert.equal(durationMs("0s", 200), 0);
  assert.equal(durationMs("0ms", 200), 0);
});

test("durationMs falls back only when the token is missing", () => {
  assert.equal(durationMs("", 200), 200);
  assert.equal(durationMs("  ", 120, "0.5"), 60);
});

test("durationMs scales the token by motion intensity", () => {
  assert.equal(durationMs(" .24s ", 200, "0.5"), 120);
  assert.equal(durationMs("120ms", 200, "2"), 240);
  assert.equal(durationMs(".4s", 200, "0"), 0);
  assert.equal(durationMs(".4s", 200, ""), 400);
});
