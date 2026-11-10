import { LineChart } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const points = series(3, 60, 120000, 400, 9000);

export default function Example() {
  const text = useText("line-area");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart series={[{ name: text.activeUsers, color: 1, area: true, points }]} format={{ axis: fmt.count }} />
    </Canvas>
  );
}
