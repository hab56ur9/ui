import { test } from "node:test";
import assert from "node:assert/strict";
import { percentOf } from "../src/lib/format.ts";

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
