import { QueueList } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("queue-list-basic");
  return (
    <div style={{ width: 300, border: "var(--border-width-default) solid var(--color-border-default)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-bg-raised)" }}>
      <QueueList
        title={text.title}
        items={[
          { id: "q1", from: text.planner, tone: 2, where: text.board, text: text.first, active: true },
          { id: "q2", from: text.qa, tone: 4, where: text.repo, text: text.second, waiting: true },
          { id: "q3", from: text.builder, tone: 3, where: text.repo, text: text.third },
        ]}
      />
      <QueueList title={text.later} items={[]} empty={text.empty} />
    </div>
  );
}
