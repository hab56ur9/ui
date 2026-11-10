import { LineChart, type Point } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const index = (points: Point[]) => points.map(({ t, v }) => ({ t, v: (v / points[0].v) * 100 }));
const revenue = index(series(23, 60, 3000, 30, 300));
const users = index(series(29, 60, 400000, 2500, 20000));

export default function Example() {
  const text = useText("line-index");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart
        series={[
          { name: text.revenue, color: 1, points: revenue },
          { name: text.users, color: 2, points: users },
        ]}
        baseline={100}
        format={{ axis: fmt.full }}
      />
    </Canvas>
  );
}
