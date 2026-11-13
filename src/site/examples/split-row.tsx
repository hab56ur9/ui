import { useState } from "react";
import { Panel, SplitPane } from "ui";
import { useText } from "../demo";

const frame = { display: "grid", width: "100%", height: 240, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" };
const body = { display: "grid", alignContent: "start", gap: "var(--space-2)", padding: "var(--space-3)" };

export default function Example() {
  const text = useText("split-row");
  const [sizes, setSizes] = useState([0.35, 0.65]);
  return (
    <div style={{ display: "grid", gap: "var(--space-2)", width: "100%" }}>
      <div style={frame}>
        <SplitPane sizes={sizes} onResize={setSizes}>
          <Panel variant="pane" title={text.list}>
            <div style={body}>
              <p>{text.first}</p>
              <p>{text.second}</p>
            </div>
          </Panel>
          <Panel variant="pane" title={text.detail}>
            <div style={body}>
              <p>{text.body}</p>
            </div>
          </Panel>
        </SplitPane>
      </div>
      <small style={{ color: "var(--color-fg-muted)" }}>{sizes.map((size) => `${Math.round(size * 100)}%`).join(" · ")}</small>
    </div>
  );
}
