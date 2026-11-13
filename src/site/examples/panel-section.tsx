import { List, Panel, PanelAction } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("panel-section");
  return (
    <div style={{ width: 260, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", background: "var(--color-bg-raised)" }}>
      <Panel title={text.channels} actions={<PanelAction icon="plus" label={text.addChannel} />}>
        <List
          label={text.channels}
          items={[
            { id: "design", title: text.design, meta: "3" },
            { id: "app", title: text.app },
          ]}
        />
      </Panel>
      <Panel title={text.agents} meta="2" actions={<PanelAction icon="plus" label={text.addAgent} />}>
        <List
          label={text.agents}
          items={[
            { id: "builder", title: text.builder, avatar: text.builder, description: text.building },
            { id: "qa", title: text.qa, avatar: text.qa, description: text.waiting },
          ]}
        />
      </Panel>
    </div>
  );
}
