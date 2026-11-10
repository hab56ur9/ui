import { useRef } from "react";
import { color, formats } from "../format";
import { tokenPx, useSize } from "../hooks";
import { useI18n } from "../i18n";
import type { Color, Format, Point } from "../types";
import { Tooltip, XAxis, YGrid, paint, useScrub } from "./parts";
import { linear, niceTicks, textWidth, categoryTicks, timeTicks } from "./scale";

export type BarChartProps = {
  points: Point[];
  name?: string;
  color?: Color;
  colorOf?: (point: Point, index: number) => Color;
  format?: Format;
  title?: string;
  categories?: string[];
};

export function BarChart(props: BarChartProps) {
  const [plot, { width, height }] = useSize<HTMLDivElement>();
  return (
    <div className="chart">
      <div className="chart-plot" ref={plot}>
        {width > 0 && height > 0 && props.points.length > 0 && <BarPlot {...props} width={width} height={height} node={plot.current} />}
      </div>
    </div>
  );
}

function BarPlot({ points, name = "", format, title, width, height, node, ...props }: BarChartProps & { width: number; height: number; node: HTMLDivElement | null }) {
  const svg = useRef<SVGSVGElement>(null);
  const { locale } = useI18n();
  const f = formats(format, locale);
  const paintOf = (point: Point, i: number) => color(props.colorOf?.(point, i) ?? props.color ?? 1);
  const size = tokenPx(node, "--font-size-label", 12);
  const yTicks = niceTicks(0, Math.max(...points.map(({ v }) => v)), Math.max(2, Math.floor(height / (size * 4.5))));
  const margin = { top: size, right: size, bottom: size * 2.2, left: Math.max(...yTicks.map((t) => textWidth(f.axis(t), size))) + 12 };
  const band = (width - margin.left - margin.right) / points.length;
  const x = (i: number) => margin.left + band * (i + 0.5);
  const y = linear([0, yTicks[yTicks.length - 1]], [height - margin.bottom, margin.top]);
  const barWidth = Math.max(1, Math.min(tokenPx(node, "--chart-bar-max", 24), band * 0.7));
  const radius = Math.min(tokenPx(node, "--chart-bar-radius", 4), barWidth / 2);
  const first = points[0].t;
  const final = points[points.length - 1].t;
  const time = linear([first, final], [x(0), x(points.length - 1)]);
  const count = Math.floor((time(final) - time(first)) / (size * 6));
  const axis = props.categories ? categoryTicks(props.categories, count) : timeTicks(first, final, count, locale);
  const { index, handlers } = useScrub(
    svg,
    points.map((_, i) => x(i)),
  );
  const floor = y(0);
  const bar = (v: number, i: number) => {
    const top = y(v);
    const r = Math.min(radius, floor - top);
    const left = x(i) - barWidth / 2;
    const right = left + barWidth;
    return `M${left},${floor}V${top + r}A${r},${r} 0 0 1 ${left + r},${top}H${right - r}A${r},${r} 0 0 1 ${right},${top + r}V${floor}Z`;
  };
  const tip =
    index === null
      ? null
      : {
          x: x(index),
          y: y(points[index].v) - size * 3,
          title: props.categories?.[index] ?? f.date(points[index].t),
          rows: [{ paint: paintOf(points[index], index), swatch: "rect" as const, name, value: f.value(points[index].v) }],
        };

  return (
    <>
      <svg ref={svg} width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title ?? ""}>
        <YGrid ticks={yTicks} y={y} left={margin.left} right={width - margin.right} format={f.axis} />
        <XAxis ticks={axis.ticks} x={time} from={first} to={final} bottom={height - margin.bottom} size={size} format={axis.format} />
        {points.map((point, i) => (
          <path key={point.t} className={`chart-bar${index === i ? " is-hover" : ""}`} d={bar(point.v, i)} style={paint(paintOf(point, i))} />
        ))}
        <rect className="chart-overlay" x={margin.left} y={0} width={Math.max(0, width - margin.left - margin.right)} height={height} {...handlers} />
      </svg>
      <Tooltip state={tip} width={width} />
    </>
  );
}
