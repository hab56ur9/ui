import { latency, mean, platforms, revenue, sum, total, windowOf } from "../dashboard-01/data";

const w = windowOf(30);
const change = (values: number[], aggregate: (xs: number[]) => number) => aggregate(w.current(values)) / aggregate(w.previous(values)) - 1;

export const data: Record<string, unknown> = {
  "users.average": mean(w.current(total)),
  "users.change": change(total, mean),
  "users.trend": w.trend(total),
  "users.daily": w.pairs(total),
  "revenue.total": sum(w.current(revenue)),
  "revenue.change": change(revenue, sum),
  "latency.p95": mean(w.current(latency)),
  "latency.change": change(latency, mean),
  platforms: platforms.map((p) => ({ id: p.id, slot: p.slot, average: mean(w.current(p.values)), change: change(p.values, mean) })),
};

export const formatsFor = (locale: string) => {
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const whole = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  return {
    compact: (v: number) => compact.format(v),
    won: (v: number) => `₩${compact.format(v)}`,
    ms: (v: number) => `${whole.format(v)}ms`,
  };
};
