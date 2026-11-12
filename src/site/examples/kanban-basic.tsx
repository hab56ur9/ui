import { useState } from "react";
import { Kanban, type KanbanCard } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("kanban-basic");
  const [cards, setCards] = useState<(KanbanCard & { column: string })[]>([
    { id: "T-4", key: "T-4", column: "todo", title: text.copy, unassigned: text.unassigned, tags: ["☑ 0/3"], meta: "09:40" },
    { id: "T-3", key: "T-3", column: "doing", title: text.query, assignee: { name: text.jun, tone: 5, state: "busy" }, tags: ["☑ 1/4"], replies: 3, meta: "09:31", working: true },
    { id: "T-2", key: "T-2", column: "review", title: text.chart, assignee: { name: text.mina, tone: 2, state: "good" }, tags: ["☑ 3/3"], replies: 5, meta: "09:12" },
    { id: "T-1", key: "T-1", column: "done", title: text.index, assignee: { name: text.jun, tone: 5, state: "good" }, tags: ["☑ 2/2"], replies: 2, meta: text.yesterday },
  ]);
  const columns = [
    { id: "todo", title: text.todo, empty: text.empty },
    { id: "doing", title: text.doing, dot: "busy" as const, empty: text.empty },
    { id: "review", title: text.review, dot: "warning" as const, empty: text.empty },
    { id: "done", title: text.done, dot: "good" as const, empty: text.empty },
  ].map((column) => ({ ...column, cards: cards.filter((card) => card.column === column.id) }));
  return <Kanban columns={columns} onMove={(id: string, column: string) => setCards((list) => list.map((card) => (card.id === id ? { ...card, column } : card)))} onAdd={() => undefined} />;
}
