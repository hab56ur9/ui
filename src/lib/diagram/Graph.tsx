import { useEffect, useId, useLayoutEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
import { fit, textWidth } from "../charts/scale";
import { ButtonBase } from "../controls";
import { reducedMotion } from "../hooks";
import { useI18n } from "../i18n";
import { IconGlyph, type IconName } from "../Icon";
import { intensity, motion, stagger } from "../motion";

export type GraphNode = { id: string; label: string; caption?: string; icon?: IconName; group?: string };
export type GraphEdge = { from: string; to: string; label?: string; step?: number; dashed?: boolean; packet?: IconName };
export type GraphGroup = { id: string; label: string };
export type GraphFlow = "packets" | "dots" | "both";
export type GraphProps = { nodes: GraphNode[]; edges: GraphEdge[]; groups?: GraphGroup[]; direction?: "right" | "down"; flow?: GraphFlow; title?: string };

type Point = { x: number; y: number };
type Placed = GraphNode & Point & { rank: number; order: number; w: number };

const NODE = { w: 168, max: 280, h: 60 };
const ICON = 24;
const PAD = 16;
const HEAD = 26;
const MARGIN = PAD + HEAD + 8;
const LABEL = 12;
const GAPS = { right: { main: 120, cross: 28 }, down: { main: 88, cross: 28 } };

function ranksOf(nodes: GraphNode[], edges: GraphEdge[]) {
  const key = new Map(nodes.map((node) => [node.id, node.group ?? node.id]));
  const incoming = new Map(nodes.map((node) => [node.id, [] as string[]]));
  const upstream = new Map<string, Set<string>>();
  for (const edge of edges) {
    incoming.get(edge.to)?.push(edge.from);
    const from = key.get(edge.from);
    const to = key.get(edge.to);
    if (from === undefined || to === undefined || from === to) continue;
    upstream.set(to, new Set(upstream.get(to)).add(from));
  }
  const level = new Map<string, number>();
  const visiting = new Set<string>();
  const visit = (k: string): number => {
    const known = level.get(k);
    if (known !== undefined) return known;
    if (visiting.has(k)) return -1;
    visiting.add(k);
    const value = Math.max(-1, ...[...(upstream.get(k) ?? [])].map(visit)) + 1;
    visiting.delete(k);
    level.set(k, value);
    return value;
  };
  const rank = new Map(nodes.map((node) => [node.id, visit(key.get(node.id) ?? node.id)]));
  return { rank, incoming };
}

function layout({ nodes, edges, groups = [], direction = "right" }: GraphProps) {
  const across = direction === "right";
  const { rank, incoming } = ranksOf(nodes, edges);
  const groupIndex = (node: GraphNode) => groups.findIndex((group) => group.id === node.group);
  const w = Math.min(NODE.max, Math.max(NODE.w, ...nodes.map((node) => (node.icon ? 16 + ICON + 12 : 16) + Math.max(textWidth(node.label, 14), textWidth(node.caption ?? "", 12)) + 16)));
  const size = { main: across ? w : NODE.h, cross: across ? NODE.h : w };
  const gap = GAPS[direction];
  const columns: GraphNode[][] = [];
  for (const node of nodes) (columns[rank.get(node.id) ?? 0] ??= []).push(node);
  const row = new Map<string, number>();
  const lengths: number[] = [];
  const crossOf = new Map<string, number>();
  columns.forEach((column = [], r) => {
    const bary = (node: GraphNode) => {
      const rows = (incoming.get(node.id) ?? []).map((id) => row.get(id)).filter((value): value is number => value !== undefined);
      return rows.length ? rows.reduce((sum, value) => sum + value, 0) / rows.length : nodes.indexOf(node);
    };
    const block = (node: GraphNode) => {
      const members = column.filter((other) => node.group !== undefined && other.group === node.group);
      return members.length ? members.reduce((sum, other) => sum + bary(other), 0) / members.length : bary(node);
    };
    const sorted = [...column].sort((a, b) => block(a) - block(b) || groupIndex(a) - groupIndex(b) || bary(a) - bary(b));
    let cursor = 0;
    sorted.forEach((node, i) => {
      const changed = i > 0 && sorted[i - 1].group !== node.group;
      cursor += i === 0 ? 0 : gap.cross + (changed ? PAD * 2 + HEAD : 0);
      crossOf.set(node.id, cursor);
      row.set(node.id, i);
      cursor += size.cross;
    });
    lengths[r] = cursor;
  });
  const longest = Math.max(0, ...lengths);
  let order = 0;
  const placed: Placed[] = columns.flatMap((column = [], r) =>
    [...column]
      .sort((a, b) => (crossOf.get(a.id) ?? 0) - (crossOf.get(b.id) ?? 0))
      .map((node) => {
        const main = MARGIN + r * (size.main + gap.main);
        const cross = MARGIN + (longest - (lengths[r] ?? 0)) / 2 + (crossOf.get(node.id) ?? 0);
        return { ...node, rank: r, order: order++, w, x: across ? main : cross, y: across ? cross : main };
      }),
  );
  const width = Math.max(...placed.map((node) => node.x + node.w)) + MARGIN;
  const height = Math.max(...placed.map((node) => node.y + NODE.h)) + MARGIN;
  return { placed, width, height, across };
}

type Port = { out: number; in: number };

const spread = (count: number, index: number) => (index - (count - 1) / 2) * 12;

function portsOf(placed: Placed[], edges: GraphEdge[], across: boolean) {
  const byId = new Map(placed.map((node) => [node.id, node]));
  const cross = (id: string) => {
    const node = byId.get(id);
    return node ? (across ? node.y : node.x) : 0;
  };
  const forward = edges.filter((edge) => (byId.get(edge.to)?.rank ?? 0) > (byId.get(edge.from)?.rank ?? 0));
  const ports = new Map<GraphEdge, Port>(edges.map((edge) => [edge, { out: 0, in: 0 }]));
  for (const node of placed) {
    const outs = forward.filter((edge) => edge.from === node.id).sort((a, b) => cross(a.to) - cross(b.to));
    outs.forEach((edge, i) => Object.assign(ports.get(edge) ?? {}, { out: spread(outs.length, i) }));
    const ins = forward.filter((edge) => edge.to === node.id).sort((a, b) => cross(a.from) - cross(b.from));
    ins.forEach((edge, i) => Object.assign(ports.get(edge) ?? {}, { in: spread(ins.length, i) }));
  }
  return ports;
}

const mid = (a: Point, b: Point, c: Point, d: Point) => ({ x: (a.x + 3 * b.x + 3 * c.x + d.x) / 8, y: (a.y + 3 * b.y + 3 * c.y + d.y) / 8 });

function route(from: Placed, to: Placed, across: boolean, port: Port) {
  const center = (node: Placed) => ({ x: node.x + node.w / 2, y: node.y + NODE.h / 2 });
  const a = center(from);
  const b = center(to);
  const half = { main: across ? from.w / 2 : NODE.h / 2, cross: across ? NODE.h / 2 : from.w / 2 };
  const along = (p: Point, main: number, cross: number) => (across ? { x: p.x + main, y: p.y + cross } : { x: p.x + cross, y: p.y + main });
  const forward = to.rank > from.rank;
  const sameRank = to.rank === from.rank;
  const below = (across ? b.y - a.y : b.x - a.x) > 0 ? 1 : -1;
  const start = forward ? along(a, half.main, port.out) : sameRank ? along(a, 0, below * half.cross) : along(a, 0, half.cross);
  const end = forward ? along(b, -half.main, port.in) : sameRank ? along(b, 0, -below * half.cross) : along(b, 0, half.cross);
  const reach = forward ? Math.abs(across ? end.x - start.x : end.y - start.y) / 2 : 48;
  const c1 = forward ? along(start, reach, 0) : sameRank ? along(start, 0, below * reach) : along(start, 0, reach);
  const c2 = forward ? along(end, -reach, 0) : sameRank ? along(end, 0, -below * reach) : along(end, 0, reach);
  return { d: `M${start.x} ${start.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`, label: mid(start, c1, c2, end) };
}

function groupBox(members: Placed[]) {
  const left = Math.min(...members.map((node) => node.x)) - PAD;
  const top = Math.min(...members.map((node) => node.y)) - PAD - HEAD;
  const right = Math.max(...members.map((node) => node.x + node.w)) + PAD;
  const bottom = Math.max(...members.map((node) => node.y + NODE.h)) + PAD;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

const TRAVEL = 1800;
const REST = 900;

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));
const easeIn = (t: number) => (1 - Math.cos(Math.PI * 0.75 * t)) / (1 - Math.cos(Math.PI * 0.75));
const easeOut = (t: number) => 1 - (1 - t) ** 3;
const within = (t: number, from: number, to: number) => clamp01((t - from) / (to - from));

function stagesOf(edges: GraphEdge[], flow: GraphFlow) {
  if (flow === "dots") return [];
  const steps = [...new Set(edges.filter((edge) => edge.packet).map((edge) => edge.step ?? Infinity))].sort((a, b) => a - b);
  return steps.map((step) => edges.flatMap((edge, i) => (edge.packet && (edge.step ?? Infinity) === step ? [i] : [])));
}

function packetFrame(t: number) {
  const grow = easeOut(within(t, 0, 0.16));
  const sink = within(t, 0.8, 0.92);
  return {
    along: easeIn(within(t, 0, 0.92)),
    scale: (0.35 + 0.65 * grow) * (1 - 0.8 * sink),
    opacity: grow * (1 - within(t, 0.88, 0.92)),
    spark: within(t, 0, 0.32),
    hit: t > 0.9,
  };
}

function useFlow(svg: RefObject<SVGSVGElement | null>, edges: GraphEdge[], stages: number[][], playing: boolean) {
  const elapsed = useRef(0);
  useEffect(() => {
    const root = svg.current;
    if (!root || stages.length === 0) return;
    const find = <T extends Element>(selector: string) => root.querySelector<T>(selector);
    const cycle = stages.length * TRAVEL + REST;
    const draw = (time: number) => {
      const at = time % cycle;
      const current = Math.floor(at / TRAVEL);
      const t = (at % TRAVEL) / TRAVEL;
      const frame = packetFrame(t);
      stages.forEach((stage, s) =>
        stage.forEach((i) => {
          const line = find<SVGPathElement>(`[data-edge="${i}"]`);
          const dot = find<SVGGElement>(`[data-packet="${i}"]`);
          const spark = find<SVGGElement>(`[data-spark="${i}"]`);
          const target = find<SVGGElement>(`[data-node="${edges[i].to}"]`);
          if (!line || !dot || !spark) return;
          const active = s === current;
          line.classList.toggle("is-active", active);
          target?.classList.toggle("is-hit", active && frame.hit);
          dot.style.opacity = active ? String(frame.opacity) : "0";
          spark.style.opacity = active ? String(1 - frame.spark) : "0";
          if (!active) return;
          const length = line.getTotalLength();
          const point = line.getPointAtLength(frame.along * length);
          const origin = line.getPointAtLength(0);
          dot.setAttribute("transform", `translate(${point.x} ${point.y}) scale(${frame.scale})`);
          spark.setAttribute("transform", `translate(${origin.x} ${origin.y}) scale(${0.4 + 1.2 * easeOut(frame.spark)})`);
        }),
      );
    };
    draw(elapsed.current);
    if (!playing) return;
    const start = performance.now() - elapsed.current;
    let frame = requestAnimationFrame(function tick(now) {
      elapsed.current = now - start;
      draw(elapsed.current);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [svg, edges, stages, playing]);
}

const tone = (index: number) => ({ "--graph-tone": `var(--color-series-${(index % 8) + 1})` }) as CSSProperties;

export function Graph(props: GraphProps) {
  const { nodes, edges, groups = [], flow = "packets", title } = props;
  const id = useId();
  const svg = useRef<SVGSVGElement>(null);
  const { placed, width, height, across } = layout(props);
  const byId = new Map(placed.map((node) => [node.id, node]));
  const ports = portsOf(placed, edges, across);
  const groupIndex = (key?: string) => groups.findIndex((group) => group.id === key);
  const { text } = useI18n();
  const [stages] = useState(() => stagesOf(edges, flow));
  const numbered = edges.map((edge, i) => edge.step !== undefined && edges.findIndex((other) => other.step === edge.step) === i);
  const dots = flow !== "packets";
  const [playing, setPlaying] = useState(() => !reducedMotion());
  useFlow(svg, edges, stages, playing);

  useLayoutEffect(() => {
    const amount = intensity();
    if (!svg.current || amount === 0) return;
    const shift = 12 * amount;
    svg.current.querySelectorAll<SVGGElement>("[data-enter]").forEach((node) => {
      const step = Number(node.dataset.enter);
      const offset = across ? `translateX(${-shift}px)` : `translateY(${-shift}px)`;
      motion(node, [{ opacity: 0, transform: offset }, { opacity: 1, transform: "none" }], "enter", { delay: stagger(step), fill: "both" });
    });
  }, []);

  const arrow = `${id}-arrow`;
  return (
    <div className="graph-frame" style={{ maxWidth: width }}>
      <svg ref={svg} className={["graph", dots ? "is-dots" : "", playing ? "" : "is-paused"].filter(Boolean).join(" ")} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        {title && <title>{title}</title>}
        <defs>
          <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
            <path className="graph-arrow" d="M0 0L10 5L0 10z" />
          </marker>
        </defs>
        {groups.map((group, i) => {
          const members = placed.filter((node) => node.group === group.id);
          if (members.length === 0) return null;
          const box = groupBox(members);
          return (
            <g key={group.id} className="graph-group" style={tone(i)} data-enter={0}>
              <rect className="graph-group-box" x={box.x} y={box.y} width={box.w} height={box.h} />
              <text className="graph-group-label" x={box.x + PAD} y={box.y + HEAD - 6}>
                {group.label}
              </text>
            </g>
          );
        })}
        {edges.map((edge, i) => {
          const from = byId.get(edge.from);
          const to = byId.get(edge.to);
          if (!from || !to) return null;
          const path = route(from, to, across, ports.get(edge) ?? { out: 0, in: 0 });
          const labelWidth = edge.label ? textWidth(edge.label, LABEL) + 16 : 0;
          const stepX = path.label.x - (labelWidth ? labelWidth / 2 + 14 : 0);
          return (
            <g key={i} data-enter={placed.length}>
              <path className={`graph-edge${edge.dashed ? " is-dashed" : ""}`} d={path.d} markerEnd={`url(#${arrow})`} data-edge={i} />
              {edge.label && (
                <g className="graph-edge-label">
                  <rect x={path.label.x - labelWidth / 2} y={path.label.y - 11} width={labelWidth} height={22} />
                  <text x={path.label.x} y={path.label.y + 4} textAnchor="middle">
                    {edge.label}
                  </text>
                </g>
              )}
              {numbered[i] && (
                <g className="graph-step">
                  <circle cx={stepX} cy={path.label.y} r={11} />
                  <text x={stepX} y={path.label.y + 4} textAnchor="middle">
                    {edge.step}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        {placed.map((node) => {
          const index = groupIndex(node.group);
          const textX = node.icon ? 16 + ICON + 12 : 16;
          const room = node.w - textX - 12;
          return (
            <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
              <g className="graph-node" style={index < 0 ? undefined : tone(index)} data-enter={node.order} data-node={node.id}>
                <rect width={node.w} height={NODE.h} />
                {node.icon && (
                  <g className="graph-node-icon">
                    <IconGlyph name={node.icon} x={16} y={(NODE.h - ICON) / 2} size={ICON} />
                  </g>
                )}
                <text className="graph-node-label" x={textX} y={node.caption ? NODE.h / 2 - 3 : NODE.h / 2 + 5}>
                  {fit(node.label, room, 14)}
                </text>
                {node.caption && (
                  <text className="graph-node-caption" x={textX} y={NODE.h / 2 + 15}>
                    {fit(node.caption, room, 12)}
                  </text>
                )}
              </g>
            </g>
          );
        })}
        {edges.map(
          (edge, i) =>
            flow !== "dots" && edge.packet && (
              <g key={i}>
                <g className="graph-spark" data-spark={i} opacity={0}>
                  <circle r={10} />
                  <path d="M0 -17V-12M0 12V17M-17 0H-12M12 0H17" />
                </g>
                <g className="graph-packet" data-packet={i} opacity={0}>
                  <circle r={14} />
                  <IconGlyph name={edge.packet} x={-8} y={-8} size={16} />
                </g>
              </g>
            ),
        )}
      </svg>
      {(stages.length > 0 || dots) && (
        <ButtonBase className="graph-play" icon={playing ? "pause" : "play"} aria-label={text(playing ? "pauseFlow" : "playFlow")} title={text(playing ? "pauseFlow" : "playFlow")} onClick={() => setPlaying(!playing)} />
      )}
    </div>
  );
}
