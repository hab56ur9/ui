import { LineChart, type Point } from "ui";
import { Canvas, DAY, series, useFmt, useText } from "../demo";

const actual = series(17, 45, 400000, 900, 16000);
const last = actual[actual.length - 1];
const ahead = Array.from({ length: 15 }, (_, k) => ({ t: last.t + (k + 1) * DAY, v: last.v + (k + 1) * 900 }));
const spread = (k: number) => 9000 * Math.sqrt(k + 1);
const edge = (sign: number): Point[] => [last, ...ahead.map(({ t, v }, k) => ({ t, v: v + sign * spread(k) }))];

export default function Example() {
  const text = useText("line-forecast");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart
        series={[
          { name: text.actual, color: 1, points: actual },
          { name: text.forecast, color: 1, dashed: true, points: [last, ...ahead] },
        ]}
        band={{ name: text.n95Interval, color: 1, lower: edge(-1), upper: edge(1) }}
        format={{ axis: fmt.count }}
        endLabels={false}
      />
    </Canvas>
  );
}
