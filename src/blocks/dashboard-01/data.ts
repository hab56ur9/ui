import { DAY, type Point } from "ui";

const random = ((seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
})(20261107);
const gaussian = () => (random() + random() + random() + random() - 2) / 0.577;

export const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
export const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

const SPAN = 730;
const dateOf = (y: number, m: number, d: number) => new Date(y, m - 1, d).getTime();
const days = Array.from({ length: SPAN }, (_, i) => new Date(2026, 10, 7 - (SPAN - 1 - i)).getTime());
const weekend = (t: number) => [0, 6].includes(new Date(t).getDay());

const releases = [
  { t: dateOf(2025, 3, 4), label: "v2.1", lift: 0.03 },
  { t: dateOf(2025, 8, 19), label: "v2.2", lift: 0.04 },
  { t: dateOf(2026, 2, 10), label: "v2.3", lift: 0.03 },
  { t: dateOf(2026, 6, 2), label: "v2.4", lift: 0.05 },
  { t: dateOf(2026, 9, 15), label: "v2.5", lift: 0.06 },
];
const campaigns = [
  { t: dateOf(2025, 11, 20), id: "yearEnd", boost: 0.1 },
  { t: dateOf(2026, 10, 13), id: "autumn", boost: 0.12 },
] as const;
export type Campaign = (typeof campaigns)[number]["id"];
export const releaseMarks = releases.map(({ t, label }) => ({ t, label }));
export const campaignMarks = campaigns.map(({ t, id }) => ({ t, id }));
const since = (t: number) => (event: { t: number }) => event.t <= t;
const liftAt = (t: number) => sum(releases.filter(since(t)).map((r) => r.lift)) + sum(campaigns.filter(since(t)).map((c) => c.boost * Math.exp(-(t - c.t) / DAY / 10)));

export const platforms = [
  { id: "web", slot: 1, base: 82000, growth: 0.16, weekendFactor: 0.78 },
  { id: "ios", slot: 2, base: 64000, growth: 0.34, weekendFactor: 1.08 },
  { id: "android", slot: 3, base: 96000, growth: 0.27, weekendFactor: 1.1 },
].map((p) => ({
  ...p,
  values: days.map((t, i) => p.base * (1 + p.growth) ** (i / 365) * (weekend(t) ? p.weekendFactor : 1) * (1 + liftAt(t)) * (1 + 0.025 * gaussian())),
}));
export const total = days.map((_, i) => sum(platforms.map((p) => p.values[i])));
export const revenue = total.map((v, i) => v * 210 * 1.12 ** (i / 365) * (weekend(days[i]) ? 1.15 : 1) * (1 + 0.06 * gaussian()));
const releaseWeek = (t: number) => t >= dateOf(2026, 9, 15) && t < dateOf(2026, 9, 18);
const incidents = new Set(days.filter((t) => random() < 0.018 || releaseWeek(t)));
export const latency = days.map((t) => 176 + 9 * gaussian() + (incidents.has(t) ? 70 + 60 * random() : 0));
export const errors = days.map((t) => Math.max(0.001, 0.0034 + 0.0005 * gaussian() + (incidents.has(t) ? 0.002 + 0.004 * random() : 0)));
const signups = total.map((v, i) => v * 0.017 * (weekend(days[i]) ? 1.25 : 1) * (1 + 0.1 * gaussian()));
const cellNoise = days.map(() => Array.from({ length: 24 }, () => 1 + 0.08 * gaussian()));

export const RANGES = [7, 30, 90, 365] as const;
export type Range = (typeof RANGES)[number];

const bucket = (points: Point[], size: number, reduce: (xs: number[]) => number) =>
  Array.from({ length: Math.ceil(points.length / size) }, (_, k) => points.slice(Math.max(0, points.length - (k + 1) * size), points.length - k * size))
    .reverse()
    .filter((chunk) => chunk.length === size)
    .map((chunk) => ({ t: chunk[chunk.length - 1].t, v: reduce(chunk.map(({ v }) => v)) }));
const smooth = (values: number[]) => values.map((_, i) => mean(values.slice(Math.max(0, i - 6), i + 1)));

export const WEEKDAYS = [1, 2, 3, 4, 5, 6, 0];
export const HOURS = Array.from({ length: 24 }, (_, h) => h);
const WEEKDAY_PEAKS = [
  [8.5, 1.2, 0.9],
  [12.5, 1.2, 0.8],
  [21.5, 2, 1],
];
const WEEKEND_PEAKS = [
  [11, 3, 0.8],
  [15, 3, 0.7],
  [21, 2.5, 1],
];
const shape = (h: number, isWeekend: boolean) => 0.12 + sum((isWeekend ? WEEKEND_PEAKS : WEEKDAY_PEAKS).map(([mu, sd, a]) => a * Math.exp(-((h - mu) ** 2) / (2 * sd * sd))));
const norms = [false, true].map((w) => mean(HOURS.map((h) => shape(h, w))));

export function windowOf(range: Range) {
  const current = (values: number[]) => values.slice(-range);
  const previous = (values: number[]) => values.slice(-2 * range, -range);
  const currentDays = current(days);
  const pairs = (values: number[]) => current(values).map((v, i) => ({ t: currentDays[i], v }));
  const weekly = range > 30;
  const horizon = Math.min(30, Math.max(7, Math.round(range / 3)));

  const forecast = () => {
    const fit = 56;
    const ys = total.slice(-fit);
    const xs = ys.map((_, i) => i);
    const mx = mean(xs);
    const my = mean(ys);
    const slope = sum(xs.map((x, i) => (x - mx) * (ys[i] - my))) / sum(xs.map((x) => (x - mx) ** 2));
    const line = (x: number) => my + slope * (x - mx);
    const weekdays = days.slice(-fit).map((t) => new Date(t).getDay());
    const ratios = ys.map((y, i) => ({ wd: weekdays[i], r: y / line(i) }));
    const factor = Array.from({ length: 7 }, (_, wd) => mean(ratios.filter((x) => x.wd === wd).map((x) => x.r)));
    const sigma = Math.sqrt(mean(ys.map((y, i) => (y - line(i) * factor[weekdays[i]]) ** 2)));
    const last = { t: days[days.length - 1], v: total[total.length - 1] };
    const ahead = Array.from({ length: horizon }, (_, k) => {
      const t = new Date(2026, 10, 8 + k).getTime();
      return { t, v: line(fit + k) * factor[new Date(t).getDay()], spread: 1.96 * sigma * Math.sqrt(1 + (k + 1) / fit) };
    });
    return {
      mean: [last, ...ahead.map(({ t, v }) => ({ t, v }))],
      lower: [last, ...ahead.map(({ t, v, spread }) => ({ t, v: v - spread }))],
      upper: [last, ...ahead.map(({ t, v, spread }) => ({ t, v: v + spread }))],
    };
  };

  const heat = () => {
    const offset = SPAN - range;
    return WEEKDAYS.map((wd) => {
      const indices = currentDays.map((t, i) => ({ t, i: offset + i })).filter(({ t }) => new Date(t).getDay() === wd);
      return HOURS.map((h) => mean(indices.map(({ t, i }) => (total[i] / 24) * (shape(h, weekend(t)) / norms[Number(weekend(t))]) * cellNoise[i][h])));
    });
  };

  return {
    range,
    weekly,
    horizon,
    days: currentDays,
    current,
    previous,
    pairs,
    trend: (values: number[]) => bucket(pairs(values), Math.ceil(range / 24), mean),
    indexed: (values: number[]) => {
      const series = current(smooth(values));
      return series.map((v, i) => ({ t: currentDays[i], v: (v / series[0]) * 100 }));
    },
    signups: () => (weekly ? bucket(pairs(signups), 7, sum) : pairs(signups)),
    forecast,
    heat,
  };
}

export type Window = ReturnType<typeof windowOf>;
