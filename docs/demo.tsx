import type { CSSProperties, ReactNode } from "react";
import { DAY, useI18n, type Point } from "ui";

export { DAY };
export const END = new Date(2026, 10, 7).getTime();

export const rng = (seed: number) => () => {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
};

export const series = (seed: number, n: number, base: number, drift: number, noise: number): Point[] => {
  const r = rng(seed);
  let v = base;
  return Array.from({ length: n }, (_, i) => {
    v = Math.max(0, v + drift + (r() - 0.5) * noise);
    return { t: END - (n - 1 - i) * DAY, v };
  });
};

export function useT() {
  const { lang } = useI18n();
  return <T,>(messages: { ko: T; en: T }) => (lang === "en" ? messages.en : messages.ko);
}

export function useFmt() {
  const { locale } = useI18n();
  const number = (options: Intl.NumberFormatOptions) => (v: number) => new Intl.NumberFormat(locale, options).format(v);
  return {
    count: number({ notation: "compact", maximumFractionDigits: 1 }),
    full: number({ maximumFractionDigits: 0 }),
    won: number({ style: "currency", currency: "KRW", notation: "compact", maximumFractionDigits: 1 }),
    percent: number({ style: "percent", maximumFractionDigits: 2 }),
    ms: (v: number) => `${number({ maximumFractionDigits: 0 })(v)}ms`,
  };
}

export function usePlatforms() {
  const t = useT();
  return [
    { name: t({ ko: "웹", en: "Web" }), color: 1, points: series(3, 60, 120000, 300, 12000) },
    { name: "iOS", color: 2, points: series(7, 60, 90000, 600, 9000) },
    { name: "Android", color: 3, points: series(11, 60, 150000, 500, 11000) },
  ];
}

export function Canvas({ height = 240, children }: { height?: number; children: ReactNode }) {
  return (
    <div className="docs-canvas" style={{ "--canvas-h": `${height}px` } as CSSProperties}>
      {children}
    </div>
  );
}

export function Panel({ height, children }: { height?: number; children: ReactNode }) {
  return (
    <div className="docs-panel" style={height ? { height } : undefined}>
      {children}
    </div>
  );
}

export function Stage({ kind, children }: { kind: "modal" | "sheet" | "toast"; children: ReactNode }) {
  return <div className={`docs-stage is-${kind}`}>{children}</div>;
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="docs-demo-row">{children}</div>;
}

export function Swatches({ paths }: { paths: string[] }) {
  return (
    <div className="docs-swatches">
      {paths.map((path) => (
        <div className="docs-swatch" key={path}>
          <span style={{ "--sw": `var(--${path.replaceAll(".", "-")})` } as CSSProperties} />
          <code>{path.replace("color.", "")}</code>
        </div>
      ))}
    </div>
  );
}
