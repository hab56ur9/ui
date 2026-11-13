import type { Color, Format } from "./types";

export const DAY = 864e5;

const UNITS = ["B", "KB", "MB", "GB", "TB"];

const shown = (value: number, step: number) => (step === 0 || value >= 9.95 ? String(Math.round(value)) : value.toFixed(1));

export const bytes = (size: number, step = 0): string => {
  const value = size / 1024 ** step;
  const last = step === UNITS.length - 1;
  if (!last && Number(shown(value, step)) >= 1024) return bytes(size, step + 1);
  return `${shown(value, step)} ${UNITS[step]}`;
};

const measurable = (max: number) => max > 0;

export const percentOf = (value: number, max: number) => (measurable(max) ? `${Math.max(0, Math.min(100, (value / max) * 100))}%` : "0%");

export const color = (value: Color) => (typeof value === "number" ? `var(--color-series-${value})` : `var(--color-chart-${value})`);

export const fullDate = (time: number, locale: string) =>
  new Intl.DateTimeFormat(locale, { year: "numeric", month: "numeric", day: "numeric", weekday: "short" }).format(new Date(time));

export const monthDay = (time: number) => {
  const d = new Date(time);
  return `${d.getMonth() + 1}/${d.getDate()}`;
};

export const monthName = (time: number, locale: string) => {
  const d = new Date(time);
  const parts: Intl.DateTimeFormatOptions = d.getMonth() === 0 ? { year: "numeric" } : { month: "short" };
  return new Intl.DateTimeFormat(locale, parts).format(d);
};

export const formats = (format: Format | undefined, locale: string) => ({
  axis: format?.axis ?? String,
  value: format?.value ?? format?.axis ?? String,
  date: format?.date ?? ((time: number) => fullDate(time, locale)),
});
