import { DocList } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("doc-list-basic");
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <DocList
        items={[
          { id: "D-3", title: text.design, meta: text.designMeta, badge: { tone: "warning", label: text.inReview }, reviewers: [{ name: text.builder, tone: 3, label: text.approved, badge: "good" }, { name: text.qa, tone: 4, label: text.changes, badge: "warning" }], aside: text.designAside },
          { id: "D-2", title: text.policy, meta: text.policyMeta, badge: { tone: "good", label: text.final }, reviewers: [{ name: text.planner, tone: 2, label: text.approved, badge: "good" }], aside: text.policyAside },
          { id: "D-1", title: text.notes, meta: text.notesMeta, aside: text.notesAside },
        ]}
      />
    </div>
  );
}
