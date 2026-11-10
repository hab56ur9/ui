import { useMemo, useState } from "react";
import { buildHtml } from "../../bin/spec.mjs";
import fitnote from "../blocks/fitnote/spec.json";
import { CodeBlock, Tabs, useI18n } from "ui";

const TABS = [
  { id: "preview", label: "Preview" },
  { id: "spec", label: "spec.json" },
  { id: "html", label: "app.html" },
];

export function SpecPreview() {
  const { lang } = useI18n();
  const [tab, setTab] = useState("preview");
  const html = useMemo(() => buildHtml(fitnote, { module: new URL("dist/ui.js", document.baseURI).href, lang: lang === "ko" ? "ko" : "en" }), [lang]);
  return (
    <div className="docs-spec">
      <Tabs label="App spec" value={tab} onChange={setTab} items={TABS} />
      {tab === "preview" && <iframe className="docs-spec-frame" title="FitNote" srcDoc={html} />}
      {tab === "spec" && <CodeBlock code={JSON.stringify(fitnote, null, 2)} lang="json" />}
      {tab === "html" && <CodeBlock code={html} lang="html" />}
    </div>
  );
}
