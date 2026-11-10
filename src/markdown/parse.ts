export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong" | "em" | "del"; children: Inline[] }
  | { kind: "code"; text: string }
  | { kind: "link"; href: string; title?: string; children: Inline[] }
  | { kind: "image"; src: string; alt: string; title?: string }
  | { kind: "footnote"; id: string; number: number }
  | { kind: "break" };

export type ListItem = { checked?: boolean; children: Block[] };
export type Tone = "info" | "good" | "warning";
export type Align = "left" | "right" | "center" | undefined;

export type Block =
  | { kind: "heading"; level: number; children: Inline[]; text: string }
  | { kind: "paragraph"; children: Inline[] }
  | { kind: "list"; ordered: boolean; start: number; items: ListItem[] }
  | { kind: "quote"; children: Block[] }
  | { kind: "callout"; tone: Tone; title?: string; children: Block[] }
  | { kind: "code"; lang: string; code: string }
  | { kind: "table"; head: Inline[][]; align: Align[]; rows: Inline[][][] }
  | { kind: "image"; src: string; alt: string; title?: string }
  | { kind: "rule" };

export type Footnote = { id: string; number: number; children: Block[] };
export type Segment = { start: number; end: number; block?: Block };
export type MarkdownDocument = { blocks: Block[]; footnotes: Footnote[]; segments: Segment[]; lines: string[] };

type Refs = { links: Map<string, { href: string; title?: string }>; notes: Map<string, string>; order: string[] };

const CALLOUTS: Record<string, Tone> = { NOTE: "info", INFO: "info", TIP: "good", GOOD: "good", SUCCESS: "good", WARNING: "warning", CAUTION: "warning", IMPORTANT: "warning" };

const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([\w-]*)/;
const HEADING = /^ {0,3}(#{1,6})(?:\s+(.*?))?\s*#*\s*$/;
const SETEXT = /^ {0,3}(=+|-+)\s*$/;
const RULE = /^ {0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^ {0,3}>\s?/;
const BULLET = /^(\s*)([-*+])\s+(.*)$/;
const NUMBERED = /^(\s*)(\d{1,9})[.)]\s+(.*)$/;
const TASK = /^\[([ xX])\]\s+/;
const DIVIDER = /^\s*\|?\s*:?-+:?\s*(\|\s*:?-+:?\s*)*\|?\s*$/;
const INDENTED = /^ {4}/;
const IMAGE_ONLY = /^\s*!\[([^\]]*)\]\(([^)\s]+)(?:\s+"([^"]*)")?\)\s*$/;
const LINK_DEF = /^ {0,3}\[([^\]^][^\]]*)\]:\s*<?([^\s>]+)>?(?:\s+["'(](.*)["')])?\s*$/;
const NOTE_DEF = /^ {0,3}\[\^([^\]]+)\]:\s?(.*)$/;

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", copy: "©", reg: "®", trade: "™", hellip: "…", mdash: "—", ndash: "–", laquo: "«", raquo: "»", middot: "·", times: "×" };

const blank = (line: string) => line.trim() === "";
const indentOf = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;
const label = (text: string) => text.trim().toLowerCase().replace(/\s+/g, " ");
const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

const startsBlock = (line: string, next = "") =>
  FENCE.test(line) || HEADING.test(line) || RULE.test(line) || QUOTE.test(line) || BULLET.test(line) || NUMBERED.test(line) || (line.includes("|") && DIVIDER.test(next));

const SAFE_URL = /^(https?:|mailto:|tel:|\/|\.|#)/i;
const safe = (url: string) => (SAFE_URL.test(url) ? url : "#");

const decode = (text: string) =>
  text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, name: string) => {
    if (name[0] !== "#") return ENTITIES[name.toLowerCase()] ?? match;
    const code = name[1].toLowerCase() === "x" ? parseInt(name.slice(2), 16) : Number(name.slice(1));
    return code > 0 && code < 0x110000 ? String.fromCodePoint(code) : match;
  });

const BARE_URL = /^(?:https?:\/\/|www\.)[^\s<]*[^\s<.,:;"')\]!?]/i;

function parseInline(source: string, refs: Refs): Inline[] {
  const out: Inline[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push({ kind: "text", text: decode(text) });
    text = "";
  };
  const push = (node: Inline, length: number) => {
    flush();
    out.push(node);
    i += length;
  };
  let i = 0;
  while (i < source.length) {
    const rest = source.slice(i);
    const escaped = rest.match(/^\\([\\`*_~[\]()#!|>{}+.-])/);
    if (escaped) {
      text += escaped[1];
      i += 2;
      continue;
    }
    if (rest.startsWith("  \n") || rest.startsWith("\\\n")) {
      push({ kind: "break" }, rest.startsWith("  \n") ? 3 : 2);
      continue;
    }
    const code = rest.match(/^(`+)([\s\S]*?[^`])\1(?!`)/);
    if (code) {
      push({ kind: "code", text: code[2].replace(/^ (.*) $/, "$1") }, code[0].length);
      continue;
    }
    const auto = rest.match(/^<((?:https?|mailto):[^\s>]+|[^\s@>]+@[^\s@>]+\.[^\s@>]+)>/i);
    if (auto) {
      const href = auto[1].includes(":") ? auto[1] : `mailto:${auto[1]}`;
      push({ kind: "link", href: safe(href), children: [{ kind: "text", text: auto[1] }] }, auto[0].length);
      continue;
    }
    const note = rest.match(/^\[\^([^\]]+)\]/);
    if (note && refs.notes.has(note[1])) {
      if (!refs.order.includes(note[1])) refs.order.push(note[1]);
      push({ kind: "footnote", id: note[1], number: refs.order.indexOf(note[1]) + 1 }, note[0].length);
      continue;
    }
    const image = rest.match(/^!\[([^\]]*)\]\(<?([^)\s>]+)>?(?:\s+"([^"]*)")?\)/);
    if (image) {
      push({ kind: "image", alt: image[1], src: safe(image[2]), title: image[3] }, image[0].length);
      continue;
    }
    const link = rest.match(/^\[((?:[^\][]|\[[^\]]*\])+)\]\(<?([^)\s>]*)>?(?:\s+"([^"]*)")?\)/);
    if (link) {
      push({ kind: "link", href: safe(link[2]), title: link[3], children: parseInline(link[1], refs) }, link[0].length);
      continue;
    }
    const reference = rest.match(/^\[((?:[^\][]|\[[^\]]*\])+)\](?:\[([^\]]*)\])?/);
    const target = reference && refs.links.get(label(reference[2] || reference[1]));
    if (reference && target) {
      push({ kind: "link", href: safe(target.href), title: target.title, children: parseInline(reference[1], refs) }, reference[0].length);
      continue;
    }
    const bare = /[\s(*_~]/.test(source[i - 1] ?? " ") ? rest.match(BARE_URL) : null;
    if (bare) {
      const href = bare[0].toLowerCase().startsWith("www.") ? `http://${bare[0]}` : bare[0];
      push({ kind: "link", href: safe(href), children: [{ kind: "text", text: bare[0] }] }, bare[0].length);
      continue;
    }
    const strong = rest.match(/^(\*\*|__)(?=\S)([\s\S]*?\S)\1/);
    if (strong) {
      let inner = strong[2];
      let length = strong[0].length;
      const odd = (inner.match(new RegExp(`(?<!\\${strong[1][0]})\\${strong[1][0]}(?!\\${strong[1][0]})`, "g")) ?? []).length % 2 === 1;
      if (odd && source[i + length] === strong[1][0]) {
        inner += strong[1][0];
        length += 1;
      }
      push({ kind: "strong", children: parseInline(inner, refs) }, length);
      continue;
    }
    const del = rest.match(/^~~(?=\S)([\s\S]*?\S)~~/);
    if (del) {
      push({ kind: "del", children: parseInline(del[1], refs) }, del[0].length);
      continue;
    }
    const em = rest.match(/^([*_])(?=\S)([\s\S]*?\S)\1(?![*_])/);
    if (em && !(em[1] === "_" && /\w/.test(source[i - 1] ?? ""))) {
      push({ kind: "em", children: parseInline(em[2], refs) }, em[0].length);
      continue;
    }
    text += source[i];
    i += 1;
  }
  flush();
  return out;
}

function parseList(lines: string[], start: number, refs: Refs): [Block, number] {
  const first = lines[start].match(BULLET) ?? lines[start].match(NUMBERED);
  const ordered = !BULLET.test(lines[start]);
  const base = first?.[1].length ?? 0;
  const items: ListItem[] = [];
  let i = start;
  while (i < lines.length) {
    const match = ordered ? lines[i].match(NUMBERED) : lines[i].match(BULLET);
    if (!match || match[1].length !== base) break;
    const body = [match[3]];
    i += 1;
    while (i < lines.length) {
      const next = lines[i];
      if (blank(next)) {
        if (i + 1 < lines.length && indentOf(lines[i + 1]) > base) {
          body.push("");
          i += 1;
          continue;
        }
        break;
      }
      if (indentOf(next) > base) {
        body.push(next.slice(Math.min(indentOf(next), base + 2)));
        i += 1;
        continue;
      }
      if (BULLET.test(next) || NUMBERED.test(next) || startsBlock(next)) break;
      body.push(next.trim());
      i += 1;
    }
    const task = body[0].match(TASK);
    if (task) body[0] = body[0].slice(task[0].length);
    items.push({ checked: task ? task[1].toLowerCase() === "x" : undefined, children: parseBlocks(body.join("\n"), refs) });
    if (i < lines.length && blank(lines[i]) && i + 1 < lines.length && (ordered ? NUMBERED : BULLET).test(lines[i + 1]) && indentOf(lines[i + 1]) === base) i += 1;
  }
  return [{ kind: "list", ordered, start: ordered ? Number(first?.[2] ?? 1) : 1, items }, i];
}

function parseBlocks(source: string, refs: Refs, ranges?: Segment[]): Block[] {
  const lines = source.split("\n");
  const blocks: Block[] = [];
  let i = 0;
  const step = () => {
    const line = lines[i];
    if (blank(line)) {
      i += 1;
      return;
    }
    const fence = line.match(FENCE);
    if (fence) {
      const close = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`);
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !close.test(lines[i])) body.push(lines[i++]);
      i += 1;
      blocks.push({ kind: "code", lang: fence[2].toLowerCase(), code: body.join("\n") });
      return;
    }
    if (INDENTED.test(line)) {
      const body: string[] = [];
      while (i < lines.length && (INDENTED.test(lines[i]) || (blank(lines[i]) && INDENTED.test(lines[i + 1] ?? "")))) body.push(lines[i++].slice(4));
      blocks.push({ kind: "code", lang: "", code: body.join("\n") });
      return;
    }
    const heading = line.match(HEADING);
    if (heading) {
      const content = heading[2] ?? "";
      blocks.push({ kind: "heading", level: heading[1].length, children: parseInline(content, refs), text: content });
      i += 1;
      return;
    }
    if (RULE.test(line)) {
      blocks.push({ kind: "rule" });
      i += 1;
      return;
    }
    if (QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && !blank(lines[i]) && (QUOTE.test(lines[i]) || !startsBlock(lines[i]))) body.push(lines[i++].replace(QUOTE, ""));
      const callout = body[0]?.match(/^\[!(\w+)\]\s*(.*)$/);
      if (callout && CALLOUTS[callout[1].toUpperCase()]) {
        blocks.push({ kind: "callout", tone: CALLOUTS[callout[1].toUpperCase()], title: callout[2] || undefined, children: parseBlocks(body.slice(1).join("\n"), refs) });
        return;
      }
      blocks.push({ kind: "quote", children: parseBlocks(body.join("\n"), refs) });
      return;
    }
    if (BULLET.test(line) || NUMBERED.test(line)) {
      const [list, next] = parseList(lines, i, refs);
      blocks.push(list);
      i = next;
      return;
    }
    if (line.includes("|") && DIVIDER.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      const align = cells(lines[i + 1]).map((cell): Align => (cell.startsWith(":") && cell.endsWith(":") ? "center" : cell.endsWith(":") ? "right" : cell.startsWith(":") ? "left" : undefined));
      const rows: Inline[][][] = [];
      i += 2;
      while (i < lines.length && !blank(lines[i]) && lines[i].includes("|")) rows.push(cells(lines[i++]).map((cell) => parseInline(cell, refs)));
      blocks.push({ kind: "table", head: head.map((cell) => parseInline(cell, refs)), align, rows });
      return;
    }
    const image = line.match(IMAGE_ONLY);
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: safe(image[2]), title: image[3] });
      i += 1;
      return;
    }
    const body = [lines[i++]];
    while (i < lines.length && !blank(lines[i]) && !SETEXT.test(lines[i]) && !startsBlock(lines[i], lines[i + 1])) body.push(lines[i++]);
    const setext = i < lines.length ? lines[i].match(SETEXT) : null;
    if (setext) {
      const content = body.join("\n").trim();
      blocks.push({ kind: "heading", level: setext[1][0] === "=" ? 1 : 2, children: parseInline(content, refs), text: content });
      i += 1;
      return;
    }
    blocks.push({ kind: "paragraph", children: parseInline(body.join("\n"), refs) });
  };
  while (i < lines.length) {
    const begin = i;
    const count = blocks.length;
    step();
    if (ranges && blocks.length > count) ranges.push({ start: begin, end: i, block: blocks[blocks.length - 1] });
  }
  return blocks;
}

function collect(lines: string[]) {
  const refs: Refs = { links: new Map(), notes: new Map(), order: [] };
  const kept: string[] = [];
  const definitions: Segment[] = [];
  let fence: RegExp | null = null;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (fence) {
      if (fence.test(line)) fence = null;
      kept.push(line);
      continue;
    }
    const open = line.match(FENCE);
    if (open) {
      fence = new RegExp(`^ {0,3}${open[1][0]}{${open[1].length},}\\s*$`);
      kept.push(line);
      continue;
    }
    const definition = line.match(LINK_DEF);
    if (definition) {
      refs.links.set(label(definition[1]), { href: definition[2], title: definition[3] });
      definitions.push({ start: i, end: i + 1 });
      kept.push("");
      continue;
    }
    const note = line.match(NOTE_DEF);
    if (note) {
      const start = i;
      const body = [note[2]];
      while (i + 1 < lines.length && (/^ {2,}\S/.test(lines[i + 1]) || (blank(lines[i + 1]) && /^ {2,}\S/.test(lines[i + 2] ?? "")))) body.push(lines[++i].replace(/^ {2,4}/, ""));
      refs.notes.set(note[1], body.join("\n"));
      definitions.push({ start, end: i + 1 });
      for (let k = start; k <= i; k += 1) kept.push("");
      continue;
    }
    kept.push(line);
  }
  return { refs, definitions, source: kept.join("\n") };
}

export function parseMarkdown(markdown: string): MarkdownDocument {
  const lines = markdown.replace(/\r\n?/g, "\n").replace(/\t/g, "    ").split("\n");
  const { refs, definitions, source } = collect(lines);
  const ranges: Segment[] = [];
  const blocks = parseBlocks(source, refs, ranges);
  const footnotes: Footnote[] = [];
  for (let n = 0; n < refs.order.length; n += 1) {
    const id = refs.order[n];
    footnotes.push({ id, number: n + 1, children: parseBlocks(refs.notes.get(id) ?? "", refs) });
  }
  return { blocks, footnotes, lines, segments: [...ranges, ...definitions].sort((x, y) => x.start - y.start) };
}

export const inlineOf = (text: string) => parseInline(text, { links: new Map(), notes: new Map(), order: [] });
