import { DataTable, Sparkline } from "ui";
import { Canvas, useFmt, usePlatforms, useText } from "../demo";

const CHANGES = [0.049, 0.031, -0.012];

export default function Example() {
  const text = useText("table-trend");
  const fmt = useFmt();
  return (
    <Canvas height={200}>
      <DataTable
        columns={[{ label: text.platform }, { label: text.dailyAvg, numeric: true }, { label: text.change, numeric: true }, { label: text.trend }]}
        rows={usePlatforms().map((platform, i) => [
          { text: platform.name, color: platform.color },
          fmt.full(platform.points[platform.points.length - 1].v),
          { delta: { change: CHANGES[i] } },
          { render: () => <Sparkline points={platform.points.slice(-20)} color={platform.color} /> },
        ])}
      />
    </Canvas>
  );
}
