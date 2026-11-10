import { useEffect, useState, type MouseEvent, type ReactNode } from "react";
import { useI18n } from "./i18n";

export type TocItem = { id: string; label: ReactNode };
export type TocProps = { items: TocItem[]; title?: string; current?: string; offset?: number; onSelect?: (id: string) => void };

export function Toc({ items, title, current, offset = 96, onSelect }: TocProps) {
  const { text } = useI18n();
  const [active, setActive] = useState(items[0]?.id);
  const ids = items.map((item) => item.id).join();

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const passed = items.filter((item) => (document.getElementById(item.id)?.getBoundingClientRect().top ?? Infinity) <= offset);
        setActive(passed.at(-1)?.id ?? items[0]?.id);
      });
    };
    measure();
    addEventListener("scroll", measure, { capture: true, passive: true });
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", measure, { capture: true });
    };
  }, [ids, offset]);

  const pick = (e: MouseEvent, id: string) => {
    e.preventDefault();
    if (onSelect) onSelect(id);
    if (!onSelect) document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };
  const selected = current ?? active;
  const name = title ?? text("onThisPage");

  return (
    <nav className="toc" aria-label={name}>
      <div className="toc-title">{name}</div>
      {items.map((item) => (
        <a key={item.id} href={`#${item.id}`} className="toc-link" title={typeof item.label === "string" ? item.label : undefined} aria-current={item.id === selected ? "location" : undefined} onClick={(e) => pick(e, item.id)}>
          {item.label}
        </a>
      ))}
    </nav>
  );
}

export type PagerLink = { label: ReactNode; href?: string; onSelect?: () => void };
export type PagerProps = { previous?: PagerLink; next?: PagerLink; label?: string };

function PagerItem({ link, caption, next }: { link: PagerLink; caption: string; next?: boolean }) {
  const body = (
    <>
      <small>{caption}</small>
      <span title={typeof link.label === "string" ? link.label : undefined}>{link.label}</span>
    </>
  );
  const className = `pager-link${next ? " is-next" : ""}`;
  if (link.href) {
    return (
      <a className={className} href={link.href} onClick={link.onSelect}>
        {body}
      </a>
    );
  }
  return (
    <button type="button" className={className} onClick={link.onSelect}>
      {body}
    </button>
  );
}

export function Pager({ previous, next, label }: PagerProps) {
  const { text } = useI18n();
  return (
    <nav className="pager" aria-label={label ?? text("pages")}>
      {previous && <PagerItem link={previous} caption={text("previous")} />}
      {next && <PagerItem link={next} caption={text("next")} next />}
    </nav>
  );
}
