import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { buildHtml, checkSpec } from "../bin/spec.mjs";

const { components } = JSON.parse(readFileSync(new URL("../dist/components.json", import.meta.url), "utf8"));

const desk = () => ({
  spec: 1,
  app: { name: "Desk", description: "Threads beside a channel." },
  start: "channel",
  nav: [
    { screen: "channel", label: "Channel", icon: "hash" },
    { screen: "people", label: "People", icon: "users" },
  ],
  frame: {
    shell: "desktop",
    sidebar: { type: "ActivityList", props: { items: { $data: "activity" }, value: { $state: "panel" }, onSelect: { $action: { name: "panel" } } } },
  },
  data: {
    activity: { description: "Recent threads.", example: [{ id: "t1", kind: "mention", author: "Ana", title: "Shell", time: "21:40", text: "Draw the shell." }] },
  },
  screens: {
    channel: { description: "Channel log.", title: "Channel", widgets: [{ id: "count", title: "Count", w: 3, h: 2, description: "Message count.", content: { type: "Stat", props: { value: 7 } } }] },
    people: { description: "Members.", title: "People", widgets: [{ id: "count", title: "Count", w: 3, h: 2, description: "Member count.", content: { type: "Stat", props: { value: 3 } } }] },
  },
  panels: {
    t1: { title: "Shell", description: "Shell thread.", content: { type: "ChatMessage", props: { author: "Ana", time: "21:40" }, children: "Draw the shell." } },
  },
});

const errorsOf = (change) => {
  const spec = desk();
  change(spec);
  return checkSpec(spec, components);
};

test("a desktop spec with a sidebar and panels passes the check", () => {
  assert.deepEqual(checkSpec(desk(), components), []);
});

test("the check rejects an unknown shell", () => {
  assert.ok(errorsOf((spec) => (spec.frame.shell = "tablet")).some((error) => error.startsWith("frame.shell:")));
});

test("the check rejects a sidebar outside the desktop shell", () => {
  assert.ok(errorsOf((spec) => delete spec.frame.shell).includes("frame.sidebar: needs frame.shell desktop"));
});

test("the check rejects a panel action that names no panel", () => {
  const errors = errorsOf((spec) => (spec.frame.sidebar.props.onSelect = { $action: { name: "panel", params: { panel: "t9" } } }));
  assert.ok(errors.some((error) => error.endsWith("opens no panel (t9)")));
});

test("the check rejects a desktop nav item without an icon", () => {
  assert.ok(errorsOf((spec) => delete spec.nav[1].icon).some((error) => error.startsWith("nav.1.icon:")));
});

test("the check rejects an unknown state", () => {
  assert.ok(errorsOf((spec) => (spec.frame.sidebar.props.value = { $state: "overlay" })).some((error) => error.includes("reads unknown state overlay")));
});

test("the build puts the sidebar and panels in a desktop shell", () => {
  const html = buildHtml(desk(), { module: "/ui/ui.js" });
  assert.match(html, /h\(DesktopShell, \{/);
  assert.match(html, /function FrameSidebar\(\{ act, state \}\)/);
  assert.match(html, /function T1Panel\(\{ act, state \}\)/);
  assert.match(html, /value: state\["panel"\]/);
});
