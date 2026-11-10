import { useCallback, useState, type ReactNode } from "react";
import { Badge } from "../Badge";
import { Stat } from "../controls";
import { Image, type ImageProps } from "../Image";
import { Icon } from "../Icon";
import { useI18n } from "../i18n";
import { PrintCopy } from "../print";
import type { ResumeContact } from "./Resume";

export type PortfolioProps = { name: string; role?: string; intro?: ReactNode; contacts?: ResumeContact[]; printable?: boolean; children: ReactNode };

export function Portfolio({ name, role, intro, contacts = [], printable = true, children }: PortfolioProps) {
  const { text } = useI18n();
  const [printing, setPrinting] = useState(false);
  const stopPrinting = useCallback(() => setPrinting(false), []);
  return (
    <article className="doc portfolio" data-medium="doc">
      <header className="portfolio-hero">
        <div>
          {role && <p className="portfolio-role">{role}</p>}
          <h1 className="portfolio-name">{name}</h1>
          {intro && <p className="portfolio-intro">{intro}</p>}
          {contacts.length > 0 && (
            <ul className="resume-contacts">
              {contacts.map(({ label, href }) => (
                <li key={label}>{href ? <a href={href}>{label}</a> : label}</li>
              ))}
            </ul>
          )}
        </div>
        {printable && (
          <button type="button" className="doc-print" aria-label={text("print")} title={text("print")} onClick={() => setPrinting(true)}>
            <Icon name="printer" />
          </button>
        )}
      </header>
      <div className="portfolio-body">{children}</div>
      {printing && (
        <PrintCopy kind="doc" medium="doc" onDone={stopPrinting}>
          <Portfolio name={name} role={role} intro={intro} contacts={contacts} printable={false}>
            {children}
          </Portfolio>
        </PrintCopy>
      )}
    </article>
  );
}

export type PortfolioSectionProps = { title: string; children: ReactNode };

export function PortfolioSection({ title, children }: PortfolioSectionProps) {
  return (
    <section className="portfolio-section">
      <h2 className="portfolio-section-title">{title}</h2>
      {children}
    </section>
  );
}

export type ProjectMetric = { label: string; value: string };
export type ProjectProps = { title: string; period?: string; role?: string; image?: ImageProps; summary?: ReactNode; metrics?: ProjectMetric[]; tags?: string[]; children?: ReactNode };

export function Project({ title, period, role, image, summary, metrics = [], tags = [], children }: ProjectProps) {
  return (
    <article className={`project${image ? " has-image" : ""}`}>
      {image && (
        <div className="project-media">
          <Image ratio="4:3" rounded {...image} />
        </div>
      )}
      <div className="project-text">
        <div className="resume-entry-head">
          <h3 className="project-title">{title}</h3>
          {period && <span className="resume-entry-period">{period}</span>}
        </div>
        {role && <p className="resume-entry-org">{role}</p>}
        {summary && <p className="project-summary">{summary}</p>}
        {metrics.length > 0 && (
          <div className="project-metrics">
            {metrics.map(({ label, value }) => (
              <Stat key={label} size="sm" label={label} value={value} />
            ))}
          </div>
        )}
        {children}
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
    </article>
  );
}
