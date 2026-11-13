import { useState, type CSSProperties, type DragEvent } from "react";
import { Segmented } from "./controls";
import { PresenceAvatar, type Face, type Presence } from "./chat";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

export type KanbanCard = {
  id: string;
  title: string;
  key?: string;
  assignee?: Face | null;
  unassigned?: string;
  tags?: string[];
  replies?: number | null;
  meta?: string;
  working?: boolean;
};

export type KanbanColumn = { id: string; title: string; dot?: Presence; empty?: string; cards: KanbanCard[] };

export type KanbanProps = {
  columns: KanbanColumn[];
  value?: string | null;
  heads?: boolean;
  lane?: boolean;
  addLabel?: string;
  onSelect?: (id: string) => void;
  onMove?: (id: string, column: string) => void;
  onAdd?: (column: string) => void;
  switcher?: boolean;
  column?: string;
  defaultColumn?: string;
  onColumnChange?: (column: string) => void;
};

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

export function Kanban({ columns, value, heads = true, lane = false, addLabel, onSelect, onMove, onAdd, switcher = false, column: current, defaultColumn, onColumnChange }: KanbanProps) {
  const { text } = useI18n();
  const [over, setOver] = useState<string | null>(null);
  const [own, setOwn] = useState(defaultColumn ?? columns[0]?.id);
  const shown = current ?? own;
  const pick = (id: string) => {
    setOwn(id);
    onColumnChange?.(id);
  };
  const add = addLabel ?? text("kanban.add");
  const drop = (column: string) => (event: DragEvent) => {
    event.preventDefault();
    setOver(null);
    const id = event.dataTransfer.getData("text/plain");
    if (id) onMove?.(id, column);
  };
  const board = (
    <div className={cx("kanban", lane && "is-lane")} style={{ "--kanban-columns": columns.length } as CSSProperties}>
      {columns.map((column) => (
        <section
          key={column.id}
          className={cx("kanban-column", over === column.id && "is-over", switcher && shown === column.id && "is-shown")}
          onDragOver={(event) => { event.preventDefault(); setOver(column.id); }}
          onDragLeave={() => setOver((current) => (current === column.id ? null : current))}
          onDrop={drop(column.id)}
        >
          {heads && (
            <div className="kanban-head">
              {column.dot && <span className={`presence-dot is-${column.dot}`} aria-hidden />}
              <span className="kanban-title">{column.title}</span>
              <span className="kanban-count">{column.cards.length}</span>
              {onAdd && <button type="button" className="kanban-add" aria-label={`${column.title} ${add}`} title={add} onClick={() => onAdd(column.id)}><Icon name="plus" size="sm" /></button>}
            </div>
          )}
          <div className="kanban-cards">
            {column.cards.map((card) => (
              <button
                key={card.id}
                type="button"
                draggable={Boolean(onMove)}
                onDragStart={(event) => event.dataTransfer.setData("text/plain", card.id)}
                className={cx("kanban-card", value === card.id && "is-selected", card.working && "is-working")}
                onClick={() => onSelect?.(card.id)}
              >
                {card.key && <span className="kanban-key">{card.key}</span>}
                <span className="kanban-card-title">{card.title}</span>
                <span className="kanban-meta">
                  {card.assignee ? <span className="kanban-who"><PresenceAvatar {...card.assignee} size="xs" />{card.assignee.name}</span> : <span className="kanban-who">{card.unassigned}</span>}
                  {(card.tags ?? []).map((tag) => <span key={tag} className="chat-chip">{tag}</span>)}
                  {card.replies != null && <span className="kanban-replies"><Icon name="message" size="sm" />{card.replies}</span>}
                  {card.meta && <span className="kanban-time">{card.meta}</span>}
                </span>
              </button>
            ))}
            {column.cards.length === 0 && column.empty && <div className="kanban-empty">{column.empty}</div>}
          </div>
        </section>
      ))}
    </div>
  );
  if (!switcher) return board;
  return (
    <div className="kanban-board">
      <div className="kanban-switch">
        <Segmented label={text("kanban.columns")} value={shown} onChange={pick} options={columns.map((column) => ({ value: column.id, label: `${column.title} ${column.cards.length}` }))} />
      </div>
      {board}
    </div>
  );
}

export function KanbanHeads({ columns }: { columns: { id: string; title: string; dot?: Presence; count: number }[] }) {
  return (
    <div className="kanban-heads" style={{ "--kanban-columns": columns.length } as CSSProperties}>
      {columns.map((column) => (
        <span key={column.id}>
          {column.dot && <span className={`presence-dot is-${column.dot}`} aria-hidden />}
          <strong>{column.title}</strong>
          <em>{column.count}</em>
        </span>
      ))}
    </div>
  );
}

