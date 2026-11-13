import { Panel, SplitPane } from "ui";
import { useText } from "../demo";

const frame = { display: "grid", width: "100%", height: 320, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" };
const body = { padding: "var(--space-3)" };

export default function Example() {
  const text = useText("split-column");
  return (
    <div style={frame}>
      <SplitPane direction="column" sizes={[0.6, 0.4]} min={80}>
        <Panel variant="pane" title={text.editor}>
          <p style={body}>{text.editorBody}</p>
        </Panel>
        <Panel variant="pane" title={text.terminal}>
          <p style={body}>{text.terminalBody}</p>
        </Panel>
      </SplitPane>
    </div>
  );
}
