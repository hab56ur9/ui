import { useState } from "react";
import { Button, DesktopShell, Panel, Row, Segmented, Tree, Viewer } from "ui";
import { Browser } from "../Browser";
import { useText } from "../demo";

type Scope = "modal" | "main" | "content";

export default function Example() {
  const text = useText("desktop-shell-overlay");
  const [scope, setScope] = useState<Scope>("modal");
  const [open, setOpen] = useState(false);
  return (
    <Browser address="desktop.example.app" width={1280} height={720}>
      <DesktopShell
        path={[text.workspace, text.file]}
        rail={[{ id: "files", label: text.files, icon: "file", current: true }]}
        sidebar={
          <Panel title={text.files}>
            <Tree label={text.files} value="readme" items={text.tree.map((item) => ({ ...item, icon: "file" as const }))} />
          </Panel>
        }
        inspector={<Panel title={text.detailsTitle}>{text.details}</Panel>}
        overlay={open && <Viewer inline icon="file" title={text.file} meta={text.meta} onClose={() => setOpen(false)}><div style={{ padding: "var(--space-6)" }}>{text.body}</div></Viewer>}
        overlayScope={scope}
        onOverlayClose={() => setOpen(false)}
      >
        <div style={{ display: "grid", alignContent: "start", gap: "var(--space-4)", padding: "var(--space-6)" }}>
          <Segmented<Scope> label={text.scope} value={scope} onChange={setScope} options={text.scopes.map(([value, label]) => ({ value: value as Scope, label }))} />
          <Row>
            <Button onClick={() => setOpen(true)}>{text.open}</Button>
          </Row>
        </div>
      </DesktopShell>
    </Browser>
  );
}
