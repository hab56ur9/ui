import type { ButtonVariant } from "./controls";
import type { IconName } from "./Icon";
import type { JsonUIAction, JsonUIContent, JsonUIFormat } from "./JsonUI";

export type SpecButton = { label: string; action: JsonUIAction; variant?: ButtonVariant };
export type SpecWidget = { id: string; w: number; h: number | "auto"; title?: string; subtitle?: string; frame?: "card" | "plain"; action?: JsonUIAction; content: JsonUIContent; description?: string };
export type SpecScreen = { description?: string; layout?: "grid" | "article"; title?: string; lede?: string; eyebrow?: string; wide?: boolean; toc?: boolean; actions?: SpecButton[]; widgets?: SpecWidget[]; sidebar?: JsonUIContent };
export type SpecOverlay = { description?: string; kind?: "modal" | "sheet"; title: string; lede?: string; body?: string; actions?: SpecButton[] };
export type SpecPanel = { description?: string; title?: string; content: JsonUIContent };
export type SpecNavItem = { screen: string; label: string; icon?: IconName; group?: string; sub?: string };
export type SpecFormat = { description?: string; style: "number" | "compact" | "percent" | "date"; digits?: number; unit?: string };
export type SpecSection = { label: string; groups: string[] };
export type SpecFrame = {
  shell?: "app" | "desktop";
  brand?: unknown;
  sidebar?: JsonUIContent;
  mobileNav?: "drawer" | "tabs";
  scroll?: "frame" | "page";
  search?: { label?: string; placeholder?: string };
  sections?: SpecSection[];
  sectionsLabel?: string;
  actions?: unknown[];
  toc?: string;
  pager?: string;
};
export type AppSpec = {
  spec?: number;
  app: { name: string; description?: string; density?: "compact" | "comfortable" };
  start: string;
  frame?: SpecFrame;
  nav?: SpecNavItem[];
  data?: Record<string, { description?: string; example?: unknown }>;
  formats?: Record<string, SpecFormat>;
  actions?: Record<string, { description?: string; params?: unknown }>;
  screens: Record<string, SpecScreen>;
  panels?: Record<string, SpecPanel>;
  overlays?: Record<string, SpecOverlay>;
};
export type SpecPosition = { screen: string; panel?: string | null; overlay?: string | null };

const named = (value: unknown): value is string => typeof value === "string";

export function specFormats(formats: AppSpec["formats"] = {}, locale: string): Record<string, JsonUIFormat> {
  const number = (digits: number, unit: string, compact: boolean) => {
    const f = new Intl.NumberFormat(locale, { maximumFractionDigits: digits, ...(compact && { notation: "compact" as const }) });
    return (v: number) => `${f.format(v)}${unit}`;
  };
  const date = new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric", weekday: "short" });
  const formatOf = (f: SpecFormat): JsonUIFormat => {
    if (f.style === "date") return (v) => date.format(v);
    if (f.style === "percent") return (v) => `${(v * 100).toFixed(f.digits ?? 1)}%`;
    return number(f.digits ?? 0, f.unit ?? "", f.style === "compact");
  };
  return Object.fromEntries(Object.entries(formats).map(([name, f]) => [name, formatOf(f)]));
}

export function specNext(spec: AppSpec, at: SpecPosition, action: JsonUIAction, value?: unknown): SpecPosition {
  const next = { ...at };
  const screen = action.params?.screen ?? value;
  const panel = action.params?.panel ?? value;
  const overlay = action.params?.overlay;
  if (action.name === "navigate" && named(screen) && Object.hasOwn(spec.screens, screen)) next.screen = screen;
  if (action.name === "open" && named(overlay)) next.overlay = overlay;
  if (action.name === "close" || action.close) next.overlay = null;
  if (action.name === "panel") next.panel = named(panel) && Object.hasOwn(spec.panels ?? {}, panel) ? panel : null;
  return next;
}

export function navGroups(items: SpecNavItem[]) {
  const groups: { key: string; title?: string; items: SpecNavItem[] }[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    const key = item.group ?? "";
    if (last?.key === key) last.items.push(item);
    if (last?.key !== key) groups.push({ key, title: item.group, items: [item] });
  }
  return groups;
}

export function sectionOf(spec: AppSpec, screen: string) {
  const group = spec.nav?.find((item) => item.screen === screen)?.group;
  return Math.max(0, (spec.frame?.sections ?? []).findIndex((section) => named(group) && section.groups.includes(group)));
}

export function tocOf(screen: SpecScreen) {
  if (screen.layout !== "article" || screen.toc === false) return [];
  return (screen.widgets ?? [])
    .flatMap((widget) => [widget.content].flat())
    .filter((node) => node?.type === "ArticleSection" && named(node.props?.id) && named(node.props?.title))
    .map((node) => ({ id: String(node.props?.id), label: String(node.props?.title) }));
}
