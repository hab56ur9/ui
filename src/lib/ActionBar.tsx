import { useEffect, useRef, type ReactNode } from "react";

export type ActionBarProps = { children: ReactNode; label?: string };

const docked = new Map<HTMLElement, number>();

function publish() {
  const root = document.documentElement;
  const height = Math.max(0, ...docked.values());
  if (height) return root.style.setProperty("--action-bar-height", `${height}px`);
  root.style.removeProperty("--action-bar-height");
}

export function ActionBar({ children, label }: ActionBarProps) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const measure = () => {
      if (el.getBoundingClientRect().bottom >= window.innerHeight - 1) docked.set(el, el.offsetHeight);
      else docked.delete(el);
      publish();
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    document.addEventListener("scroll", measure, { capture: true, passive: true });
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      document.removeEventListener("scroll", measure, { capture: true });
      window.removeEventListener("resize", measure);
      docked.delete(el);
      publish();
    };
  }, []);
  return (
    <div ref={bar} className="action-bar" role="group" aria-label={label}>
      {children}
    </div>
  );
}
