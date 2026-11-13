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

const hostOf = (src: string) => src.match(/^https?:\/\/(?:[^/?#@]*@)?([^/?#]+)/i)?.[1].toLowerCase();

export const showsImage = (src: string, hosts?: string[]) => {
  const host = hostOf(src);
  return !hosts || !host || hosts.some((allowed) => allowed.toLowerCase() === host);
};

export const ImageLink = ({ src, alt }: { src: string; alt?: string }) => (
  <a href={src} target="_blank" rel="noreferrer noopener">
    {alt || src}
  </a>
);

function inline(nodes: Inline[], hosts?: string[]): ReactNode {
  return nodes.map((node, i) => {
    switch (node.kind) {
      case "text":
        return <Fragment key={i}>{node.text}</Fragment>;
      case "strong":
        return <strong key={i}>{inline(node.children, hosts)}</strong>;
      case "em":
        return <em key={i}>{inline(node.children, hosts)}</em>;
      case "del":
        return <del key={i}>{inline(node.children, hosts)}</del>;
      case "code":
        return <code key={i}>{node.text}</code>;
      case "link": {
        const external = /^https?:/i.test(node.href);
        return (
          <a key={i} href={node.href} title={node.title} target={external ? "_blank" : undefined} rel={external ? "noreferrer noopener" : undefined}>
            {inline(node.children, hosts)}
          </a>
        );
      }
      case "image":
        return showsImage(node.src, hosts) ? <img key={i} src={node.src} alt={node.alt} title={node.title} loading="lazy" /> : <ImageLink key={i} src={node.src} alt={node.alt} />;
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

export const renderInline = (text: string, refs?: Refs, hosts?: string[]) => inline(inlineOf(text, refs), hosts);

export function Footnotes({ refs, imageHosts }: { refs: Refs; imageHosts?: string[] }) {
  if (refs.order.length === 0) return null;
  return (
    <section className="markdown-footnotes">
      <ol>
        {refs.order.map((id) => (
          <li key={id} id={`fn-${id}`}>
            {renderInline(refs.notes.get(id) ?? "", refs, imageHosts)}
            <a href={`#fnref-${id}`} className="markdown-footnote-back" aria-label="back">
              ↩
            </a>
          </li>
        ))}
      </ol>
    </section>
  );
}
