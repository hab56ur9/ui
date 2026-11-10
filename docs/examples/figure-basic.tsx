import { DataTable, Figure, LineChart } from "ui";
import { series, useText } from "../demo";

export default function Example() {
  const text = useText("figure-basic");
  return (
    <>
      <Figure caption={text.dailyLayoutResets} height={180}>
        <LineChart series={[{ name: text.resets, color: 1, points: series(4, 28, 40, -1, 6) }]} />
      </Figure>
      <Figure kind="table" caption={text.savedSizeBy}>
        <DataTable
          columns={[{ label: text.widgets }, { label: text.savedSize, numeric: true }]}
          rows={[
            ["4", "180 B"],
            ["8", "360 B"],
          ]}
        />
      </Figure>
    </>
  );
}
