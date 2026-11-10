import { Children, isValidElement, useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactElement, type ReactNode } from "react";
import { BoardActions } from "./BoardActions";
import { DataTable, type DataTableProps } from "./DataTable";
import { Icon } from "./Icon";
import { reducedMotion, token, tokenPx } from "./hooks";
import { useI18n } from "./i18n";
import { useOptionalUI } from "./overlay/Provider";

export type WidgetSpec = {
  id: string;
  title: string;
  subtitle?: ReactNode;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxH?: number;
  render: () => ReactNode;
  table?: () => DataTableProps;
};

export type LayoutItem = { id: string; w: number; h: number; hidden: boolean };

const defaults = (widgets: WidgetSpec[]): LayoutItem[] => widgets.map(({ id, w, h }) => ({ id, w, h, hidden: false }));

const fits = (saved: unknown, widgets: WidgetSpec[]): saved is LayoutItem[] => Array.isArray(saved) && saved.length === widgets.length && saved.every((item) => widgets.some((w) => w.id === item?.id));

type Events = { initial?: LayoutItem[]; onChange?: (layout: LayoutItem[]) => void; onCommit?: (layout: LayoutItem[]) => void; delay: number };

export function useBoardLayout(widgets: WidgetSpec[], { initial, onChange, onCommit, delay }: Events) {
  const [layout, setState] = useState<LayoutItem[]>(() => (fits(initial, widgets) ? initial : defaults(widgets)));
  const touched = useRef(false);
  const pending = useRef<LayoutItem[] | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const listeners = useRef({ onChange, onCommit });
  listeners.current = { onChange, onCommit };

  const flush = useCallback(() => {
    window.clearTimeout(timer.current);
    const next = pending.current;
    pending.current = null;
    if (next) listeners.current.onCommit?.(next);
  }, []);

  useEffect(() => {
    if (touched.current || !fits(initial, widgets)) return;
    setState(initial);
  }, [initial]);

  useEffect(() => {
    const onHidden = () => document.visibilityState === "hidden" && flush();
    addEventListener("pagehide", flush);
    document.addEventListener("visibilitychange", onHidden);
    return () => {
      removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHidden);
      flush();
    };
  }, [flush]);

  const setLayout = useCallback(
    (next: LayoutItem[]) => {
      touched.current = true;
      setState(next);
      listeners.current.onChange?.(next);
      pending.current = next;
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(flush, delay);
    },
    [delay, flush],
  );
  const toggle = (id: string, hidden: boolean) => {
    const item = layout.find((entry) => entry.id === id);
    if (!item) return;
    setLayout([...layout.filter((entry) => entry.id !== id), { ...item, hidden }]);
  };
  return {
    layout,
    setLayout,
    reset: () => setLayout(defaults(widgets)),
    hide: (id: string) => toggle(id, true),
    show: (id: string) => toggle(id, false),
    hidden: layout.filter((item) => item.hidden).map((item) => widgets.find((w) => w.id === item.id) as WidgetSpec),
  };
}

export type BoardLayout = ReturnType<typeof useBoardLayout>;

type GridProps = {
  widgets: WidgetSpec[];
  layout: LayoutItem[];
  onLayoutChange: (layout: LayoutItem[]) => void;
  onHide?: (widget: WidgetSpec, previous: LayoutItem[]) => void;
  announce?: (message: string) => void;
  busy?: boolean;
};

export type BoardProps = {
  initialLayout?: LayoutItem[];
  onLayoutChange?: (layout: LayoutItem[]) => void;
  onLayoutCommit?: (layout: LayoutItem[]) => void;
  commitDelay?: number;
  toolbar?: ReactNode;
  actions?: boolean;
  busy?: boolean;
  children?: ReactNode;
};

export type WidgetProps = Omit<WidgetSpec, "render"> & { frame?: "card" | "plain"; children: ReactNode };

export function Widget({ title, subtitle, w, h, frame = "card", children }: WidgetProps) {
  return (
    <section className={`widget is-static is-${frame}`} style={{ "--w": w, "--h": h } as CSSProperties}>
      {title && (
        <header className="widget-head">
          <div className="widget-titles">
            <h2 className="widget-title" title={typeof title === "string" ? title : undefined}>
              {title}
            </h2>
            {subtitle && <span className="widget-subtitle">{subtitle}</span>}
          </div>
        </header>
      )}
      <div className="widget-body">{children}</div>
    </section>
  );
}

const specsOf = (children: ReactNode): WidgetSpec[] =>
  Children.toArray(children)
    .filter((child): child is ReactElement<WidgetProps> => isValidElement(child) && child.type === Widget)
    .map(({ props: { children: body, ...spec } }) => ({ ...spec, render: () => body }));

export function Board({ children, initialLayout, onLayoutChange, onLayoutCommit, commitDelay = 1500, toolbar, actions = true, busy }: BoardProps) {
  const { text } = useI18n();
  const specs = specsOf(children);
  const board = useBoardLayout(specs, { initial: initialLayout, onChange: onLayoutChange, onCommit: onLayoutCommit, delay: commitDelay });
  return (
    <>
      {(toolbar !== undefined || actions) && (
        <div className="toolbar" role="toolbar" aria-label={text("boardTools")}>
          {toolbar}
          <span className="toolbar-spacer" />
          {actions && <BoardActions board={board} />}
        </div>
      )}
      <BoardGrid widgets={specs} layout={board.layout} onLayoutChange={board.setLayout} busy={busy} />
    </>
  );
}

const DRAG_THRESHOLD = 4;

function track(event: PointerEvent, move: (e: globalThis.PointerEvent) => void, done: () => void) {
  const pointer = event.pointerId;
  const own = (e: globalThis.PointerEvent) => e.pointerId === pointer;
  const onMove = (e: globalThis.PointerEvent) => own(e) && move(e);
  const onEnd = (e: globalThis.PointerEvent) => {
    if (!own(e)) return;
    removeEventListener("pointermove", onMove);
    removeEventListener("pointerup", onEnd);
    removeEventListener("pointercancel", onEnd);
    done();
  };
  addEventListener("pointermove", onMove);
  addEventListener("pointerup", onEnd);
  addEventListener("pointercancel", onEnd);
}

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

function BoardGrid({ widgets, layout, onLayoutChange, onHide, announce, busy = false }: GridProps) {
  const { text } = useI18n();
  const ui = useOptionalUI();
  const [message, setMessage] = useState("");
  const say = announce ?? setMessage;
  const grid = useRef<HTMLDivElement>(null);
  const before = useRef<Map<string, DOMRect> | null>(null);
  const current = useRef(layout);
  current.current = layout;
  const [dragging, setDragging] = useState<string | null>(null);
  const [resizing, setResizing] = useState<string | null>(null);
  const [tables, setTables] = useState<Set<string>>(new Set());
  const defOf = (id: string) => widgets.find((w) => w.id === id) as WidgetSpec;
  const shown = layout.filter((item) => !item.hidden);

  const nodes = () => [...(grid.current?.querySelectorAll<HTMLElement>(":scope > .widget") ?? [])];
  const measure = () => (before.current = new Map(nodes().map((n) => [n.dataset.id as string, n.getBoundingClientRect()])));

  useLayoutEffect(() => {
    const from = before.current;
    before.current = null;
    if (!from || !grid.current || reducedMotion()) return;
    const duration = tokenPx(grid.current, "--motion-duration-base", 200);
    const easing = token("--motion-easing-standard");
    nodes().forEach((node) => {
      const a = from.get(node.dataset.id as string);
      const b = node.getBoundingClientRect();
      if (!a || (a.left === b.left && a.top === b.top)) return;
      node.animate([{ transform: `translate(${a.left - b.left}px, ${a.top - b.top}px)` }, { transform: "none" }], { duration, easing });
    });
  });

  const commit = (next: LayoutItem[], animate = true) => {
    if (animate) measure();
    current.current = next;
    onLayoutChange(next);
  };

  const moveTo = (id: string, index: number) => {
    const visible = current.current.filter((item) => !item.hidden);
    const item = visible.find((entry) => entry.id === id) as LayoutItem;
    const rest = visible.filter((entry) => entry.id !== id);
    rest.splice(index, 0, item);
    commit([...rest, ...current.current.filter((entry) => entry.hidden)]);
  };

  const positionOf = (id: string) => current.current.filter((item) => !item.hidden).findIndex((item) => item.id === id);

  const startDrag = (node: HTMLElement, id: string, event: PointerEvent) => {
    const rect = node.getBoundingClientRect();
    const offset = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    const ghost = node.cloneNode(true) as HTMLElement;
    ghost.classList.add("widget-ghost");
    Object.assign(ghost.style, { width: `${rect.width}px`, height: `${rect.height}px` });
    const follow = (e: { clientX: number; clientY: number }) => (ghost.style.transform = `translate(${e.clientX - offset.x}px, ${e.clientY - offset.y}px)`);
    follow(event);
    document.body.appendChild(ghost);
    setDragging(id);
    let settledAt = 0;
    const move = (e: globalThis.PointerEvent) => {
      follow(e);
      if (!grid.current || performance.now() - settledAt < tokenPx(grid.current, "--motion-duration-fast", 120)) return;
      const target = document
        .elementsFromPoint(e.clientX, e.clientY)
        .map((n) => n.closest<HTMLElement>(".widget"))
        .find((w) => w && w.dataset.id !== id && w.parentElement === grid.current);
      if (!target) return;
      const box = target.getBoundingClientRect();
      const after = e.clientX > box.left + box.width / 2;
      const from = positionOf(id);
      const over = positionOf(target.dataset.id as string);
      const to = clamp(over + (after ? 1 : 0) - (from < over ? 1 : 0), 0, shown.length - 1);
      if (to === from) return;
      moveTo(id, to);
      settledAt = performance.now();
    };
    const end = () => {
      ghost.remove();
      setDragging(null);
      say(text("moved", { title: defOf(id).title, n: positionOf(id) + 1 }));
    };
    return { move, end };
  };

  const armDrag = (id: string, event: PointerEvent<HTMLElement>) => {
    if (event.button !== 0 || (event.target as Element).closest(".widget-actions")) return;
    event.preventDefault();
    const node = event.currentTarget.closest<HTMLElement>(".widget") as HTMLElement;
    const travelled = (e: globalThis.PointerEvent) => Math.hypot(e.clientX - event.clientX, e.clientY - event.clientY) >= DRAG_THRESHOLD;
    let drag: ReturnType<typeof startDrag> | undefined;
    track(
      event,
      (e) => {
        if (!drag && !travelled(e)) return;
        drag ??= startDrag(node, id, event);
        drag.move(e);
      },
      () => drag?.end(),
    );
  };

  const moveByKey = (id: string, event: KeyboardEvent<HTMLButtonElement>) => {
    const step = ({ ArrowLeft: -1, ArrowUp: -1, ArrowRight: 1, ArrowDown: 1 } as Record<string, number>)[event.key];
    if (!step) return;
    event.preventDefault();
    const index = clamp(positionOf(id) + step, 0, shown.length - 1);
    if (index === positionOf(id)) return;
    moveTo(id, index);
    say(text("moved", { title: defOf(id).title, n: index + 1 }));
  };

  const resizeTo = (id: string, w: number, h: number) => {
    const def = defOf(id);
    const columns = tokenPx(grid.current, "--grid-columns", 12);
    const next = current.current.map((item) => (item.id === id ? { ...item, w: clamp(w, def.minW ?? 2, columns), h: clamp(h, def.minH ?? 2, def.maxH ?? 10) } : item));
    commit(next, false);
    return next.find((item) => item.id === id) as LayoutItem;
  };

  const startResize = (id: string, event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || !grid.current) return;
    event.preventDefault();
    const node = grid.current;
    const gap = tokenPx(node, "--layout-gap", 16);
    const columns = tokenPx(node, "--grid-columns", 12);
    const column = (node.clientWidth - gap * (columns - 1)) / columns + gap;
    const row = tokenPx(node, "--widget-row", 64) + gap;
    const item = current.current.find((entry) => entry.id === id) as LayoutItem;
    const start = { x: event.clientX, y: event.clientY, w: item.w, h: item.h };
    setResizing(id);
    track(
      event,
      (e) => resizeTo(id, start.w + Math.round((e.clientX - start.x) / column), start.h + Math.round((e.clientY - start.y) / row)),
      () => setResizing(null),
    );
  };

  const resizeByKey = (id: string, event: KeyboardEvent<HTMLDivElement>) => {
    const delta = ({ ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] } as Record<string, [number, number]>)[event.key];
    if (!delta) return;
    event.preventDefault();
    const item = current.current.find((entry) => entry.id === id) as LayoutItem;
    const next = resizeTo(id, item.w + delta[0], item.h + delta[1]);
    say(text("resized", { title: defOf(id).title, w: next.w, h: next.h }));
  };

  const hide = (id: string) => {
    const previous = current.current;
    const item = previous.find((entry) => entry.id === id) as LayoutItem;
    commit([...previous.filter((entry) => entry.id !== id), { ...item, hidden: true }]);
    say(text("hidden", { title: defOf(id).title }));
    if (onHide) return onHide(defOf(id), previous);
    ui?.toast({ message: text("hidden", { title: defOf(id).title }), action: { label: text("undo"), onClick: () => onLayoutChange(previous) } });
  };

  const flipTable = (id: string) =>
    setTables((set) => {
      const next = new Set(set);
      if (!next.delete(id)) next.add(id);
      return next;
    });

  const classes = ["board", dragging ? "is-dragging" : "", busy ? "is-refetching" : ""].filter(Boolean).join(" ");
  return (
    <div className="board-frame">
      <div className={classes} ref={grid}>
        {shown.map((item) => {
          const def = defOf(item.id);
          const table = tables.has(item.id) && def.table;
          const state = [item.id === dragging ? "is-placeholder" : "", item.id === resizing ? "is-resizing" : ""].filter(Boolean).join(" ");
          return (
            <section key={item.id} className={`widget ${state}`.trim()} data-id={item.id} aria-label={def.title} style={{ "--w": item.w, "--h": item.h } as CSSProperties}>
              <header className="widget-head" onPointerDown={(e) => armDrag(item.id, e)}>
                <button type="button" className="widget-handle" aria-label={text("move", { title: def.title })} title={text("move", { title: def.title })} onKeyDown={(e) => moveByKey(item.id, e)}>
                  <Icon name="grip" size="sm" />
                </button>
                <div className="widget-titles">
                  <h2 className="widget-title">{def.title}</h2>
                  <span className="widget-subtitle">{def.subtitle}</span>
                </div>
                <div className="widget-actions">
                  {def.table && (
                    <button type="button" className="widget-action" aria-label={text("tableView")} title={text("tableView")} aria-pressed={Boolean(table)} onClick={() => flipTable(item.id)}>
                      {text("table")}
                    </button>
                  )}
                  <button type="button" className="widget-action" aria-label={text("hide", { title: def.title })} title={text("hide", { title: def.title })} onClick={() => hide(item.id)}>
                    <Icon name="close" size="sm" />
                  </button>
                </div>
              </header>
              <div className="widget-body">{table ? <DataTable {...table()} /> : def.render()}</div>
              <div className="widget-resize" tabIndex={0} role="button" aria-label={text("resize", { title: def.title })} onPointerDown={(e) => startResize(item.id, e)} onKeyDown={(e) => resizeByKey(item.id, e)} />
              <span className="widget-size">{`${item.w} × ${item.h}`}</span>
            </section>
          );
        })}
      </div>
      {!announce && (
        <p className="sr-only" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
