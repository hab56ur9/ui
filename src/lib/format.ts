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

export const milliseconds = (time: string) => parseFloat(time) * (/[^m]s$/.test(time) ? 1000 : 1);

export const durationMs = (time: string, fallback: number, intensity = "1") => {
  const ms = milliseconds(time.trim());
  const scale = parseFloat(intensity);
  return (Number.isNaN(ms) ? fallback : ms) * (Number.isNaN(scale) ? 1 : scale);
};

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

const MINUTE = 6e4;

const pad = (value: number) => String(value).padStart(2, "0");

export const clock = (time: number) => {
  const d = new Date(time);
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const CLOCK_STEPS = [1, 2, 5, 10, 15, 30, 60, 120, 180, 360, 720, 1440].map((minutes) => minutes * MINUTE);

export const clockTicks = (t0: number, t1: number, count: number) => {
  const step = CLOCK_STEPS.find((s) => s >= (t1 - t0) / Math.max(count, 1)) ?? CLOCK_STEPS[CLOCK_STEPS.length - 1];
  const offset = new Date(t0).getTimezoneOffset() * MINUTE;
  const first = Math.ceil((t0 - offset) / step) * step + offset;
  return Array.from({ length: Math.max(0, Math.floor((t1 - first) / step) + 1) }, (_, i) => first + i * step);
};

export type DurationUnits = { h: string; m: string; s: string };

export const duration = (ms: number, units: DurationUnits) => {
  const total = Math.max(0, Math.round(ms / 1000));
  if (total < 60) return `${total}${units.s}`;
  const minutes = Math.round(total / 60);
  const hours = Math.floor(minutes / 60);
  if (hours === 0) return `${minutes}${units.m}`;
  return minutes % 60 === 0 ? `${hours}${units.h}` : `${hours}${units.h} ${minutes % 60}${units.m}`;
};
