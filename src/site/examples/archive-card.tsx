import { ArchiveCard } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("archive-card");
  return (
    <div style={{ width: "100%", maxWidth: 480 }}>
      <ArchiveCard
        draft
        title={text.title}
        count={text.count}
        sections={[
          { label: text.progress, entries: [{ text: text.p1 }, { text: text.p2 }] },
          { label: text.discussion, entries: [{ text: text.d1 }] },
          { label: text.decision, entries: [{ text: text.c1, meta: text.c1meta }] },
          { label: text.todo, entries: [{ text: text.t1, badge: { tone: "warning", label: text.open } }] },
        ]}
        evidence={text.evidence}
        actions={[
          { id: "archive", label: text.archive, variant: "primary" },
          { id: "edit", label: text.edit },
          { id: "cancel", label: text.cancel },
        ]}
        note={text.note}
      />
    </div>
  );
}
