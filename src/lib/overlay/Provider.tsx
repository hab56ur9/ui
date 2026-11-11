import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { LangProvider, useI18n } from "../i18n";
import { Icon } from "../Icon";
import { Modal } from "./Dialog";
import { motion } from "./motion";
import { lookOf, type Theme } from "../theme";

export type ToastStatus = "info" | "good" | "warning" | "critical";
export type ToastProps = { message: string; status?: ToastStatus; action?: { label: string; onClick?: () => void }; duration?: number };
export type ToastHandle = { update: (props: Partial<ToastProps>) => void; dismiss: () => void };
export type ConfirmProps = { title: string; description?: string; body?: ReactNode; confirmLabel?: string; cancelLabel?: string; danger?: boolean };

type Context = { toast: (props: ToastProps) => ToastHandle; confirm: (props: ConfirmProps) => Promise<boolean> };
const UIContext = createContext<Context | null>(null);

export function useToast() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useToast needs <UIProvider>");
  return context.toast;
}

export function useOptionalUI() {
  return useContext(UIContext);
}

export function useConfirm() {
  const context = useContext(UIContext);
  if (!context) throw new Error("useConfirm needs <UIProvider>");
  return context.confirm;
}

const STATUS_ICON: Record<ToastStatus, string> = { info: "info", good: "success", warning: "warning", critical: "error" };
const MAX_TOASTS = 3;
type Entry = { id: number; props: ToastProps; leaving: boolean };

export type UIProviderProps = { theme: Theme; lang?: string; children: ReactNode };

export function UIProvider({ theme, lang, children }: UIProviderProps) {
  useLayoutEffect(() => {
    const { preset, style } = lookOf(theme);
    const root = document.documentElement.dataset;
    root.preset = preset;
    root.style = style;
  }, [theme]);
  return (
    <LangProvider lang={lang}>
      <Hosts>{children}</Hosts>
    </LangProvider>
  );
}

function Hosts({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Entry[]>([]);
  const [pending, setPending] = useState<{ props: ConfirmProps; resolve: (ok: boolean) => void } | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const sequence = useRef(0);

  const dismiss = useCallback((id: number) => setToasts((list) => list.map((entry) => (entry.id === id ? { ...entry, leaving: true } : entry))), []);
  const remove = useCallback((id: number) => setToasts((list) => list.filter((entry) => entry.id !== id)), []);

  const toast = useCallback(
    (props: ToastProps): ToastHandle => {
      const id = ++sequence.current;
      setToasts((list) => {
        const next = [...list, { id, props, leaving: false }];
        const live = next.filter((entry) => !entry.leaving);
        const extra = new Set(live.slice(0, Math.max(0, live.length - MAX_TOASTS)).map((entry) => entry.id));
        return next.map((entry) => (extra.has(entry.id) ? { ...entry, leaving: true } : entry));
      });
      return {
        update: (next) => setToasts((list) => list.map((entry) => (entry.id === id ? { ...entry, props: { ...entry.props, ...next } } : entry))),
        dismiss: () => dismiss(id),
      };
    },
    [dismiss],
  );

  const confirm = useCallback(
    (props: ConfirmProps) =>
      new Promise<boolean>((resolve) => {
        setPending({ props, resolve });
        setConfirmOpen(true);
      }),
    [],
  );

  const value = useMemo(() => ({ toast, confirm }), [toast, confirm]);
  return (
    <UIContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} dismiss={dismiss} remove={remove} />
      {pending && <ConfirmDialog open={confirmOpen} props={pending.props} onClose={(ok) => {
        pending.resolve(ok);
        setConfirmOpen(false);
      }} />}
    </UIContext.Provider>
  );
}

function ConfirmDialog({ open, props, onClose }: { open: boolean; props: ConfirmProps; onClose: (ok: boolean) => void }) {
  const { text } = useI18n();
  return (
    <Modal<boolean>
      open={open}
      size="sm"
      title={props.title}
      description={props.description}
      onClose={(value) => onClose(value === true)}
      actions={[
        { label: props.cancelLabel ?? text("cancel"), value: false, autoFocus: true },
        { label: props.confirmLabel ?? text("confirm"), value: true, variant: props.danger ? "danger" : "primary" },
      ]}
    >
      {props.body}
    </Modal>
  );
}

function Toaster({ toasts, dismiss, remove }: { toasts: Entry[]; dismiss: (id: number) => void; remove: (id: number) => void }) {
  const region = useRef<HTMLDivElement>(null);
  const newest = toasts[toasts.length - 1]?.id;
  useLayoutEffect(() => {
    const node = region.current;
    if (!node) return;
    if (node.matches(":popover-open")) node.hidePopover();
    if (toasts.length) node.showPopover();
  }, [newest, toasts.length]);
  return createPortal(
    <div className="toast-region" popover="manual" ref={region}>
      {toasts.map((entry) => (
        <LiveToast key={entry.id} entry={entry} onDismiss={() => dismiss(entry.id)} onGone={() => remove(entry.id)} />
      ))}
    </div>,
    document.body,
  );
}

function LiveToast({ entry, onDismiss, onGone }: { entry: Entry; onDismiss: () => void; onGone: () => void }) {
  const { locale } = useI18n();
  const node = useRef<HTMLDivElement>(null);
  const status = entry.props.status ?? "info";
  const duration = entry.props.duration ?? (status === "critical" ? 8000 : 4000);
  const timer = useRef<{ id?: number; remaining: number; startedAt: number }>({ remaining: duration, startedAt: 0 });

  const run = useCallback(() => {
    if (!timer.current.remaining) return;
    timer.current.startedAt = performance.now();
    timer.current.id = window.setTimeout(onDismiss, timer.current.remaining);
  }, [onDismiss]);
  const pause = () => {
    window.clearTimeout(timer.current.id);
    timer.current.remaining -= performance.now() - timer.current.startedAt;
  };

  useEffect(() => {
    if (node.current) motion(node.current, [{ opacity: 0, transform: "translateY(8px)" }, { opacity: 1, transform: "none" }], "enter");
    run();
    return () => window.clearTimeout(timer.current.id);
  }, [run]);

  useEffect(() => {
    if (!entry.leaving || !node.current) return;
    window.clearTimeout(timer.current.id);
    motion(node.current, [{ opacity: 1, transform: "none" }, { opacity: 0, transform: "translateY(4px)" }], "exit").then(onGone);
  }, [entry.leaving, onGone]);

  return (
    <div ref={node} className={`toast is-${status}`} role={status === "critical" ? "alert" : "status"} lang={locale} onPointerEnter={pause} onPointerLeave={run} onFocus={pause} onBlur={run}>
      <ToastBody props={entry.props} onDismiss={onDismiss} />
    </div>
  );
}

function ToastBody({ props, onDismiss }: { props: ToastProps; onDismiss?: () => void }) {
  const { text } = useI18n();
  const { message, status = "info", action } = props;
  const label = text(`status.${status}`);
  const visibleLabel = status === "warning" || status === "critical";
  return (
    <>
      <span className="toast-icon">
        <Icon name={STATUS_ICON[status]} />
      </span>
      <div className="toast-text">
        <strong className={visibleLabel ? "toast-label" : "sr-only"}>{visibleLabel ? label : `${label}: `}</strong>
        <span>{message}</span>
      </div>
      {action && (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            action.onClick?.();
            onDismiss?.();
          }}
        >
          {action.label}
        </button>
      )}
      <button type="button" className="toast-close" aria-label={text("dismiss")} title={text("dismiss")} onClick={onDismiss}>
        <Icon name="close" />
      </button>
    </>
  );
}

export function Toast(props: ToastProps & { onDismiss?: () => void }) {
  const { locale } = useI18n();
  const status = props.status ?? "info";
  return (
    <div className={`toast is-${status}`} role={status === "critical" ? "alert" : "status"} lang={locale}>
      <ToastBody props={props} onDismiss={props.onDismiss} />
    </div>
  );
}
