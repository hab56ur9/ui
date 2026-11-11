import { DataTable, Sparkline } from "ui";
import { series } from "../demo";

const SLOTS = [1, 2, 3];

export default function Example() {
  return (
    <DataTable
      fit
      columns={SLOTS.map((slot) => ({ label: String(slot) }))}
      rows={[SLOTS.map((slot) => ({ render: () => <Sparkline points={series(slot * 7, 24, 100, 0.8, 10)} color={slot} /> }))]}
    />
  );
}
