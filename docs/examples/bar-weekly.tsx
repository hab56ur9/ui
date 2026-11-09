import { BarChart } from "ui";
import { Canvas, series, useFmt, useT } from "../demo";

const points = series(37, 16, 40, 0.6, 18);
const latest = (i: number) => i === points.length - 1;

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <BarChart
        name={t({ ko: "주간 거리", en: "Weekly distance" })}
        points={points}
        colorOf={(_, i) => (latest(i) ? "chart.emphasis" : "chart.de-emphasis")}
        format={{ axis: (v) => `${fmt.full(v)}km` }}
      />
    </Canvas>
  );
}
