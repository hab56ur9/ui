import { useEffect, useLayoutEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Icon, type IconName } from "../Icon";
import { useI18n, type MessageKey } from "../i18n";
import type { JsonUIAction, JsonUIFormat } from "../JsonUI";
import { block, footnoteList } from "./Markdown";
import { parseMarkdown, type Segment } from "./parse";

export type MarkdownEditorProps = {
  defaultValue?: string;
  onChange?: (markdown: string) => void;
  data?: Record<string, unknown>;
  formats?: Record<string, JsonUIFormat>;
  onAction?: (action: JsonUIAction) => void;
};

type Command = { id: MessageKey; icon: IconName; template: string; caret?: number };

const COMMANDS: Command[] = [
  { id: "md.paragraph", icon: "menu", template: "" },
  { id: "md.heading1", icon: "chevron-right", template: "# " },
  { id: "md.heading2", icon: "chevron-right", template: "## " },
  { id: "md.heading3", icon: "chevron-right", template: "### " },
  { id: "md.bullets", icon: "menu", template: "- " },
  { id: "md.numbers", icon: "menu", template: "1. " },
  { id: "md.todo", icon: "check", template: "- [ ] " },
  { id: "md.quote", icon: "message", template: "> " },
  { id: "md.note", icon: "info", template: "> [!NOTE] \n> ", caret: 10 },
  { id: "md.warning", icon: "warning", template: "> [!WARNING] \n> ", caret: 13 },
  { id: "md.table", icon: "table", template: "| A | B |\n| --- | --- |\n|  |  |", caret: 2 },
  { id: "md.code", icon: "copy", template: "```ts\n\n```", caret: 6 },
  { id: "md.rule", icon: "minus", template: "---" },
  { id: "md.image", icon: "image", template: "![](https://)", caret: 2 },
  { id: "md.stat", icon: "chart-bar", template: '```ui\n{ "type": "Stat", "props": { "label": "Label", "value": "1,234", "delta": { "change": 0.1 } } }\n```', caret: 6 },
];

const MULTI = /^(\s*([-*+]|\d+[.)])\s|>|\||```|~~~| {4})/;
const ITEM = /^(\s*)([-*+]|(\d+)([.)]))\s(\[[ xX]\]\s)?(.*)$/;

type Editing = { start: number; end: number; draft: string; caret?: number };

export function MarkdownEditor({ defaultValue = "", onChange, ...ctxProps }: MarkdownEditorProps) {
  const { text } = useI18n();
  const [source, setSource] = useState(defaultValue);
  const [editing, setEditing] = useState<Editing | null>(null);
  const [menu, setMenu] = useState(0);
  const area = useRef<HTMLTextAreaElement>(null);

  const doc = useMemo(() => parseMarkdown(source), [source]);
  const lines = doc.lines;
  const ctx = { ...ctxProps, seen: new Map<string, number>() };

  const commit = (next: string) => {
    setSource(next);
    onChange?.(next.replace(/\n{3,}/g, "\n\n").trim());
  };
  const join = (before: string[], middle: string, after: string[]) => [...before, ...middle.split("\n"), ...after].join("\n");
  const begin = (start: number, end: number, caret?: number) => setEditing({ start, end, draft: lines.slice(start, end).join("\n"), caret });
  const place = (before: string[], draft: string, after: string[]) => {
    const head = [...before, ""];
    const tail = after.length ? ["", ...after] : [];
    commit(join(head, draft, tail));
    setEditing({ start: head.length, end: head.length + draft.split("\n").length, draft, caret: draft.length });
  };
  const insertAt = (line: number, draft = "") => place(lines.slice(0, line), draft, lines.slice(line));

  const query = editing?.draft.startsWith("/") && !editing.draft.includes("\n") ? editing.draft.slice(1).toLowerCase() : null;
  const options = query === null ? [] : COMMANDS.filter((command) => text(command.id).toLowerCase().includes(query) || command.id.includes(query));

  useLayoutEffect(() => {
    if (!editing || !area.current) return;
    const el = area.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
    if (editing.caret !== undefined) {
      el.focus();
      el.setSelectionRange(editing.caret, editing.caret);
      setEditing({ ...editing, caret: undefined });
    }
  }, [editing]);

  useEffect(() => setMenu(0), [query]);

  const update = (draft: string, caret?: number) => {
    if (!editing) return;
    const before = lines.slice(0, editing.start);
    const after = lines.slice(editing.end);
    commit(join(before, draft, after));
    setEditing({ start: editing.start, end: editing.start + draft.split("\n").length, draft, caret });
  };

  const choose = (command: Command) => update(command.template, command.caret ?? command.template.length);

  const neighbors = (current: Editing) => {
    const segments = doc.segments.filter((segment) => segment.end <= current.start || segment.start >= current.end);
    return { previous: [...segments].reverse().find((segment) => segment.end <= current.start), next: segments.find((segment) => segment.start >= current.end) };
  };

  const onKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (!editing) return;
    const el = e.currentTarget;
    const atStart = el.selectionStart === 0 && el.selectionEnd === 0;
    const atEnd = el.selectionStart === el.value.length;
    if (options.length) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setMenu((menu + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        choose(options[menu]);
        return;
      }
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setEditing(null);
      return;
    }
    if (e.key === "Enter" && !e.shiftKey && atEnd) {
      const rows = editing.draft.split("\n");
      const last = rows[rows.length - 1];
      const item = last.match(ITEM);
      const quote = /^>\s?/.test(last) && !/^> \[!/.test(last);
      const split = (kept: string[]) => {
        e.preventDefault();
        place([...lines.slice(0, editing.start), ...kept], "", lines.slice(editing.end));
      };
      if (item && !item[6].trim()) return split(rows.slice(0, -1));
      if (item) {
        e.preventDefault();
        const marker = item[3] ? `${Number(item[3]) + 1}${item[4]}` : item[2];
        const next = `${item[1]}${marker} ${item[5] ? "[ ] " : ""}`;
        update(`${editing.draft}\n${next}`, editing.draft.length + next.length + 1);
        return;
      }
      if (quote && rows.length > 1 && !last.replace(/^>\s?/, "").trim()) return split(rows.slice(0, -1));
      if (quote) {
        e.preventDefault();
        update(`${editing.draft}\n> `, editing.draft.length + 3);
        return;
      }
      if (!MULTI.test(editing.draft) && !editing.draft.includes("\n")) return split(editing.draft ? rows : []);
    }
    if (e.key === "Backspace" && editing.draft === "") {
      e.preventDefault();
      const { previous } = neighbors(editing);
      const before = lines.slice(0, editing.start);
      while (before.length && before[before.length - 1] === "") before.pop();
      const after = lines.slice(editing.end);
      while (after.length && after[0] === "") after.shift();
      const next = [...before, ...(before.length && after.length ? [""] : []), ...after].join("\n");
      commit(next);
      setEditing(null);
      if (previous) {
        const draft = lines.slice(previous.start, previous.end).join("\n");
        setEditing({ start: previous.start, end: previous.end, draft, caret: draft.length });
      }
      return;
    }
    const { previous, next } = neighbors(editing);
    if (e.key === "ArrowUp" && atStart && previous) {
      e.preventDefault();
      begin(previous.start, previous.end, lines.slice(previous.start, previous.end).join("\n").length);
      return;
    }
    if (e.key === "ArrowDown" && atEnd && next) {
      e.preventDefault();
      begin(next.start, next.end, 0);
    }
  };

  const view = (segment: Segment, i: number) => {
    const raw = lines.slice(segment.start, segment.end).join("\n");
    return (
      <div key={`${segment.start}:${i}`} className="md-block" onClick={() => begin(segment.start, segment.end, raw.length)}>
        <button
          type="button"
          className="md-add"
          aria-label={text("md.add")}
          title={text("md.add")}
          onClick={(e) => {
            e.stopPropagation();
            insertAt(segment.end, "/");
          }}
        >
          <Icon name="plus" size="sm" />
        </button>
        {segment.block ? block(segment.block, ctx, i) : <code className="md-definition">{raw}</code>}
      </div>
    );
  };

  const shown = editing ? doc.segments.filter((segment) => segment.end <= editing.start || segment.start >= editing.end) : doc.segments;
  const cut = editing ? shown.findIndex((segment) => segment.start >= editing.end) : -1;
  const head = editing ? (cut === -1 ? shown : shown.slice(0, cut)) : shown;
  const tail = editing && cut !== -1 ? shown.slice(cut) : [];

  return (
    <div className="markdown md-editor">
      {head.map(view)}
      {editing && (
        <div className="md-block is-editing">
          <textarea
            ref={area}
            className="md-input"
            value={editing.draft}
            rows={1}
            placeholder={text("md.placeholder")}
            aria-label={text("md.block")}
            onChange={(e) => update(e.target.value)}
            onKeyDown={onKey}
            onBlur={(e) => {
              if (!e.currentTarget.closest(".md-block")?.contains(e.relatedTarget as Node)) setEditing(null);
            }}
          />
          {options.length > 0 && (
            <ul className="md-menu" role="listbox" aria-label={text("md.commands")}>
              {options.map((command, i) => (
                <li key={command.id} role="option" aria-selected={i === menu}>
                  <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(command)}>
                    <Icon name={command.icon} size="sm" />
                    {text(command.id)}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {tail.map((segment, i) => view(segment, head.length + i + 1))}
      {footnoteList(doc.footnotes, ctx)}
      <button type="button" className="md-append" onClick={() => insertAt(lines.length)}>
        <Icon name="plus" size="sm" />
        {text("md.add")}
      </button>
    </div>
  );
}
