import { Heatmap, useI18n } from "ui";
import { Canvas, DAY, END, rng, useText } from "../demo";

const random = rng(77);
const weeks = Array.from({ length: 26 }, (_, w) => END - (25 - w) * 7 * DAY);
const sunday = (day: number) => day === 6;
const values = Array.from({ length: 7 }, (_, day) => weeks.map(() => (random() < (sunday(day) ? 0.8 : 0.5) ? 3 + random() * (sunday(day) ? 15 : 6) : 0)));

export default function Example() {
  const text = useText("heatmap-calendar");
  const month = new Intl.DateTimeFormat(useI18n().locale, { month: "short" });
  return (
    <Canvas height={220}>
      <Heatmap
        rows={text.items}
        columns={weeks}
        values={values}
        ramp="sequential-main"
        zeroIsEmpty
        labelEvery={4}
        format={{ value: (v) => `${v.toFixed(1)}km`, column: (week) => month.format(week) }}
      />
    </Canvas>
  );
}
