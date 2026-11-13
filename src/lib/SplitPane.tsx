import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { clamp } from "./charts/scale";
import { useI18n } from "./i18n";

export type ResizeHandleProps = {
  orientation?: "vertical" | "horizontal";
  label?: string;
  onMove: (dx: number, dy: number) => void;
  onEnd?: () => void;
};

const steps: Record<string, [number, number]> = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] };

export function ResizeHandle({ orientation = "vertical", label, onMove, onEnd }: ResizeHandleProps) {
  const { text } = useI18n();
  const [dragging, setDragging] = useState(false);
  const start = (event: PointerEvent<HTMLDivElement>) => {
    event.preventDefault();
    const origin = { x: event.clientX, y: event.clientY };
    setDragging(true);
    const move = (e: globalThis.PointerEvent) => onMove(e.clientX - origin.x, e.clientY - origin.y);
    const up = () => {
      setDragging(false);
      removeEventListener("pointermove", move);
      removeEventListener("pointerup", up);
      onEnd?.();
    };
    addEventListener("pointermove", move);
    addEventListener("pointerup", up);
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = steps[event.key];
    const along = orientation === "vertical" ? step?.[0] : step?.[1];
    if (!along) return;
    event.preventDefault();
    const size = event.shiftKey ? 64 : 16;
    onMove(orientation === "vertical" ? along * size : 0, orientation === "horizontal" ? along * size : 0);
    onEnd?.();
  };
  return (
    <div
      className={dragging ? "resize-handle is-dragging" : "resize-handle"}
      role="separator"
      tabIndex={0}
      aria-orientation={orientation}
      aria-label={label ?? text("split.resize")}
      onPointerDown={start}
      onKeyDown={keys}
    />
  );
}

export type SplitPaneProps = {
  direction?: "row" | "column";
  sizes?: number[];
  min?: number;
  onResize?: (sizes: number[]) => void;
  children?: ReactNode;
};

export function SplitPane({ direction = "row", sizes, min = 120, onResize, children }: SplitPaneProps) {
  const panes = [children].flat().filter(Boolean);
  const [ratios, setRatios] = useState(sizes ?? panes.map(() => 1 / panes.length));
  const box = useRef<HTMLDivElement>(null);
  const base = useRef(ratios);
  const current = useRef(ratios);
  current.current = ratios;
  const row = direction === "row";
  const template = ratios.map((ratio) => `minmax(0, ${ratio}fr)`).join(" 5px ");
  const handle = (i: number) => {
    const move = (dx: number, dy: number) => {
      const rect = box.current?.getBoundingClientRect();
      const total = (row ? rect?.width : rect?.height) || 1;
      const pair = base.current[i - 1] + base.current[i];
      const floor = Math.min(min / total, pair / 2);
      const left = clamp(base.current[i - 1] + (row ? dx : dy) / total, floor, pair - floor);
      current.current = base.current.map((r, j) => (j === i - 1 ? left : j === i ? pair - left : r));
      setRatios(current.current);
    };
    const end = () => {
      base.current = current.current;
      onResize?.(current.current);
    };
    return <ResizeHandle key={`h${i}`} orientation={row ? "vertical" : "horizontal"} onMove={move} onEnd={end} />;
  };
  return (
    <div ref={box} className={row ? "split-view is-row" : "split-view is-column"} style={row ? { gridTemplateColumns: template } : { gridTemplateRows: template }}>
      {panes.flatMap((pane, i) => [
        i > 0 && handle(i),
        <div key={i} className="split-view-cell">
          {pane}
        </div>,
      ])}
    </div>
  );
}
