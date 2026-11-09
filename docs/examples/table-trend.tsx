import { DataTable, Sparkline } from "ui";
import { Canvas, useFmt, usePlatforms, useT } from "../demo";

const CHANGES = [0.049, 0.031, -0.012];

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Canvas height={200}>
      <DataTable
        columns={[
          { label: t({ ko: "플랫폼", en: "Platform" }) },
          { label: t({ ko: "일 평균", en: "Daily avg" }), numeric: true },
          { label: t({ ko: "변화", en: "Change" }), numeric: true },
          { label: t({ ko: "추이", en: "Trend" }) },
        ]}
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
