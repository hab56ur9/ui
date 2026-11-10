import { Fragment, type ReactNode } from "react";
import { CodeBlock, type CodeLang } from "../Code";
import { DataTable } from "../DataTable";
import { JsonUI, type JsonUIAction, type JsonUIFormat, type JsonUINode } from "../JsonUI";
import { Callout } from "../slides/parts";
import { inlineOf, parseMarkdown, type Block, type Footnote, type Inline } from "./parse";

export type MarkdownProps = { children: string; data?: Record<string, unknown>; formats?: Record<string, JsonUIFormat>; onAction?: (action: JsonUIAction) => void };

const LANGS: Record<string, CodeLang> = { tsx: "tsx", ts: "tsx", typescript: "tsx", jsx: "tsx", js: "tsx", javascript: "tsx", html: "html", xml: "html", json: "json", sql: "sql" };

const plain = (nodes: Inline[]): string => nodes.map((node) => ("children" in node ? plain(node.children) : "text" in node ? node.text : "")).join("");

const slug = (text: string, seen: Map<string, number>) => {
  const base =
    text
      .toLowerCase()
      .trim()
      .replace(/[^\p{L}\p{N}\s-]/gu, "")
      .replace(/\s+/g, "-") || "section";
  const count = seen.get(base) ?? 0;
  seen.set(base, count + 1);
  return count ? `${base}-${count}` : base;
};

function inline(nodes: Inline[]): ReactNode {
  return nodes.map((node, i) => {
    switch (node.kind) {
      case "text":
        return <Fragment key={i}>{node.text}</Fragment>;
      case "strong":
        return <strong key={i}>{inline(node.children)}</strong>;
      case "em":
        return <em key={i}>{inline(node.children)}</em>;
      case "del":
        return <del key={i}>{inline(node.children)}</del>;
      case "code":
        return <code key={i}>{node.text}</code>;
      case "link": {
        const external = /^https?:/i.test(node.href);
        return (
          <a key={i} href={node.href} title={node.title} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined}>
            {inline(node.children)}
          </a>
        );
      }
      case "image":
        return <img key={i} src={node.src} alt={node.alt} title={node.title} loading="lazy" />;
      case "footnote":
        return (
          <sup key={i} className="markdown-footnote-ref">
            <a href={`#fn-${node.id}`} id={`fnref-${node.id}`}>
              {node.number}
            </a>
          </sup>
        );
      case "break":
        return <br key={i} />;
    }
  });
}

export const renderInline = (text: string) => inline(inlineOf(text));

export type Context = Omit<MarkdownProps, "children"> & { seen: Map<string, number> };

function uiBlock(code: string, ctx: Context) {
  try {
    return <JsonUI node={JSON.parse(code) as JsonUINode} data={ctx.data} formats={ctx.formats} onAction={ctx.onAction} />;
  } catch {
    return <CodeBlock code={code} lang="json" />;
  }
}

export function block(node: Block, ctx: Context, key: number): ReactNode {
  switch (node.kind) {
    case "heading": {
      const Tag = `h${node.level}` as "h1";
      return (
        <Tag key={key} id={slug(node.text, ctx.seen)} className="markdown-heading">
          {inline(node.children)}
        </Tag>
      );
    }
    case "paragraph":
      return <p key={key}>{inline(node.children)}</p>;
    case "list": {
      const items = node.items.map((item, i) => (
        <li key={i} className={item.checked === undefined ? undefined : "is-task"}>
          {item.checked !== undefined && <input type="checkbox" checked={item.checked} disabled aria-label={item.checked ? "done" : "to do"} />}
          {item.children.length === 1 && item.children[0].kind === "paragraph" ? inline(item.children[0].children) : blocks(item.children, ctx)}
        </li>
      ));
      return node.ordered ? (
        <ol key={key} start={node.start === 1 ? undefined : node.start}>
          {items}
        </ol>
      ) : (
        <ul key={key}>{items}</ul>
      );
    }
    case "quote":
      return <blockquote key={key}>{blocks(node.children, ctx)}</blockquote>;
    case "callout":
      return (
        <Callout key={key} tone={node.tone} title={node.title}>
          {blocks(node.children, ctx)}
        </Callout>
      );
    case "code":
      return node.lang === "ui" ? (
        <div key={key} className="markdown-ui">
          {uiBlock(node.code, ctx)}
        </div>
      ) : (
        <CodeBlock key={key} code={node.code} lang={LANGS[node.lang] ?? "plain"} />
      );
    case "table":
      return (
        <div key={key} className="markdown-table">
          <DataTable columns={node.head.map((cell, i) => ({ label: plain(cell), numeric: node.align[i] === "right" }))} rows={node.rows.map((row) => node.head.map((_, i) => ({ render: () => inline(row[i] ?? []) })))} />
        </div>
      );
    case "image":
      return (
        <figure key={key} className="markdown-image">
          <img src={node.src} alt={node.alt} title={node.title} loading="lazy" />
          {(node.title || node.alt) && <figcaption>{node.title || node.alt}</figcaption>}
        </figure>
      );
    case "rule":
      return <hr key={key} />;
  }
}

function blocks(nodes: Block[], ctx: Context): ReactNode {
  return nodes.map((node, i) => block(node, ctx, i));
}

export function footnoteList(footnotes: Footnote[], ctx: Context) {
  if (footnotes.length === 0) return null;
  return (
    <section className="markdown-footnotes">
      <ol>
        {footnotes.map((note) => (
          <li key={note.id} id={`fn-${note.id}`}>
            {blocks(note.children, ctx)}
            <a href={`#fnref-${note.id}`} className="markdown-footnote-back" aria-label="back">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Markdown({ children, ...rest }: MarkdownProps) {
  const { blocks: content, footnotes } = parseMarkdown(children);
  const ctx = { ...rest, seen: new Map<string, number>() };
  return (
    <div className="markdown">
      {blocks(content, ctx)}
      {footnoteList(footnotes, ctx)}
    </div>
  );
}
