import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { color } from "./format";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

export type ImageProps = { alt: string; src?: string; seed?: number; ratio?: "1:1" | "3:4" | "4:3" | "16:9"; fit?: "cover" | "contain"; rounded?: boolean };

export function Image({ alt, src, seed = 1, ratio = "1:1", fit = "cover", rounded }: ImageProps) {
  const style = { "--ratio": ratio.replace(":", " / "), "--from": color((seed % 8) + 1), "--to": color(((seed + 3) % 8) + 1), "--fit": fit } as CSSProperties;
  return (
    <span className={`image${rounded ? " is-rounded" : ""}`} style={style}>
      {src ? (
        <img src={src} alt={alt} loading="lazy" />
      ) : (
        <span className="image-placeholder" role="img" aria-label={alt}>
          <Icon name="image" size="lg" />
        </span>
      )}
    </span>
  );
}

export type ImageCardProps = { image: ImageProps; title: string; description?: string; meta?: string; badge?: string; onSelect?: () => void };

export function ImageCard({ image, title, description, meta, badge, onSelect }: ImageCardProps) {
  const body = (
    <>
      <span className="image-card-media">
        <Image ratio="4:3" {...image} />
        {badge && <span className="image-card-badge">{badge}</span>}
      </span>
      <span className="image-card-text">
        <strong>{title}</strong>
        {description && <span>{description}</span>}
        {meta && <span className="image-card-meta">{meta}</span>}
      </span>
    </>
  );
  if (!onSelect) return <article className="image-card">{body}</article>;
  return (
    <button type="button" className="image-card" onClick={onSelect}>
      {body}
    </button>
  );
}

export type MiniCardProps = { image: ImageProps; title: string; meta?: string; onSelect?: () => void };

export function MiniCard({ image, title, meta, onSelect }: MiniCardProps) {
  const body = (
    <>
      <Image ratio="1:1" rounded {...image} />
      <span className="mini-card-text">
        <strong>{title}</strong>
        {meta && <span>{meta}</span>}
      </span>
    </>
  );
  if (!onSelect) return <article className="mini-card">{body}</article>;
  return (
    <button type="button" className="mini-card" onClick={onSelect}>
      {body}
    </button>
  );
}

export type CarouselProps = { children: ReactNode; label?: string; size?: "full" | "card" | "mini"; peek?: boolean };

export function Carousel({ children, label, size = "full", peek = true }: CarouselProps) {
  const { text } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [atEnd, setAtEnd] = useState(false);
  const slides = [children].flat(Infinity).filter(Boolean) as ReactNode[];
  const go = (next: number) => {
    const target = Math.max(0, Math.min(slides.length - 1, next));
    track.current?.children[target]?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "start" });
  };
  const onScroll = () => {
    const el = track.current;
    if (!el?.firstElementChild) return;
    setIndex(Math.round(el.scrollLeft / (el.firstElementChild as HTMLElement).offsetWidth));
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
  };
  const full = size === "full";
  return (
    <section className={`carousel is-${size}${peek ? " is-peek" : ""}`} aria-roledescription="carousel" aria-label={label}>
      <div ref={track} className="carousel-track" onScroll={onScroll}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide" role="group" aria-roledescription="slide" aria-label={`${i + 1} / ${slides.length}`}>
            {slide}
          </div>
        ))}
      </div>
      <div className="carousel-controls">
        <button type="button" className="carousel-nav" aria-label={text("previous")} title={text("previous")} disabled={index === 0} onClick={() => go(index - 1)}>
          <Icon name="chevron-left" />
        </button>
        {full && (
          <span className="carousel-dots" aria-hidden="true">
            {slides.map((_, i) => (
              <span key={i} className={i === index ? "is-current" : undefined} />
            ))}
          </span>
        )}
        <button type="button" className="carousel-nav" aria-label={text("next")} title={text("next")} disabled={atEnd || index === slides.length - 1} onClick={() => go(index + 1)}>
          <Icon name="chevron-right" />
        </button>
      </div>
    </section>
  );
}
