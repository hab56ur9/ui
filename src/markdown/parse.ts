export type Inline =
  | { kind: "text"; text: string }
  | { kind: "strong" | "em" | "del"; children: Inline[] }
  | { kind: "code"; text: string }
  | { kind: "link"; href: string; children: Inline[] }
  | { kind: "image"; src: string; alt: string }
  | { kind: "break" };

export type ListItem = { checked?: boolean; children: Block[] };
export type Tone = "info" | "good" | "warning";

export type Block =
  | { kind: "heading"; level: number; children: Inline[]; text: string }
  | { kind: "paragraph"; children: Inline[] }
  | { kind: "list"; ordered: boolean; start: number; items: ListItem[] }
  | { kind: "quote"; children: Block[] }
  | { kind: "callout"; tone: Tone; title?: string; children: Block[] }
  | { kind: "code"; lang: string; code: string }
  | { kind: "table"; head: Inline[][]; align: ("left" | "right" | "center" | undefined)[]; rows: Inline[][][] }
  | { kind: "image"; src: string; alt: string }
  | { kind: "rule" };

const CALLOUTS: Record<string, Tone> = { NOTE: "info", INFO: "info", TIP: "good", GOOD: "good", SUCCESS: "good", WARNING: "warning", CAUTION: "warning", IMPORTANT: "warning" };

const FENCE = /^ {0,3}(`{3,}|~{3,})\s*([\w-]*)/;
const HEADING = /^ {0,3}(#{1,6})\s+(.*?)\s*#*\s*$/;
const RULE = /^ {0,3}([-*_])(\s*\1){2,}\s*$/;
const QUOTE = /^ {0,3}>\s?/;
const BULLET = /^(\s*)([-*+])\s+(.*)$/;
const NUMBERED = /^(\s*)(\d{1,9})[.)]\s+(.*)$/;
const TASK = /^\[([ xX])\]\s+/;
const DIVIDER = /^\s*\|?\s*:?-{2,}:?\s*(\|\s*:?-{2,}:?\s*)*\|?\s*$/;
const IMAGE_ONLY = /^\s*!\[([^\]]*)\]\(([^)\s]+)\)\s*$/;

const blank = (line: string) => line.trim() === "";
const indentOf = (line: string) => line.match(/^\s*/)?.[0].length ?? 0;
const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

const startsBlock = (line: string, next = "") =>
  FENCE.test(line) || HEADING.test(line) || RULE.test(line) || QUOTE.test(line) || BULLET.test(line) || NUMBERED.test(line) || (line.includes("|") && DIVIDER.test(next));

const SAFE_URL = /^(https?:|mailto:|tel:|\/|\.|#)/i;
const safe = (url: string) => (SAFE_URL.test(url) ? url : "#");

export function parseInline(source: string): Inline[] {
  const out: Inline[] = [];
  let text = "";
  const flush = () => {
    if (text) out.push({ kind: "text", text });
    text = "";
  };
  let i = 0;
  while (i < source.length) {
    const rest = source.slice(i);
    const escaped = rest.match(/^\\([\\`*_~[\]()#!|>-])/);
    if (escaped) {
      text += escaped[1];
      i += 2;
      continue;
    }
    if (rest.startsWith("  \n") || rest.startsWith("\\\n")) {
      flush();
      out.push({ kind: "break" });
      i += rest.startsWith("  \n") ? 3 : 2;
      continue;
    }
    const code = rest.match(/^(`+)([\s\S]*?[^`])\1(?!`)/);
    if (code) {
      flush();
      out.push({ kind: "code", text: code[2].trim() });
      i += code[0].length;
      continue;
    }
    const image = rest.match(/^!\[([^\]]*)\]\(([^)\s]+)\)/);
    if (image) {
      flush();
      out.push({ kind: "image", alt: image[1], src: safe(image[2]) });
      i += image[0].length;
      continue;
    }
    const link = rest.match(/^\[([^\]]+)\]\(([^)\s]+)\)/);
    if (link) {
      flush();
      out.push({ kind: "link", href: safe(link[2]), children: parseInline(link[1]) });
      i += link[0].length;
      continue;
    }
    const strong = rest.match(/^(\*\*|__)(?=\S)([\s\S]*?\S)\1/);
    if (strong) {
      flush();
      out.push({ kind: "strong", children: parseInline(strong[2]) });
      i += strong[0].length;
      continue;
    }
    const del = rest.match(/^~~(?=\S)([\s\S]*?\S)~~/);
    if (del) {
      flush();
      out.push({ kind: "del", children: parseInline(del[1]) });
      i += del[0].length;
      continue;
    }
    const em = rest.match(/^([*_])(?=\S)([\s\S]*?\S)\1(?![*_])/);
    if (em && !(em[1] === "_" && /\w/.test(source[i - 1] ?? ""))) {
      flush();
      out.push({ kind: "em", children: parseInline(em[2]) });
      i += em[0].length;
      continue;
    }
    text += source[i];
    i += 1;
  }
  flush();
  return out;
}

function parseList(lines: string[], start: number): [Block, number] {
  const first = lines[start].match(BULLET) ?? lines[start].match(NUMBERED);
  const ordered = !BULLET.test(lines[start]);
  const base = first?.[1].length ?? 0;
  const items: ListItem[] = [];
  let i = start;
  while (i < lines.length) {
    const line = lines[i];
    const match = ordered ? line.match(NUMBERED) : line.match(BULLET);
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
    items.push({ checked: task ? task[1].toLowerCase() === "x" : undefined, children: parseBlocks(body.join("\n")) });
    if (i < lines.length && blank(lines[i]) && i + 1 < lines.length && (ordered ? NUMBERED : BULLET).test(lines[i + 1]) && indentOf(lines[i + 1]) === base) i += 1;
  }
  return [{ kind: "list", ordered, start: ordered ? Number(first?.[2] ?? 1) : 1, items }, i];
}

export function parseBlocks(source: string): Block[] {
  const lines = source.replace(/\r\n?/g, "\n").replace(/\t/g, "  ").split("\n");
  const blocks: Block[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (blank(line)) {
      i += 1;
      continue;
    }
    const fence = line.match(FENCE);
    if (fence) {
      const close = new RegExp(`^ {0,3}${fence[1][0]}{${fence[1].length},}\\s*$`);
      const body: string[] = [];
      i += 1;
      while (i < lines.length && !close.test(lines[i])) body.push(lines[i++]);
      i += 1;
      blocks.push({ kind: "code", lang: fence[2].toLowerCase(), code: body.join("\n") });
      continue;
    }
    const heading = line.match(HEADING);
    if (heading) {
      blocks.push({ kind: "heading", level: heading[1].length, children: parseInline(heading[2]), text: heading[2] });
      i += 1;
      continue;
    }
    if (RULE.test(line)) {
      blocks.push({ kind: "rule" });
      i += 1;
      continue;
    }
    if (QUOTE.test(line)) {
      const body: string[] = [];
      while (i < lines.length && !blank(lines[i]) && (QUOTE.test(lines[i]) || !startsBlock(lines[i]))) body.push(lines[i++].replace(QUOTE, ""));
      const callout = body[0]?.match(/^\[!(\w+)\]\s*(.*)$/);
      if (callout && CALLOUTS[callout[1].toUpperCase()]) {
        blocks.push({ kind: "callout", tone: CALLOUTS[callout[1].toUpperCase()], title: callout[2] || undefined, children: parseBlocks(body.slice(1).join("\n")) });
        continue;
      }
      blocks.push({ kind: "quote", children: parseBlocks(body.join("\n")) });
      continue;
    }
    if (BULLET.test(line) || NUMBERED.test(line)) {
      const [list, next] = parseList(lines, i);
      blocks.push(list);
      i = next;
      continue;
    }
    if (line.includes("|") && DIVIDER.test(lines[i + 1] ?? "")) {
      const head = cells(line);
      const align = cells(lines[i + 1]).map((cell) => (cell.startsWith(":") && cell.endsWith(":") ? "center" : cell.endsWith(":") ? "right" : cell.startsWith(":") ? "left" : undefined));
      const rows: Inline[][][] = [];
      i += 2;
      while (i < lines.length && !blank(lines[i]) && lines[i].includes("|")) rows.push(cells(lines[i++]).map(parseInline));
      blocks.push({ kind: "table", head: head.map(parseInline), align, rows });
      continue;
    }
    const image = line.match(IMAGE_ONLY);
    if (image) {
      blocks.push({ kind: "image", alt: image[1], src: safe(image[2]) });
      i += 1;
      continue;
    }
    const body = [lines[i++]];
    while (i < lines.length && !blank(lines[i]) && !startsBlock(lines[i], lines[i + 1])) body.push(lines[i++]);
    blocks.push({ kind: "paragraph", children: parseInline(body.join("\n")) });
  }
  return blocks;
}
