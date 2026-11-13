import { Badge, Kanban, KanbanHeads, Lane } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("lane-basic");
  const columns = (cards: Record<string, { id: string; title: string }[]>) => [
    { id: "todo", title: text.todo, cards: cards.todo ?? [] },
    { id: "doing", title: text.doing, dot: "busy" as const, cards: cards.doing ?? [] },
    { id: "done", title: text.done, dot: "good" as const, cards: cards.done ?? [] },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", width: "100%" }}>
      <KanbanHeads
        columns={[
          { id: "todo", title: text.todo, count: 2 },
          { id: "doing", title: text.doing, dot: "busy", count: 1 },
          { id: "done", title: text.done, dot: "good", count: 2 },
        ]}
      />
      <Lane title={text.extract} value={2} max={3} meta={[text.extractDone, text.planner, text.due]} badge={<Badge tone="main">{text.active}</Badge>}>
        <Kanban lane heads={false} columns={columns({ todo: [{ id: "T-3", title: text.tree }], doing: [{ id: "T-2", title: text.cards }], done: [{ id: "T-1", title: text.panel }] })} />
      </Lane>
      <Lane title={text.loose} meta={[text.looseCount]}>
        <Kanban lane heads={false} columns={columns({ todo: [{ id: "T-5", title: text.icons }], done: [{ id: "T-4", title: text.fonts }] })} />
      </Lane>
    </div>
  );
}
