import { Callout } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("callout-basic");
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Callout title={text.note}>{text.newDataArrives}</Callout>
      <Callout tone="good" title={text.tip}>
        {text.dragWidgetsTo}
      </Callout>
      <Callout tone="warning" title={text.decisionNeeded}>
        {text.turningPromoAlerts}
      </Callout>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "var(--space-3)" }}>
        <Callout tone="do" accent="top">
          {text.doText}
        </Callout>
        <Callout tone="dont" accent="top">
          {text.dontText}
        </Callout>
      </div>
    </div>
  );
}
