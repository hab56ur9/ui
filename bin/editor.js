import { Button, Segmented, h, render, themes, useEffect, useRef, useState } from "/ui/dist/ui.js";

const file = new URLSearchParams(location.search).get("file") ?? "";
const DEVICES = { desktop: [1440, 900], tablet: [768, 1024], mobile: [390, 844] };
const PAD = 32;

const STYLE = `
html, body { height: 100%; margin: 0; }
body { background: var(--color-bg-page); color: var(--color-fg-default); font-family: var(--font-family-sans); }
.ed { display: grid; grid-template-columns: 240px minmax(0, 1fr) 280px; grid-template-rows: auto minmax(0, 1fr); height: 100vh; }
.ed-bar { grid-column: 1 / -1; display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) var(--space-4); border-bottom: var(--border-width-default) solid var(--color-border-default); background: var(--color-bg-surface); }
.ed-file { font-family: var(--font-family-mono); font-size: var(--font-size-caption); color: var(--color-fg-secondary); }
.ed-spacer { flex: 1; }
.ed-status { color: var(--color-fg-muted); font-size: var(--font-size-caption); }
.ed-side { overflow: auto; padding: var(--space-3); border-right: var(--border-width-default) solid var(--color-border-default); background: var(--color-bg-surface); }
.ed-props { overflow: auto; padding: var(--space-4); border-left: var(--border-width-default) solid var(--color-border-default); background: var(--color-bg-surface); display: flex; flex-direction: column; gap: var(--space-3); }
.ed-heading { margin: var(--space-3) 0 var(--space-1); color: var(--color-fg-muted); font-size: var(--font-size-caption); font-weight: var(--font-weight-semibold); text-transform: uppercase; letter-spacing: 0.04em; }
.ed-item { display: block; width: 100%; padding: var(--space-1) var(--space-2); border: 0; border-radius: var(--radius-control); background: none; color: var(--color-fg-default); font: inherit; font-size: var(--font-size-label); text-align: left; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ed-item:hover { background: var(--color-bg-subtle); }
.ed-item.is-current { background: var(--color-main-subtle); color: var(--color-fg-default); }
.ed-item.is-removed { color: var(--color-fg-muted); text-decoration: line-through; }
.ed-stage { position: relative; overflow: auto; background: var(--color-bg-subtle); }
.ed-canvas { position: relative; margin: ${PAD}px auto; box-shadow: var(--elevation-lifted); background: var(--color-bg-page); }
.ed-canvas iframe { position: absolute; top: 0; left: 0; border: 0; transform-origin: 0 0; background: var(--color-bg-page); }
.ed-layer { position: absolute; inset: 0; overflow: hidden; }
.ed-layer.is-passive { pointer-events: none; }
.ed-box { position: absolute; border: var(--border-width-default) dashed transparent; cursor: grab; }
.ed-box:hover { border-color: var(--color-main-default); }
.ed-box.is-selected { border: var(--border-width-strong) solid var(--color-main-default); }
.ed-box.is-removed { background: repeating-linear-gradient(45deg, transparent 0 8px, var(--color-bg-scrim) 8px 9px); }
.ed-box.is-dragging { opacity: 0.4; }
.ed-tag { position: absolute; top: -22px; left: -2px; padding: 2px var(--space-2); border-radius: var(--radius-control) var(--radius-control) 0 0; background: var(--color-main-default); color: var(--color-main-on); font-size: var(--font-size-caption); white-space: nowrap; pointer-events: none; }
.ed-note { position: absolute; top: var(--space-1); right: var(--space-1); width: 10px; height: 10px; border-radius: var(--radius-pill); background: var(--color-status-warning); pointer-events: none; }
.ed-handle { position: absolute; right: -6px; bottom: -6px; width: 12px; height: 12px; border: var(--border-width-strong) solid var(--color-main-default); border-radius: var(--radius-mark); background: var(--color-bg-raised); cursor: nwse-resize; }
.ed-drop { position: absolute; width: 4px; border-radius: var(--radius-pill); background: var(--color-main-default); pointer-events: none; }
.ed-ghost { position: absolute; border: var(--border-width-strong) dashed var(--color-main-default); background: var(--color-main-subtle); opacity: 0.6; pointer-events: none; }
.ed-field { display: flex; flex-direction: column; gap: var(--space-1); font-size: var(--font-size-label); color: var(--color-fg-secondary); }
.ed-field input[type="number"], .ed-field textarea { width: 100%; box-sizing: border-box; padding: var(--space-2); border: var(--border-width-default) solid var(--color-border-default); border-radius: var(--radius-control); background: var(--color-bg-page); color: var(--color-fg-default); font: inherit; }
.ed-field textarea { min-height: 96px; resize: vertical; }
.ed-pair { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
.ed-change { font-size: var(--font-size-caption); color: var(--color-fg-secondary); }
.ed-change s { color: var(--color-fg-muted); }
.ed-empty { color: var(--color-fg-muted); font-size: var(--font-size-label); }
`;

function useEngine(frame, reloadKey) {
  const [engine, setEngine] = useState(null);
  const [, setTick] = useState(0);
  useEffect(() => {
    setEngine(null);
    let stop = () => undefined;
    const timer = setInterval(() => {
      const api = frame.current?.contentWindow?.uiReview;
      if (!api) return;
      clearInterval(timer);
      setEngine(api);
      stop = api.subscribe(() => setTick((n) => n + 1));
    }, 100);
    return () => {
      clearInterval(timer);
      stop();
    };
  }, [reloadKey]);
  return engine;
}

function Editor() {
  const frame = useRef(null);
  const stage = useRef(null);
  const layer = useRef(null);
  const [device, setDevice] = useState("desktop");
  const [mode, setMode] = useState("edit");
  const [loads, setLoads] = useState(0);
  const [stageWidth, setStageWidth] = useState(1000);
  const [selected, setSelected] = useState(null);
  const [drag, setDrag] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("");
  const engine = useEngine(frame, loads);
  const [width, height] = DEVICES[device];
  const scale = Math.min(1, (stageWidth - PAD * 2) / width);

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setStageWidth(entry.contentRect.width));
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  const widgets = engine?.widgets() ?? [];
  const screens = engine?.screens() ?? [];
  const screen = engine?.screen();
  const current = widgets.find((w) => w.id === selected);
  const box = (rect) => ({ left: rect.x * scale, top: rect.y * scale, width: rect.width * scale, height: rect.height * scale });
  const local = (e) => {
    const r = layer.current.getBoundingClientRect();
    return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale };
  };

  const startMove = (e, widget) => {
    if (e.button !== 0) return;
    e.preventDefault();
    setSelected(widget.id);
    setDrag({ kind: "move", id: widget.id, start: local(e), target: undefined, moved: false });
  };
  const startResize = (e, widget) => {
    e.preventDefault();
    e.stopPropagation();
    setSelected(widget.id);
    setDrag({ kind: "resize", id: widget.id, start: local(e), w: widget.w, h: widget.h });
  };
  const onMove = (e) => {
    if (!drag) return;
    const point = local(e);
    if (drag.kind === "move") {
      const over = widgets.find((w) => w.id !== drag.id && point.x >= w.rect.x && point.x <= w.rect.x + w.rect.width && point.y >= w.rect.y && point.y <= w.rect.y + w.rect.height);
      const after = over && (over.flow ? point.y > over.rect.y + over.rect.height / 2 : point.x > over.rect.x + over.rect.width / 2);
      const others = widgets.filter((w) => w.id !== drag.id);
      const at = over ? others.indexOf(over) + (after ? 1 : 0) : undefined;
      const target = at === undefined ? undefined : (others[at]?.id ?? null);
      setDrag({ ...drag, point, moved: drag.moved || Math.hypot(point.x - drag.start.x, point.y - drag.start.y) > 4, target, over: over && { ...over, after } });
    }
    if (drag.kind === "resize") {
      const widget = widgets.find((w) => w.id === drag.id);
      const w = Math.max(1, Math.min(12, Math.round((widget.rect.width + point.x - drag.start.x + widget.gap) / (widget.column + widget.gap))));
      const hh = Math.max(1, Math.round((widget.rect.height + point.y - drag.start.y + widget.gap) / (widget.row + widget.gap)));
      setDrag({ ...drag, point, w, h: hh });
    }
  };
  const onUp = () => {
    if (drag?.kind === "move" && drag.moved && drag.target !== undefined) engine.moveBefore(drag.id, drag.target);
    if (drag?.kind === "resize") engine.patch(drag.id, { w: drag.w, h: drag.h });
    setDrag(null);
  };
  const onDouble = (e) => {
    const { x, y } = local(e);
    if (!engine.editTextAt(x, y)) return;
    setEditing(true);
    frame.current.contentDocument.addEventListener("focusout", () => setEditing(false), { once: true });
  };
  const onWheel = (e) => {
    const { x, y } = local(e);
    engine.scrollAt(x, y, e.deltaX / scale, e.deltaY / scale);
  };
  const save = async () => {
    setStatus("Saving…");
    const ok = await engine.save();
    setStatus(ok ? "Saved" : "Save failed");
  };

  const dragging = drag && widgets.find((w) => w.id === drag.id);
  const drop = drag?.kind === "move" && drag.moved && drag.over;
  return h(
    "div",
    { className: "ed", onPointerMove: onMove, onPointerUp: onUp },
    h(
      "header",
      { className: "ed-bar" },
      h("strong", null, "ui editor"),
      h("span", { className: "ed-file" }, file),
      h("span", { className: "ed-spacer" }),
      h(Segmented, { label: "Mode", value: mode, onChange: setMode, options: [{ value: "edit", label: "Edit" }, { value: "interact", label: "Interact" }] }),
      h(Segmented, { label: "Device", value: device, onChange: setDevice, options: [{ value: "desktop", label: "Desktop" }, { value: "tablet", label: "Tablet" }, { value: "mobile", label: "Mobile" }] }),
      h("span", { className: "ed-status" }, `${Math.round(scale * 100)}%`),
      h(Button, { onClick: () => engine?.addWidget() }, "+ Widget"),
      h("span", { className: "ed-status" }, status || (engine?.dirty() ? "Unsaved changes" : "")),
      h(Button, { variant: "primary", onClick: save, disabled: !engine }, "Save"),
    ),
    h(
      "aside",
      { className: "ed-side" },
      h("div", { className: "ed-heading" }, "Screens"),
      screens.map((item) => h("button", { key: item.id, type: "button", className: `ed-item${item.id === screen ? " is-current" : ""}`, onClick: () => engine.go(item.id) }, item.label)),
      h("div", { className: "ed-heading" }, "Widgets"),
      widgets.map((w) =>
        h(
          "button",
          {
            key: w.id,
            type: "button",
            className: `ed-item${w.id === selected ? " is-current" : ""}${w.removed ? " is-removed" : ""}`,
            onClick: () => {
              setSelected(w.id);
              engine.reveal(w.id);
            },
          },
          `${w.title}${w.note ? " •" : ""}`,
        ),
      ),
    ),
    h(
      "main",
      { className: "ed-stage", ref: stage },
      h(
        "div",
        { className: "ed-canvas", style: { width: width * scale, height: height * scale } },
        h("iframe", { ref: frame, src: file, title: "canvas", style: { width, height, transform: `scale(${scale})` }, onLoad: () => setLoads((n) => n + 1) }),
        h(
          "div",
          { ref: layer, className: `ed-layer${mode === "interact" || editing ? " is-passive" : ""}`, onWheel, onDoubleClick: onDouble, onPointerDown: (e) => e.target === e.currentTarget && setSelected(null) },
          widgets.map((w) =>
            h(
              "div",
              {
                key: w.id,
                className: `ed-box${w.id === selected ? " is-selected" : ""}${w.removed ? " is-removed" : ""}${drag?.kind === "move" && drag.moved && drag.id === w.id ? " is-dragging" : ""}`,
                style: box(w.rect),
                onPointerDown: (e) => startMove(e, w),
              },
              w.id === selected && h("span", { className: "ed-tag" }, `${w.title}${w.flow ? "" : ` · ${w.w}×${w.h}`}`),
              w.note && h("span", { className: "ed-note" }),
              w.id === selected && !w.flow && h("span", { className: "ed-handle", onPointerDown: (e) => startResize(e, w) }),
            ),
          ),
          drop &&
            h("div", {
              className: "ed-drop",
              style: drop.flow
                ? { left: drop.rect.x * scale, width: drop.rect.width * scale, height: 4, top: (drop.after ? drop.rect.y + drop.rect.height : drop.rect.y) * scale - 2 }
                : { top: drop.rect.y * scale, height: drop.rect.height * scale, left: (drop.after ? drop.rect.x + drop.rect.width : drop.rect.x) * scale - 2 },
            }),
          drag?.kind === "resize" && dragging && h("div", { className: "ed-ghost", style: { ...box(dragging.rect), width: (drag.w * (dragging.column + dragging.gap) - dragging.gap) * scale, height: (drag.h * (dragging.row + dragging.gap) - dragging.gap) * scale } }),
        ),
      ),
    ),
    h(
      "aside",
      { className: "ed-props" },
      current
        ? [
            h("div", { key: "t", className: "ed-heading" }, `Widget · ${current.id}`),
            h("strong", { key: "n" }, current.title),
            !current.flow &&
              h(
                "div",
                { key: "s", className: "ed-pair" },
                h("label", { className: "ed-field" }, "Columns", h("input", { type: "number", min: 1, max: 12, value: current.w, onChange: (e) => engine.patch(current.id, { w: Number(e.target.value) }) })),
                h("label", { className: "ed-field" }, "Rows", h("input", { type: "number", min: 1, value: current.h, onChange: (e) => engine.patch(current.id, { h: Number(e.target.value) }) })),
              ),
            h("label", { key: "r", className: "ed-field" }, h("span", null, h("input", { type: "checkbox", checked: current.removed, onChange: (e) => engine.patch(current.id, { removed: e.target.checked || undefined }) }), " Hide this widget")),
            h("label", { key: "m", className: "ed-field" }, "Note for the agent", h("textarea", { key: current.id, defaultValue: current.note, placeholder: "What should change here, and why?", onBlur: (e) => engine.patch(current.id, { note: e.target.value.trim() || undefined }) })),
            h("div", { key: "x", className: "ed-heading" }, "Text changes"),
            current.text.length ? current.text.map((change) => h("div", { key: change.from, className: "ed-change" }, h("s", null, change.from), " → ", change.to)) : h("div", { key: "e", className: "ed-empty" }, "Double-click text on the canvas to edit it."),
          ]
        : h("div", { className: "ed-empty" }, "Select a widget on the canvas. Drag to reorder, pull the corner to resize, double-click text to edit."),
    ),
  );
}

const style = document.createElement("style");
style.textContent = STYLE;
document.head.append(style);
render("#editor", h(Editor), { theme: themes.lime.minimal });
