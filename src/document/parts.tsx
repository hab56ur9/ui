import type { ReactNode } from "react";
import { useI18n } from "../i18n";

export type Priority = "must" | "should" | "could";
export type Requirement = { text: ReactNode; priority: Priority; status?: "open" | "done" | "dropped"; note?: ReactNode };

export function RequirementTable({ items, prefix = "R" }: { items: Requirement[]; prefix?: string }) {
  const { text } = useI18n();
  return (
    <div className="doc-table-wrap">
      <table className="data-table doc-table">
        <thead>
          <tr>
            <th>{text("doc.id")}</th>
            <th>{text("doc.requirement")}</th>
            <th>{text("doc.priority")}</th>
            <th>{text("doc.state")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const id = `${prefix}${i + 1}`;
            return (
              <tr key={id} data-ref={id}>
                <td className="doc-id">{id}</td>
                <td>
                  {item.text}
                  {item.note && <div className="doc-note">{item.note}</div>}
                </td>
                <td>
                  <span className={`doc-priority is-${item.priority}`}>{text(`doc.${item.priority}`)}</span>
                </td>
                <td>{text(`doc.${item.status ?? "open"}`)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export type Option = { name: string; summary?: ReactNode; pros: string[]; cons: string[]; chosen?: boolean };

export function Options({ items }: { items: Option[] }) {
  const { text } = useI18n();
  return (
    <div className="doc-options" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
      {items.map((item) => (
        <div key={item.name} className={`doc-option${item.chosen ? " is-chosen" : ""}`}>
          <div className="doc-option-head">
            <strong>{item.name}</strong>
            {item.chosen && <span className="doc-option-badge">{text("doc.chosen")}</span>}
          </div>
          {item.summary && <p className="doc-option-summary">{item.summary}</p>}
          <div className="doc-option-label">{text("doc.pros")}</div>
          <ul>
            {item.pros.map((pro) => (
              <li key={pro}>{pro}</li>
            ))}
          </ul>
          <div className="doc-option-label">{text("doc.cons")}</div>
          <ul>
            {item.cons.map((con) => (
              <li key={con}>{con}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export function Figure({ caption, kind = "figure", height, children }: { caption: ReactNode; kind?: "figure" | "table"; height?: number; children: ReactNode }) {
  return (
    <figure className={`doc-figure is-${kind}`}>
      {kind === "table" && <figcaption>{caption}</figcaption>}
      <div className="doc-figure-body" style={height ? { height } : undefined}>
        {children}
      </div>
      {kind === "figure" && <figcaption>{caption}</figcaption>}
    </figure>
  );
}

export type Change = { version: string; date: string; author: string; note: ReactNode };

export function ChangeLog({ items }: { items: Change[] }) {
  const { text } = useI18n();
  return (
    <div className="doc-table-wrap">
      <table className="data-table doc-table">
        <thead>
          <tr>
            <th>{text("doc.version")}</th>
            <th>{text("doc.date")}</th>
            <th>{text("doc.author")}</th>
            <th>{text("doc.change")}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.version}>
              <td className="doc-id">{item.version}</td>
              <td>{item.date}</td>
              <td>{item.author}</td>
              <td>{item.note}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
