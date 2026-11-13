import { cloneElement, useEffect, useId, useLayoutEffect, useRef, useState, type FocusEvent, type PointerEvent, type ReactElement, type ReactNode } from "react";
import { fold, motion, settle, unfold } from "../motion";

type TriggerProps = {
  "aria-describedby"?: string;
  "aria-controls"?: string;
  "aria-expanded"?: boolean;
  "aria-haspopup"?: "dialog";
  onClick?: (event: unknown) => void;
};

export type PopoverProps = {
  content: ReactNode;
  title?: string;
  trigger?: "hover" | "click";
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactElement<TriggerProps>;
};

const OPEN_DELAY = 200;
const CLOSE_DELAY = 150;
const EDGE = 8;
const GAP = 6;

const isTouch = (event: PointerEvent) => event.pointerType === "touch";
const isKeyboardFocus = (event: FocusEvent) => event.target instanceof Element && event.target.matches(":focus-visible");
const leavesAnchor = (event: FocusEvent) => event.relatedTarget instanceof Node && !event.currentTarget.contains(event.relatedTarget);

function place(panel: HTMLElement, target: DOMRect) {
  const left = Math.min(Math.max(target.left, EDGE), window.innerWidth - EDGE - panel.offsetWidth);
  const below = target.bottom + GAP;
  const fitsBelow = below + panel.offsetHeight <= window.innerHeight - EDGE;
  const above = Math.max(target.top - GAP - panel.offsetHeight, EDGE);
  panel.style.left = `${left}px`;
  panel.style.top = `${fitsBelow ? below : above}px`;
  panel.dataset.side = fitsBelow ? "below" : "above";
}

export function Popover({ content, title, trigger = "click", defaultOpen = false, onOpenChange, children }: PopoverProps) {
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const timer = useRef(0);
  const turn = useRef(0);
  const [open, setOpen] = useState(defaultOpen);
  const hover = trigger === "hover";

  const change = (next: boolean) => {
    window.clearTimeout(timer.current);
    if (next === open) return;
    setOpen(next);
    onOpenChange?.(next);
  };
  const later = (next: boolean, delay: number) => {
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => change(next), delay);
  };

  useEffect(() => () => window.clearTimeout(timer.current), []);

  useLayoutEffect(() => {
    const node = panel.current;
    const target = anchor.current?.firstElementChild;
    if (!open || !node || !target) return;
    turn.current += 1;
    settle(node);
    if (!node.matches(":popover-open")) node.showPopover();
    const reposition = () => place(node, target.getBoundingClientRect());
    reposition();
    motion(node, fold, "enter", { fill: "none" });
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      change(false);
      if (target instanceof HTMLElement && node.contains(document.activeElement)) target.focus();
    };
    const onPointer = (event: globalThis.PointerEvent) => {
      if (anchor.current?.contains(event.target as Node)) return;
      change(false);
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      const closing = ++turn.current;
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
      motion(node, unfold, "exit").then(() => {
        if (closing !== turn.current || !node.matches(":popover-open")) return;
        node.hidePopover();
        settle(node);
      });
    };
  }, [open]);

  const triggerProps: TriggerProps = hover
    ? { "aria-describedby": id }
    : {
        "aria-controls": id,
        "aria-expanded": open,
        "aria-haspopup": "dialog",
        onClick: (event) => {
          children.props.onClick?.(event);
          change(!open);
        },
      };

  return (
    <span
      ref={anchor}
      className="popover-anchor"
      onPointerEnter={(event) => {
        if (hover && !isTouch(event)) later(true, open ? 0 : OPEN_DELAY);
      }}
      onPointerLeave={(event) => {
        if (hover && !isTouch(event)) later(false, CLOSE_DELAY);
      }}
      onFocus={(event) => {
        if (hover && isKeyboardFocus(event)) change(true);
      }}
      onBlur={(event) => {
        if (leavesAnchor(event)) later(false, 0);
      }}
    >
      {cloneElement(children, triggerProps)}
      <div id={id} ref={panel} className="popover" role={hover ? "tooltip" : "dialog"} aria-label={title} popover="manual">
        {title && <strong className="popover-title">{title}</strong>}
        <div className="popover-body">{content}</div>
      </div>
    </span>
  );
}
