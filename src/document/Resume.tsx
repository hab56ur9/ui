import { useCallback, useState, type ReactNode } from "react";
import { Badge } from "../Badge";
import { Icon } from "../Icon";
import { useI18n } from "../i18n";
import { PrintCopy } from "../print";

export type ResumeContact = { label: string; href?: string };
export type ResumeProps = { name: string; role?: string; contacts?: ResumeContact[]; summary?: ReactNode; printable?: boolean; children: ReactNode };

export function Resume({ name, role, contacts = [], summary, printable = true, children }: ResumeProps) {
  const { text } = useI18n();
  const [printing, setPrinting] = useState(false);
  const stopPrinting = useCallback(() => setPrinting(false), []);
  return (
    <article className="doc resume" data-medium="doc">
      <header className="resume-head">
        <div className="resume-name">
          <h1 className="doc-title">{name}</h1>
          {role && <p className="resume-role">{role}</p>}
        </div>
        {printable && (
          <button type="button" className="doc-print" aria-label={text("print")} title={text("print")} onClick={() => setPrinting(true)}>
            <Icon name="printer" />
          </button>
        )}
        {contacts.length > 0 && (
          <ul className="resume-contacts">
            {contacts.map(({ label, href }) => (
              <li key={label}>{href ? <a href={href}>{label}</a> : label}</li>
            ))}
          </ul>
        )}
        {summary && <p className="resume-summary">{summary}</p>}
      </header>
      <div className="resume-body">{children}</div>
      {printing && (
        <PrintCopy kind="doc" medium="doc" onDone={stopPrinting}>
          <Resume name={name} role={role} contacts={contacts} summary={summary} printable={false}>
            {children}
          </Resume>
        </PrintCopy>
      )}
    </article>
  );
}

export type ResumeSectionProps = { title: string; children: ReactNode };

export function ResumeSection({ title, children }: ResumeSectionProps) {
  return (
    <section className="resume-section">
      <h2 className="resume-section-title">{title}</h2>
      <div className="resume-section-body">{children}</div>
    </section>
  );
}

export type ResumeEntryProps = { title?: string; org?: string; period?: string; place?: string; items?: ReactNode[]; tags?: string[]; children?: ReactNode };

export function ResumeEntry({ title, org, period, place, items = [], tags = [], children }: ResumeEntryProps) {
  return (
    <div className="resume-entry">
      {(title || period) && (
        <div className="resume-entry-head">
          <div>
            {title && <h3 className="resume-entry-title">{title}</h3>}
            {(org || place) && <p className="resume-entry-org">{[org, place].filter(Boolean).join(" · ")}</p>}
          </div>
          {period && <span className="resume-entry-period">{period}</span>}
        </div>
      )}
      {children}
      {items.length > 0 && (
        <ul className="resume-entry-items">
          {items.map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
      {tags.length > 0 && (
        <ul className="resume-tags">
          {tags.map((tag) => (
            <li key={tag}>
              <Badge>{tag}</Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
