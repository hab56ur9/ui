import { createElement, Fragment, isValidElement, type ComponentType, type ReactNode } from "react";
import * as ui from "./index";

export type JsonUIAction = { name: string; params?: Record<string, unknown>; close?: boolean };
export type JsonUINode = { type: string; props?: Record<string, unknown>; children?: unknown };
export type JsonUIContent = JsonUINode | JsonUINode[];
export type JsonUIFormat = (value: number) => string;
export type JsonUIComponents = Record<string, ComponentType<never>>;
export type JsonUIProps = { node: JsonUIContent; data?: Record<string, unknown>; formats?: Record<string, JsonUIFormat>; onAction?: (action: JsonUIAction) => void };

type Row = Record<string, unknown>;
export type JsonUIContext = {
  data: Row;
  formats: Record<string, JsonUIFormat>;
  state?: Row;
  components?: JsonUIComponents;
  onAction: (action: JsonUIAction, value?: unknown) => void;
};

const componentOf = (name: string, ctx: JsonUIContext) => (ctx.components?.[name] ?? (ui as unknown as JsonUIComponents)[name]) as ComponentType<Row> | undefined;

const isObject = (value: unknown): value is Row => typeof value === "object" && value !== null && !Array.isArray(value);
const isPrimitive = (value: unknown) => ["string", "number", "boolean"].includes(typeof value);
export const isJsonUINode = (value: unknown): value is JsonUINode => isObject(value) && typeof value.type === "string" && /^[A-Z]/.test(value.type);

const shown = (value: unknown, spec: Row, ctx: JsonUIContext) => {
  if (isObject(spec.$labels)) return spec.$labels[String(value)] ?? String(value);
  const format = ctx.formats[String(spec.$format)];
  return format ? format(value as number) : value;
};

const keyed = (out: unknown, i: number) => (isValidElement(out) ? <Fragment key={i}>{out}</Fragment> : out);

export function resolve(value: unknown, ctx: JsonUIContext, row?: Row): unknown {
  if (Array.isArray(value)) return value.map((item, i) => keyed(resolve(item, ctx, row), i));
  if (!isObject(value)) return value;
  if ("$data" in value) return shown(ctx.data[String(value.$data)], value, ctx);
  if ("$field" in value) return shown(row?.[String(value.$field)], value, ctx);
  if ("$state" in value) return ctx.state?.[String(value.$state)];
  if ("$each" in value) return ((resolve(value.$each, ctx, row) as Row[] | undefined) ?? []).map((item, i) => keyed(resolve(value.$as, ctx, item), i));
  if ("$action" in value) {
    const action = value.$action as JsonUIAction;
    return (arg?: unknown) => ctx.onAction(action, arg);
  }
  if ("$format" in value) return ctx.formats[String(value.$format)];
  if (isJsonUINode(value)) return draw(value, ctx, row);
  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, resolve(item, ctx, row)]));
}

export function draw(content: JsonUIContent, ctx: JsonUIContext, row?: Row): ReactNode {
  if (Array.isArray(content)) return <ui.Stack>{content.map((node, i) => <div key={i}>{draw(node, ctx, row)}</div>)}</ui.Stack>;
  const Component = componentOf(content.type, ctx);
  if (typeof Component !== "function" && typeof Component !== "object") return <p className="json-ui-missing">{content.type}</p>;
  const children = content.children === undefined ? [] : [content.children].flat().map((child) => resolve(child, ctx, row) as ReactNode);
  return createElement(Component, resolve(content.props ?? {}, ctx, row) as Row, ...children);
}

export function JsonUI({ node, data = {}, formats = {}, onAction = () => undefined }: JsonUIProps) {
  const act = (action: JsonUIAction, value?: unknown) => onAction(isPrimitive(value) ? { ...action, params: { ...action.params, value } } : action);
  return <div className="json-ui">{draw(node, { data, formats, onAction: act })}</div>;
}
