import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent } from "react";
import { tokenPx, useSize } from "../hooks";
import { useI18n } from "../i18n";
import { Tooltip } from "./parts";
import { clamp, textWidth } from "./scale";

export type HeatmapProps<C> = {
  rows: string[];
  columns: C[];
  values: (number | null)[][];
  format: { value: (value: number) => string; column?: (column: C) => string; cell?: (row: number, column: number) => string };
  labelEvery?: number;
  ramp?: "sequential" | "sequential-main";
  zeroIsEmpty?: boolean;
  title?: string;
};

const STEPS = 7;
const seq = (value: string) => ({ "--seq": value }) as CSSProperties;

export function Heatmap<C>(props: HeatmapProps<C>) {
  const { text } = useI18n();
  const [plot, { width, height }] = useSize<HTMLDivElement>();
  const { values, ramp = "sequential", zeroIsEmpty = false } = props;
  const empty = (v: number) => zeroIsEmpty && v === 0;
  const measured = values.flat().filter((v): v is number => Number.isFinite(v) && !empty(v as number));
  const min = Math.min(...measured);
  const max = Math.max(...measured);
  const rampPaint = (k: number) => `var(--color-${ramp}-${k})`;
  const bin = (v: number) => clamp(Math.floor(((v - min) / (max - min || 1)) * STEPS) + 1, 1, STEPS);
  const fillOf = (v: number) => (empty(v) ? "var(--color-bg-subtle)" : rampPaint(bin(v)));
  return (
    <div className="chart">
      <div className="chart-plot" ref={plot}>
        {width > 0 && height > 0 && props.rows.length > 0 && <HeatmapPlot {...props} fillOf={fillOf} width={width} height={height} node={plot.current} />}
      </div>
      <div className="chart-scale">
        {zeroIsEmpty && (
          <>
            <span className="chart-scale-step" style={seq("var(--color-bg-subtle)")} />
            <span className="chart-scale-gap">{text("none")}</span>
          </>
        )}
        <span>{props.format.value(min)}</span>
        {Array.from({ length: STEPS }, (_, i) => (
          <span key={i} className="chart-scale-step" style={seq(rampPaint(i + 1))} />
        ))}
        <span>{props.format.value(max)}</span>
      </div>
    </div>
  );
}

function HeatmapPlot<C>({ rows, columns, values, format, labelEvery, title, fillOf, width, height, node }: HeatmapProps<C> & { fillOf: (v: number) => string; width: number; height: number; node: HTMLDivElement | null }) {
  const svg = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<[number, number] | null>(null);
  const [last, setLast] = useState<[number, number]>([0, 0]);
  const size = tokenPx(node, "--font-size-label", 12);
  const gap = tokenPx(node, "--chart-gap", 2);
  const column = format.column ?? String;
  const margin = { top: 0, right: 0, bottom: size * 1.8, left: Math.max(...rows.map((r) => textWidth(r, size))) + 8 };
  const cw = (width - margin.left - margin.right) / columns.length;
  const ch = (height - margin.top - margin.bottom) / rows.length;
  const every = labelEvery ?? Math.ceil((size * 3) / cw);
  const cellTitle = format.cell ?? ((r: number, c: number) => `${rows[r]} ${column(columns[c])}`);
  const focus = (next: [number, number]) => {
    setCursor(next);
    setLast(next);
  };
  const onPointerMove = (e: PointerEvent<SVGRectElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    focus([clamp(Math.floor((e.clientY - box.top - margin.top) / ch), 0, rows.length - 1), clamp(Math.floor((e.clientX - box.left - margin.left) / cw), 0, columns.length - 1)]);
  };
  const onKeyDown = (e: KeyboardEvent<SVGRectElement>) => {
    const move = ({ ArrowUp: [-1, 0], ArrowDown: [1, 0], ArrowLeft: [0, -1], ArrowRight: [0, 1] } as Record<string, [number, number]>)[e.key];
    if (!move) return;
    e.preventDefault();
    focus([clamp(last[0] + move[0], 0, rows.length - 1), clamp(last[1] + move[1], 0, columns.length - 1)]);
  };
  const hovered = cursor && Number.isFinite(values[cursor[0]]?.[cursor[1]]) ? cursor : null;
  const tip = hovered && {
    x: margin.left + cw * (hovered[1] + 1),
    y: margin.top + ch * hovered[0],
    title: cellTitle(hovered[0], hovered[1]),
    rows: [{ paint: fillOf(values[hovered[0]][hovered[1]] as number), swatch: "rect" as const, name: "", value: format.value(values[hovered[0]][hovered[1]] as number) }],
  };

  return (
    <>
      <svg ref={svg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? ""}>
        {rows.map((row, r) => (
          <text key={`row-${r}`} x={margin.left - 8} y={margin.top + ch * (r + 0.5)} textAnchor="end" dominantBaseline="middle">
            {row}
          </text>
        ))}
        {columns.map((col, c) =>
          c % every ? null : (
            <text key={`col-${c}`} x={margin.left + cw * (c + 0.5)} y={height - size * 0.4} textAnchor="middle">
              {column(col)}
            </text>
          ),
        )}
        {values.map((row, r) =>
          row.map((v, c) =>
            v === null || !Number.isFinite(v) ? null : (
              <rect
                key={`${r}-${c}`}
                className={`chart-cell${hovered && hovered[0] === r && hovered[1] === c ? " is-hover" : ""}`}
                x={margin.left + cw * c + gap / 2}
                y={margin.top + ch * r + gap / 2}
                width={Math.max(0, cw - gap)}
                height={Math.max(0, ch - gap)}
                style={seq(fillOf(v))}
              />
            ),
          ),
        )}
        <rect
          className="chart-overlay"
          x={margin.left}
          y={margin.top}
          width={cw * columns.length}
          height={ch * rows.length}
          tabIndex={0}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
          onFocus={() => setCursor(last)}
          onKeyDown={onKeyDown}
        />
      </svg>
      <Tooltip state={tip} width={width} />
    </>
  );
}
