import type { ReactNode } from "react";

const KEYWORDS = "const|let|var|function|return|if|else|for|of|in|new|async|await|true|false|null|undefined|typeof|class|export|import|from|default|type|as";

const GRAMMARS = {
  tsx: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ["string", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`/y],
    ["tag", /<\/?[A-Za-z][\w.]*|\/>/y],
    ["keyword", new RegExp(`\\b(?:${KEYWORDS})\\b|=>`, "y")],
    ["number", /\b\d+(?:\.\d+)?(?:e\d+)?\b/y],
    ["function", /[A-Za-z_$][\w$]*(?=\s*\()/y],
    ["attr", /[A-Za-z_$][\w$-]*(?=\s*:(?!:)|=[^=>])/y],
    ["plain", /[A-Za-z_$][\w$]*|\s+|./y],
  ],
  html: [
    ["comment", /<!--[\s\S]*?-->/y],
    ["tag", /<\/?[\w-]+|\/?>/y],
    ["attr", /[\w:-]+(?==)/y],
    ["string", /"[^"]*"|'[^']*'/y],
    ["plain", /[^<"'\w]+|[\w:-]+|./y],
  ],
  json: [
    ["attr", /"(?:\\.|[^"\\\n])*"(?=\s*:)/y],
    ["string", /"(?:\\.|[^"\\\n])*"/y],
    ["number", /-?\b\d+(?:\.\d+)?(?:e[+-]?\d+)?\b/y],
    ["keyword", /\b(?:true|false|null)\b/y],
    ["plain", /\s+|./y],
  ],
  sql: [
    ["comment", /--[^\n]*/y],
    ["string", /'(?:''|[^'])*'/y],
    ["keyword", /\b(?:select|from|where|and|or|not|in|is|null|join|left|right|inner|on|group|by|order|limit|having|as|insert|into|values|update|set|delete|create|table|index|primary|key|with|case|when|then|else|end|distinct|count|sum|avg|min|max)\b/iy],
    ["number", /\b\d+(?:\.\d+)?\b/y],
    ["function", /[A-Za-z_][\w]*(?=\s*\()/y],
    ["plain", /[A-Za-z_][\w]*|\s+|./y],
  ],
  plain: [["plain", /[\s\S]+/y]],
} satisfies Record<string, [string, RegExp][]>;

export type CodeLang = keyof typeof GRAMMARS;

const guess = (code: string): CodeLang => {
  if (/^\s*<[a-z!]/.test(code)) return "html";
  if (/^\s*(?:npm|node|bun|git|https?:|[\w.-]+\/[\w./<>-]*\s*$)/m.test(code.split("\n")[0])) return "plain";
  return "tsx";
};

function tokens(code: string, lang: CodeLang) {
  const grammar: [string, RegExp][] = GRAMMARS[lang];
  const out: [string, string][] = [];
  let at = 0;
  while (at < code.length) {
    const [kind, match] = grammar
      .map(([name, pattern]) => {
        pattern.lastIndex = at;
        return [name, pattern.exec(code)] as const;
      })
      .find(([, found]) => found && found[0].length) as [string, RegExpExecArray];
    out.push([kind, match[0]]);
    at += match[0].length;
  }
  return out;
}

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
