import { LineChart, type Point } from "ui";
import { Canvas, DAY, series, useFmt, useT } from "../demo";

const actual = series(17, 45, 400000, 900, 16000);
const last = actual[actual.length - 1];
const ahead = Array.from({ length: 15 }, (_, k) => ({ t: last.t + (k + 1) * DAY, v: last.v + (k + 1) * 900 }));
const spread = (k: number) => 9000 * Math.sqrt(k + 1);
const edge = (sign: number): Point[] => [last, ...ahead.map(({ t, v }, k) => ({ t, v: v + sign * spread(k) }))];

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart
        series={[
          { name: t({ ko: "실측", en: "Actual" }), color: 1, points: actual },
          { name: t({ ko: "예측", en: "Forecast" }), color: 1, dashed: true, points: [last, ...ahead] },
        ]}
        band={{ name: t({ ko: "95% 구간", en: "95% interval" }), color: 1, lower: edge(-1), upper: edge(1) }}
        format={{ axis: fmt.count }}
        endLabels={false}
      />
    </Canvas>
  );
}
