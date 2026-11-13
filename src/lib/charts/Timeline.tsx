import {
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type PointerEvent,
} from "react";
import { clock, clockTicks, color, duration } from "../format";
import { tokenPx, useSize } from "../hooks";
import { useI18n } from "../i18n";
import { Tooltip, XAxis } from "./parts";
import { clamp, fit, linear, textWidth } from "./scale";

export type TimelineSegment = {
  start: number;
  end?: number;
  tone?: number;
  label?: string;
};
export type TimelineLane = { label: string; segments: TimelineSegment[] };
export type TimelineProps = {
  lanes: TimelineLane[];
  from?: number;
  to?: number;
  now?: number;
  title?: string;
};

type Spot = [number, number];

const paint = (value: string) => ({ "--c": value }) as CSSProperties;

export function Timeline(props: TimelineProps) {
  const [plot, { width, height }] = useSize<HTMLDivElement>();
  return (
    <div className="chart">
      <div className="chart-plot" ref={plot}>
        {width > 0 && height > 0 && props.lanes.length > 0 && (
          <TimelinePlot
            {...props}
            width={width}
            height={height}
            node={plot.current}
          />
        )}
      </div>
    </div>
  );
}

function TimelinePlot({
  lanes,
  from,
  to,
  now = Date.now(),
  title,
  width,
  height,
  node,
}: TimelineProps & {
  width: number;
  height: number;
  node: HTMLDivElement | null;
}) {
  const { text: t } = useI18n();
  const svg = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState<Spot | null>(null);
  const [last, setLast] = useState<Spot | null>(null);
  const size = tokenPx(node, "--font-size-label", 12);
  const units = { h: t("time.h"), m: t("time.m"), s: t("time.s") };
  const endOf = (segment: TimelineSegment) => segment.end ?? now;
  const all = lanes.flatMap((lane) => lane.segments);
  const t0 = from ?? Math.min(...all.map((segment) => segment.start));
  const t1 = to ?? Math.max(...all.map(endOf));
  const margin = {
    top: 0,
    right: 8,
    bottom: size * 1.8,
    left: Math.max(...lanes.map((lane) => textWidth(lane.label, size))) + 12,
  };
  const x = linear([t0, t1], [margin.left, width - margin.right]);
  const ch = (height - margin.top - margin.bottom) / lanes.length;
  const bar = Math.min(ch * 0.64, size * 2.2);
  const ticks = clockTicks(
    t0,
    t1,
    Math.max(2, Math.floor((width - margin.left - margin.right) / (size * 7))),
  );
  const open =
    all.some((segment) => segment.end === undefined) && now >= t0 && now <= t1;
  const segmentAt = (spot: Spot | null) =>
    spot ? lanes[spot[0]]?.segments[spot[1]] : undefined;

  const focus = (next: Spot | null) => {
    setCursor(next);
    if (next) setLast(next);
  };

  const onPointerMove = (event: PointerEvent<SVGRectElement>) => {
    const box = svg.current?.getBoundingClientRect();
    if (!box) return;
    const lane = clamp(
      Math.floor((event.clientY - box.top - margin.top) / ch),
      0,
      lanes.length - 1,
    );
    const time = x.invert(event.clientX - box.left);
    const index = lanes[lane].segments.findIndex(
      (segment) => segment.start <= time && time <= endOf(segment),
    );
    focus(index < 0 ? null : [lane, index]);
  };

  const nearest = (lane: number, time: number) =>
    lanes[lane].segments.reduce(
      (best, segment, index, list) =>
        Math.abs(segment.start - time) < Math.abs(list[best].start - time)
          ? index
          : best,
      0,
    );

  const onKeyDown = (event: KeyboardEvent<SVGRectElement>) => {
    const here = last ?? [0, 0];
    const time = segmentAt(here)?.start ?? t0;
    const filled = (lane: number) => lanes[lane].segments.length > 0;
    const vertical = (step: number) => {
      let lane = here[0] + step;
      while (lane >= 0 && lane < lanes.length && !filled(lane)) lane += step;
      return lane >= 0 && lane < lanes.length
        ? ([lane, nearest(lane, time)] as Spot)
        : here;
    };
    const count = lanes[here[0]].segments.length;
    const moves: Record<string, () => Spot> = {
      ArrowRight: () => [here[0], clamp(here[1] + 1, 0, count - 1)],
      ArrowLeft: () => [here[0], clamp(here[1] - 1, 0, count - 1)],
      ArrowDown: () => vertical(1),
      ArrowUp: () => vertical(-1),
      Home: () => [here[0], 0],
      End: () => [here[0], count - 1],
    };
    const move = moves[event.key];
    if (!move) return;
    event.preventDefault();
    focus(move());
  };

  const firstSpot = (): Spot | null => {
    const lane = lanes.findIndex((item) => item.segments.length > 0);
    return lane < 0 ? null : [lane, 0];
  };

  const hovered = segmentAt(cursor) ? cursor : null;
  const active = segmentAt(hovered);
  const tip =
    hovered && active
      ? {
          x: x(Math.min(endOf(active), t1)),
          y: margin.top + ch * (hovered[0] + 0.5) + bar / 2 + 4,
          title: active.label
            ? `${lanes[hovered[0]].label} · ${active.label}`
            : lanes[hovered[0]].label,
          rows: [
            {
              paint: color(active.tone ?? 1),
              swatch: "rect" as const,
              name: `${clock(active.start)} – ${active.end === undefined ? t("timeline.running") : clock(active.end)}`,
              value: duration(endOf(active) - active.start, units),
            },
          ],
        }
      : null;

  return (
    <>
      <svg
        ref={svg}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title ?? ""}
      >
        <g className="chart-grid">
          {ticks.map((tick) => (
            <line
              key={tick}
              x1={x(tick)}
              x2={x(tick)}
              y1={margin.top}
              y2={height - margin.bottom}
            />
          ))}
        </g>
        <XAxis
          ticks={ticks}
          x={x}
          from={t0}
          to={t1}
          bottom={height - margin.bottom}
          size={size}
          format={clock}
        />
        {lanes.map((lane, l) => (
          <g key={`${lane.label}-${l}`}>
            <text
              x={margin.left - 12}
              y={margin.top + ch * (l + 0.5)}
              textAnchor="end"
              dominantBaseline="middle"
            >
              {lane.label}
            </text>
            {lane.segments.map((segment, s) => {
              const left = x(clamp(segment.start, t0, t1));
              const span = Math.max(2, x(clamp(endOf(segment), t0, t1)) - left);
              const room = span - size;
              const top = margin.top + ch * (l + 0.5) - bar / 2;
              const classes = [
                "timeline-span",
                segment.end === undefined && "is-open",
                hovered?.[0] === l && hovered[1] === s && "is-hover",
              ]
                .filter(Boolean)
                .join(" ");
              return (
                <g key={s}>
                  <rect
                    className={classes}
                    x={left}
                    y={top}
                    width={span}
                    height={bar}
                    style={paint(color(segment.tone ?? 1))}
                  />
                  {segment.label && room > size * 2 && (
                    <text
                      className="timeline-label"
                      x={left + size / 2}
                      y={top + bar / 2}
                      dominantBaseline="middle"
                    >
                      {fit(segment.label, room, size)}
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        ))}
        {open && (
          <line
            className="timeline-now"
            x1={x(now)}
            x2={x(now)}
            y1={margin.top}
            y2={height - margin.bottom}
          />
        )}
        <rect
          className="chart-overlay"
          x={margin.left}
          y={margin.top}
          width={Math.max(0, width - margin.left - margin.right)}
          height={ch * lanes.length}
          tabIndex={0}
          onPointerMove={onPointerMove}
          onPointerLeave={() => setCursor(null)}
          onBlur={() => setCursor(null)}
          onFocus={() => focus(last ?? firstSpot())}
          onKeyDown={onKeyDown}
        />
      </svg>
      <Tooltip state={tip} width={width} />
    </>
  );
}
