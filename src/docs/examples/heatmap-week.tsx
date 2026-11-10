import { Heatmap } from "ui";
import { Canvas, rng, useFmt, useText } from "../demo";

const random = rng(41);
const peak = (hour: number, center: number, width: number) => Math.exp(-((hour - center) ** 2) / width);
const weekday = (day: number) => day < 5;
const values = Array.from({ length: 7 }, (_, day) =>
  Array.from({ length: 24 }, (_, hour) => 1000 + 3000 * peak(hour, weekday(day) ? 21 : 15, 18) + (weekday(day) ? 2000 * peak(hour, 9, 4) : 0) + 400 * random()),
);
const hours = Array.from({ length: 24 }, (_, hour) => hour);

export default function Example() {
  const text = useText("heatmap-week");
  const fmt = useFmt();
  return (
    <Canvas height={260}>
      <Heatmap rows={text.items} columns={hours} values={values} format={{ value: fmt.count, column: (hour) => `${hour}${text.h}` }} />
    </Canvas>
  );
}
