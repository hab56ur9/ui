import { useRef } from "react";
import { color, formats } from "../format";
import { tokenPx, useSize } from "../hooks";
import { useI18n } from "../i18n";
import { Icon } from "../Icon";
import type { Color, Format, Point } from "../types";
import { Legend, Tooltip, XAxis, YGrid, paint, useScrub, type LegendItem } from "./parts";
import { categoryTicks, finite, linear, niceTicks, pathOf, textWidth, timeTicks } from "./scale";

export type LineSeries = { name: string; points: Point[]; color?: Color; dashed?: boolean; area?: boolean; flagBreaches?: boolean };

export type LineChartProps = {
  series: LineSeries[];
  format?: Format;
  band?: { name: string; lower: Point[]; upper: Point[]; color?: Color };
  threshold?: { value: number; label: string; breach: string; direction?: "above" | "below" };
  baseline?: number;
  annotations?: { t: number; label: string }[];
  endLabels?: boolean;
  title?: string;
  categories?: string[];
};

export function LineChart(props: LineChartProps) {
  const [plot, { width, height }] = useSize<HTMLDivElement>();
  const drawn = props.series
    .filter((s) => s.points.length > 0)
    .map((s, i) => ({ ...s, paint: color(s.color ?? i + 1), swatch: s.dashed ? ("dashed" as const) : ("line" as const) }));
  const items: LegendItem[] = [...drawn, ...(props.band ? [{ name: props.band.name, paint: color(props.band.color ?? 1), swatch: "band" as const }] : [])];
  return (
    <div className="chart">
      {items.length > 1 && <Legend items={items} />}
      <div className="chart-plot" ref={plot}>
        {width > 0 && height > 0 && drawn.length > 0 && <LinePlot {...props} drawn={drawn} width={width} height={height} node={plot.current} />}
      </div>
    </div>
  );
}

type Drawn = LineSeries & { paint: string; swatch: "line" | "dashed" };

function LinePlot({ drawn, band, threshold, baseline, annotations = [], endLabels = true, format, title, categories, width, height, node }: LineChartProps & { drawn: Drawn[]; width: number; height: number; node: HTMLDivElement | null }) {
  const svg = useRef<SVGSVGElement>(null);
  const { locale } = useI18n();
  const f = formats(format, locale);
  const size = tokenPx(node, "--font-size-label", 12);
  const icon = tokenPx(node, "--icon-size-sm", 16);
  const points = drawn.flatMap((s) => s.points);
  const times = [...new Set(points.map(({ t }) => t))].sort((a, b) => a - b);
  const values = finite([...points.map(({ v }) => v), ...(band ? [...band.lower, ...band.upper].map(({ v }) => v) : []), threshold?.value, baseline]);
  const yTicks = niceTicks(Math.min(...values), Math.max(...values), Math.max(2, Math.floor(height / (size * 4.5))));
  const last = (s: Drawn) => s.points[s.points.length - 1];
  const endText = (s: Drawn) => `${s.name} ${f.value(last(s).v)}`;
  const top = size * (annotations.length ? 2 : 1);
  const bottom = size * 2.2;
  const y = linear([yTicks[0], yTicks[yTicks.length - 1]], [height - bottom, top]);
  const ends = drawn.map((s) => ({ s, y: y(last(s).v) })).sort((a, b) => a.y - b.y);
  const collides = ends.some((end, i) => i > 0 && end.y - ends[i - 1].y < size * 1.3);
  const margin = {
    top,
    right: endLabels && !collides ? Math.max(...drawn.map((s) => textWidth(endText(s), size))) + 16 : size,
    bottom,
    left: Math.max(...yTicks.map((t) => textWidth(f.axis(t), size))) + 12,
  };
  const t0 = times[0];
  const t1 = times[times.length - 1];
  const x = linear([t0, t1], [margin.left, width - margin.right]);
  const count = Math.floor((x(t1) - x(t0)) / (size * 6));
  const axis = categories ? categoryTicks(categories, x(t0 + 1) - x(t0), size) : timeTicks(t0, t1, count, locale);
  const breaching = (v: number) => threshold !== undefined && (threshold.direction === "below" ? v < threshold.value : v > threshold.value);
  const lookup = drawn.map((s) => new Map(s.points.map(({ t, v }) => [t, v])));
  const positions = times.map(x);
  const { index, handlers } = useScrub(svg, positions);

  let labelEdge = -Infinity;
  const marks = annotations
    .filter(({ t }) => t >= t0 && t <= t1)
    .sort((a, b) => a.t - b.t)
    .map((mark) => {
      const shown = x(mark.t) >= labelEdge;
      if (shown) labelEdge = x(mark.t) + 4 + textWidth(mark.label, size) + size;
      return { ...mark, shown };
    });

  const active = index === null ? null : times[index];
  const present = active === null ? [] : drawn.map((s, k) => ({ s, v: lookup[k].get(active) })).filter((p): p is { s: Drawn; v: number } => Number.isFinite(p.v));
  const tip =
    active === null
      ? null
      : {
          x: positions[index ?? 0],
          y: margin.top,
          title: categories?.[active] ?? f.date(active),
          rows: present.map(({ s, v }) => ({ paint: s.paint, swatch: s.swatch, name: s.name, value: f.value(v) })),
          notes: threshold ? present.filter(({ s, v }) => s.flagBreaches && breaching(v)).map(() => threshold.breach) : [],
        };
  const floor = y(yTicks[0]);

  return (
    <>
      <svg ref={svg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? ""}>
        <YGrid ticks={yTicks} y={y} left={margin.left} right={width - margin.right} format={f.axis} />
        <XAxis ticks={axis.ticks} x={x} from={t0} to={t1} bottom={height - margin.bottom} size={size} format={axis.format} />
        {Number.isFinite(baseline) && <line className="chart-baseline" x1={margin.left} x2={width - margin.right} y1={y(baseline as number)} y2={y(baseline as number)} />}
        {marks.map((mark) => (
          <g className="chart-annotation" key={mark.t}>
            <line x1={x(mark.t)} x2={x(mark.t)} y1={margin.top - size * 0.4} y2={height - margin.bottom} />
            {mark.shown && (
              <text x={x(mark.t) + 4} y={margin.top - size * 0.6}>
                {mark.label}
              </text>
            )}
          </g>
        ))}
        {band && <path className="series-area" d={`${pathOf(band.upper, x, y)}L${pathOf([...band.lower].reverse(), x, y).slice(1)}Z`} style={paint(color(band.color ?? 1))} />}
        {drawn
          .filter((s) => s.area)
          .map((s) => (
            <path key={`area-${s.name}`} className="series-area" d={`${pathOf(s.points, x, y)}L${x(last(s).t)},${floor}L${x(s.points[0].t)},${floor}Z`} style={paint(s.paint)} />
          ))}
        {threshold && (
          <g className="chart-threshold">
            <line x1={margin.left} x2={width - margin.right} y1={y(threshold.value)} y2={y(threshold.value)} />
            <text x={width - margin.right - icon - 4} y={y(threshold.value) - 6} textAnchor="end">
              {threshold.label}
            </text>
            <svg className="chart-threshold-icon" x={width - margin.right - icon} y={y(threshold.value) - icon - 4} width={icon} height={icon}>
              <Icon name="warning" size="sm" />
            </svg>
          </g>
        )}
        {drawn.map((s) => (
          <path key={`line-${s.name}`} className={`series-line${s.dashed ? " is-dashed" : ""}`} d={pathOf(s.points, x, y)} style={paint(s.paint)} />
        ))}
        {drawn
          .filter((s) => s.flagBreaches)
          .flatMap((s) => s.points.filter(({ v }) => breaching(v)).map(({ t, v }) => <circle key={`breach-${s.name}-${t}`} className="series-dot is-critical" cx={x(t)} cy={y(v)} />))}
        {endLabels &&
          !collides &&
          ends.map(({ s, y: ey }) => (
            <g key={`end-${s.name}`}>
              <circle className="series-dot" cx={x(last(s).t)} cy={ey} style={paint(s.paint)} />
              <text className="chart-end-label" x={x(last(s).t) + 10} y={ey} dominantBaseline="middle">
                <tspan>{`${s.name} `}</tspan>
                <tspan className="is-value">{f.value(last(s).v)}</tspan>
              </text>
            </g>
          ))}
        {active !== null && (
          <>
            <line className="chart-crosshair" x1={positions[index ?? 0]} x2={positions[index ?? 0]} y1={margin.top} y2={height - margin.bottom} />
            {present.map(({ s, v }) => (
              <circle key={`hover-${s.name}`} className="series-dot" cx={positions[index ?? 0]} cy={y(v)} style={paint(s.paint)} />
            ))}
          </>
        )}
        <rect className="chart-overlay" x={margin.left} y={0} width={Math.max(0, width - margin.left - margin.right)} height={height} {...handlers} />
      </svg>
      <Tooltip state={tip} width={width} />
    </>
  );
}
