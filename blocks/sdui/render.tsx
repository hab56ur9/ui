import { createElement, Fragment, isValidElement, type ComponentType, type CSSProperties, type ReactNode } from "react";
import * as ui from "ui";
import type { TabBarStyle } from "ui";

export type Action = { name: string; params?: Record<string, unknown>; close?: boolean };
export type Node = { type: string; props?: Record<string, unknown>; children?: unknown };
export type Content = Node | Node[];

export type ScreenWidget = { id: string; title?: string; subtitle?: string; w: number; h: number; frame?: "card" | "plain"; content: Content; action?: Action };
export type NavItem = { id: string; label: string; icon: string };
export type ButtonDef = { label: string; variant?: "primary" | "secondary" | "danger"; action: Action };
export type ScreenDef = { title?: string; lede?: string; actions?: ButtonDef[]; widgets: ScreenWidget[] };
export type Overlay = { kind: "modal" | "sheet"; title: string; description?: string; body?: string; actions: ButtonDef[] };
export type App = { version: number; app: string; density?: "comfortable" | "compact"; start: string; nav: NavItem[]; navBar?: TabBarStyle; screens: Record<string, ScreenDef>; overlays?: Record<string, Overlay> };

type Format = (v: number) => string;
type Row = Record<string, unknown>;
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

const COMPONENTS = ui as unknown as Record<string, ComponentType<Row> | undefined>;
const MISSING: CSSProperties = { color: "var(--color-fg-muted)" };

const isObject = (value: unknown): value is Row => typeof value === "object" && value !== null && !Array.isArray(value);
const isPrimitive = (value: unknown) => ["string", "number", "boolean"].includes(typeof value);
export const isNode = (value: unknown): value is Node => isObject(value) && typeof value.type === "string" && /^[A-Z]/.test(value.type);

const shown = (value: unknown, spec: Row, ctx: Context) => {
  if (isObject(spec.$labels)) return spec.$labels[String(value)] ?? String(value);
  const format = ctx.formats[String(spec.$format)];
  return format ? format(value as number) : value;
};

const keyed = (out: unknown, i: number) => (isValidElement(out) ? <Fragment key={i}>{out}</Fragment> : out);

export function resolve(value: unknown, ctx: Context, row?: Row): unknown {
  if (Array.isArray(value)) return value.map((item, i) => keyed(resolve(item, ctx, row), i));
  if (!isObject(value)) return value;
  if ("$data" in value) return shown(ctx.data[String(value.$data)], value, ctx);
  if ("$field" in value) return shown(row?.[String(value.$field)], value, ctx);
  if ("$each" in value) return ((resolve(value.$each, ctx, row) as Row[] | undefined) ?? []).map((item, i) => keyed(resolve(value.$as, ctx, item), i));
  if ("$action" in value) {
    const action = value.$action as Action;
    return (arg?: unknown) => ctx.onAction(isPrimitive(arg) ? { ...action, params: { ...action.params, value: arg } } : action);
  }
  if ("$format" in value) return ctx.formats[String(value.$format)];
  if (isNode(value)) return renderNode(value, ctx, row);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, ctx, row)]));
}

export function renderNode(content: Content, ctx: Context, row?: Row): ReactNode {
  if (Array.isArray(content)) return <div className="stack">{content.map((node, i) => <div key={i}>{renderNode(node, ctx, row)}</div>)}</div>;
  const Component = COMPONENTS[content.type];
  if (typeof Component !== "function") return <p style={MISSING}>{content.type}</p>;
  const children = content.children === undefined ? [] : [content.children].flat().map((child) => resolve(child, ctx, row) as ReactNode);
  return createElement(Component, resolve(content.props ?? {}, ctx, row) as Row, ...children);
}
