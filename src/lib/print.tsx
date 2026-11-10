import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";

export function PrintCopy({ kind, medium, onDone, children }: { kind: "deck" | "doc"; medium: string; onDone: () => void; children: ReactNode }) {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("is-printing");
    const done = () => {
      root.classList.remove("is-printing");
      onDone();
    };
    addEventListener("afterprint", done, { once: true });
    const timer = window.setTimeout(() => print(), 400);
    return () => {
      window.clearTimeout(timer);
      removeEventListener("afterprint", done);
      root.classList.remove("is-printing");
    };
  }, [onDone]);
  return createPortal(
    <div className="print-root" data-kind={kind} data-medium={medium}>
      {children}
    </div>,
    document.body,
  );
}
