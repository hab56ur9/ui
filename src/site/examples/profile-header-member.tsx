import { Button, Panel, PanelAction, ProfileHeader } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("profile-header-member");
  return (
    <div style={{ display: "grid", width: "100%", maxWidth: 380, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" }}>
      <Panel variant="pane" title={text.profile} meta={text.builder} actions={<PanelAction icon="close" label={text.close} />}>
        <ProfileHeader
          variant="member"
          name={text.builder}
          tone={2}
          state="busy"
          role={text.maintainer}
          status={text.working}
          bio={text.expertise}
          actions={
            <>
              <Button variant="primary" icon="monitor">{text.shell}</Button>
              <Button icon="pause">{text.stop}</Button>
              <Button icon="refresh">{text.reload}</Button>
            </>
          }
          facts={[
            { label: "handle", value: "@builder" },
            { label: text.active, value: text.oneItem },
            { label: text.queue, value: text.twoItems },
            { label: text.session, value: "3f9c2a71" },
          ]}
        />
      </Panel>
    </div>
  );
}
