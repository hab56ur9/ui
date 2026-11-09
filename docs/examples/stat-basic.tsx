import { Stat } from "ui";
import { Panel, series, useFmt, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  const label = t({ ko: "이전 30일 대비", en: "vs previous 30 days" });
  return (
    <div className="docs-cards">
      <Panel height={150}>
        <Stat value={fmt.count(471000)} delta={{ change: 0.063, label }} trend={series(5, 24, 100, 1, 6)} />
      </Panel>
      <Panel height={150}>
        <Stat value={fmt.ms(176)} delta={{ change: -0.04, goodWhenUp: false, label }} trend={series(9, 24, 180, -0.4, 10)} />
      </Panel>
      <Panel height={150}>
        <Stat value={fmt.percent(0.0042)} delta={{ change: 0.11, goodWhenUp: false, label }} trend={series(13, 24, 40, 0.3, 6)} />
      </Panel>
    </div>
  );
}
