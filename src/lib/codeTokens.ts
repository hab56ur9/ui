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
  go: [
    ["comment", /\/\/[^\n]*|\/\*[\s\S]*?\*\//y],
    ["string", /"(?:\\.|[^"\\\n])*"|`[^`]*`|'(?:\\.|[^'\\\n])*'/y],
    ["keyword", /\b(?:package|import|func|return|if|else|for|range|switch|case|default|go|defer|select|chan|map|struct|interface|type|var|const|break|continue|nil|true|false|iota)\b/y],
    ["number", /\b\d+(?:\.\d+)?\b/y],
    ["function", /[A-Za-z_][\w]*(?=\s*\()/y],
    ["plain", /[A-Za-z_][\w]*|\s+|./y],
  ],
  py: [
    ["comment", /#[^\n]*/y],
    ["string", /"""[\s\S]*?"""|\'\'\'[\s\S]*?\'\'\'|[rbf]?"(?:\\.|[^"\\\n])*"|[rbf]?'(?:\\.|[^'\\\n])*'/y],
    ["tag", /@[A-Za-z_][\w.]*/y],
    ["keyword", /\b(?:def|class|return|if|elif|else|for|while|in|not|and|or|is|import|from|as|with|try|except|finally|raise|yield|lambda|pass|break|continue|async|await|None|True|False|self)\b/y],
    ["number", /\b\d+(?:\.\d+)?\b/y],
    ["function", /[A-Za-z_][\w]*(?=\s*\()/y],
    ["plain", /[A-Za-z_][\w]*|\s+|./y],
  ],
  yaml: [
    ["comment", /#[^\n]*/y],
    ["attr", /[\w.-]+(?=\s*:(?:\s|$))/y],
    ["string", /"(?:\\.|[^"\\\n])*"|'[^'\n]*'/y],
    ["keyword", /\b(?:true|false|null|yes|no)\b/y],
    ["number", /-?\b\d+(?:\.\d+)?\b/y],
    ["plain", /[\w-]+|\s+|./y],
  ],
  md: [
    ["keyword", /^#{1,6} [^\n]*/my],
    ["string", /`[^`\n]+`/y],
    ["function", /\[[^\]\n]*\]\([^)\n]*\)/y],
    ["tag", /^\s*(?:[-*+]|\d+\.) /my],
    ["plain", /[^`[#\n-]+|\s+|./y],
  ],
  sh: [
    ["comment", /(?<![\w$])#[^\n]*/y],
    ["string", /"(?:\\.|[^"\\])*"|'[^']*'/y],
    ["attr", /\$(?:\{[^}\n]*\}|[A-Za-z_][\w]*|[@*#?$!0-9])/y],
    ["keyword", /\b(?:if|then|else|elif|fi|for|while|until|do|done|case|esac|in|function|return|export|local|set|unset|source)\b/y],
    ["tag", /(?<![\w-])--?[A-Za-z][\w-]*/y],
    ["number", /\b\d+\b/y],
    ["plain", /[A-Za-z_][\w.-]*|\s+|./y],
  ],
  css: [
    ["comment", /\/\*[\s\S]*?\*\//y],
    ["string", /"(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'/y],
    ["keyword", /@[\w-]+|!important/y],
    ["attr", /--?[A-Za-z][\w-]*(?=\s*:[^{};]*[;}])|[A-Za-z][\w-]*(?=\s*:[^{};]*[;}])/y],
    ["tag", /[.#]?[A-Za-z_-][\w-]*(?=[^{};]*\{)/y],
    ["number", /#[\da-fA-F]{3,8}\b|-?\d*\.?\d+(?:[a-z]+|%)?/y],
    ["function", /[A-Za-z-]+(?=\()/y],
    ["plain", /[A-Za-z_-][\w-]*|\s+|./y],
  ],
  plain: [["plain", /[\s\S]+/y]],
} satisfies Record<string, [string, RegExp][]>;

export type CodeLang = keyof typeof GRAMMARS;

const EXTENSIONS: Record<string, CodeLang> = { ts: "tsx", tsx: "tsx", js: "tsx", jsx: "tsx", mjs: "tsx", cjs: "tsx", go: "go", py: "py", json: "json", yaml: "yaml", yml: "yaml", sql: "sql", md: "md", html: "html", css: "css", sh: "sh", bash: "sh", zsh: "sh" };

export const langOf = (path: string): CodeLang => EXTENSIONS[path.split(".").pop()?.toLowerCase() ?? ""] ?? "plain";

export const guess = (code: string): CodeLang => {
  if (/^\s*<[a-z!]/.test(code)) return "html";
  if (/^\s*(?:npm|node|bun|git|https?:|[\w.-]+\/[\w./<>-]*\s*$)/m.test(code.split("\n")[0])) return "plain";
  return "tsx";
};

export function tokens(code: string, lang: CodeLang) {
  const grammar: [string, RegExp][] = GRAMMARS[lang] ?? GRAMMARS.plain;
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
