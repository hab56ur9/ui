import { test } from "node:test";
import assert from "node:assert/strict";
import { navGroups, sectionOf, specFormats, specNext, tocOf } from "../src/lib/appSpec.ts";

const spec = {
  app: { name: "Desk" },
  start: "home",
  frame: { sections: [{ label: "Work", groups: ["Main"] }, { label: "Docs", groups: ["Guide"] }] },
  nav: [
    { screen: "home", label: "Home", group: "Main" },
    { screen: "list", label: "List", group: "Main" },
    { screen: "intro", label: "Intro", group: "Guide" },
  ],
  screens: { home: {}, list: {}, intro: { layout: "article" } },
  panels: { info: { title: "Info", content: [] } },
  overlays: { confirm: { title: "Sure?" } },
};
const at = { screen: "home", panel: null, overlay: null };

test("specNext navigates by params or by value and ignores unknown screens", () => {
  assert.equal(specNext(spec, at, { name: "navigate", params: { screen: "list" } }).screen, "list");
  assert.equal(specNext(spec, at, { name: "navigate" }, "intro").screen, "intro");
  assert.equal(specNext(spec, at, { name: "navigate" }, "nowhere").screen, "home");
  assert.equal(specNext(spec, at, { name: "navigate" }, "toString").screen, "home");
});

test("specNext opens and closes overlays", () => {
  const open = specNext(spec, at, { name: "open", params: { overlay: "confirm" } });
  assert.equal(open.overlay, "confirm");
  assert.equal(specNext(spec, open, { name: "close" }).overlay, null);
  assert.equal(specNext(spec, open, { name: "save", close: true }).overlay, null);
});

test("specNext toggles panels and drops unknown ones", () => {
  const shown = specNext(spec, at, { name: "panel", params: { panel: "info" } });
  assert.equal(shown.panel, "info");
  assert.equal(specNext(spec, shown, { name: "panel" }).panel, null);
  assert.equal(specNext(spec, at, { name: "panel" }, "missing").panel, null);
  assert.equal(specNext(spec, at, { name: "panel" }, "constructor").panel, null);
});

test("specNext leaves the position alone for app actions", () => {
  assert.deepEqual(specNext(spec, at, { name: "save" }, "x"), at);
});

test("navGroups keeps nav order and merges neighbours of one group", () => {
  const groups = navGroups(spec.nav);
  assert.deepEqual(groups.map((g) => [g.title, g.items.length]), [["Main", 2], ["Guide", 1]]);
});

test("sectionOf finds the section of the screen's group", () => {
  assert.equal(sectionOf(spec, "intro"), 1);
  assert.equal(sectionOf(spec, "list"), 0);
  assert.equal(sectionOf(spec, "unlisted"), 0);
});

test("tocOf lists titled article sections only on article screens", () => {
  const section = (id, title) => ({ type: "ArticleSection", props: { id, title } });
  const article = { layout: "article", widgets: [{ id: "a", w: 12, h: 1, content: [section("one", "One"), { type: "Text" }] }, { id: "b", w: 12, h: 1, content: section("two", "Two") }] };
  assert.deepEqual(tocOf(article), [{ id: "one", label: "One" }, { id: "two", label: "Two" }]);
  assert.deepEqual(tocOf({ ...article, layout: "grid" }), []);
  assert.deepEqual(tocOf({ ...article, toc: false }), []);
});

test("specFormats builds number, compact, percent and date formatters", () => {
  const f = specFormats(
    { won: { style: "number", unit: "원" }, big: { style: "compact", digits: 1 }, rate: { style: "percent", digits: 1 }, day: { style: "date" } },
    "en-US",
  );
  assert.equal(f.won(12345.6), "12,346원");
  assert.equal(f.big(15300), "15.3K");
  assert.equal(f.rate(0.1234), "12.3%");
  assert.equal(f.day(new Date(2026, 10, 19).getTime()), "Thu, 11/19");
});
