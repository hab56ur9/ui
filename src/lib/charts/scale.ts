import { DAY, monthDay, monthName } from "../format";
import type { Point } from "../types";

const GLYPH = 0.62;

const WIDE = /[\u1100-\u11ff\u3040-\u30ff\u3130-\u318f\u4e00-\u9fff\uac00-\ud7af\uff00-\uffef]/;
export const textWidth = (text: string, size: number) => [...text].reduce((sum, char) => sum + (WIDE.test(char) ? 1 : GLYPH), 0) * size;
export const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
export const finite = (values: (number | undefined)[]) => values.filter((v): v is number => Number.isFinite(v));

export type Scale = ((v: number) => number) & { invert: (p: number) => number };

export function linear([d0, d1]: [number, number], [r0, r1]: [number, number]): Scale {
  const k = (r1 - r0) / (d1 - d0 || 1);
  const scale = ((v: number) => r0 + (v - d0) * k) as Scale;
  scale.invert = (p: number) => d0 + (p - r0) / k;
  return scale;
}

export function niceTicks(min: number, max: number, count: number) {
  const raw = (max - min || Math.abs(max) || 1) / Math.max(count, 1);
  const magnitude = 10 ** Math.floor(Math.log10(raw));
  const step = [1, 2, 2.5, 5, 10].map((m) => m * magnitude).find((s) => s >= raw) ?? raw;
  const start = Math.floor(min / step) * step;
  const end = Math.max(Math.ceil(max / step) * step, start + step);
  return Array.from({ length: Math.round((end - start) / step) + 1 }, (_, i) => +(start + i * step).toFixed(10));
}

const fit = (label: string, room: number, size: number) => {
  if (textWidth(label, size) <= room) return label;
  const chars = [...label];
  while (chars.length > 1 && textWidth(`${chars.join("")}…`, size) > room) chars.pop();
  return `${chars.join("")}…`;
};

export function categoryTicks(labels: string[], spacing: number, size: number) {
  const all = labels.map((_, i) => i);
  if (spacing >= size * 3) return { ticks: all, format: (t: number) => fit(labels[t] ?? "", spacing - size / 2, size) };
  const widest = Math.max(0, ...labels.map((label) => textWidth(label, size))) + size;
  const step = Math.max(1, Math.ceil(widest / Math.max(spacing, 1)));
  return { ticks: all.filter((i) => i % step === 0), format: (t: number) => labels[t] ?? "" };
}

export function timeTicks(t0: number, t1: number, count: number, locale: string) {
  const perTick = (t1 - t0) / DAY / Math.max(count, 1);
  const dayStep = [1, 2, 7, 14, 28].find((s) => s >= perTick);
  if (dayStep) {
    const ticks = Array.from({ length: Math.floor((t1 - t0) / (dayStep * DAY)) + 1 }, (_, i) => t1 - i * dayStep * DAY).reverse();
    return { ticks, format: monthDay };
  }
  const monthStep = [1, 2, 3, 6].find((s) => s * 30.4 >= perTick) ?? 12;
  const first = new Date(t0);
  const ticks: number[] = [];
  for (let d = new Date(first.getFullYear(), first.getMonth() + 1, 1); d.getTime() <= t1; d.setMonth(d.getMonth() + monthStep)) ticks.push(d.getTime());
  return { ticks, format: (t: number) => monthName(t, locale) };
}

export const pathOf = (points: Point[], x: Scale, y: Scale) => points.map(({ t, v }, i) => `${i ? "L" : "M"}${x(t).toFixed(1)},${y(v).toFixed(1)}`).join("");
