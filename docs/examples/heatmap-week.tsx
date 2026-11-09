import { Heatmap } from "ui";
import { Canvas, rng, useFmt, useT } from "../demo";

const random = rng(41);
const peak = (hour: number, center: number, width: number) => Math.exp(-((hour - center) ** 2) / width);
const weekday = (day: number) => day < 5;
const values = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => 1000 + 3000 * peak(hour, weekday(day) ? 21 : 15, 18) + (weekday(day) ? 2000 * peak(hour, 9, 4) : 0) + 400 * random()),
);
const hours = Array.from({ length: 24 }, (_, hour) => hour);

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={260}>
      <Heatmap
        rows={t({ ko: ["월", "화", "수", "목", "금", "토", "일"], en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] })}
        columns={hours}
        values={values}
        format={{ value: fmt.count, column: (hour) => `${hour}${t({ ko: "시", en: "h" })}` }}
      />
    </Canvas>
  );
}
