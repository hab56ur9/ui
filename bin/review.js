const STORE = "ui-review";
const source = document.getElementById(STORE);
const review = source ? JSON.parse(source.textContent) : { version: 1, screens: {} };
review.overlays ??= {};
const embedded = window.parent !== window;
let on = false;
let dragged = null;
let applying = false;
let savedState = JSON.stringify(source ? JSON.parse(source.textContent) : null);

const STYLE = `
.ui-review-bar { position: fixed; right: var(--space-4); bottom: var(--space-4); z-index: 100; display: flex; gap: var(--space-2); align-items: center; padding: var(--space-2); border: var(--border-width-default) solid var(--color-border-default); border-radius: var(--radius-card); background: var(--color-bg-raised); box-shadow: var(--elevation-lifted); font: inherit; }
.ui-review-bar span { padding: 0 var(--space-2); color: var(--color-fg-muted); font-size: var(--font-size-caption); }
.ui-review-on .widget[data-id] { outline: var(--border-width-strong) dashed var(--color-border-strong); outline-offset: calc(-1 * var(--border-width-strong)); }
.ui-review-on .widget[data-id].is-dragover { outline-color: var(--color-main-default); }
.ui-review-tools { position: absolute; top: var(--space-2); right: var(--space-2); left: var(--space-2); z-index: 5; display: none; flex-wrap: wrap; justify-content: flex-end; gap: var(--space-1); pointer-events: none; }
.ui-review-tools button { pointer-events: auto; }
.ui-review-on .widget:hover > .ui-review-tools, .ui-review-on .widget:focus-within > .ui-review-tools { display: flex; }
.ui-review-tools button, .ui-review-bar button { min-width: 28px; height: 28px; padding: 0 var(--space-2); border: var(--border-width-default) solid var(--color-border-default); border-radius: var(--radius-control); background: var(--color-bg-surface); color: var(--color-fg-default); font: inherit; font-size: var(--font-size-caption); cursor: pointer; }
.ui-review-note { position: absolute; left: var(--space-2); right: var(--space-2); bottom: var(--space-2); z-index: 5; display: none; padding: var(--space-2); border-radius: var(--radius-control); background: var(--color-status-warning-subtle, var(--color-bg-subtle)); color: var(--color-fg-default); font-size: var(--font-size-caption); white-space: pre-wrap; }
.ui-review-on .ui-review-note.has-note, .ui-review-note.is-editing { display: block; }
.ui-review-on dialog > .ui-review-tools.is-overlay { position: static; display: flex; padding: 0 var(--space-4) var(--space-3); }
dialog > .ui-review-note.is-overlay { position: static; margin: 0 var(--space-4) var(--space-4); }
.ui-review-note textarea { width: 100%; min-height: 64px; font: inherit; }
.widget.ui-review-removed { display: none; }
.ui-review-on [data-press] { display: none; }
.ui-review-on .widget.ui-review-removed { display: flex; opacity: 0.35; }
.ui-review-on [data-review-text] { cursor: text; }
.ui-review-on [contenteditable="true"] { outline: var(--focus-ring-width) solid var(--color-main-default); }
`;

const screenOf = () => document.querySelector("[data-screen]");
const entry = (screen) => (review.screens[screen] ??= { widgets: {}, added: [] });
const widgetEntry = (screen, id) => {
  const state = entry(screen);
  state.widgets ??= {};
  return (state.widgets[id] ??= {});
};
const board = (root) => root.querySelector(".board");
const widgetsOf = (root) => [...board(root)?.children ?? []].filter((el) => el.matches(".widget[data-id]"));
const clean = (value) => Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined && !(Array.isArray(v) && !v.length) && v !== ""));

function leafTexts(widget) {
  return [...widget.querySelectorAll("*")].filter((el) => !el.closest(".ui-review-tools, .ui-review-note") && el.children.length === 0 && el.textContent.trim() && !el.closest("svg"));
}

function tools(widget, screen) {
  if (widget.querySelector(":scope > .ui-review-tools")) return;
  const id = widget.dataset.id;
  const bar = document.createElement("div");
  bar.className = "ui-review-tools";
  const button = (label, title, run) => {
    const el = document.createElement("button");
    el.type = "button";
    el.textContent = label;
    el.title = title;
    el.addEventListener("click", (e) => {
      e.stopPropagation();
      run();
      apply();
    });
    bar.append(el);
  };
  const size = (key, step) => () => {
    const state = widgetEntry(screen, id);
    const current = Number(state[key] ?? getComputedStyle(widget).getPropertyValue(`--${key}`)) || 1;
    state[key] = Math.min(key === "w" ? 12 : 12, Math.max(1, current + step));
  };
  button("◀", "Move earlier", () => move(screen, id, -1));
  button("▶", "Move later", () => move(screen, id, 1));
  button("W−", "Narrower", size("w", -1));
  button("W+", "Wider", size("w", 1));
  button("H−", "Shorter", size("h", -1));
  button("H+", "Taller", size("h", 1));
  button("✎", "Note", () => editNote(widget.querySelector(":scope > .ui-review-note"), widgetEntry(screen, id)));
  button("✕", "Remove or restore", () => {
    const state = widgetEntry(screen, id);
    state.removed = state.removed ? undefined : true;
  });
  widget.append(bar);
  const note = document.createElement("div");
  note.className = "ui-review-note";
  widget.append(note);
  widget.addEventListener("dragstart", (e) => {
    if (!on) return e.preventDefault();
    dragged = id;
    e.dataTransfer.effectAllowed = "move";
  });
  widget.addEventListener("dragover", (e) => {
    if (!on || !dragged || dragged === id) return;
    e.preventDefault();
    widget.classList.add("is-dragover");
  });
  widget.addEventListener("dragleave", () => widget.classList.remove("is-dragover"));
  widget.addEventListener("drop", (e) => {
    e.preventDefault();
    widget.classList.remove("is-dragover");
    if (!dragged || dragged === id) return;
    const order = currentOrder(screen).filter((key) => key !== dragged);
    order.splice(order.indexOf(id), 0, dragged);
    entry(screen).order = order;
    dragged = null;
    apply();
  });
  textEditing(widget, () => widgetEntry(screen, id));
}

function textEditing(container, stateOf) {
  container.addEventListener("dblclick", (e) => {
    if (!on) return;
    const target = e.target.closest("[data-review-text]");
    if (!target || target.isContentEditable) return;
    e.preventDefault();
    e.stopPropagation();
    const from = target.dataset.reviewFrom ?? target.textContent;
    target.contentEditable = "true";
    target.focus();
    target.addEventListener(
      "blur",
      () => {
        target.contentEditable = "false";
        const to = target.textContent;
        const state = stateOf();
        state.text = (state.text ?? []).filter((change) => change.from !== from);
        if (to !== from) state.text.push({ from, to });
        target.dataset.reviewFrom = from;
        apply();
      },
      { once: true },
    );
  });
}

function applyText(container, state) {
  for (const el of leafTexts(container)) {
    el.dataset.reviewText = "";
    const from = el.dataset.reviewFrom ?? el.textContent;
    const change = (state.text ?? []).find((c) => c.from === from);
    if (change && el.textContent !== change.to && !el.isContentEditable) {
      el.dataset.reviewFrom = from;
      el.textContent = change.to;
    }
  }
}

function applyNote(box, state) {
  if (!box) return;
  if (!box.classList.contains("is-editing") && box.textContent !== (state.note ?? "")) box.textContent = state.note ?? "";
  box.classList.toggle("has-note", Boolean(state.note));
}

function overlayTools(dialog, id) {
  if (dialog.querySelector(":scope > .ui-review-tools")) return;
  const bar = document.createElement("div");
  bar.className = "ui-review-tools is-overlay";
  const note = document.createElement("div");
  note.className = "ui-review-note is-overlay";
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = "✎ Note";
  button.addEventListener("click", (e) => {
    e.stopPropagation();
    editNote(note, (review.overlays[id] ??= {}));
  });
  bar.append(button);
  dialog.append(bar, note);
  textEditing(dialog, () => (review.overlays[id] ??= {}));
}

function currentOrder(screen) {
  const root = screenOf();
  const present = widgetsOf(root).map((el) => el.dataset.id);
  const saved = entry(screen).order ?? [];
  return [...saved.filter((id) => present.includes(id)), ...present.filter((id) => !saved.includes(id))];
}

function move(screen, id, step) {
  const order = currentOrder(screen);
  const at = order.indexOf(id);
  const to = Math.min(order.length - 1, Math.max(0, at + step));
  order.splice(at, 1);
  order.splice(to, 0, id);
  entry(screen).order = order;
}

function editNote(note, state) {
  note.classList.add("is-editing");
  note.textContent = "";
  const area = document.createElement("textarea");
  area.value = state.note ?? "";
  area.placeholder = "What should change here, and why?";
  note.append(area);
  area.focus();
  area.addEventListener("click", (e) => e.stopPropagation());
  area.addEventListener("blur", () => {
    state.note = area.value.trim() || undefined;
    note.classList.remove("is-editing");
    apply();
  });
}

function addWidget() {
  const root = screenOf();
  if (!root) return;
  const screen = root.dataset.screen;
  const state = entry(screen);
  const id = `new-${(state.added ?? []).length + 1}`;
  (state.added ??= []).push({ id, title: "New widget", w: 4, h: 2 });
  apply();
}

function placeholder(added) {
  const el = document.createElement("section");
  el.className = "widget is-static is-card ui-review-added";
  el.dataset.id = added.id;
  el.innerHTML = `<header class="widget-head"><div class="widget-titles"><h2 class="widget-title"></h2></div></header><div class="widget-body"></div>`;
  el.querySelector(".widget-title").textContent = added.title;
  return el;
}

function apply() {
  if (applying) return;
  applying = true;
  document.documentElement.classList.toggle("ui-review-on", on);
  const root = screenOf();
  const grid = root && board(root);
  if (grid) {
    const screen = root.dataset.screen;
    const state = entry(screen);
    for (const added of state.added ?? []) {
      if (!grid.querySelector(`:scope > [data-id="${added.id}"]`)) grid.append(placeholder(added));
      const el = grid.querySelector(`:scope > [data-id="${added.id}"]`);
      el.style.setProperty("--w", widgetEntry(screen, added.id).w ?? added.w);
      el.style.setProperty("--h", widgetEntry(screen, added.id).h ?? added.h);
    }
    const order = currentOrder(screen);
    for (const widget of widgetsOf(root)) {
      const id = widget.dataset.id;
      const saved = state.widgets?.[id] ?? {};
      widget.draggable = on;
      if (!embedded) tools(widget, screen);
      if (saved.w) widget.style.setProperty("--w", saved.w);
      if (saved.h) widget.style.setProperty("--h", saved.h);
      widget.style.order = String(order.indexOf(id));
      widget.classList.toggle("ui-review-removed", Boolean(saved.removed));
      applyText(widget, saved);
      applyNote(widget.querySelector(":scope > .ui-review-note"), saved);
    }
  }
  const overlay = document.querySelector("[data-overlay]")?.dataset.overlay;
  const dialog = overlay && document.querySelector("dialog[open]");
  if (dialog) {
    overlayTools(dialog, overlay);
    const state = review.overlays[overlay] ?? {};
    applyText(dialog, state);
    applyNote(dialog.querySelector(":scope > .ui-review-note"), state);
  }
  status();
  applying = false;
}

function snapshot() {
  const screens = Object.fromEntries(
    Object.entries(review.screens)
      .map(([screen, state]) => {
        const widgets = Object.fromEntries(Object.entries(state.widgets ?? {}).map(([id, w]) => [id, clean(w)]).filter(([, w]) => Object.keys(w).length));
        return [screen, clean({ order: state.order, widgets: Object.keys(widgets).length ? widgets : undefined, added: state.added })];
      })
      .filter(([, state]) => Object.keys(state).length),
  );
  const overlays = Object.fromEntries(Object.entries(review.overlays).map(([id, o]) => [id, clean(o)]).filter(([, o]) => Object.keys(o).length));
  return { version: 1, screens, ...(Object.keys(overlays).length && { overlays }) };
}

const label = document.createElement("span");
function status() {
  const current = snapshot();
  const changes = Object.values(current.screens).reduce((n, s) => n + Object.keys(s.widgets ?? {}).length + (s.added?.length ?? 0) + (s.order ? 1 : 0), 0) + Object.keys(current.overlays ?? {}).length;
  const saved = JSON.stringify(current) === savedState;
  const text = `${on ? "Review · " : ""}${changes} changes${saved ? " · saved" : ""}`;
  if (label.textContent !== text) label.textContent = text;
}

async function save() {
  const body = JSON.stringify(snapshot(), null, 2);
  const response = await fetch(`/__ui/review?file=${encodeURIComponent(location.pathname)}`, { method: "POST", headers: { "content-type": "application/json" }, body });
  if (!response.ok) {
    label.textContent = `Save failed (${response.status})`;
    return false;
  }
  savedState = JSON.stringify(JSON.parse(body));
  status();
  return true;
}

function mount() {
  const style = document.createElement("style");
  style.textContent = STYLE;
  document.head.append(style);
  const bar = document.createElement("div");
  bar.className = "ui-review-bar";
  const make = (text, run) => {
    const el = document.createElement("button");
    el.type = "button";
    el.textContent = text;
    el.addEventListener("click", run);
    return el;
  };
  const toggle = make("Review", () => {
    on = !on;
    toggle.textContent = on ? "Done" : "Review";
    apply();
  });
  bar.append(label, toggle, make("+ Widget", addWidget), make("Save", save));
  if (!embedded) document.body.append(bar);
  new MutationObserver(() => {
    queueMicrotask(apply);
    queueMicrotask(notify);
  }).observe(document.body, { childList: true, subtree: true });
  addEventListener("scroll", notify, true);
  addEventListener("resize", notify);
  apply();
}

const listeners = new Set();
let pending = false;
function notify() {
  if (pending) return;
  pending = true;
  requestAnimationFrame(() => {
    pending = false;
    for (const listener of listeners) listener();
  });
}

function editTextAt(x, y) {
  const root = screenOf();
  const target = document.elementFromPoint(x, y);
  const widget = target?.closest(".widget[data-id]");
  const leaf = widget && leafTexts(widget).find((el) => el === target || el.contains(target));
  if (!leaf) return false;
  const screen = root.dataset.screen;
  const id = widget.dataset.id;
  const from = leaf.dataset.reviewFrom ?? leaf.textContent;
  leaf.contentEditable = "true";
  leaf.focus();
  getSelection()?.selectAllChildren(leaf);
  leaf.addEventListener(
    "blur",
    () => {
      leaf.contentEditable = "false";
      const state = widgetEntry(screen, id);
      state.text = (state.text ?? []).filter((change) => change.from !== from);
      if (leaf.textContent !== from) state.text.push({ from, to: leaf.textContent });
      leaf.dataset.reviewFrom = from;
      apply();
      notify();
    },
    { once: true },
  );
  return true;
}

window.uiReview = {
  snapshot,
  save,
  subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  screen: () => screenOf()?.dataset.screen ?? null,
  screens() {
    const links = [...document.querySelectorAll('.shell-nav a[href^="#/"], nav a[href^="#/"]')].filter((a) => !a.closest(".pager"));
    const seen = new Map();
    for (const a of links) {
      const id = a.getAttribute("href").slice(2);
      if (!seen.has(id)) seen.set(id, a.textContent.trim());
    }
    return [...seen].map(([id, label]) => ({ id, label }));
  },
  go: (id) => (location.hash = `#/${id}`),
  widgets() {
    const root = screenOf();
    if (!root) return [];
    const grid = board(root);
    const flow = grid?.classList.contains("is-flow") ?? false;
    const style = grid && getComputedStyle(grid);
    const column = grid ? (grid.clientWidth - parseFloat(style.columnGap || "0") * 11) / 12 : 0;
    const row = grid ? parseFloat(style.getPropertyValue("--widget-row")) || parseFloat(style.gridAutoRows) || 0 : 0;
    const screen = root.dataset.screen;
    return widgetsOf(root).sort((a, b) => Number(a.style.order || 0) - Number(b.style.order || 0)).map((el) => {
      const rect = el.getBoundingClientRect();
      const saved = review.screens[screen]?.widgets?.[el.dataset.id] ?? {};
      const title = el.querySelector(".widget-title")?.textContent || el.querySelector("h2, h3")?.textContent || el.dataset.id;
      return {
        id: el.dataset.id,
        title,
        rect: { x: rect.left, y: rect.top, width: rect.width, height: rect.height },
        w: Number(getComputedStyle(el).getPropertyValue("--w")) || 0,
        h: Number(getComputedStyle(el).getPropertyValue("--h")) || 0,
        flow,
        column,
        row,
        gap: parseFloat(style?.columnGap || "0"),
        removed: Boolean(saved.removed),
        note: saved.note ?? "",
        text: saved.text ?? [],
        added: (review.screens[screen]?.added ?? []).some((item) => item.id === el.dataset.id),
      };
    });
  },
  patch(id, patch) {
    const screen = screenOf()?.dataset.screen;
    if (!screen) return;
    Object.assign(widgetEntry(screen, id), patch);
    apply();
    notify();
  },
  moveBefore(id, before) {
    const screen = screenOf()?.dataset.screen;
    if (!screen) return;
    const order = currentOrder(screen).filter((key) => key !== id);
    const at = before === null ? order.length : order.indexOf(before);
    order.splice(at < 0 ? order.length : at, 0, id);
    entry(screen).order = order;
    apply();
    notify();
  },
  addWidget() {
    addWidget();
    notify();
  },
  editTextAt,
  reveal(id) {
    screenOf()?.querySelector(`.widget[data-id="${id}"]`)?.scrollIntoView({ block: "center" });
  },
  scrollAt(x, y, dx, dy) {
    let el = document.elementFromPoint(x, y);
    while (el && el !== document.documentElement) {
      const style = getComputedStyle(el);
      if (/(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight) break;
      el = el.parentElement;
    }
    (el && el !== document.documentElement ? el : document.scrollingElement).scrollBy(dx, dy);
  },
  dirty: () => JSON.stringify(snapshot()) !== savedState,
};

mount();
