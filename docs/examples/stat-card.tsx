import { Stat } from "ui";
import { Panel, series, useFmt, useT } from "../demo";

const trend = series(5, 24, 100, 1, 6);

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Panel height={150}>
      <Stat value={fmt.count(471000)} delta={{ change: 0.063, label: t({ ko: "이전 30일 대비", en: "vs previous 30 days" }) }} trend={trend} />
    </Panel>
  );
}
