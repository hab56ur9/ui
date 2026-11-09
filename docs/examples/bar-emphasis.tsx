import { BarChart } from "ui";
import { Canvas, series, useFmt, useT } from "../demo";

const points = series(31, 14, 5000, 80, 1600);
const latest = (i: number) => i === points.length - 1;

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas>
      <BarChart
        name={t({ ko: "신규 가입", en: "Sign-ups" })}
        points={points}
        colorOf={(_, i) => (latest(i) ? "chart.emphasis" : "chart.de-emphasis")}
        format={{ axis: fmt.count, value: fmt.full }}
      />
    </Canvas>
  );
}
