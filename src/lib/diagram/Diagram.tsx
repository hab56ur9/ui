import { Children, Fragment, isValidElement, useId, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { textWidth } from "../charts/scale";
import { ButtonBase } from "../controls";
import { useSize } from "../hooks";
import { useI18n } from "../i18n";
import { Icon, IconGlyph, type IconName } from "../Icon";
import { MotionScope } from "../MotionScope";

export type DiagramFlow = "packets" | "dots" | "pulses" | "both";
export type DiagramMotion = "packet" | "dots" | "pulse" | "dots-pulse" | "still";
export type DiagramProps = { title: string; id?: string; direction?: "right" | "down"; flow?: DiagramFlow; motion?: boolean; children: ReactNode };
export type DiagramNodeProps = { id: string; label: string; caption?: string; icon?: IconName; lane?: string; col?: number; row?: number; children?: ReactNode };
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
type Port = { out: number; in: number; bow: number; direct: boolean };

const PAD = 16;
const HEAD = 26;
const MARGIN = PAD + HEAD + 8;
const LABEL = 12;
const GAPS = { right: { main: 104, cross: 60 }, down: { main: 88, cross: 48 } };
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

function backArrows(nodes: Declared[], arrows: DiagramArrowProps[]) {
  const order = arrows.map((arrow, i) => ({ arrow, i })).sort((a, b) => (a.arrow.step ?? Infinity) - (b.arrow.step ?? Infinity) || a.i - b.i);
  const state = new Map<string, "open" | "done">();
  const back = new Set<DiagramArrowProps>();
  const visit = (id: string) => {
    state.set(id, "open");
    for (const { arrow } of order) {
      if (arrow.from !== id) continue;
      const seen = state.get(arrow.to);
      if (seen === "open") back.add(arrow);
      if (seen === undefined) visit(arrow.to);
    }
    state.set(id, "done");
  };
  const sources = nodes.filter((node) => !arrows.some((arrow) => arrow.to === node.id));
  for (const node of [...sources, ...nodes]) if (!state.has(node.id)) visit(node.id);
  return back;
}

function ranksOf(nodes: Declared[], arrows: DiagramArrowProps[]) {
  const key = new Map(nodes.map((node) => [node.id, node.group ?? node.id]));
  const incoming = new Map(nodes.map((node) => [node.id, [] as string[]]));
  const upstream = new Map<string, Set<string>>();
  const back = backArrows(nodes, arrows);
  for (const arrow of arrows) {
    if (back.has(arrow)) continue;
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
  return { rank, incoming, back };
}

function layout(nodes: Declared[], arrows: DiagramArrowProps[], groups: { id: string }[], sizes: Map<string, Size>, direction: "right" | "down", spread: number) {
  const across = direction === "right";
  const { rank: auto, back } = ranksOf(nodes, arrows);
  const pinned = (node: Declared) => node.col ?? nodes.find((other) => other.group !== undefined && other.group === node.group && other.col !== undefined)?.col;
  const target = new Map(nodes.map((node) => [node.id, pinned(node) ?? auto.get(node.id) ?? 0]));
  const used = [...new Set(target.values())].sort((a, b) => a - b);
  const rank = new Map([...target].map(([id, value]) => [id, used.indexOf(value)]));
  const sizeOf = (node: Declared) => sizes.get(node.id) ?? { w: 168, h: 60 };
  const main = (node: Declared) => (across ? sizeOf(node).w : sizeOf(node).h);
  const cross = (node: Declared) => (across ? sizeOf(node).h : sizeOf(node).w);
  const gap = { main: GAPS[direction].main + spread * 24, cross: GAPS[direction].cross + spread * 16 };
  const forward = arrows
    .map((arrow, index) => ({ arrow, index }))
    .filter(({ arrow }) => !back.has(arrow))
    .sort((a, b) => (a.arrow.step ?? Infinity) - (b.arrow.step ?? Infinity) || a.index - b.index)
    .map(({ arrow }) => arrow);
  const lanes = [...new Set(nodes.flatMap((node) => (node.lane ? [node.lane] : [])))];
  const columns: Declared[][] = [];
  for (const node of nodes) (columns[rank.get(node.id) ?? 0] ??= []).push(node);
  const row = new Map<string, number>();
  const lane = new Map<string, number>();
  const parent = (node: Declared) => forward.find((arrow) => arrow.to === node.id && row.has(arrow.from))?.from;
  columns.forEach((column = []) => {
    const taken = new Set<number>();
    const blocks = column.reduce<Declared[][]>((list, node) => {
      const same = node.group !== undefined ? list.find((block) => block[0].group === node.group) : undefined;
      if (same) same.push(node);
      if (!same) list.push([node]);
      return list;
    }, []);
    const pinnedRow = (node: Declared) => node.row !== undefined;
    for (const block of blocks.filter((members) => members.every(pinnedRow))) block.sort((a, b) => (a.row ?? 0) - (b.row ?? 0));
    const want = (node: Declared) => {
      if (node.row !== undefined) return node.row;
      const from = parent(node);
      const band = node.lane ? lanes.indexOf(node.lane) : from !== undefined ? (lane.get(from) ?? 0) : 0;
      lane.set(node.id, band);
      const inherited = from !== undefined && lane.get(from) === band ? (row.get(from) ?? 0) % 1000 : 0;
      return band * 1000 + inherited;
    };
    const wanted = blocks.map((block) => ({ block, start: Math.round(block.map((node, i) => want(node) - i).sort((a, b) => a - b)[Math.floor(block.length / 2)]) }));
    wanted.sort((a, b) => Number(b.block.some((node) => node.row !== undefined)) - Number(a.block.some((node) => node.row !== undefined)) || a.start - b.start);
    for (const { block, start } of wanted) {
      const fits = (first: number) => block.every((_, i) => !taken.has(first + i));
      const steps = Array.from({ length: 64 }, (_, k) => (k % 2 === 0 ? k / 2 : -(k + 1) / 2));
      const fixed = block.some((node) => node.row !== undefined);
      const first = start + (fixed && fits(start) ? 0 : (steps.find((step) => fits(start + step)) ?? 0));
      block.forEach((node, i) => {
        row.set(node.id, first + i);
        taken.add(first + i);
      });
    }
  });
  const keys = [...new Set(row.values())].sort((a, b) => a - b);
  const index = new Map(keys.map((key, i) => [key, i]));
  const rowOf = (node: Declared) => index.get(row.get(node.id) ?? 0) ?? 0;
  const widths = columns.map((column = []) => Math.max(0, ...column.map(main)));
  const heights = keys.map((_, k) => Math.max(0, ...nodes.filter((node) => rowOf(node) === k).map(cross)));
  const at = (r: number | undefined, k: number) => nodes.find((node) => rank.get(node.id) === r && rowOf(node) === k);
  const edge = (upper: Declared | undefined, lower: Declared | undefined) => {
    const closing = upper?.group !== undefined && upper.group !== lower?.group;
    const opening = lower?.group !== undefined && lower.group !== upper?.group;
    return (upper && closing ? PAD : 0) + (upper && opening ? PAD + HEAD : 0);
  };
  const rowGap = (k: number) => gap.cross + Math.max(0, ...columns.map((_, r) => edge(at(r, k), at(r, k + 1))));
  const labelRoom = (r: number) =>
    Math.max(
      gap.main,
      ...arrows
        .filter((arrow) => !back.has(arrow) && (rank.get(arrow.from) ?? 0) <= r && (rank.get(arrow.to) ?? 0) > r)
        .map((arrow) => (arrow.label ? textWidth(arrow.label, LABEL) + 16 : 0) + (arrow.step !== undefined ? 28 : 0) + 48),
    ) + arrows.filter((arrow) => back.has(arrow) && rank.get(arrow.to) === r).length * 48;
  const starts = widths.map((_, r) => MARGIN + widths.slice(0, r).reduce((sum, value, k) => sum + value + labelRoom(k), 0));
  const tops = heights.map((_, k) => MARGIN + heights.slice(0, k).reduce((sum, value, j) => sum + value + rowGap(j), 0));
  let order = 0;
  const placed: Placed[] = columns.flatMap((column = [], r) =>
    [...column]
      .sort((a, b) => rowOf(a) - rowOf(b))
      .map((node) => {
        const k = rowOf(node);
        const along = starts[r] + (widths[r] - main(node)) / 2;
        const side = tops[k] + (heights[k] - cross(node)) / 2;
        return { ...node, ...sizeOf(node), rank: r, order: order++, x: across ? along : side, y: across ? side : along };
      }),
  );
  const width = Math.max(0, ...placed.map((node) => node.x + node.w)) + MARGIN;
  const height = Math.max(0, ...placed.map((node) => node.y + node.h)) + MARGIN;
  return { placed, width, height, across, back };
}

const spread = (count: number, index: number) => (index - (count - 1) / 2) * 16;

function portsOf(placed: Placed[], arrows: DiagramArrowProps[], across: boolean) {
  const byId = new Map(placed.map((node) => [node.id, node]));
  const cross = (id: string) => {
    const node = byId.get(id);
    return node ? (across ? node.y : node.x) : 0;
  };
  const rankOf = (id: string) => byId.get(id)?.rank ?? 0;
  const forward = arrows.filter((arrow) => rankOf(arrow.to) > rankOf(arrow.from));
  const direct = arrows.filter((arrow) => rankOf(arrow.to) === rankOf(arrow.from) - 1);
  const ports = new Map<DiagramArrowProps, Port>(arrows.map((arrow) => [arrow, { out: 0, in: 0, bow: 0, direct: direct.includes(arrow) }]));
  const pairs = new Map<string, DiagramArrowProps[]>();
  const pairKey = (arrow: DiagramArrowProps) => [arrow.from, arrow.to].sort().join("|");
  for (const arrow of [...forward, ...direct]) pairs.set(pairKey(arrow), [...(pairs.get(pairKey(arrow)) ?? []), arrow]);
  for (const group of pairs.values()) group.forEach((arrow, i) => Object.assign(ports.get(arrow) ?? {}, { bow: (i - (group.length - 1) / 2) * 60 }));
  const assign = (items: { arrow: DiagramArrowProps; other: string; end: "out" | "in"; back: boolean }[]) => {
    items.sort((a, b) => cross(a.other) - cross(b.other) || Number(a.back) - Number(b.back));
    items.forEach((item, i) => Object.assign(ports.get(item.arrow) ?? {}, { [item.end]: spread(items.length, i) }));
  };
  for (const node of placed) {
    assign([
      ...forward.filter((arrow) => arrow.from === node.id).map((arrow) => ({ arrow, other: arrow.to, end: "out" as const, back: false })),
      ...direct.filter((arrow) => arrow.to === node.id).map((arrow) => ({ arrow, other: arrow.from, end: "in" as const, back: true })),
    ]);
    assign([
      ...forward.filter((arrow) => arrow.to === node.id).map((arrow) => ({ arrow, other: arrow.from, end: "in" as const, back: false })),
      ...direct.filter((arrow) => arrow.from === node.id).map((arrow) => ({ arrow, other: arrow.to, end: "out" as const, back: true })),
    ]);
  }
  return ports;
}


type Curve = { d: string; label: Point; length: number; point: (t: number) => Point };

const cubic = (a: Point, b: Point, c: Point, d: Point) => (t: number) => ({
  x: (1 - t) ** 3 * a.x + 3 * (1 - t) ** 2 * t * b.x + 3 * (1 - t) * t ** 2 * c.x + t ** 3 * d.x,
  y: (1 - t) ** 3 * a.y + 3 * (1 - t) ** 2 * t * b.y + 3 * (1 - t) * t ** 2 * c.y + t ** 3 * d.y,
});
const quad = (a: Point, b: Point, c: Point) => (t: number) => ({ x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * b.x + t ** 2 * c.x, y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * b.y + t ** 2 * c.y });
const line = (a: Point, b: Point) => (t: number) => ({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });

function trace(d: string, ...parts: ((t: number) => Point)[]): Curve {
  const samples = parts.flatMap((part, i) => Array.from({ length: 17 }, (_, k) => part(k / 16)).slice(i === 0 ? 0 : 1));
  const lengths = samples.reduce<number[]>((sums, point, i) => [...sums, i === 0 ? 0 : sums[i - 1] + Math.hypot(point.x - samples[i - 1].x, point.y - samples[i - 1].y)], []);
  const length = lengths[lengths.length - 1] ?? 0;
  const point = (t: number) => {
    const target = t * length;
    const j = Math.max(1, lengths.findIndex((sum) => sum >= target));
    const span = lengths[j] - lengths[j - 1] || 1;
    return line(samples[j - 1], samples[j])((target - lengths[j - 1]) / span);
  };
  return { d, label: point(0.5), length, point };
}

function route(from: Placed, to: Placed, across: boolean, port: Port, lane: number, placed: Placed[]): Curve {
  const center = (node: Placed) => ({ x: node.x + node.w / 2, y: node.y + node.h / 2 });
  const half = (node: Placed) => ({ main: across ? node.w / 2 : node.h / 2, cross: across ? node.h / 2 : node.w / 2 });
  const a = center(from);
  const b = center(to);
  const along = (p: Point, main: number, cross: number) => (across ? { x: p.x + main, y: p.y + cross } : { x: p.x + cross, y: p.y + main });
  const forward = to.rank > from.rank;
  const sameRank = to.rank === from.rank;
  const path = (points: Point[], command: string) => points.map((point) => `${point.x} ${point.y}`).join(command);
  if (port.direct) {
    const start = along(a, -half(from).main, port.out);
    const end = along(b, half(to).main, port.in);
    const reach = Math.abs(across ? end.x - start.x : end.y - start.y) / 2;
    const c1 = along(start, -reach, port.bow);
    const c2 = along(end, reach, port.bow);
    return trace(`M${path([start], "")}C${path([c1, c2, end], " ")}`, cubic(start, c1, c2, end));
  }
  if (forward) {
    const start = along(a, half(from).main, port.out);
    const end = along(b, -half(to).main, port.in);
    const reach = Math.abs(across ? end.x - start.x : end.y - start.y) / 2;
    const c1 = along(start, reach, port.bow);
    const c2 = along(end, -reach, port.bow);
    return trace(`M${path([start], "")}C${path([c1, c2, end], " ")}`, cubic(start, c1, c2, end));
  }
  if (sameRank) {
    const below = (across ? b.y - a.y : b.x - a.x) > 0 ? 1 : -1;
    const start = along(a, 0, below * half(from).cross);
    const end = along(b, 0, -below * half(to).cross);
    const c1 = along(start, 0, below * 40);
    const c2 = along(end, 0, -below * 40);
    return trace(`M${path([start], "")}C${path([c1, c2, end], " ")}`, cubic(start, c1, c2, end));
  }
  const mainOf = (p: Point) => (across ? p.x : p.y);
  const crossOf = (p: Point) => (across ? p.y : p.x);
  const at = (main: number, cross: number) => (across ? { x: main, y: cross } : { x: cross, y: main });
  const crossStart = (node: Placed) => (across ? node.y : node.x);
  const crossEnd = (node: Placed) => (across ? node.y + node.h : node.x + node.w);
  const span = placed.filter((node) => node.rank >= to.rank && node.rank <= from.rank);
  const gap = 24 + lane * 16;
  const belowLine = Math.max(...span.map(crossEnd)) + gap;
  const aboveLine = Math.min(...span.map(crossStart)) - gap;
  const blocked = (node: Placed, below: boolean) => placed.some((other) => other !== node && other.rank === node.rank && (below ? crossStart(other) >= crossEnd(node) : crossEnd(other) <= crossStart(node)));
  const useBelow = belowLine - Math.max(crossEnd(from), crossEnd(to)) <= Math.min(crossStart(from), crossStart(to)) - aboveLine;
  const side = useBelow ? 1 : -1;
  const rail = useBelow ? belowLine : aboveLine;
  const toward = Math.sign(mainOf(b) - mainOf(a)) || -1;
  const outof = blocked(from, useBelow);
  const into = blocked(to, useBelow);
  const start = outof ? along(a, toward * half(from).main, 0) : along(a, 0, side * half(from).cross);
  const end = into ? along(b, -toward * half(to).main, 0) : along(b, 0, side * half(to).cross);
  const leave = outof ? mainOf(start) + toward * 24 : mainOf(start);
  const arrive = into ? mainOf(end) - toward * 24 : mainOf(end);
  const points = [start, ...(outof ? [at(leave, crossOf(start))] : []), at(leave, rail), at(arrive, rail), ...(into ? [at(arrive, crossOf(end))] : []), end];
  return rounded(points, 16);
}

function rounded(points: Point[], radius: number): Curve {
  const toward = (a: Point, b: Point, r: number) => {
    const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: a.x + ((b.x - a.x) / length) * r, y: a.y + ((b.y - a.y) / length) * r };
  };
  const parts: ((t: number) => Point)[] = [];
  let d = `M${points[0].x} ${points[0].y}`;
  let cursor = points[0];
  for (let i = 1; i < points.length - 1; i++) {
    const corner = points[i];
    const r = Math.min(radius, Math.hypot(corner.x - cursor.x, corner.y - cursor.y) / 2, Math.hypot(points[i + 1].x - corner.x, points[i + 1].y - corner.y) / 2);
    const enter = toward(corner, cursor, r);
    const exit = toward(corner, points[i + 1], r);
    parts.push(line(cursor, enter), quad(enter, corner, exit));
    d += `L${enter.x} ${enter.y}Q${corner.x} ${corner.y} ${exit.x} ${exit.y}`;
    cursor = exit;
  }
  const last = points[points.length - 1];
  parts.push(line(cursor, last));
  d += `L${last.x} ${last.y}`;
  return trace(d, ...parts);
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

type Box = { x: number; y: number; w: number; h: number };

const overlaps = (a: Box, b: Box) => a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;

function placeLabels(arrows: DiagramArrowProps[], paths: (Curve | null)[], numbered: boolean[], placed: Placed[]) {
  const taken: Box[] = placed.map((node) => ({ x: node.x - 4, y: node.y - 4, w: node.w + 8, h: node.h + 8 }));
  const traces = paths.map((path) => (path ? Array.from({ length: Math.ceil(path.length / 6) + 1 }, (_, k) => path.point(Math.min(1, (k * 6) / (path.length || 1)))) : []));
  let conflicts = 0;
  const crossed = (box: Box, own: number) => traces.some((points, j) => j !== own && points.some((p) => p.x > box.x && p.x < box.x + box.w && p.y > box.y && p.y < box.y + box.h));
  const place = (path: Curve, own: number, width: number, tries: number[]) => {
    const options = tries.map((t) => {
      const point = path.point(t);
      return { point, box: { x: point.x - width / 2 - 3, y: point.y - 14, w: width + 6, h: 28 } };
    });
    const clear = options.find(({ box }) => !taken.some((other) => overlaps(box, other)) && !crossed(box, own));
    const free = clear ?? options.find(({ box }) => !taken.some((other) => overlaps(box, other))) ?? options[0];
    conflicts += clear ? 0 : 1;
    taken.push(free.box);
    return free.point;
  };
  const spots = arrows.map((arrow, i) => {
    const path = paths[i];
    if (!path) return { label: null, step: null };
    const step = numbered[i] ? place(path, i, 22, [0.24, 0.32, 0.16, 0.4, 0.5, 0.6, 0.7, 0.8]) : null;
    const label = arrow.label ? place(path, i, textWidth(arrow.label, LABEL) + 16, [0.5, 0.58, 0.42, 0.66, 0.34, 0.74, 0.26, 0.82, 0.18, 0.88, 0.12]) : null;
    return { label, step };
  });
  return { spots, conflicts };
}

function arrange(nodes: Declared[], arrows: DiagramArrowProps[], groups: { id: string }[], sizes: Map<string, Size>, direction: "right" | "down", numbered: boolean[]) {
  const attempt = (spread: number) => {
    const { placed, width, height, across, back } = layout(nodes, arrows, groups, sizes, direction, spread);
    const lanes = new Map([...back].map((arrow, i) => [arrow, i]));
    const byId = new Map(placed.map((node) => [node.id, node]));
    const ports = portsOf(placed, arrows, across);
    const paths = arrows.map((item) => {
      const from = byId.get(item.from);
      const to = byId.get(item.to);
      return from && to ? route(from, to, across, ports.get(item) ?? { out: 0, in: 0, bow: 0, direct: false }, lanes.get(item) ?? 0, placed) : null;
    });
    const { spots, conflicts } = placeLabels(arrows, paths, numbered, placed);
    return { placed, width, height, across, paths, spots, conflicts };
  };
  let best = attempt(0);
  for (let spread = 1; spread <= 4 && best.conflicts > 0; spread++) best = attempt(spread);
  return best;
}

const tone = (index: number) => ({ "--diagram-tone": `var(--color-series-${(index % 8) + 1})` }) as CSSProperties;

const sameSizes = (a: Map<string, Size> | null, b: Map<string, Size>) => a !== null && a.size === b.size && [...b].every(([id, size]) => a.get(id)?.w === size.w && a.get(id)?.h === size.h);

function DiagramRoot({ title, id, direction = "right", flow = "packets", motion = true, children }: DiagramProps) {
  const enter = motion ? "enter" : undefined;
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
      const next = new Map(
        [...root.querySelectorAll<HTMLElement>("[data-node]")].map((node) => {
          const style = getComputedStyle(node);
          const inner = node.querySelector<HTMLElement>(".diagram-node-inner");
          const pad = (a: string, b: string) => parseFloat(style.getPropertyValue(a)) + parseFloat(style.getPropertyValue(b));
          const w = (inner?.offsetWidth ?? 0) + pad("padding-left", "padding-right") + pad("border-left-width", "border-right-width");
          const h = (inner?.offsetHeight ?? 0) + pad("padding-top", "padding-bottom") + pad("border-top-width", "border-bottom-width");
          return [node.dataset.node ?? "", { w: Math.max(168, w), h }];
        }),
      );
      setSizes((current) => (sameSizes(current, next) ? current : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    root.querySelectorAll("[data-node]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [signature]);

  const numbered = arrows.map((arrow, i) => arrow.step !== undefined && arrows.findIndex((other) => other.step === arrow.step) === i);
  const { placed, width, height, across, paths, spots } = arrange(nodes, arrows, groups, sizes ?? new Map(), direction, numbered);
  const byId = new Map(placed.map((node) => [node.id, node]));
  const motions = arrows.map((arrow) => motionOf(arrow, flow));
  const packets = arrows.flatMap((arrow, i) => (motions[i].packet ? [i] : []));
  const stages = [...new Set(packets.map((i) => arrows[i].step ?? Infinity))].sort((a, b) => a - b);
  const animated = packets.length > 0 || motions.some((motion) => motion.dots || motion.pulse);
  const { css, cycle } = flowCss(scope, name, arrows, packets, stages);
  const scale = room > 0 ? Math.min(1, room / width) : 1;
  const ready = sizes !== null;
  const groupIndex = (key?: string) => groups.findIndex((group) => group.id === key);
  const arrow = `${name}-arrow`;
  const beads = arrows.flatMap((_, i) => (motions[i].bead && paths[i] ? [i] : []));
  const spans = paths.map((path) => (path ? Math.ceil(path.length / DOT_GAP) * DOT_GAP : 0));
  const relay = relayCss(scope, name, beads, arrows, spans);

  return (
    <MotionScope on={motion}>
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
                <g key={group.id} className="diagram-group" data-motion={enter} style={{ ...tone(i), "--motion-order": 0 } as CSSProperties}>
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
              return (
                <g key={i} className="diagram-arrow" data-arrow={i} data-motion={enter} style={{ "--motion-order": placed.length } as CSSProperties}>
                  <path
                    className={["diagram-line", item.dashed ? "is-dashed" : "", motions[i].dots ? "is-dots" : ""].filter(Boolean).join(" ")}
                    d={path.d}
                    markerEnd={`url(#${arrow})`}
                    data-edge={i}
                    style={motions[i].bead ? { animationDuration: `${(DOT_PERIOD / BEAD_SPEED) * 1000}ms` } : undefined}
                  />
                </g>
              );
            })}
            {arrows.map((item, i) => {
              const { label, step } = spots[i];
              const labelWidth = item.label ? textWidth(item.label, LABEL) + 16 : 0;
              if (!label && !step) return null;
              return (
                <g key={i} className="diagram-tags" data-arrow={i} data-motion={enter} style={{ "--motion-order": placed.length } as CSSProperties}>
                  {label && (
                    <g className="diagram-label">
                      <rect x={label.x - labelWidth / 2} y={label.y - 11} width={labelWidth} height={22} />
                      <text x={label.x} y={label.y + 4} textAnchor="middle">
                        {item.label}
                      </text>
                    </g>
                  )}
                  {step && (
                    <g className="diagram-step">
                      <circle cx={step.x} cy={step.y} r={11} />
                      <text x={step.x} y={step.y + 4} textAnchor="middle">
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
                data-motion={enter}
                style={{ left: spot?.x ?? 0, top: spot?.y ?? 0, width: ready ? spot?.w : undefined, height: ready ? spot?.h : undefined, "--motion-order": spot?.order ?? 0, ...(index < 0 ? {} : tone(index)) } as CSSProperties}
              >
                <div className="diagram-node-inner">
                  <div className="diagram-node-head">
                    {node.icon && <Icon name={node.icon} />}
                    <div>
                      <div className="diagram-node-label">{node.label}</div>
                      {node.caption && <div className="diagram-node-caption">{node.caption}</div>}
                    </div>
                  </div>
                  {node.children !== undefined && <div className="diagram-node-body">{node.children}</div>}
                </div>
              </div>
            );
          })}
          <svg className="diagram-flow" width={width} height={height} aria-hidden="true" data-motion={motion ? "settle" : undefined} style={{ "--motion-order": placed.length } as CSSProperties}>
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
    </MotionScope>
  );
}

export const Diagram = Object.assign(DiagramRoot, { Node: DiagramNode, Group: DiagramGroup, Arrow: DiagramArrow });
