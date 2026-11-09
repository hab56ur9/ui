import { color } from "../format";
import { tokenPx, useSize } from "../hooks";
import type { Color, Point } from "../types";
import { paint } from "./parts";
import { linear, pathOf } from "./scale";

export type SparklineProps = { points: Point[]; color?: Color };

export function Sparkline({ points, color: dot = 1 }: SparklineProps) {
  const [host, { width, height }] = useSize<HTMLSpanElement>();
  const ready = width > 0 && height > 0 && points.length > 0;
  const ring = tokenPx(host.current, "--chart-marker-radius", 4) + tokenPx(host.current, "--chart-marker-ring", 2);
  const values = points.map(({ v }) => v);
  const x = ready ? linear([points[0].t, points[points.length - 1].t], [ring, width - ring]) : null;
  const y = ready ? linear([Math.min(...values), Math.max(...values)], [height - ring, ring]) : null;
  const end = points[points.length - 1];
  return (
    <span className="sparkline" ref={host}>
      {x && y && (
        <svg className="chart-sparkline" width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <path className="series-line is-muted" d={pathOf(points, x, y)} />
          <circle className="series-dot" cx={x(end.t)} cy={y(end.v)} style={paint(color(dot))} />
        </svg>
      )}
    </span>
  );
}
