import { DataTable, Figure, LineChart } from "ui";
import { series, useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <>
      <Figure caption={t({ ko: "일별 배치 초기화 횟수", en: "Daily layout resets" })} height={180}>
        <LineChart series={[{ name: t({ ko: "초기화", en: "Resets" }), color: 1, points: series(4, 28, 40, -1, 6) }]} />
      </Figure>
      <Figure kind="table" caption={t({ ko: "위젯 수에 따른 저장 크기", en: "Saved size by widget count" })}>
        <DataTable
          columns={[{ label: t({ ko: "위젯 수", en: "Widgets" }) }, { label: t({ ko: "저장 크기", en: "Saved size" }), numeric: true }]}
          rows={[
            ["4", "180 B"],
            ["8", "360 B"],
          ]}
        />
      </Figure>
    </>
  );
}
