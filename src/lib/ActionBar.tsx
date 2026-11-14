import { useEffect, useRef, type ReactNode } from "react";

export type ActionBarProps = { children: ReactNode; label?: string };

export function ActionBar({ children, label }: ActionBarProps) {
  const bar = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    const root = document.documentElement;
    const measure = () => {
      const docked = el.getBoundingClientRect().bottom >= window.innerHeight - 1;
      if (docked) return root.style.setProperty("--action-bar-height", `${el.offsetHeight}px`);
      root.style.removeProperty("--action-bar-height");
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
      root.style.removeProperty("--action-bar-height");
    };
  }, []);
  return (
    <div ref={bar} className="action-bar" role="group" aria-label={label}>
      {children}
    </div>
  );
}
