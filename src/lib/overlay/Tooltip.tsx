import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type PointerEvent, type FocusEvent, type ReactElement } from "react";

export type TooltipProps = {
  label: string;
  children: ReactElement<{ "aria-describedby"?: string }>;
};

const HOVER_DELAY = 200;
const EDGE = 8;
const GAP = 6;

const isTouch = (event: PointerEvent) => event.pointerType === "touch";
const isKeyboardFocus = (event: FocusEvent) => event.target instanceof Element && event.target.matches(":focus-visible");

function place(tip: HTMLElement, target: DOMRect) {
  const center = target.left + target.width / 2;
  const left = Math.min(Math.max(center - tip.offsetWidth / 2, EDGE), window.innerWidth - EDGE - tip.offsetWidth);
  const above = target.top - GAP - tip.offsetHeight;
  const fitsAbove = above >= EDGE;
  tip.style.left = `${left}px`;
  tip.style.top = `${fitsAbove ? above : target.bottom + GAP}px`;
  tip.style.setProperty("--tooltip-arrow", `${center - left}px`);
  tip.dataset.side = fitsAbove ? "above" : "below";
}

export function Tooltip({ label, children }: TooltipProps) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const tip = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const [open, setOpen] = useState(false);

  const show = (delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setOpen(true), delay);
  };
  const hide = () => {
    window.clearTimeout(timer.current);
    setOpen(false);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    const node = tip.current;
    const target = anchor.current?.firstElementChild;
    if (!open || !node || !target) return;
    node.showPopover();
    place(node, target.getBoundingClientRect());
    const close = () => setOpen(false);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    document.addEventListener("keydown", onKey);
    return () => {
      if (node.matches(":popover-open")) node.hidePopover();
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <span
      ref={anchor}
      className="tooltip-anchor"
      onPointerEnter={(event) => {
        if (!isTouch(event)) show(HOVER_DELAY);
      }}
      onPointerLeave={hide}
      onFocus={(event) => {
        if (isKeyboardFocus(event)) show(0);
      }}
      onBlur={hide}
    >
      {cloneElement(children, { "aria-describedby": id })}
      <div id={id} ref={tip} className="tooltip" role="tooltip" popover="manual">
        <span className="tooltip-text">{label}</span>
      </div>
    </span>
  );
}
