import { Children, isValidElement, type ReactNode } from "react";
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

export type OptionProps = { name: ReactNode; chosen?: boolean; children?: ReactNode };

export function Option({ name, chosen = false, children }: OptionProps) {
  const { text } = useI18n();
  return (
    <Card
      title={name}
      aside={
        chosen && (
          <Badge tone="main" variant="solid">
            {text("doc.chosen")}
          </Badge>
        )
      }
      selected={chosen}
    >
      {children}
    </Card>
  );
}

function Points({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="option-points">
      <div className="options-label">{label}</div>
      <ul>{Children.map(children, (child) => (child === null || child === undefined || child === false ? null : isValidElement(child) && child.type === "li" ? child : <li>{child}</li>))}</ul>
    </div>
  );
}

export function Pros({ children }: { children?: ReactNode }) {
  const { text } = useI18n();
  return <Points label={text("doc.pros")}>{children}</Points>;
}

export function Cons({ children }: { children?: ReactNode }) {
  const { text } = useI18n();
  return <Points label={text("doc.cons")}>{children}</Points>;
}

export function Options({ children }: { children?: ReactNode }) {
  return (
    <div className="options" style={{ gridTemplateColumns: `repeat(${Children.count(children)}, minmax(0, 1fr))` }}>
      {children}
    </div>
  );
}

export type Change = { version: string; date: string; author: string; note: ReactNode };

export function ChangeLog({ items }: { items: Change[] }) {
  const { text } = useI18n();
  return (
    <DataTable
      fit
      columns={[{ label: text("doc.version") }, { label: text("doc.date") }, { label: text("doc.author") }, { label: text("doc.change"), wrap: true }]}
      rows={items.map((item) => [{ text: item.version, className: "record-id" }, item.date, item.author, { content: item.note }])}
    />
  );
}
