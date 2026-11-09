import type { Point } from "ui";

const DAY = 86400000;
const start = new Date(2026, 9, 12).getTime();

export const resets: Point[] = Array.from({ length: 28 }, (_, i) => ({ t: start + i * DAY, v: Math.round(40 * Math.exp(-i / 9) + 6 + ((i * 7) % 5)) }));
