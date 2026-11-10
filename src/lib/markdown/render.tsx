import { Fragment, type ReactNode } from "react";
import { inlineOf, type Inline, type Refs } from "./parse";

export const slug = (text: string, seen: Map<string, number>) => {
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

export const renderInline = (text: string, refs?: Refs) => inline(inlineOf(text, refs));

export function Footnotes({ refs }: { refs: Refs }) {
  if (refs.order.length === 0) return null;
  return (
    <section className="markdown-footnotes">
      <ol>
        {refs.order.map((id) => (
          <li key={id} id={`fn-${id}`}>
            {renderInline(refs.notes.get(id) ?? "", refs)}
            <a href={`#fnref-${id}`} className="markdown-footnote-back" aria-label="back">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
