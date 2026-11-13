import { useState } from "react";
import { Badge, DescriptionList, DesktopShell, Panel, PanelAction, Tree } from "ui";
import { Browser } from "../Browser";
import { useText } from "../demo";

export default function Example() {
  const text = useText("desktop-shell-basic");
  const [current, setCurrent] = useState("design");
  const [sizes, setSizes] = useState({ sidebar: 248, inspector: 300 });
  const channel = text.channels.find((item) => item.id === current) ?? text.channels[0];
  return (
    <Browser address="desktop.example.app" width={1280} height={720}>
      <DesktopShell
        path={[text.workspace, channel.label]}
        search={{ placeholder: text.search, shortcut: "⌘K" }}
        titleActions={<Badge tone="good">{text.live}</Badge>}
        rail={text.rail.map((item, i) => ({ ...item, icon: item.icon as "home", current: i === 1, dot: i === 2 ? ("active" as const) : undefined }))}
        railFooter={[{ id: "settings", label: text.settings, icon: "sliders" }]}
        sidebar={
          <Panel title={text.channelsTitle} actions={<PanelAction icon="plus" label={text.addChannel} />}>
            <Tree label={text.channelsTitle} value={current} onSelect={setCurrent} items={text.channels.map((item) => ({ ...item, icon: "message" as const }))} />
          </Panel>
        }
        inspector={
          <Panel title={text.detailsTitle}>
            <DescriptionList items={text.details.map(([label, value]) => ({ label, value }))} />
          </Panel>
        }
        status={<div style={{ display: "flex", alignItems: "center", padding: "0 var(--space-3)", borderTop: "var(--border-width-default) solid var(--color-border-default)", background: "var(--color-bg-subtle)", color: "var(--color-fg-muted)", fontSize: 11 }}>{text.sizes.replace("{side}", String(sizes.sidebar)).replace("{aside}", String(sizes.inspector))}</div>}
        sizes={sizes}
        onResize={setSizes}
      >
        <Panel variant="pane" title={channel.label} meta={channel.description}>
          <div style={{ display: "grid", alignContent: "start", gap: "var(--space-3)", padding: "var(--space-4)" }}>
            {text.messages.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </Panel>
      </DesktopShell>
    </Browser>
  );
}
