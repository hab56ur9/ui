import { Children, createContext, useCallback, useContext, useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { useSize } from "../hooks";
import { Icon } from "../Icon";
import { useI18n } from "../i18n";
import { PrintCopy } from "../print";

const WIDTH = 1920;
const HEIGHT = 1080;

type SlideContextValue = { index: number; total: number; title?: string };
const SlideContext = createContext<SlideContextValue>({ index: 0, total: 1 });

export type DeckProps = { title?: string; start?: number; controls?: boolean; children: ReactNode };

const NEXT = ["ArrowRight", "ArrowDown", "PageDown", " "];
const PREVIOUS = ["ArrowLeft", "ArrowUp", "PageUp"];

function Pages({ slides, title, current }: { slides: ReactNode[]; title?: string; current?: number }) {
  return slides.map((slide, index) => (
    <div key={index} className={`deck-page${index === current ? " is-current" : ""}`}>
      <SlideContext.Provider value={{ index, total: slides.length, title }}>{slide}</SlideContext.Provider>
    </div>
  ));
}

export function Deck({ title, start = 0, controls = true, children }: DeckProps) {
  const { text } = useI18n();
  const slides = Children.toArray(children);
  const last = slides.length - 1;
  const [index, setIndex] = useState(Math.min(start, last));
  const [full, setFull] = useState(false);
  const [notes, setNotes] = useState(false);
  const [printing, setPrinting] = useState(false);
  const stopPrinting = useCallback(() => setPrinting(false), []);
  const root = useRef<HTMLDivElement>(null);
  const [stage, size] = useSize<HTMLDivElement>();
  const scale = size.width ? Math.min(size.width / WIDTH, (size.height || Infinity) / HEIGHT) : 0;
  const offset = { x: (size.width - WIDTH * scale) / 2, y: ((size.height || HEIGHT * scale) - HEIGHT * scale) / 2 };
  const clamp = (next: number) => Math.max(0, Math.min(last, next));
  const go = (next: number) => setIndex(clamp(next));
  const step = (delta: number) => setIndex((current) => clamp(current + delta));

  useEffect(() => {
    const onChange = () => setFull(document.fullscreenElement === root.current);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  useLayoutEffect(() => {
    if (index > last) setIndex(last);
  }, [index, last]);

  const present = () => (full ? document.exitFullscreen() : root.current?.requestFullscreen());
  const onKey = (e: KeyboardEvent) => {
    if (NEXT.includes(e.key)) step(1);
    if (PREVIOUS.includes(e.key)) step(-1);
    if (e.key === "Home") go(0);
    if (e.key === "End") go(last);
    if (e.key === "f") present();
    if ([...NEXT, ...PREVIOUS, "Home", "End"].includes(e.key)) e.preventDefault();
  };
  const current = slides[index] as { props?: { notes?: string } } | undefined;

  return (
    <div ref={root} className={`deck${full ? " is-full" : ""}`} tabIndex={0} role="region" aria-roledescription="slides" aria-label={title} onKeyDown={onKey}>
      <div ref={stage} className="deck-stage">
        <div className="deck-viewport" data-medium="slide" style={{ transform: `translate(${offset.x}px, ${offset.y}px) scale(${scale})` } as CSSProperties} aria-live="polite">
          <Pages slides={slides} title={title} current={index} />
        </div>
      </div>
      {controls && (
        <div className="deck-controls">
          <button type="button" className="deck-button" aria-label={text("previousSlide")} title={text("previousSlide")} disabled={index === 0} onClick={() => step(-1)}>
            <Icon name="chevron-left" />
          </button>
          <span className="deck-count">{text("slideOf", { n: index + 1, total: slides.length })}</span>
          <button type="button" className="deck-button" aria-label={text("nextSlide")} title={text("nextSlide")} disabled={index === last} onClick={() => step(1)}>
            <Icon name="chevron-right" />
          </button>
          <span className="toolbar-spacer" />
          {current?.props?.notes && (
            <button type="button" className="deck-button is-text" aria-pressed={notes} onClick={() => setNotes(!notes)}>
              {text("notes")}
            </button>
          )}
          <button type="button" className="deck-button" aria-label={text("print")} title={text("print")} onClick={() => setPrinting(true)}>
            <Icon name="printer" />
          </button>
          <button type="button" className="deck-button" aria-label={text(full ? "exitPresent" : "present")} title={text(full ? "exitPresent" : "present")} onClick={present}>
            <Icon name={full ? "close" : "expand"} />
          </button>
        </div>
      )}
      {notes && current?.props?.notes && <p className="deck-notes">{current.props.notes}</p>}
      {printing && (
        <PrintCopy kind="deck" medium="slide" onDone={stopPrinting}>
          <Pages slides={slides} title={title} />
        </PrintCopy>
      )}
    </div>
  );
}

export type SlideTone = "plain" | "dark" | "accent";
export type SlideProps = { tone?: SlideTone; source?: ReactNode; footer?: boolean; notes?: string; className?: string; children: ReactNode };

export function Slide({ tone = "plain", source, footer = true, className, children }: SlideProps) {
  const { index, total } = useContext(SlideContext);
  return (
    <section className={["slide", `is-${tone}`, className ?? ""].filter(Boolean).join(" ")} data-theme={tone === "dark" ? "dark" : undefined} aria-label={`${index + 1} / ${total}`}>
      <div className="slide-body">{children}</div>
      {footer && <SlideFooter source={source} />}
    </section>
  );
}

export type SlideHeaderProps = { kicker?: ReactNode; title: ReactNode; subtitle?: ReactNode };

export function SlideHeader({ kicker, title, subtitle }: SlideHeaderProps) {
  return (
    <header className="slide-head">
      {kicker && <div className="slide-kicker">{kicker}</div>}
      <h2 className="slide-title">{title}</h2>
      {subtitle && <p className="slide-subtitle">{subtitle}</p>}
    </header>
  );
}

export function SlideFooter({ source }: { source?: ReactNode }) {
  const { index, total, title } = useContext(SlideContext);
  return (
    <footer className="slide-foot">
      <span className="slide-source">{source}</span>
      <span className="toolbar-spacer" />
      {title && <span>{title}</span>}
      <span className="slide-number">{`${index + 1} / ${total}`}</span>
    </footer>
  );
}
