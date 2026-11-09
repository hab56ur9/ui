const DAY = 86400000;
const TODAY = new Date(2026, 10, 9).getTime();
const random = ((seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
})(20261109);

const days = (n: number) => Array.from({ length: n }, (_, i) => TODAY - (n - 1 - i) * DAY);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;

const month = days(30);
const steps = month.map((t, i) => (i === month.length - 1 ? 7860 : Math.round(6200 + i * 60 + (new Date(t).getDay() % 6 === 0 ? 2400 : 0) + random() * 2200)));
const resting = month.map((_, i) => 64 - i * 0.12 + random() * 3);
const average = month.map((_, i) => 92 - i * 0.2 + random() * 6);
const active = days(56).map((_, i) => 25 + i * 0.35 + random() * 25);

const KINDS = ["run", "ride", "strength", "yoga", "run"];
const workouts = days(5)
  .reverse()
  .map((t, i) => ({ date: t, kind: KINDS[i], minutes: [34, 52, 40, 30, 28][i], distance: [5.2, 18.4, 0, 0, 4.1][i], calories: [348, 512, 286, 120, 290][i] }));

const weekly = Array.from({ length: 8 }, (_, w) => ({ t: TODAY - (7 - w) * 7 * DAY, v: Math.round(active.slice(w * 7, w * 7 + 7).reduce((a, b) => a + b, 0)) }));

export const data: Record<string, unknown> = {
  "steps.today": steps.at(-1),
  "steps.delta": (steps.at(-1) as number) / mean(steps.slice(-8, -1)) - 1,
  "steps.trend": month.map((t, i) => ({ t, v: steps[i] })).slice(-14),
  "active.today": Math.round(active.at(-1) as number),
  "active.delta": (active.at(-1) as number) / mean(active.slice(-8, -1)) - 1,
  "calories.today": 2140,
  "calories.delta": 0.06,
  "sleep.last": 7.2,
  "sleep.delta": -0.04,
  "heart.resting": month.map((t, i) => ({ t, v: resting[i] })),
  "heart.average": month.map((t, i) => ({ t, v: average[i] })),
  "active.weekly": weekly,
  "workouts.recent": workouts,
  "workouts.days": month.filter((_, i) => i % 3 !== 1 && i < month.length - 1),
  today: TODAY,
};
