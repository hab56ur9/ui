import { Meter } from "ui";
import { Panel, useText } from "../demo";

export default function Example() {
  const text = useText("meter-basic");
  const won = (v: number) => `₩${(v / 100000000).toFixed(1)}억`;
  return (
    <div className="card-grid">
      <Panel>
        <Meter label={text.budget} value={660000000} max={2130000000} target={710000000} format={won} note={text.budgetNote} />
      </Panel>
      <Panel>
        <Meter label={text.goal} value={8432} max={10000} status="good" note={text.goalNote} />
      </Panel>
      <Panel>
        <Meter label={text.quota} value={96} max={100} format={(v) => `${v}%`} status="critical" note={text.quotaNote} />
      </Panel>
    </div>
  );
}
