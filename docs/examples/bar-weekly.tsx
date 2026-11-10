import { BarChart } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const points = series(37, 16, 40, 0.6, 18);
const latest = (i: number) => i === points.length - 1;

export default function Example() {
  const text = useText("bar-weekly");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <BarChart name={text.weeklyDistance} points={points} colorOf={(_, i) => (latest(i) ? "chart.emphasis" : "chart.de-emphasis")} format={{ axis: (v) => `${fmt.full(v)}km` }} />
    </Canvas>
  );
}
