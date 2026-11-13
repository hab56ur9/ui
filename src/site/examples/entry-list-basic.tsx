import { useState } from "react";
import { EntryList, type EntryItem } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("entry-list-basic");
  const [memos, setMemos] = useState<EntryItem[]>([
    { id: "n1", meta: text.memo1Time, text: text.memo1 },
    { id: "n2", meta: text.memo2Time, text: text.memo2 },
    { id: "n3", meta: text.memo3Time, text: text.memo3, removable: false },
  ]);
  return (
    <div style={{ width: 340, display: "grid", gap: "var(--space-5)" }}>
      <EntryList
        title={text.routines}
        items={[
          { id: "u1", icon: "clock", title: text.daily, meta: text.next1, text: text.routine1 },
          { id: "u2", icon: "clock", title: text.weekly, meta: text.next2, text: text.routine2 },
        ]}
      />
      <EntryList title={text.memos} items={memos} onRemove={(id) => setMemos((current) => current.filter((memo) => memo.id !== id))} empty={text.noMemos} />
      <EntryList title={text.routines} items={[]} empty={text.noRoutines} />
    </div>
  );
}
