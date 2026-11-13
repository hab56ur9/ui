import { useState } from "react";
import { ActivityList } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("activity-list-basic");
  const [value, setValue] = useState("a2");
  return (
    <div style={{ width: "100%", maxWidth: 480, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" }}>
      <ActivityList
        value={value}
        onSelect={setValue}
        items={[
          { id: "a1", kind: "mention", author: text.planner, tone: 2, title: text.planner, where: text.board, time: "14:05", text: text.mentionText, unread: true },
          { id: "a2", kind: "approval", author: text.builder, tone: 3, title: text.builder, where: text.repo, time: "13:40", text: text.approvalText },
          { id: "a3", kind: "failure", author: text.qa, tone: 4, title: text.qa, where: text.repo, time: "12:12", text: text.failureText },
        ]}
      />
    </div>
  );
}
