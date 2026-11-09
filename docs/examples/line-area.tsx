import { LineChart } from "ui";
import { Canvas, series, useFmt, useT } from "../demo";

const points = series(3, 60, 120000, 400, 9000);

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart series={[{ name: t({ ko: "활성 사용자", en: "Active users" }), color: 1, area: true, points }]} format={{ axis: fmt.count }} />
    </Canvas>
  );
}
