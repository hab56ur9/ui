import { ArchivedLine } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("archived-line");
  return (
    <div style={{ display: "grid", gap: 8, width: "100%", maxWidth: 720 }}>
      <ArchivedLine title={text.title} summary={text.summary} meta={text.meta} onOpen={() => {}} />
      <ArchivedLine title={text.day} summary={text.daySummary} meta={text.dayMeta} onOpen={() => {}} onRestore={() => {}} />
    </div>
  );
}
