import { Panel, PanelAction } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("panel-pane");
  return (
    <div style={{ display: "grid", width: "100%", maxWidth: 520, height: 240, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" }}>
      <Panel
        variant="pane"
        title={text.thread}
        meta={text.where}
        actions={
          <>
            <PanelAction icon="link" label={text.copyLink} />
            <PanelAction icon="close" label={text.close} />
          </>
        }
      >
        <div style={{ display: "grid", alignContent: "start", gap: "var(--space-3)", padding: "var(--space-3)" }}>
          <p>{text.first}</p>
          <p>{text.second}</p>
          <p>{text.third}</p>
        </div>
      </Panel>
    </div>
  );
}
