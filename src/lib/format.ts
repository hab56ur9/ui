import type { Color, Format } from "./types";

export const DAY = 864e5;

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
