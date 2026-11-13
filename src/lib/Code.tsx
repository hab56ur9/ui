import type { ReactNode } from "react";
import { guess, tokens, type CodeLang } from "./codeTokens";

export { langOf, type CodeLang } from "./codeTokens";

type Token = [string, string];

function lines(code: string, lang: CodeLang) {
  const out: Token[][] = [[]];
  for (const [kind, text] of tokens(code, lang)) {
    text.split("\n").forEach((part, i) => {
      if (i > 0) out.push([]);
      if (part) out[out.length - 1].push([kind, part]);
    });
  }
  return out;
}

function indentOf(line: Token[]) {
  const text = line.map(([, part]) => part).join("");
  const width = text.length - text.trimStart().length;
  let rest = width;
  const body = line.flatMap(([kind, part]): Token[] => {
    const cut = Math.min(rest, part.length);
    rest -= cut;
    return part.length > cut ? [[kind, part.slice(cut)]] : [];
  });
  return { indent: text.slice(0, width), body };
}

function Tokens({ items }: { items: Token[] }) {
  return items.map(([kind, text], i) =>
    kind === "plain" ? (
      text
    ) : (
      <span key={i} className={`tok-${kind}`}>
        {text}
      </span>
    ),
  );
}

export function Highlight({ code, lang = guess(code), numbers = false }: { code: string; lang?: CodeLang; numbers?: boolean }) {
  const all = lines(code, lang);
  return (
    <code className={numbers ? "has-lines" : undefined}>
      {all.map((line, i) => {
        const { indent, body } = indentOf(line);
        return (
          <span className="line" key={i}>
            {indent && <span className="line-indent">{indent}</span>}
            <Tokens items={body} />
            {i < all.length - 1 && "\n"}
          </span>
        );
      })}
    </code>
  );
}

export function CodeLine({ code, lang }: { code: string; lang: CodeLang }) {
  return <Tokens items={tokens(code, lang)} />;
}

export type CodeBlockProps = { code: string; lang?: CodeLang; title?: string; actions?: ReactNode };

export function CodeBlock({ code, lang, title, actions }: CodeBlockProps) {
  return (
    <figure className="code-block">
      {(title || actions) && (
        <figcaption className="code-block-title">
          <span>{title}</span>
          {actions}
        </figcaption>
      )}
      <pre>
        <Highlight code={code.trimEnd()} lang={lang} numbers={code.trimEnd().split("\n").length > 3} />
      </pre>
    </figure>
  );
}
