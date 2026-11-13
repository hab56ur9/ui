import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n";
import { Icon, type IconName } from "../Icon";
import { fadeBackdrop, motion } from "../motion";

export type ViewerProps = {
  open?: boolean;
  onClose?: () => void;
  title: string;
  icon?: IconName;
  meta?: ReactNode;
  tools?: ReactNode;
  actions?: ReactNode;
  aside?: ReactNode;
  wide?: boolean;
  inline?: boolean;
  children?: ReactNode;
};

export function Viewer({ open = true, onClose, title, icon = "file", meta, tools, actions, aside, wide = false, inline = false, children }: ViewerProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mounted, setMounted] = useState(open);
  const { locale, text } = useI18n();

  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || inline) return;
    if (open && !dialog.open) {
      dialog.showModal();
      motion(dialog, [{ opacity: 0, transform: "scale(0.98)" }, { opacity: 1, transform: "none" }], "enter");
      fadeBackdrop(dialog, "enter", 0, 1);
    }
    if (!open && dialog.open) {
      Promise.all([motion(dialog, [{ opacity: 1 }, { opacity: 0 }], "exit"), fadeBackdrop(dialog, "exit", 1, 0)]).then(() => {
        dialog.close();
        setMounted(false);
      });
    }
  }, [open, mounted, inline]);

  const content = (
    <>
      <header className="viewer-head">
        <span className="viewer-icon">
          <Icon name={icon} />
        </span>
        <div className="viewer-title">
          <strong title={title}>{title}</strong>
          {meta && <span>{meta}</span>}
        </div>
        {tools && <div className="viewer-tools">{tools}</div>}
        <span className="viewer-gap" />
        <div className="viewer-actions">
          {actions}
          <button type="button" className="viewer-close" aria-label={text("close")} title={text("close")} onClick={onClose}>
            <Icon name="close" size="sm" />
          </button>
        </div>
      </header>
      <div className={aside ? "viewer-body has-aside" : "viewer-body"}>
        <div className="viewer-sheet">{children}</div>
        {aside && <aside className="viewer-aside">{aside}</aside>}
      </div>
    </>
  );
  const className = wide ? "viewer is-wide" : "viewer";
  if (inline) {
    return (
      <section className={`${className} is-inline`} lang={locale} role="dialog" aria-label={title}>
        {content}
      </section>
    );
  }
  if (!mounted) return null;
  return createPortal(
    <dialog
      ref={ref}
      className={className}
      lang={locale}
      aria-label={title}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
    >
      {content}
    </dialog>,
    document.body,
  );
}
