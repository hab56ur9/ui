import type { ReactNode } from "react";
import { isJsonUINode, JsonUI, type JsonUIAction, type JsonUINode, type TabBarStyle } from "ui";

export type Action = JsonUIAction;
export type Node = JsonUINode;
export type Content = Node | Node[];

export type ScreenWidget = { id: string; title?: string; subtitle?: string; w: number; h: number; frame?: "card" | "plain"; content: Content; action?: Action };
export type NavItem = { id: string; label: string; icon: string };
export type ButtonDef = { label: string; variant?: "primary" | "secondary" | "danger"; action: Action };
export type ScreenDef = { title?: string; lede?: string; actions?: ButtonDef[]; widgets: ScreenWidget[] };
export type Overlay = { kind: "modal" | "sheet"; title: string; description?: string; body?: string; actions: ButtonDef[] };
export type App = { version: number; app: string; density?: "comfortable" | "compact"; start: string; nav: NavItem[]; navBar?: TabBarStyle; screens: Record<string, ScreenDef>; overlays?: Record<string, Overlay> };

type Format = (v: number) => string;
export type Context = { data: Record<string, unknown>; formats: Record<string, Format>; onAction: (action: Action) => void };

export const formatsFor = (locale: string): Record<string, Format> => {
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const full = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const one = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
  const date = new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric", weekday: "short" });
  return {
    compact: (v) => compact.format(v),
    full: (v) => full.format(v),
    percent: (v) => `${(v * 100).toFixed(1)}%`,
    minutes: (v) => `${full.format(v)}min`,
    hours: (v) => `${one.format(v)}h`,
    kcal: (v) => `${full.format(v)}kcal`,
    km: (v) => (v ? `${one.format(v)}km` : "—"),
    bpm: (v) => `${full.format(v)}bpm`,
    date: (v) => date.format(v),
  };
};

export const isNode = isJsonUINode;

export function renderNode(content: Content, ctx: Context): ReactNode {
  return <JsonUI node={content} data={ctx.data} formats={ctx.formats} onAction={ctx.onAction} />;
}
