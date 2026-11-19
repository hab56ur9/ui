import { useMemo, useState } from "react";
import { buildHtml } from "../../bin/spec.mjs";
import en from "../blocks/fitnote/spec.en.json";
import ko from "../blocks/fitnote/spec.ko.json";
import { Browser, CodeBlock, SpecApp, specNext, Tabs, useI18n, type AppSpec, type JsonUIAction, type SpecPosition } from "ui";

const tabsOf = (lang: "en" | "ko") => [
  { id: "preview", label: "Preview" },
  { id: "runtime", label: "SpecApp" },
  { id: "spec", label: `spec.${lang}.json` },
  { id: "html", label: "app.html" },
];

function Runtime({ spec }: { spec: AppSpec }) {
  const [at, setAt] = useState<SpecPosition>({ screen: spec.start });
  const data = useMemo(() => Object.fromEntries(Object.entries(spec.data ?? {}).map(([key, slot]) => [key, slot.example])), [spec]);
  const act = (action: JsonUIAction, value?: unknown) => setAt((now) => specNext(spec, now, action, value));
  return (
    <Browser address={spec.app.name.toLowerCase()} width={1200} height={720}>
      <SpecApp spec={spec} data={data} screen={at.screen} panel={at.panel} overlay={at.overlay} onAction={act} />
    </Browser>
  );
}

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
      {tab === "runtime" && <Runtime spec={spec as AppSpec} />}
      {tab === "spec" && <CodeBlock code={JSON.stringify(spec, null, 2)} lang="json" />}
      {tab === "html" && <CodeBlock code={html} lang="html" />}
    </div>
  );
}
