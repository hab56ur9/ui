import { useMemo, useState } from "react";
import { buildHtml } from "../../bin/spec.mjs";
import en from "../blocks/fitnote/spec.en.json";
import ko from "../blocks/fitnote/spec.ko.json";
import { CodeBlock, Tabs, useI18n } from "ui";

const tabsOf = (lang: "en" | "ko") => [
  { id: "preview", label: "Preview" },
  { id: "spec", label: `spec.${lang}.json` },
  { id: "html", label: "app.html" },
];

export function SpecPreview() {
  const { lang } = useI18n();
  const [tab, setTab] = useState("preview");
  const code = lang === "ko" ? "ko" : "en";
  const spec = code === "ko" ? ko : en;
  const html = useMemo(() => buildHtml(spec, { module: new URL("dist/ui.js", document.baseURI).href, lang: code }), [spec, code]);
  return (
    <div className="docs-spec">
      <Tabs label="App spec" value={tab} onChange={setTab} items={tabsOf(code)} />
      {tab === "preview" && <iframe className="docs-spec-frame" title={spec.app.name} srcDoc={html} />}
      {tab === "spec" && <CodeBlock code={JSON.stringify(spec, null, 2)} lang="json" />}
      {tab === "html" && <CodeBlock code={html} lang="html" />}
    </div>
  );
}
