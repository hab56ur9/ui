import { Button, CodeEditor, Viewer, langOf } from "ui";
import { useText } from "../demo";

const SETTINGS = `{
  "theme": "system",
  "editor": {
    "tabSize": 2,
    "wrap": false
  },
  "notifications": {
    "mentions": true,
    "digest": "daily"
  },
  "telemetry": false
}`;

export default function Example() {
  const text = useText("code-editor-viewer");
  return (
    <div style={{ height: 420 }}>
      <Viewer inline icon="code" title={text.title} meta={text.meta} actions={<Button icon="copy" label={text.copy} />}>
        <CodeEditor defaultValue={SETTINGS} lang={langOf(text.title)} start={1} focus={[9]} readOnly />
      </Viewer>
    </div>
  );
}
