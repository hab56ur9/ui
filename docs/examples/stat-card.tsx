import { Stat } from "ui";
import { Panel, series, useFmt, useText } from "../demo";

const trend = series(5, 24, 100, 1, 6);

export default function Example() {
  const text = useText("stat-card");
  const fmt = useFmt();
  return (
    <Panel height={150}>
      <Stat value={fmt.count(471000)} delta={{ change: 0.063, label: text.vsPrevious30 }} trend={trend} />
    </Panel>
  );
}
