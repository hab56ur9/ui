import { parseMarkdown, type Align, type Tone } from "./parse";

export type Kind = "paragraph" | "h1" | "h2" | "h3" | "bullet" | "number" | "todo" | "quote" | "callout" | "code" | "ui" | "table" | "image" | "divider" | "raw";

export type EditorBlock = {
  id: string;
  kind: Kind;
  text: string;
  indent?: number;
  checked?: boolean;
  tone?: Tone;
  title?: string;
  lang?: string;
  rows?: string[][];
  align?: Align[];
  src?: string;
  alt?: string;
};

export const TEXT_KINDS: Kind[] = ["paragraph", "h1", "h2", "h3", "bullet", "number", "todo", "quote", "callout"];
export const LIST_KINDS: Kind[] = ["bullet", "number", "todo"];

let counter = 0;
export const newId = () => `b${Date.now().toString(36)}${(counter++).toString(36)}`;
export const make = (kind: Kind, patch: Partial<EditorBlock> = {}): EditorBlock => ({ id: newId(), kind, text: "", ...patch });

const ITEM = /^(\s*)([-*+]|\d+[.)])\s+(\[([ xX])\]\s+)?(.*)$/;
const TONE_NAME: Record<Tone, string> = { info: "NOTE", good: "TIP", warning: "WARNING" };
const cells = (line: string) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/(?<!\\)\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"));

function listItems(raw: string[]): EditorBlock[] {
  const items: EditorBlock[] = [];
  const base = raw[0]?.match(/^\s*/)?.[0].length ?? 0;
  for (const line of raw) {
    const match = line.match(ITEM);
    if (!match) {
      if (items.length && line.trim()) items[items.length - 1].text += `\n${line.trim()}`;
      continue;
    }
    const indent = Math.min(3, Math.floor(Math.max(0, match[1].length - base) / 2));
    const kind: Kind = match[3] ? "todo" : /\d/.test(match[2]) ? "number" : "bullet";
    items.push(make(kind, { text: match[5], indent, checked: match[4] ? match[4].toLowerCase() === "x" : undefined }));
  }
  return items;
}

export function fromMarkdown(markdown: string): EditorBlock[] {
  const doc = parseMarkdown(markdown);
  const blocks: EditorBlock[] = [];
  for (const segment of doc.segments) {
    const raw = doc.lines.slice(segment.start, segment.end);
    const node = segment.block;
    if (!node) {
      blocks.push(make("raw", { text: raw.join("\n") }));
      continue;
    }
    switch (node.kind) {
      case "heading":
        blocks.push(make(`h${Math.min(3, node.level)}` as Kind, { text: node.text }));
        break;
      case "paragraph":
        blocks.push(make("paragraph", { text: raw.join("\n") }));
        break;
      case "list":
        blocks.push(...listItems(raw));
        break;
      case "quote":
        blocks.push(make("quote", { text: raw.map((line) => line.replace(/^ {0,3}>\s?/, "")).join("\n") }));
        break;
      case "callout": {
        const body = raw.map((line) => line.replace(/^ {0,3}>\s?/, ""));
        blocks.push(make("callout", { tone: node.tone, title: node.title, text: body.slice(1).join("\n") }));
        break;
      }
      case "code":
        blocks.push(make(node.lang === "ui" ? "ui" : "code", { text: node.code, lang: node.lang }));
        break;
      case "table": {
        const rows = raw.filter((_, i) => i !== 1).map(cells);
        blocks.push(make("table", { text: "", rows, align: node.align }));
        break;
      }
      case "image":
        blocks.push(make("image", { src: node.src, alt: node.alt }));
        break;
      case "rule":
        blocks.push(make("divider"));
        break;
    }
  }
  return blocks.length ? blocks : [make("paragraph")];
}

const quoteLines = (text: string) =>
  text
    .split("\n")
    .map((line) => (line ? `> ${line}` : ">"))
    .join("\n");

export function blockMarkdown(block: EditorBlock, number = 1): string {
  const pad = "  ".repeat(block.indent ?? 0);
  switch (block.kind) {
    case "paragraph":
      return block.text;
    case "h1":
    case "h2":
    case "h3":
      return `${"#".repeat(Number(block.kind[1]))} ${block.text}`;
    case "bullet":
      return `${pad}- ${block.text}`;
    case "number":
      return `${pad}${number}. ${block.text}`;
    case "todo":
      return `${pad}- [${block.checked ? "x" : " "}] ${block.text}`;
    case "quote":
      return quoteLines(block.text);
    case "callout":
      return `> [!${TONE_NAME[block.tone ?? "info"]}]${block.title ? ` ${block.title}` : ""}${block.text ? `\n${quoteLines(block.text)}` : ""}`;
    case "code":
      return `\`\`\`${block.lang ?? ""}\n${block.text}\n\`\`\``;
    case "ui":
      return `\`\`\`ui\n${block.text}\n\`\`\``;
    case "table": {
      const rows = block.rows?.length ? block.rows : [["", ""]];
      const width = Math.max(...rows.map((row) => row.length));
      const line = (row: string[]) => `| ${Array.from({ length: width }, (_, i) => (row[i] ?? "").replace(/\|/g, "\\|")).join(" | ")} |`;
      const marks: Record<string, string> = { right: "---:", center: ":---:", left: ":---" };
      const divider = `| ${Array.from({ length: width }, (_, i) => marks[block.align?.[i] ?? ""] ?? "---").join(" | ")} |`;
      return [line(rows[0]), divider, ...rows.slice(1).map(line)].join("\n");
    }
    case "image":
      return `![${block.alt ?? ""}](${block.src ?? ""})`;
    case "divider":
      return "---";
    case "raw":
      return block.text;
  }
}

export function numbers(blocks: EditorBlock[]): number[] {
  const out: number[] = [];
  const counters: number[] = [];
  blocks.forEach((block, i) => {
    const indent = block.indent ?? 0;
    if (block.kind !== "number") {
      if (!LIST_KINDS.includes(block.kind)) counters.length = 0;
      out.push(0);
      return;
    }
    const previous = blocks[i - 1];
    const continues = previous && LIST_KINDS.includes(previous.kind) && (previous.kind === "number" || (previous.indent ?? 0) > indent);
    counters[indent] = continues && counters[indent] ? counters[indent] + 1 : 1;
    counters.length = indent + 1;
    out.push(counters[indent]);
  });
  return out;
}

export function toMarkdown(blocks: EditorBlock[]): string {
  const marks = numbers(blocks);
  return blocks
    .map((block, i) => {
      const text = blockMarkdown(block, marks[i]);
      const previous = blocks[i - 1];
      const tight = previous && LIST_KINDS.includes(block.kind) && LIST_KINDS.includes(previous.kind);
      return i === 0 ? text : `${tight ? "\n" : "\n\n"}${text}`;
    })
    .join("")
    .trim();
}
