import { DataTable, Sparkline } from "ui";
import { Canvas, useFmt, usePlatforms, useText } from "../demo";

export default function Example() {
  const text = useText("table-small");
  const fmt = useFmt();
  return (
    <Canvas height={200}>
      <DataTable
        columns={[{ label: text.platform }, { label: text.dailyAvg, numeric: true }, { label: text.trend }]}
        rows={usePlatforms().map((platform) => [
          { text: platform.name, color: platform.color },
          fmt.full(platform.points[platform.points.length - 1].v),
          { render: () => <Sparkline points={platform.points.slice(-20)} color={platform.color} /> },
        ])}
      />
    </Canvas>
  );
}
