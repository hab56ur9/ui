import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeLayout } from "../src/lib/boardLayout.ts";

const widgets = [
  { id: "a", w: 3, h: 1 },
  { id: "b", w: 6, h: 3 },
  { id: "c", w: 12, h: 4 },
];

test("mergeLayout keeps the saved order, sizes and hidden state", () => {
  const saved = [
    { id: "c", w: 6, h: 2, hidden: false },
    { id: "a", w: 4, h: 1, hidden: true },
    { id: "b", w: 6, h: 3, hidden: false },
  ];
  assert.deepEqual(mergeLayout(saved, widgets), saved);
});

test("mergeLayout appends new widgets at their default size", () => {
  const saved = [{ id: "b", w: 12, h: 2, hidden: false }];
  assert.deepEqual(mergeLayout(saved, widgets), [
    { id: "b", w: 12, h: 2, hidden: false },
    { id: "a", w: 3, h: 1, hidden: false },
    { id: "c", w: 12, h: 4, hidden: false },
  ]);
});

test("mergeLayout drops widgets that no longer exist", () => {
  const saved = [
    { id: "gone", w: 3, h: 1, hidden: false },
    { id: "a", w: 3, h: 1, hidden: false },
    { id: "b", w: 6, h: 3, hidden: false },
    { id: "c", w: 12, h: 4, hidden: false },
  ];
  assert.deepEqual(mergeLayout(saved, widgets).map(({ id }) => id), ["a", "b", "c"]);
});

test("mergeLayout falls back to defaults for missing or broken saves", () => {
  const fresh = widgets.map(({ id, w, h }) => ({ id, w, h, hidden: false }));
  assert.deepEqual(mergeLayout(undefined, widgets), fresh);
  assert.deepEqual(mergeLayout("x", widgets), fresh);
  assert.deepEqual(mergeLayout([null, { id: 1 }, { id: "a" }], widgets), fresh);
});
