import { LineChart } from "ui";
import { Canvas, series, useFmt, useT } from "../demo";

const thisYear = series(4, 60, 100, 2, 6);
const lastYear = series(9, 60, 90, 1.6, 6);

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart
        series={[
          { name: t({ ko: "올해", en: "This year" }), color: "chart.emphasis", area: true, points: thisYear },
          { name: t({ ko: "작년", en: "Last year" }), color: "chart.de-emphasis", dashed: true, points: lastYear },
        ]}
        format={{ axis: fmt.count }}
      />
    </Canvas>
  );
}
