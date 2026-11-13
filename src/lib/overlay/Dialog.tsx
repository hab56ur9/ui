import { useEffect, useId, useLayoutEffect, useRef, useState, type MouseEvent, type PointerEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ButtonBase } from "../controls";
import { useI18n } from "../i18n";
import { Icon } from "../Icon";
import { fadeBackdrop, motion } from "../motion";
import { useModalFocus } from "./focus";

export type DialogAction<V> = { label: string; value?: V; variant?: "secondary" | "primary" | "danger"; autoFocus?: boolean };

export type DialogProps<V> = {
  open: boolean;
  onClose: (value: V | null) => void;
  title: string;
  description?: string;
  children?: ReactNode;
  actions?: DialogAction<V>[];
  dismissible?: boolean;
  inline?: boolean;
};

type Kind = "modal" | "sheet";

const FRAMES = {
  modal: {
    enter: [{ opacity: 0, transform: "translateY(8px) scale(0.98)" }, { opacity: 1, transform: "none" }],
    exit: () => [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(4px) scale(0.99)" }],
    kind: "enter" as const,
  },
  sheet: {
    enter: [{ transform: "translateY(100%)" }, { transform: "translateY(0)" }],
    exit: (dialog: HTMLElement) => [{ transform: dialog.style.transform || "translateY(0)" }, { transform: "translateY(100%)" }],
    kind: "slow" as const,
  },
};

const outside = (dialog: HTMLElement, e: MouseEvent) => {
  const box = dialog.getBoundingClientRect();
  return e.clientX < box.left || e.clientX > box.right || e.clientY < box.top || e.clientY > box.bottom;
};

function Dialog<V>({ kind, size = "md", open, onClose, title, description, children, actions = [], dismissible = true, inline = false }: DialogProps<V> & { kind: Kind; size?: "sm" | "md" | "lg" }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(open);
  const titleId = useId();
  const { locale, text } = useI18n();
  const frames = FRAMES[kind];

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  const trap = useModalFocus(ref, mounted && !inline);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || inline) return;
    if (open && !dialog.open) {
      dialog.showModal();
      dialog.querySelector<HTMLElement>("[data-autofocus]")?.focus();
      motion(dialog, frames.enter, frames.kind);
      fadeBackdrop(dialog, "enter", 0, 1);
    }
    if (!open && dialog.open) {
      Promise.all([motion(dialog, frames.exit(dialog), "exit"), fadeBackdrop(dialog, "exit", 1, 0)]).then(() => {
        dialog.close();
        setMounted(false);
      });
    }
  }, [open, mounted, frames, inline]);

  const startDrag = (e: PointerEvent<HTMLElement>) => {
    const dialog = ref.current;
    if (kind !== "sheet" || !dialog || !dismissible || e.button !== 0 || (e.target as Element).closest("button")) return;
    e.preventDefault();
    const handle = e.currentTarget;
    const startY = e.clientY;
    const startAt = performance.now();
    const offset = (ev: globalThis.PointerEvent) => {
      const dy = ev.clientY - startY;
      return dy > 0 ? dy : dy / 4;
    };
    handle.setPointerCapture(e.pointerId);
    dialog.classList.add("is-dragging");
    const move = (ev: globalThis.PointerEvent) => (dialog.style.transform = `translateY(${offset(ev)}px)`);
    const up = (ev: globalThis.PointerEvent) => {
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      dialog.classList.remove("is-dragging");
      const dy = offset(ev);
      const fast = dy / (performance.now() - startAt) > 0.6;
      if (dy > dialog.offsetHeight * 0.3 || (fast && dy > 24)) return onClose(null);
      const from = dialog.style.transform;
      dialog.style.transform = "";
      motion(dialog, [{ transform: from || "translateY(0)" }, { transform: "translateY(0)" }], "enter");
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
  };

  const content = (
    <>
      {kind === "sheet" && <div className="sheet-grabber" onPointerDown={startDrag} />}
      <header className="overlay-head" onPointerDown={startDrag}>
        <h2 className="overlay-title" id={titleId}>
          {title}
        </h2>
        {dismissible && (
          <button type="button" className="overlay-close" aria-label={text("close")} title={text("close")} onClick={() => onClose(null)}>
            <Icon name="close" />
          </button>
        )}
      </header>
      {description && <p className="overlay-description">{description}</p>}
      <div className="overlay-body">{typeof children === "string" ? <p className="overlay-text">{children}</p> : children}</div>
      {actions.length > 0 && (
        <div className="overlay-actions">
          {actions.map((action) => (
            <ButtonBase key={action.label} variant={action.variant} data-autofocus={action.autoFocus || undefined} onClick={() => onClose(action.value ?? (action.label as V))}>
              {action.label}
            </ButtonBase>
          ))}
        </div>
      )}
    </>
  );
  if (inline) {
    return (
      <div className={`overlay overlay-${kind} is-inline`} data-size={size} lang={locale} role="dialog" aria-labelledby={titleId}>
        {content}
      </div>
    );
  }
  if (!mounted) return null;
  return createPortal(
    <dialog
      ref={ref}
      onKeyDown={trap}
      className={`overlay overlay-${kind}`}
      data-size={size}
      lang={locale}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        if (dismissible) onClose(null);
      }}
      onClick={(e) => {
        if (dismissible && e.target === ref.current && outside(ref.current, e)) onClose(null);
      }}
    >
      {content}
    </dialog>,
    document.body,
  );
}

export function Modal<V = string>(props: DialogProps<V> & { size?: "sm" | "md" | "lg" }) {
  return <Dialog {...props} kind="modal" />;
}

export function Sheet<V = string>(props: DialogProps<V>) {
  return <Dialog {...props} kind="sheet" />;
}

export type ActionListItem = { id: string; label: string };
export type ActionListProps = { items: ActionListItem[]; onSelect: (id: string) => void };

export function ActionList({ items, onSelect }: ActionListProps) {
  return (
    <ul className="sheet-list">
      {items.map((item) => (
        <li key={item.id}>
          <ButtonBase onClick={() => onSelect(item.id)}>{item.label}</ButtonBase>
        </li>
      ))}
    </ul>
  );
}
