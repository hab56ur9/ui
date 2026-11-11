import { LineChart } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const thisYear = series(4, 60, 100, 2, 6);
const lastYear = series(9, 60, 90, 1.6, 6);

export default function Example() {
  const text = useText("line-emphasis");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart
        series={[
          { name: text.thisYear, color: "emphasis", area: true, points: thisYear },
          { name: text.lastYear, color: "de-emphasis", dashed: true, points: lastYear },
        ]}
        format={{ axis: fmt.count }}
      />
    </Canvas>
  );
}
