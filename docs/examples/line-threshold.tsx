import { LineChart } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const points = series(21, 60, 180, 0, 50).map(({ t, v }, i) => ({ t, v: i % 17 === 5 ? v + 90 : v }));

export default function Example() {
  const text = useText("line-threshold");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart series={[{ name: "p95", color: 1, area: true, flagBreaches: true, points }]} threshold={{ value: 250, label: "SLO 250ms", breach: text.overSlo }} format={{ axis: fmt.ms }} />
    </Canvas>
  );
}
