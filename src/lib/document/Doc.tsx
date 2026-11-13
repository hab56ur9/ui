import { createContext, useCallback, useContext, useId, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Badge, type BadgeTone } from "../Badge";
import { scrollBehavior } from "../hooks";
import { Icon } from "../Icon";
import { useI18n } from "../i18n";
import { PrintCopy } from "../print";

export type DocStatus = "draft" | "review" | "final";
const STATUS_TONE: Record<DocStatus, BadgeTone> = { draft: "neutral", review: "warning", final: "main" };

export type DocMeta = { status?: DocStatus; authors?: string[]; reviewers?: string[]; date?: string; version?: string };
export type DocProps = { title: ReactNode; summary?: ReactNode; meta?: DocMeta; toc?: boolean; printable?: boolean; children: ReactNode };

type Entry = { id: string; number: string; title: string; level: number };

const DepthContext = createContext(0);

const jump = (e: MouseEvent, selector: string) => {
  e.preventDefault();
  const found = (e.currentTarget as Element).closest(".doc")?.querySelector<HTMLElement>(selector);
  const target = found?.closest<HTMLElement>("tr") ?? found;
  if (!target) return;
  target.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
  target.classList.remove("is-flash");
  void target.offsetWidth;
  target.classList.add("is-flash");
};

export function Doc({ title, summary, meta = {}, toc = true, printable = true, children }: DocProps) {
  const { text } = useI18n();
  const root = useRef<HTMLElement>(null);
  const [outline, setOutline] = useState<Entry[]>([]);
  const [printing, setPrinting] = useState(false);
  const stopPrinting = useCallback(() => setPrinting(false), []);

  useLayoutEffect(() => {
    const counters = [0, 0];
    const headings = [...(root.current?.querySelectorAll<HTMLElement>(".doc-heading") ?? [])];
    setOutline(
      headings.map((heading) => {
        const level = Number(heading.dataset.level);
        counters[level - 1] += 1;
        if (level === 1) counters[1] = 0;
        return { id: heading.id, number: counters.slice(0, level).join("."), title: heading.dataset.title ?? "", level };
      }),
    );
  }, [children]);

  const people = (label: string, names?: string[]) =>
    names?.length ? (
      <>
        <dt>{label}</dt>
        <dd>{names.join(", ")}</dd>
      </>
    ) : null;

  return (
    <article ref={root} className="doc" data-medium="doc">
      <header className="doc-head">
        <div className="doc-head-row">
          {meta.status && STATUS_TONE[meta.status] && (
            <Badge tone={STATUS_TONE[meta.status]} variant={meta.status === "final" ? "solid" : "outline"}>
              {text(`doc.${meta.status}`)}
            </Badge>
          )}
          <span className="toolbar-spacer" />
          {printable && (
            <button type="button" className="doc-print" aria-label={text("print")} title={text("print")} onClick={() => setPrinting(true)}>
              <Icon name="printer" />
            </button>
          )}
        </div>
        <h1 className="doc-title">{title}</h1>
        {summary && <p className="doc-summary">{summary}</p>}
        <dl className="doc-meta">
          {people(text("doc.authors"), meta.authors)}
          {people(text("doc.reviewers"), meta.reviewers)}
          {meta.date && (
            <>
              <dt>{text("doc.date")}</dt>
              <dd>{meta.date}</dd>
            </>
          )}
          {meta.version && (
            <>
              <dt>{text("doc.version")}</dt>
              <dd>{meta.version}</dd>
            </>
          )}
        </dl>
      </header>
      {toc && outline.length > 0 && (
        <nav className="doc-toc" aria-label={text("doc.contents")}>
          <div className="doc-toc-title">{text("doc.contents")}</div>
          <ol>
            {outline.map((entry) => (
              <li key={entry.id} className={`is-level-${entry.level}`}>
                <a href={`#${entry.id}`} onClick={(e) => jump(e, `#${CSS.escape(entry.id)}`)}>
                  <span className="doc-toc-number">{entry.number}</span>
                  {entry.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}
      <div className="doc-body">{children}</div>
      {printing && (
        <PrintCopy kind="doc" medium="doc" onDone={stopPrinting}>
          <Doc title={title} summary={summary} meta={meta} toc={toc} printable={false}>
            {children}
          </Doc>
        </PrintCopy>
      )}
    </article>
  );
}

export type DocSectionProps = { title: string; id?: string; children: ReactNode };

export function DocSection({ title, id, children }: DocSectionProps) {
  const depth = useContext(DepthContext) + 1;
  const auto = useId();
  const anchor = id ?? `doc-${auto.replace(/[^\w-]/g, "")}`;
  const Heading = depth === 1 ? "h2" : "h3";
  return (
    <section className={`doc-section is-level-${depth}`}>
      <Heading className="doc-heading" id={anchor} data-level={Math.min(depth, 2)} data-title={title}>
        {title}
      </Heading>
      <DepthContext.Provider value={depth}>{children}</DepthContext.Provider>
    </section>
  );
}

export function Ref({ to }: { to: string }) {
  return (
    <a className="doc-ref" href={`#${to}`} onClick={(e) => jump(e, `[data-ref="${to}"]`)}>
      {to}
    </a>
  );
}
