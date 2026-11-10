import { Heatmap, useI18n } from "ui";
import { Canvas, DAY, END, rng, useT } from "../demo";

const random = rng(77);
const weeks = Array.from({ length: 26 }, (_, w) => END - (25 - w) * 7 * DAY);
const sunday = (day: number) => day === 6;
const values = Array.from({ length: 7 }, (_, day) => weeks.map(() => (random() < (sunday(day) ? 0.8 : 0.5) ? 3 + random() * (sunday(day) ? 15 : 6) : 0)));

export default function Example() {
  const t = useT();
  const month = new Intl.DateTimeFormat(useI18n().locale, { month: "short" });
  return (
    <Canvas height={220}>
      <Heatmap
        rows={t({ ko: ["월", "", "수", "", "금", "", "일"], en: ["Mon", "", "Wed", "", "Fri", "", "Sun"] })}
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
