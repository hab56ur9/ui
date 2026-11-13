import { useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type SyntheticEvent } from "react";
import { clamp } from "./charts/scale";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

export type CompareImage = { src: string; alt: string; label?: string };

export type ImageCompareProps = {
  before: CompareImage;
  after: CompareImage;
  value?: number;
  ratio?: "1:1" | "3:4" | "4:3" | "16:9";
  fit?: "contain" | "cover";
  label?: string;
  onChange?: (value: number) => void;
};

const keySteps: Record<string, number> = { ArrowLeft: -1, ArrowDown: -1, ArrowRight: 1, ArrowUp: 1, PageDown: -10, PageUp: 10 };

export function ImageCompare({ before, after, value = 50, ratio, fit = "contain", label, onChange }: ImageCompareProps) {
  const { text } = useI18n();
  const [position, setPosition] = useState(clamp(value, 0, 100));
  const [natural, setNatural] = useState<string>();
  const [dragging, setDragging] = useState(false);
  const move = (next: number) => {
    const settled = Math.round(clamp(next, 0, 100) * 10) / 10;
    if (settled === position) return;
    setPosition(settled);
    onChange?.(settled);
  };
  const follow = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    move(((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100);
  };
  const press = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setDragging(true);
    follow(event);
  };
  const keys = (event: KeyboardEvent<HTMLDivElement>) => {
    const ends: Record<string, number> = { Home: 0, End: 100 };
    const step = keySteps[event.key];
    if (step === undefined && !(event.key in ends)) return;
    event.preventDefault();
    move(event.key in ends ? ends[event.key] : position + step * (event.shiftKey ? 10 : 1));
  };
  const measure = (event: SyntheticEvent<HTMLImageElement>) => {
    const image = event.currentTarget;
    if (image.naturalWidth && image.naturalHeight) setNatural(`${image.naturalWidth} / ${image.naturalHeight}`);
  };
  const style = { "--ratio": ratio ? ratio.replace(":", " / ") : (natural ?? "16 / 9"), "--fit": fit, "--at": `${position}%` } as CSSProperties;
  return (
    <div
      className={dragging ? "image-compare is-dragging" : "image-compare"}
      style={style}
      onPointerDown={press}
      onPointerMove={(event) => dragging && follow(event)}
      onPointerUp={() => setDragging(false)}
      onPointerCancel={() => setDragging(false)}
    >
      <img src={before.src} alt={before.alt} draggable={false} onLoad={measure} />
      <div className="image-compare-after">
        <img src={after.src} alt={after.alt} draggable={false} />
      </div>
      {before.label && <span className="image-compare-label is-before">{before.label}</span>}
      {after.label && <span className="image-compare-label is-after">{after.label}</span>}
      <div
        className="image-compare-handle"
        role="slider"
        tabIndex={0}
        aria-label={label ?? text("compare.handle")}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={position}
        aria-valuetext={`${Math.round(position)}%`}
        onKeyDown={keys}
      >
        <span className="image-compare-knob">
          <Icon name="chevron-left" size="sm" />
          <Icon name="chevron-right" size="sm" />
        </span>
      </div>
    </div>
  );
}
