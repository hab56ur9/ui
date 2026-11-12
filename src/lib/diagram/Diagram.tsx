import { Children, Fragment, isValidElement, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { textWidth } from "../charts/scale";
import { ButtonBase } from "../controls";
import { useSize } from "../hooks";
import { useI18n } from "../i18n";
import { Icon, IconGlyph, type IconName } from "../Icon";

export type DiagramFlow = "packets" | "dots" | "pulses" | "both";
export type DiagramMotion = "packet" | "dots" | "pulse" | "dots-pulse" | "still";
export type DiagramProps = { title: string; id?: string; direction?: "right" | "down"; flow?: DiagramFlow; children: ReactNode };
export type DiagramNodeProps = { id: string; label: string; caption?: string; icon?: IconName; children?: ReactNode };
export type DiagramGroupProps = { id: string; label: string; children: ReactNode };
export type DiagramArrowProps = { from: string; to: string; label?: string; step?: number; dashed?: boolean; packet?: IconName; motion?: DiagramMotion };

function DiagramNode(props: DiagramNodeProps) {
  return null;
}

function DiagramGroup(props: DiagramGroupProps) {
  return null;
}

function DiagramArrow(props: DiagramArrowProps) {
  return null;
}

type Declared = DiagramNodeProps & { group?: string };
type Size = { w: number; h: number };
type Point = { x: number; y: number };
type Placed = Declared & Point & Size & { rank: number; order: number };
type Port = { out: number; in: number };

const PAD = 16;
const HEAD = 26;
const MARGIN = PAD + HEAD + 8;
const LABEL = 12;
const GAPS = { right: { main: 120, cross: 28 }, down: { main: 88, cross: 28 } };
const STEP = 1800;
const REST = 900;
const PULSE_SPEED = 180;
const BEAD_SPEED = 82;
const DOT_PERIOD = 18;
const DOT_GAP = 9;

function collect(children: ReactNode, group: string | undefined, out = { nodes: [] as Declared[], arrows: [] as DiagramArrowProps[], groups: [] as { id: string; label: string }[] }) {
  Children.forEach(children, (child) => {
    if (!isValidElement(child)) return;
    if (child.type === Fragment) collect((child.props as { children?: ReactNode }).children, group, out);
    if (child.type === DiagramGroup) {
      const props = child.props as DiagramGroupProps;
      out.groups.push({ id: props.id, label: props.label });
      collect(props.children, props.id, out);
    }
    if (child.type === DiagramNode) out.nodes.push({ ...(child.props as DiagramNodeProps), group });
    if (child.type === DiagramArrow) out.arrows.push(child.props as DiagramArrowProps);
  });
  return out;
}

function ranksOf(nodes: Declared[], arrows: DiagramArrowProps[]) {
  const key = new Map(nodes.map((node) => [node.id, node.group ?? node.id]));
  const incoming = new Map(nodes.map((node) => [node.id, [] as string[]]));
  const upstream = new Map<string, Set<string>>();
  for (const arrow of arrows) {
    incoming.get(arrow.to)?.push(arrow.from);
    const from = key.get(arrow.from);
    const to = key.get(arrow.to);
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

function layout(nodes: Declared[], arrows: DiagramArrowProps[], groups: { id: string }[], sizes: Map<string, Size>, direction: "right" | "down") {
  const across = direction === "right";
  const { rank, incoming } = ranksOf(nodes, arrows);
  const sizeOf = (node: Declared) => sizes.get(node.id) ?? { w: 168, h: 60 };
  const main = (node: Declared) => (across ? sizeOf(node).w : sizeOf(node).h);
  const cross = (node: Declared) => (across ? sizeOf(node).h : sizeOf(node).w);
  const groupIndex = (node: Declared) => groups.findIndex((group) => group.id === node.group);
  const gap = GAPS[direction];
  const columns: Declared[][] = [];
  for (const node of nodes) (columns[rank.get(node.id) ?? 0] ??= []).push(node);
  const row = new Map<string, number>();
  const offset = new Map<string, number>();
  const lengths: number[] = [];
  columns.forEach((column = [], r) => {
    const bary = (node: Declared) => {
      const rows = (incoming.get(node.id) ?? []).map((id) => row.get(id)).filter((value): value is number => value !== undefined);
      return rows.length ? rows.reduce((sum, value) => sum + value, 0) / rows.length : nodes.indexOf(node);
    };
    const block = (node: Declared) => {
      const members = column.filter((other) => node.group !== undefined && other.group === node.group);
      return members.length ? members.reduce((sum, other) => sum + bary(other), 0) / members.length : bary(node);
    };
    const sorted = [...column].sort((a, b) => block(a) - block(b) || groupIndex(a) - groupIndex(b) || bary(a) - bary(b));
    let cursor = 0;
    sorted.forEach((node, i) => {
      const changed = i > 0 && sorted[i - 1].group !== node.group;
      cursor += i === 0 ? 0 : gap.cross + (changed ? PAD * 2 + HEAD : 0);
      offset.set(node.id, cursor);
      row.set(node.id, i);
      cursor += cross(node);
    });
    lengths[r] = cursor;
  });
  const widths = columns.map((column = []) => Math.max(0, ...column.map(main)));
  const starts = widths.map((_, r) => MARGIN + widths.slice(0, r).reduce((sum, value) => sum + value + gap.main, 0));
  const longest = Math.max(0, ...lengths);
  let order = 0;
  const placed: Placed[] = columns.flatMap((column = [], r) =>
    [...column]
      .sort((a, b) => (offset.get(a.id) ?? 0) - (offset.get(b.id) ?? 0))
      .map((node) => {
        const along = starts[r] + (widths[r] - main(node)) / 2;
        const side = MARGIN + (longest - (lengths[r] ?? 0)) / 2 + (offset.get(node.id) ?? 0);
        return { ...node, ...sizeOf(node), rank: r, order: order++, x: across ? along : side, y: across ? side : along };
      }),
  );
  const width = Math.max(0, ...placed.map((node) => node.x + node.w)) + MARGIN;
  const height = Math.max(0, ...placed.map((node) => node.y + node.h)) + MARGIN;
  return { placed, width, height, across };
}

const spread = (count: number, index: number) => (index - (count - 1) / 2) * 12;

function portsOf(placed: Placed[], arrows: DiagramArrowProps[], across: boolean) {
  const byId = new Map(placed.map((node) => [node.id, node]));
  const cross = (id: string) => {
    const node = byId.get(id);
    return node ? (across ? node.y : node.x) : 0;
  };
  const forward = arrows.filter((arrow) => (byId.get(arrow.to)?.rank ?? 0) > (byId.get(arrow.from)?.rank ?? 0));
  const ports = new Map<DiagramArrowProps, Port>(arrows.map((arrow) => [arrow, { out: 0, in: 0 }]));
  for (const node of placed) {
    const outs = forward.filter((arrow) => arrow.from === node.id).sort((a, b) => cross(a.to) - cross(b.to));
    outs.forEach((arrow, i) => Object.assign(ports.get(arrow) ?? {}, { out: spread(outs.length, i) }));
    const ins = forward.filter((arrow) => arrow.to === node.id).sort((a, b) => cross(a.from) - cross(b.from));
    ins.forEach((arrow, i) => Object.assign(ports.get(arrow) ?? {}, { in: spread(ins.length, i) }));
  }
  return ports;
}

const mid = (a: Point, b: Point, c: Point, d: Point) => ({ x: (a.x + 3 * b.x + 3 * c.x + d.x) / 8, y: (a.y + 3 * b.y + 3 * c.y + d.y) / 8 });

function route(from: Placed, to: Placed, across: boolean, port: Port) {
  const center = (node: Placed) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });
  const half = (node: Placed) => ({ main: across ? node.w / 2 : node.h / 2, cross: across ? node.h / 2 : node.w / 2 });
  const a = center(from);
  const b = center(to);
  const along = (p: Point, main: number, cross: number) => (across ? { x: p.x + main, y: p.y + cross } : { x: p.x + cross, y: p.y + main });
  const forward = to.rank > from.rank;
  const sameRank = to.rank === from.rank;
  const below = (across ? b.y - a.y : b.x - a.x) > 0 ? 1 : -1;
  const start = forward ? along(a, half(from).main, port.out) : sameRank ? along(a, 0, below * half(from).cross) : along(a, 0, half(from).cross);
  const end = forward ? along(b, -half(to).main, port.in) : sameRank ? along(b, 0, -below * half(to).cross) : along(b, 0, half(to).cross);
  const reach = forward ? Math.abs(across ? end.x - start.x : end.y - start.y) / 2 : 48;
  const c1 = forward ? along(start, reach, 0) : sameRank ? along(start, 0, below * reach) : along(start, 0, reach);
  const c2 = forward ? along(end, -reach, 0) : sameRank ? along(end, 0, -below * reach) : along(end, 0, reach);
  const at = (t: number) => ({
    x: (1 - t) ** 3 * start.x + 3 * (1 - t) ** 2 * t * c1.x + 3 * (1 - t) * t ** 2 * c2.x + t ** 3 * end.x,
    y: (1 - t) ** 3 * start.y + 3 * (1 - t) ** 2 * t * c1.y + 3 * (1 - t) * t ** 2 * c2.y + t ** 3 * end.y,
  });
  const samples = Array.from({ length: 17 }, (_, i) => at(i / 16));
  const length = samples.slice(1).reduce((sum, point, i) => sum + Math.hypot(point.x - samples[i].x, point.y - samples[i].y), 0);
  return { d: `M${start.x} ${start.y}C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${end.x} ${end.y}`, label: mid(start, c1, c2, end), length };
}

function groupBox(members: Placed[]) {
  const left = Math.min(...members.map((node) => node.x)) - PAD;
  const top = Math.min(...members.map((node) => node.y)) - PAD - HEAD;
  const right = Math.max(...members.map((node) => node.x + node.w)) + PAD;
  const bottom = Math.max(...members.map((node) => node.y + node.h)) + PAD;
  return { x: left, y: top, w: right - left, h: bottom - top };
}

function motionOf(arrow: DiagramArrowProps, flow: DiagramFlow) {
  const explicit = arrow.motion;
  if (explicit === "still") return { packet: false, dots: false, pulse: false, bead: false };
  if (explicit === "dots") return { packet: false, dots: true, pulse: false, bead: false };
  if (explicit === "pulse") return { packet: false, dots: false, pulse: true, bead: false };
  if (explicit === "dots-pulse") return { packet: false, dots: true, pulse: true, bead: true };
  if (explicit === "packet") return { packet: arrow.packet !== undefined, dots: false, pulse: false, bead: false };
  if (flow === "pulses") return { packet: false, dots: false, pulse: true, bead: false };
  return { packet: flow !== "dots" && arrow.packet !== undefined, dots: flow === "dots" || flow === "both", pulse: false, bead: false };
}

const at = (value: number) => `${Math.min(100, Math.max(0, value)).toFixed(2)}%`;

function flowCss(scope: string, name: string, arrows: DiagramArrowProps[], packets: number[], stages: number[]) {
  const cycle = stages.length * STEP + REST;
  const share = (STEP / cycle) * 100;
  const stageOf = (i: number) => stages.indexOf(arrows[i].step ?? Infinity);
  const arrivals = new Map<string, number[]>();
  const blocks = packets.map((i) => {
    const a = stageOf(i) * share;
    const local = (t: number) => at(a + t * share);
    arrivals.set(arrows[i].to, [...(arrivals.get(arrows[i].to) ?? []), a + 0.9 * share]);
    return `@keyframes ${name}-travel-${i} { 0%, ${at(a)} { offset-distance: 0%; animation-timing-function: cubic-bezier(0.45, 0, 0.75, 0.75); } ${local(0.92)}, 100% { offset-distance: 100%; } }
@keyframes ${name}-pop-${i} { 0%, ${at(a)} { scale: 0.35; opacity: 0; animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1); } ${local(0.16)}, ${local(0.8)} { scale: 1; opacity: 1; } ${local(0.88)} { scale: 0.6; opacity: 1; } ${local(0.92)}, 100% { scale: 0.2; opacity: 0; } }
@keyframes ${name}-spark-${i} { 0%, ${at(a)} { scale: 0.4; opacity: 0; } ${at(a + 0.01)} { scale: 0.4; opacity: 1; animation-timing-function: cubic-bezier(0.33, 1, 0.68, 1); } ${local(0.32)}, 100% { scale: 1.6; opacity: 0; } }
@keyframes ${name}-edge-${i} { 0%, ${at(a)} { stroke: var(--color-fg-muted); stroke-width: 1.5; } ${at(a + 2.5)}, ${at(a + share - 1)} { stroke: var(--color-main-default); stroke-width: 2.5; } ${at(a + share + 1.5)}, 100% { stroke: var(--color-fg-muted); stroke-width: 1.5; } }
${scope} [data-packet="${i}"] { animation: ${name}-travel-${i} var(--diagram-cycle) linear infinite; }
${scope} [data-packet="${i}"] > g { animation: ${name}-pop-${i} var(--diagram-cycle) linear infinite; }
${scope} [data-spark="${i}"] > g { animation: ${name}-spark-${i} var(--diagram-cycle) linear infinite; }
${scope} [data-edge="${i}"] { animation: ${name}-edge-${i} var(--diagram-cycle) linear infinite; }`;
  });
  const hits = [...arrivals].map(([node, times], n) => {
    const steps = [...times].sort((a, b) => a - b).map((t) => `${at(t)} { outline-color: transparent; } ${at(t + 0.8)} { outline-color: var(--color-main-default); } ${at(t + 6)} { outline-color: transparent; }`);
    return `@keyframes ${name}-hit-${n} { 0% { outline-color: transparent; } ${steps.join(" ")} 100% { outline-color: transparent; } }
${scope} [data-node="${node}"]::after { animation: ${name}-hit-${n} var(--diagram-cycle) linear infinite; }`;
  });
  return { css: [...blocks, ...hits].join("\n"), cycle };
}

function relayCss(scope: string, name: string, beads: number[], arrows: DiagramArrowProps[], spans: number[]) {
  if (beads.length === 0) return "";
  const arrival = new Map<string, number>();
  const starts = new Map<number, number>();
  const pending = [...beads];
  for (let guard = 0; pending.length > 0 && guard < beads.length * beads.length + 1; guard++) {
    const ready = pending.findIndex((i) => !pending.some((j) => arrows[j].to === arrows[i].from && j !== i));
    const i = pending.splice(ready < 0 ? 0 : ready, 1)[0];
    const from = arrows[i].from;
    const start = arrival.get(from) ?? 0;
    starts.set(i, start);
    const end = start + spans[i];
    arrival.set(arrows[i].to, Math.min(arrival.get(arrows[i].to) ?? end, end));
  }
  const period = Math.max(...beads.map((i) => (starts.get(i) ?? 0) + spans[i])) + DOT_GAP * 4;
  const ms = (period / BEAD_SPEED) * 1000;
  return beads
    .map((i) => {
      const a = ((starts.get(i) ?? 0) / period) * 100;
      const b = (((starts.get(i) ?? 0) + spans[i]) / period) * 100;
      const fade = (DOT_GAP / period) * 100;
      return `@keyframes ${name}-bead-${i} { 0%, ${at(a)} { offset-distance: 0px; opacity: 0; } ${at(a + fade)} { opacity: 1; } ${at(b - fade)} { opacity: 1; } ${at(b)}, 100% { offset-distance: ${spans[i]}px; opacity: 0; } }
${scope} [data-bead="${i}"] { animation: ${name}-bead-${i} ${ms}ms linear infinite; }`;
    })
    .join("\n");
}

const tone = (index: number) => ({ "--diagram-tone": `var(--color-series-${(index % 8) + 1})` }) as CSSProperties;

const sameSizes = (a: Map<string, Size> | null, b: Map<string, Size>) => a !== null && a.size === b.size && [...b].every(([id, size]) => a.get(id)?.w === size.w && a.get(id)?.h === size.h);

function DiagramRoot({ title, id, direction = "right", flow = "packets", children }: DiagramProps) {
  const { text } = useI18n();
  const raw = useId();
  const name = `diagram-${raw.replace(/[^a-zA-Z0-9]/g, "")}`;
  const scope = `[data-diagram="${name}"]`;
  const canvas = useRef<HTMLDivElement>(null);
  const [host, { width: room }] = useSize<HTMLDivElement>();
  const [sizes, setSizes] = useState<Map<string, Size> | null>(null);
  const [playing, setPlaying] = useState(true);
  const { nodes, arrows, groups } = collect(children, undefined);
  const signature = nodes.map((node) => node.id).join("|");

  useLayoutEffect(() => {
    const root = canvas.current;
    if (!root) return;
    const measure = () => {
      const next = new Map([...root.querySelectorAll<HTMLElement>("[data-node]")].map((node) => [node.dataset.node ?? "", { w: node.offsetWidth, h: node.offsetHeight }]));
      setSizes((current) => (sameSizes(current, next) ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    root.querySelectorAll("[data-node]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [signature]);

  const { placed, width, height, across } = layout(nodes, arrows, groups, sizes ?? new Map(), direction);
  const byId = new Map(placed.map((node) => [node.id, node]));
  const ports = portsOf(placed, arrows, across);
  const motions = arrows.map((arrow) => motionOf(arrow, flow));
  const packets = arrows.flatMap((arrow, i) => (motions[i].packet ? [i] : []));
  const stages = [...new Set(packets.map((i) => arrows[i].step ?? Infinity))].sort((a, b) => a - b);
  const animated = packets.length > 0 || motions.some((motion) => motion.dots || motion.pulse);
  const { css, cycle } = flowCss(scope, name, arrows, packets, stages);
  const numbered = arrows.map((arrow, i) => arrow.step !== undefined && arrows.findIndex((other) => other.step === arrow.step) === i);
  const scale = room > 0 ? Math.min(1, room / width) : 1;
  const ready = sizes !== null;
  const groupIndex = (key?: string) => groups.findIndex((group) => group.id === key);
  const arrow = `${name}-arrow`;
  const paths = arrows.map((item) => {
    const from = byId.get(item.from);
    const to = byId.get(item.to);
    return from && to ? route(from, to, across, ports.get(item) ?? { out: 0, in: 0 }) : null;
  });
  const beads = arrows.flatMap((_, i) => (motions[i].bead && paths[i] ? [i] : []));
  const spans = paths.map((path) => (path ? Math.ceil(path.length / DOT_GAP) * DOT_GAP : 0));
  const relay = relayCss(scope, name, beads, arrows, spans);

  return (
    <figure className={`diagram${playing ? "" : " is-paused"}`} data-diagram={name} data-name={id} aria-label={title} style={{ "--diagram-cycle": `${cycle}ms`, maxWidth: width } as CSSProperties}>
      <style>{`${css}\n${relay}`}</style>
      <div ref={host} className="diagram-host" style={{ height: ready ? height * scale : undefined }}>
        <div ref={canvas} className="diagram-canvas" style={{ width, height, transform: `scale(${scale})`, visibility: ready ? undefined : "hidden" }}>
          <svg className="diagram-lines" width={width} height={height} aria-hidden="true">
            <defs>
              <marker id={arrow} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="9" markerHeight="9" markerUnits="userSpaceOnUse" orient="auto-start-reverse">
                <path className="diagram-arrowhead" d="M0 0L10 5L0 10z" />
              </marker>
            </defs>
            {groups.map((group, i) => {
              const members = placed.filter((node) => node.group === group.id);
              if (members.length === 0) return null;
              const box = groupBox(members);
              return (
                <g key={group.id} className="diagram-group" style={{ ...tone(i), "--order": 0 } as CSSProperties}>
                  <rect className="diagram-group-box" x={box.x} y={box.y} width={box.w} height={box.h} />
                  <text className="diagram-group-label" x={box.x + PAD} y={box.y + HEAD - 6}>
                    {group.label}
                  </text>
                </g>
              );
            })}
            {arrows.map((item, i) => {
              const path = paths[i];
              if (!path) return null;
              const labelWidth = item.label ? textWidth(item.label, LABEL) + 16 : 0;
              const stepX = path.label.x - (labelWidth ? labelWidth / 2 + 14 : 0);
              return (
                <g key={i} className="diagram-arrow" style={{ "--order": placed.length } as CSSProperties}>
                  <path
                    className={["diagram-line", item.dashed ? "is-dashed" : "", motions[i].dots ? "is-dots" : ""].filter(Boolean).join(" ")}
                    d={path.d}
                    markerEnd={`url(#${arrow})`}
                    data-edge={i}
                    style={motions[i].bead ? { animationDuration: `${(DOT_PERIOD / BEAD_SPEED) * 1000}ms` } : undefined}
                  />
                  {item.label && (
                    <g className="diagram-label">
                      <rect x={path.label.x - labelWidth / 2} y={path.label.y - 11} width={labelWidth} height={22} />
                      <text x={path.label.x} y={path.label.y + 4} textAnchor="middle">
                        {item.label}
                      </text>
                    </g>
                  )}
                  {numbered[i] && (
                    <g className="diagram-step">
                      <circle cx={stepX} cy={path.label.y} r={11} />
                      <text x={stepX} y={path.label.y + 4} textAnchor="middle">
                        {item.step}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
          {nodes.map((node) => {
            const spot = byId.get(node.id);
            const index = groupIndex(node.group);
            return (
              <div
                key={node.id}
                className="diagram-node"
                data-node={node.id}
                style={{ left: spot?.x ?? 0, top: spot?.y ?? 0, "--order": spot?.order ?? 0, ...(index < 0 ? {} : tone(index)) } as CSSProperties}
              >
                <div className="diagram-node-head">
                  {node.icon && <Icon name={node.icon} />}
                  <div>
                    <div className="diagram-node-label">{node.label}</div>
                    {node.caption && <div className="diagram-node-caption">{node.caption}</div>}
                  </div>
                </div>
                {node.children !== undefined && <div className="diagram-node-body">{node.children}</div>}
              </div>
            );
          })}
          <svg className="diagram-flow" width={width} height={height} aria-hidden="true">
            {arrows.map((_, i) => {
              const path = paths[i];
              if (!path || !motions[i].pulse) return null;
              const bead = motions[i].bead;
              const duration = Math.min(3000, Math.max(900, (path.length / PULSE_SPEED) * 1000));
              const along = { offsetPath: `path("${path.d}")` };
              const timing = bead ? along : { ...along, animationDuration: `${duration}ms`, animationDelay: `${-((i * 0.37) % 1) * duration}ms` };
              return (
                <g key={i} className={`diagram-pulse${bead ? " is-bead" : ""}`} data-bead={bead ? i : undefined} style={timing}>
                  {!bead && <circle className="diagram-pulse-halo" r={9} />}
                  <circle r={bead ? 4.5 : 3.5} />
                </g>
              );
            })}
            {packets.map((i) => {
              const path = paths[i];
              const icon = arrows[i].packet;
              if (!path || !icon) return null;
              const along = { offsetPath: `path("${path.d}")` };
              return (
                <g key={i}>
                  <g className="diagram-spark" data-spark={i} style={along}>
                    <g>
                      <circle r={10} />
                      <path d="M0 -17V-12M0 12V17M-17 0H-12M12 0H17" />
                    </g>
                  </g>
                  <g className="diagram-packet" data-packet={i} style={along}>
                    <g>
                      <circle r={14} />
                      <IconGlyph name={icon} x={-8} y={-8} size={16} />
                    </g>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
      {animated && (
        <ButtonBase className="diagram-play" icon={playing ? "pause" : "play"} aria-label={text(playing ? "pauseFlow" : "playFlow")} title={text(playing ? "pauseFlow" : "playFlow")} onClick={() => setPlaying(!playing)} />
      )}
    </figure>
  );
}

export const Diagram = Object.assign(DiagramRoot, { Node: DiagramNode, Group: DiagramGroup, Arrow: DiagramArrow });
