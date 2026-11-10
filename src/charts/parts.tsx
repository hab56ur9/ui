import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type RefObject } from "react";
import { Icon } from "../Icon";
import type { Swatch } from "../types";
import { clamp, type Scale } from "./scale";

const paint = (value: string) => ({ "--c": value }) as CSSProperties;

export function Key({ swatch, color }: { swatch: Swatch; color: string }) {
  return <span className={`key key-${swatch}`} style={paint(color)} />;
}

export type LegendItem = { name: string; paint: string; swatch: Swatch };

export function Legend({ items }: { items: LegendItem[] }) {
  return (
    <ul className="chart-legend">
      {items.map((item) => (
        <li key={item.name}>
          <Key swatch={item.swatch} color={item.paint} />
          <span>{item.name}</span>
        </li>
      ))}
    </ul>
  );
}

export type TooltipRow = { paint: string; swatch: Swatch; name: string; value: string };
export type TooltipState = { x: number; y: number; title: string; rows: TooltipRow[]; notes?: string[] } | null;

export function Tooltip({ state, width }: { state: TooltipState; width: number }) {
  if (!state) return null;
  const flip = state.x > width / 2;
  const style: CSSProperties = flip ? { left: state.x - 16, top: Math.max(0, state.y), transform: "translateX(-100%)" } : { left: state.x + 16, top: Math.max(0, state.y) };
  return (
    <div className="chart-tooltip" style={style}>
      <div className="chart-tooltip-title">{state.title}</div>
      {state.rows.map((row) => (
        <div className="chart-tooltip-row" key={row.name || row.value}>
          <Key swatch={row.swatch} color={row.paint} />
          <strong>{row.value}</strong>
          <span>{row.name}</span>
        </div>
      ))}
      {state.notes?.map((note) => (
        <div className="chart-tooltip-note" key={note}>
          <span className="status-icon status-critical">
            <Icon name="warning" size="sm" />
          </span>
          <span>{note}</span>
        </div>
      ))}
    </div>
  );
}

export function useScrub(svg: RefObject<SVGSVGElement | null>, positions: number[]) {
  const [index, setIndex] = useState<number | null>(null);
  const go = (i: number) => setIndex(clamp(i, 0, positions.length - 1));
  const nearest = (x: number) => positions.reduce((best, p, i) => (Math.abs(p - x) < Math.abs(positions[best] - x) ? i : best), 0);
  const handlers = {
    tabIndex: 0,
    onPointerMove: (e: PointerEvent<SVGRectElement>) => go(nearest(e.clientX - (svg.current?.getBoundingClientRect().left ?? 0))),
    onPointerLeave: () => setIndex(null),
    onBlur: () => setIndex(null),
    onFocus: () => go(index ?? positions.length - 1),
    onKeyDown: (e: KeyboardEvent<SVGRectElement>) => {
      const step = ({ ArrowLeft: -1, ArrowRight: 1 } as Record<string, number>)[e.key];
      if (!step) return;
      e.preventDefault();
      go((index ?? positions.length - 1) + step);
    },
  };
  return { index, handlers };
}

export function YGrid({ ticks, y, left, right, format }: { ticks: number[]; y: Scale; left: number; right: number; format: (v: number) => string }) {
  return (
    <g className="chart-grid">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={left} x2={right} y1={y(tick)} y2={y(tick)} />
          <text x={left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle">
            {format(tick)}
          </text>
        </g>
      ))}
    </g>
  );
}

export function XAxis({ ticks, x, from, to, bottom, size, format }: { ticks: number[]; x: Scale; from: number; to: number; bottom: number; size: number; format: (t: number) => string }) {
  return (
    <g className="chart-axis">
      <line x1={x(from)} x2={x(to)} y1={bottom} y2={bottom} />
      {ticks.map((tick) => {
        const label = format(tick);
        const half = label.length * size * 0.3;
        const anchor = x(tick) - half < x(from) ? "start" : x(tick) + half > x(to) ? "end" : "middle";
        return (
          <text key={tick} x={x(tick)} y={bottom + size * 1.4} textAnchor={anchor}>
            {label}
          </text>
        );
      })}
    </g>
  );
}

export { paint };
