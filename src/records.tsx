import type { ReactNode } from "react";
import { Badge } from "./Badge";
import { Card } from "./Card";
import { DataTable } from "./DataTable";
import { useI18n } from "./i18n";

export type Priority = "must" | "should" | "could";
export type Requirement = { text: ReactNode; priority: Priority; status?: "open" | "done" | "dropped"; note?: ReactNode };

export function RequirementTable({ items, prefix = "R" }: { items: Requirement[]; prefix?: string }) {
  const { text } = useI18n();
  return (
    <DataTable
      fit
      columns={[{ label: text("doc.id") }, { label: text("doc.requirement"), wrap: true }, { label: text("doc.priority") }, { label: text("doc.state") }]}
      rows={items.map((item, i) => [
        { text: `${prefix}${i + 1}`, className: "record-id" },
        {
          content: (
            <>
              {item.text}
              {item.note && <div className="record-note">{item.note}</div>}
            </>
          ),
        },
        { text: text(`doc.${item.priority}`), className: `priority is-${item.priority}` },
        text(`doc.${item.status ?? "open"}`),
      ])}
    />
  );
}

export type Option = { name: string; summary?: ReactNode; pros: string[]; cons: string[]; chosen?: boolean };

export function Options({ items }: { items: Option[] }) {
  const { text } = useI18n();
  return (
    <div className="options" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => (
        <Card
          key={item.name}
          title={item.name}
          aside={
            item.chosen && (
              <Badge tone="main" variant="solid">
                {text("doc.chosen")}
              </Badge>
            )
          }
          description={item.summary}
          selected={item.chosen}
        >
          <div className="options-label">{text("doc.pros")}</div>
          <ul>
            {item.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
          <div className="options-label">{text("doc.cons")}</div>
          <ul>
            {item.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}

export type Change = { version: string; date: string; author: string; note: ReactNode };

export function ChangeLog({ items }: { items: Change[] }) {
  const { text } = useI18n();
  return <DataTable fit columns={[{ label: text("doc.version") }, { label: text("doc.date") }, { label: text("doc.author") }, { label: text("doc.change"), wrap: true }]} rows={items.map((item) => [{ text: item.version, className: "record-id" }, item.date, item.author, { content: item.note }])} />;
}
