import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { CodeBlock, type CodeLang } from "../Code";
import { DataTable } from "../DataTable";
import { Icon, type IconName } from "../Icon";
import { useI18n, type MessageKey } from "../i18n";
import { JsonUI, type JsonUIAction, type JsonUIFormat, type JsonUINode } from "../JsonUI";
import { Callout } from "../Callout";
import { fromMarkdown, LIST_KINDS, make, numbers, TEXT_KINDS, toMarkdown, type EditorBlock, type Kind } from "./blocks";
import { MermaidView, parseMermaid } from "./mermaid";
import { parseMarkdown } from "./parse";
import { Footnotes, renderInline, slug } from "./render";

export type MarkdownProps = {
  children?: string;
  defaultValue?: string;
  readOnly?: boolean;
  onChange?: (markdown: string) => void;
  data?: Record<string, unknown>;
  formats?: Record<string, JsonUIFormat>;
  onAction?: (action: JsonUIAction) => void;
};

type Focus = { id: string; caret: number | "end" } | null;
type Command = { id: MessageKey; icon: IconName; apply: () => Partial<EditorBlock> & { kind: Kind } };

const DAY = 86400000;
const START = new Date(2026, 10, 3).getTime();
const json = (value: unknown) => JSON.stringify(value, null, 2);

const COMMANDS: Command[] = [
  { id: "md.paragraph", icon: "menu", apply: () => ({ kind: "paragraph" }) },
  { id: "md.heading1", icon: "chevron-right", apply: () => ({ kind: "h1" }) },
  { id: "md.heading2", icon: "chevron-right", apply: () => ({ kind: "h2" }) },
  { id: "md.heading3", icon: "chevron-right", apply: () => ({ kind: "h3" }) },
  { id: "md.bullets", icon: "menu", apply: () => ({ kind: "bullet" }) },
  { id: "md.numbers", icon: "menu", apply: () => ({ kind: "number" }) },
  { id: "md.todo", icon: "check", apply: () => ({ kind: "todo", checked: false }) },
  { id: "md.quote", icon: "message", apply: () => ({ kind: "quote" }) },
  { id: "md.note", icon: "info", apply: () => ({ kind: "callout", tone: "info" }) },
  { id: "md.warning", icon: "warning", apply: () => ({ kind: "callout", tone: "warning" }) },
  { id: "md.code", icon: "copy", apply: () => ({ kind: "code", lang: "ts" }) },
  {
    id: "md.table",
    icon: "table",
    apply: () => ({
      kind: "table",
      rows: [
        ["", ""],
        ["", ""],
      ],
    }),
  },
  { id: "md.image", icon: "image", apply: () => ({ kind: "image", src: "", alt: "" }) },
  { id: "md.rule", icon: "minus", apply: () => ({ kind: "divider" }) },
  { id: "md.stat", icon: "chart-bar", apply: () => ({ kind: "ui", text: json({ type: "Stat", props: { label: "Label", value: "1,234", delta: { change: 0.1 } } }) }) },
  {
    id: "md.chart",
    icon: "chart-line",
    apply: () => ({
      kind: "ui",
      text: json({ type: "Widget", props: { id: "trend", title: "Trend", w: 12, h: 3 }, children: { type: "LineChart", props: { series: [{ name: "Visits", color: 1, points: [3, 5, 4, 6, 8, 7, 9].map((v, i) => ({ t: START + i * DAY, v })) }] } } }),
    }),
  },
  { id: "md.button", icon: "plus", apply: () => ({ kind: "ui", text: json({ type: "Button", props: { variant: "primary" }, children: "Button" }) }) },
  { id: "md.calendar", icon: "calendar", apply: () => ({ kind: "ui", text: json({ type: "Calendar" }) }) },
  { id: "md.card", icon: "image", apply: () => ({ kind: "ui", text: json({ type: "ImageCard", props: { image: { alt: "Image", seed: 2 }, title: "Title", description: "Description" } }) }) },
];

const SHORTCUTS: [RegExp, (match: RegExpMatchArray) => Partial<EditorBlock> & { kind: Kind }][] = [
  [/^(#{1,3}) ([\s\S]*)$/, (m) => ({ kind: `h${m[1].length}` as Kind, text: m[2] })],
  [/^(?:\[ ?\]|- \[ \]) ([\s\S]*)$/, (m) => ({ kind: "todo", checked: false, text: m[1] })],
  [/^[-*+] ([\s\S]*)$/, (m) => ({ kind: "bullet", text: m[1] })],
  [/^1[.)] ([\s\S]*)$/, (m) => ({ kind: "number", text: m[1] })],
  [/^> ([\s\S]*)$/, (m) => ({ kind: "quote", text: m[1] })],
];

const LANGS: Record<string, CodeLang> = { tsx: "tsx", ts: "tsx", typescript: "tsx", jsx: "tsx", js: "tsx", javascript: "tsx", html: "html", json: "json", sql: "sql" };

function grow(el: HTMLTextAreaElement | null) {
  if (!el) return;
  el.style.height = "auto";
  el.style.height = `${el.scrollHeight}px`;
}

export function Markdown({ children, defaultValue, readOnly = false, onChange, data, formats, onAction }: MarkdownProps) {
  const { text } = useI18n();
  const source = defaultValue ?? children ?? "";
  const [own, setBlocks] = useState<EditorBlock[]>(() => fromMarkdown(source));
  const fixed = useMemo(() => (readOnly ? fromMarkdown(source) : null), [readOnly, source]);
  const blocks = fixed ?? own;
  const refs = useMemo(() => parseMarkdown(toMarkdown(blocks)).refs, [blocks]);
  const inline = (value: string) => renderInline(value, refs);
  const seen = new Map<string, number>();
  const [focus, setFocus] = useState<Focus>(null);
  const [menu, setMenu] = useState(0);
  const [drag, setDrag] = useState<{ id: string; over: number } | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const marks = numbers(blocks);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange?.(toMarkdown(blocks));
  }, [blocks]);

  const indexOf = (id: string) => blocks.findIndex((block) => block.id === id);
  const patch = (id: string, change: Partial<EditorBlock>) => setBlocks((list) => list.map((block) => (block.id === id ? { ...block, ...change } : block)));
  const insertAfter = (id: string, block: EditorBlock, caret: number | "end" = 0) => {
    setBlocks((list) => {
      const i = list.findIndex((item) => item.id === id);
      return [...list.slice(0, i + 1), block, ...list.slice(i + 1)];
    });
    setFocus({ id: block.id, caret });
  };
  const remove = (id: string, then?: Focus) => {
    setBlocks((list) => {
      const next = list.filter((block) => block.id !== id);
      return next.length ? next : [make("paragraph")];
    });
    setFocus(then ?? null);
  };
  const move = (id: string, to: number) =>
    setBlocks((list) => {
      const from = list.findIndex((block) => block.id === id);
      if (from === -1 || to === from || to === from + 1) return list;
      const next = [...list];
      const [item] = next.splice(from, 1);
      next.splice(to > from ? to - 1 : to, 0, item);
      return next;
    });
  const neighbor = (id: string, step: number) => blocks[indexOf(id) + step];

  const current = focus ? blocks.find((block) => block.id === focus.id) : undefined;
  const query = current && TEXT_KINDS.includes(current.kind) && current.text.startsWith("/") && !current.text.includes("\n") ? current.text.slice(1).toLowerCase() : null;
  const options = query === null ? [] : COMMANDS.filter((command) => text(command.id).toLowerCase().includes(query) || command.id.includes(query));
  useEffect(() => setMenu(0), [query]);

  const choose = (block: EditorBlock, command: Command) => {
    const change = command.apply();
    setBlocks((list) => list.map((item) => (item.id === block.id ? { id: item.id, text: "", indent: item.indent, ...change } : item)));
    if (change.kind === "divider") {
      const next = make("paragraph");
      setBlocks((list) => {
        const i = list.findIndex((item) => item.id === block.id);
        return [...list.slice(0, i + 1), next, ...list.slice(i + 1)];
      });
      setFocus({ id: next.id, caret: 0 });
      return;
    }
    setFocus({ id: block.id, caret: "end" });
  };

  const onTextKey = (block: EditorBlock, e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.nativeEvent.isComposing) return;
    const el = e.currentTarget;
    const start = el.selectionStart;
    const collapsed = start === el.selectionEnd;
    if (options.length && focus?.id === block.id) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        setMenu((menu + (e.key === "ArrowDown" ? 1 : -1) + options.length) % options.length);
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        choose(block, options[menu]);
        return;
      }
      if (e.key === "Escape") {
        e.preventDefault();
        patch(block.id, { text: "" });
        return;
      }
    }
    if (e.altKey && e.shiftKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
      e.preventDefault();
      const i = indexOf(block.id);
      move(block.id, e.key === "ArrowUp" ? Math.max(0, i - 1) : Math.min(blocks.length, i + 2));
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (LIST_KINDS.includes(block.kind) && !block.text) {
        if (block.indent) patch(block.id, { indent: block.indent - 1 });
        else patch(block.id, { kind: "paragraph", checked: undefined });
        return;
      }
      const before = block.text.slice(0, start);
      const after = block.text.slice(el.selectionEnd);
      patch(block.id, { text: before });
      const keep = LIST_KINDS.includes(block.kind) ? { kind: block.kind, indent: block.indent, checked: block.kind === "todo" ? false : undefined } : { kind: "paragraph" as Kind };
      insertAfter(block.id, make(keep.kind, { ...keep, text: after }), 0);
      return;
    }
    if (e.key === "Backspace" && collapsed && start === 0) {
      if (block.kind !== "paragraph") {
        e.preventDefault();
        if (LIST_KINDS.includes(block.kind) && block.indent) patch(block.id, { indent: block.indent - 1 });
        else patch(block.id, { kind: "paragraph", checked: undefined, tone: undefined, title: undefined });
        return;
      }
      const previous = neighbor(block.id, -1);
      if (!previous) return;
      e.preventDefault();
      if (TEXT_KINDS.includes(previous.kind)) {
        const caret = previous.text.length;
        patch(previous.id, { text: previous.text + block.text });
        remove(block.id, { id: previous.id, caret });
        return;
      }
      if (!block.text) remove(block.id, { id: previous.id, caret: "end" });
      return;
    }
    if (e.key === "Tab" && LIST_KINDS.includes(block.kind)) {
      e.preventDefault();
      patch(block.id, { indent: Math.max(0, Math.min(3, (block.indent ?? 0) + (e.shiftKey ? -1 : 1))) });
      return;
    }
    if (e.key === "ArrowUp" && collapsed && !block.text.slice(0, start).includes("\n")) {
      const previous = neighbor(block.id, -1);
      if (previous) {
        e.preventDefault();
        setFocus({ id: previous.id, caret: "end" });
      }
      return;
    }
    if (e.key === "ArrowDown" && collapsed && !block.text.slice(start).includes("\n")) {
      const next = neighbor(block.id, 1);
      if (next) {
        e.preventDefault();
        setFocus({ id: next.id, caret: 0 });
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      el.blur();
    }
  };

  const onText = (block: EditorBlock, value: string) => {
    if (block.kind === "paragraph") {
      if (value === "---") {
        patch(block.id, { kind: "divider", text: "" });
        insertAfter(block.id, make("paragraph"), 0);
        return;
      }
      const fence = value.match(/^```(\w*)$/);
      if (fence) {
        patch(block.id, { kind: fence[1] === "ui" ? "ui" : "code", lang: fence[1] || "ts", text: "" });
        setFocus({ id: block.id, caret: 0 });
        return;
      }
      for (const [pattern, change] of SHORTCUTS) {
        const match = value.match(pattern);
        if (match) {
          patch(block.id, change(match));
          setFocus({ id: block.id, caret: change(match).text?.length ?? 0 });
          return;
        }
      }
    }
    patch(block.id, { text: value });
  };

  const leave = (id: string, related: EventTarget | null) => {
    const row = root.current?.querySelector(`[data-id="${id}"]`);
    if (related instanceof Node && row?.contains(related)) return;
    setFocus((value) => (value?.id === id ? null : value));
  };

  const startDrag = (block: EditorBlock, e: ReactPointerEvent) => {
    e.preventDefault();
    setFocus(null);
    setDrag({ id: block.id, over: indexOf(block.id) });
    const rows = [...(root.current?.querySelectorAll<HTMLElement>(":scope > .md-row") ?? [])];
    const onMove = (event: PointerEvent) => {
      const over = rows.findIndex((row) => event.clientY < row.getBoundingClientRect().top + row.offsetHeight / 2);
      setDrag({ id: block.id, over: over === -1 ? rows.length : over });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setDrag((value) => {
        if (value) move(value.id, value.over);
        return null;
      });
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  const rows = blocks.map((block, i) =>
    readOnly && block.kind === "raw" ? null : (
      <Row
        key={block.id}
        block={block}
        number={marks[i]}
        readOnly={readOnly}
        inline={inline}
        anchor={["h1", "h2", "h3"].includes(block.kind) ? slug(block.text, seen) : undefined}
        focus={focus?.id === block.id ? focus : null}
        dropBefore={drag?.over === i && drag.id !== block.id}
        dropAfter={drag?.over === blocks.length && i === blocks.length - 1}
        dragging={drag?.id === block.id}
        text={text}
        onFocus={(caret) => setFocus({ id: block.id, caret })}
        onLeave={(related) => leave(block.id, related)}
        onKey={(e) => onTextKey(block, e)}
        onText={(value) => onText(block, value)}
        onPatch={(change) => patch(block.id, change)}
        onRemove={() => {
          const previous = neighbor(block.id, -1);
          remove(block.id, previous ? { id: previous.id, caret: "end" } : null);
        }}
        onNext={() => {
          const next = neighbor(block.id, 1);
          if (next) setFocus({ id: next.id, caret: 0 });
          else insertAfter(block.id, make("paragraph"), 0);
        }}
        onPrevious={() => {
          const previous = neighbor(block.id, -1);
          if (previous) setFocus({ id: previous.id, caret: "end" });
        }}
        onAdd={() => insertAfter(block.id, make("paragraph", { text: "/" }), 1)}
        onGrab={(e) => startDrag(block, e)}
        menu={
          focus?.id === block.id && options.length > 0 ? (
            <ul className="md-menu" role="listbox" aria-label={text("md.commands")}>
              {options.map((command, k) => (
                <li key={command.id} role="option" aria-selected={k === menu}>
                  <button type="button" tabIndex={-1} onMouseDown={(e) => e.preventDefault()} onClick={() => choose(block, command)}>
                    <Icon name={command.icon} size="sm" />
                    {text(command.id)}
                  </button>
                </li>
              ))}
            </ul>
          ) : null
        }
        ui={(source) => {
          try {
            return <JsonUI node={JSON.parse(source) as JsonUINode} data={data} formats={formats} onAction={onAction} />;
          } catch {
            return <p className="md-error">{text("md.invalid")}</p>;
          }
        }}
      />
    ),
  );
  const isList = (i: number) => readOnly && ["bullet", "number", "todo"].includes(blocks[i]?.kind ?? "");
  const content = rows.reduce<ReactNode[]>((out, row, i) => {
    if (!isList(i)) return [...out, row];
    if (isList(i - 1)) return out;
    let end = i;
    while (isList(end + 1)) end += 1;
    return [
      ...out,
      <div key={`list-${blocks[i].id}`} role="list" className="md-list">
        {rows.slice(i, end + 1)}
      </div>,
    ];
  }, []);

  return (
    <div ref={root} className={`markdown md-editor${readOnly ? " is-read-only" : ""}${drag ? " is-dragging" : ""}`}>
      {content}
      <Footnotes refs={refs} />
      {!readOnly && (
        <button type="button" className="md-append" onClick={() => insertAfter(blocks[blocks.length - 1].id, make("paragraph"), 0)}>
          <Icon name="plus" size="sm" />
          {text("md.add")}
        </button>
      )}
    </div>
  );
}

type RowProps = {
  block: EditorBlock;
  readOnly: boolean;
  inline: (value: string) => ReactNode;
  anchor?: string;
  number: number;
  focus: Focus;
  dropBefore: boolean;
  dropAfter: boolean;
  dragging: boolean;
  text: (key: MessageKey) => string;
  onFocus: (caret: number | "end") => void;
  onLeave: (related: EventTarget | null) => void;
  onKey: (e: KeyboardEvent<HTMLTextAreaElement>) => void;
  onText: (value: string) => void;
  onPatch: (change: Partial<EditorBlock>) => void;
  onRemove: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onAdd: () => void;
  onGrab: (e: ReactPointerEvent) => void;
  menu: ReactNode;
  ui: (source: string) => ReactNode;
};

function Row({ block, readOnly, inline, anchor, number, focus, dropBefore, dropAfter, dragging, text, onFocus, onLeave, onKey, onText, onPatch, onRemove, onNext, onPrevious, onAdd, onGrab, menu, ui }: RowProps) {
  const field = useRef<HTMLTextAreaElement & HTMLInputElement>(null);
  const editing = focus !== null;

  useLayoutEffect(() => {
    if (!focus) return;
    const el = field.current;
    if (!el) return;
    grow(el as HTMLTextAreaElement);
    if (document.activeElement !== el) el.focus();
    const caret = focus.caret === "end" ? el.value.length : Math.min(focus.caret, el.value.length);
    el.setSelectionRange?.(caret, caret);
  }, [focus, block.kind]);

  useLayoutEffect(() => {
    if (editing) grow(field.current as HTMLTextAreaElement);
  });

  const blockKey = (e: KeyboardEvent<HTMLElement>) => {
    const el = e.target as HTMLTextAreaElement;
    if (e.key === "Escape") {
      e.preventDefault();
      el.blur?.();
      return;
    }
    if (e.key === "Backspace" && !(el.value ?? "")) {
      e.preventDefault();
      onRemove();
      return;
    }
    if (e.key === "ArrowDown" && el.selectionStart === el.value?.length) {
      e.preventDefault();
      onNext();
      return;
    }
    if (e.key === "ArrowUp" && el.selectionStart === 0 && el.selectionEnd === 0) {
      e.preventDefault();
      onPrevious();
    }
  };

  const area = (className: string, placeholder?: string) => <textarea ref={field} className={`md-field ${className}`} rows={1} value={block.text} placeholder={placeholder} aria-label={text("md.block")} onChange={(e) => onText(e.target.value)} onKeyDown={onKey} onBlur={(e) => onLeave(e.relatedTarget)} />;

  const textView = (className: string, empty?: string) => {
    if (editing) return area(className, empty ?? text("md.placeholder"));
    const content = block.text ? inline(block.text) : <span className="md-empty">{empty ?? ""}</span>;
    if (readOnly) return <div className={`md-field md-view ${className}`}>{content}</div>;
    return (
      <div
        className={`md-field md-view ${className}`}
        onMouseDown={(e) => {
          e.preventDefault();
          onFocus("end");
        }}
      >
        {content}
      </div>
    );
  };

  let body: ReactNode;
  switch (block.kind) {
    case "paragraph":
      body = textView("is-paragraph", text("md.placeholder"));
      break;
    case "h1":
    case "h2":
    case "h3":
      body = textView(`is-${block.kind}`, text(`md.heading${block.kind[1]}` as MessageKey));
      break;
    case "bullet":
    case "number":
    case "todo":
      body = (
        <div className="md-item">
          {block.kind === "todo" ? (
            <input type="checkbox" className="md-check" checked={Boolean(block.checked)} disabled={readOnly} aria-label={text("md.todo")} onChange={(e) => onPatch({ checked: e.target.checked })} />
          ) : (
            <span className="md-marker" aria-hidden="true">
              {block.kind === "number" ? `${number}.` : ["•", "◦", "▪", "•"][block.indent ?? 0]}
            </span>
          )}
          {textView(`is-item${block.checked ? " is-done" : ""}`, text("md.bullets"))}
        </div>
      );
      break;
    case "quote":
      body = <blockquote className="md-quote">{textView("is-quote", text("md.quote"))}</blockquote>;
      break;
    case "callout":
      body = (
        <Callout tone={block.tone} title={block.title || undefined}>
          {editing && <input className="md-field md-title" value={block.title ?? ""} placeholder={text("md.title")} aria-label={text("md.title")} onChange={(e) => onPatch({ title: e.target.value })} onBlur={(e) => onLeave(e.relatedTarget)} />}
          {textView("is-callout", text("md.placeholder"))}
        </Callout>
      );
      break;
    case "code":
    case "ui": {
      const chart = block.kind === "code" && block.lang === "mermaid" ? parseMermaid(block.text) : null;
      body = editing ? (
        <div className="md-code">
          <div className="md-code-bar">{block.kind === "code" ? <input className="md-lang" value={block.lang ?? ""} placeholder="lang" aria-label="lang" onChange={(e) => onPatch({ lang: e.target.value })} onBlur={(e) => onLeave(e.relatedTarget)} /> : <span className="md-lang">ui · JSON</span>}</div>
          <textarea ref={field} className="md-field is-code" value={block.text} rows={3} spellCheck={false} aria-label={text("md.code")} onChange={(e) => onPatch({ text: e.target.value })} onKeyDown={blockKey} onBlur={(e) => onLeave(e.relatedTarget)} />
          {block.kind === "ui" && <div className="md-ui-preview">{ui(block.text)}</div>}
          {chart && <div className="md-ui-preview"><MermaidView chart={chart} /></div>}
        </div>
      ) : (
        <div
          className={readOnly ? undefined : "md-click"}
          onMouseDown={(e) => {
            if (readOnly) return;
            e.preventDefault();
            onFocus("end");
          }}
        >
          {block.kind === "ui" ? (
            <div className="md-ui">{ui(block.text)}</div>
          ) : chart ? (
            <MermaidView chart={chart} />
          ) : readOnly && block.lang === "mermaid" ? (
            <details className="md-chart-source">
              <summary>{text("md.chartSource")}</summary>
              <CodeBlock code={block.text} lang="plain" />
            </details>
          ) : (
            <CodeBlock code={block.text} lang={LANGS[block.lang ?? ""] ?? "plain"} />
          )}
        </div>
      );
      break;
    }
    case "table": {
      const rows = block.rows?.length ? block.rows : [["", ""]];
      const width = Math.max(...rows.map((row) => row.length));
      if (readOnly) {
        body = (
          <div className="markdown-table">
            <DataTable fit columns={(rows[0] ?? []).map((cell, c) => ({ label: cell, numeric: block.align?.[c] === "right" }))} rows={rows.slice(1).map((row) => Array.from({ length: width }, (_, c) => ({ content: inline(row[c] ?? "") })))} />
          </div>
        );
        break;
      }
      const set = (r: number, c: number, value: string) => onPatch({ rows: rows.map((row, i) => (i === r ? Array.from({ length: width }, (_, k) => (k === c ? value : (row[k] ?? ""))) : row)) });
      body = (
        <div className="md-table">
          <table className="data-table">
            <tbody>
              {rows.map((row, r) => (
                <tr key={r} className={r === 0 ? "is-head" : undefined}>
                  {Array.from({ length: width }, (_, c) => (
                    <td key={c} className={block.align?.[c] === "right" ? "is-numeric" : undefined}>
                      <input ref={r === 0 && c === 0 ? field : undefined} value={row[c] ?? ""} aria-label={`${r + 1}:${c + 1}`} onChange={(e) => set(r, c, e.target.value)} onFocus={() => !editing && onFocus(0)} onBlur={(e) => onLeave(e.relatedTarget)} />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="md-table-tools">
            <button type="button" onClick={() => onPatch({ rows: [...rows, Array.from({ length: width }, () => "")] })}>
              <Icon name="plus" size="sm" />
              {text("md.row")}
            </button>
            <button type="button" onClick={() => onPatch({ rows: rows.map((row) => [...Array.from({ length: width }, (_, k) => row[k] ?? ""), ""]) })}>
              <Icon name="plus" size="sm" />
              {text("md.column")}
            </button>
          </div>
        </div>
      );
      break;
    }
    case "image":
      body = (
        <figure
          className="markdown-image md-image"
          onMouseDown={(e) => {
            if (editing || readOnly) return;
            e.preventDefault();
            onFocus(0);
          }}
        >
          {block.src || readOnly ? (
            <img src={block.src} alt={block.alt ?? ""} />
          ) : (
            <div className="md-empty-image">
              <Icon name="image" />
            </div>
          )}
          {editing ? (
            <div className="md-image-fields">
              <input ref={field} className="md-field" value={block.src ?? ""} placeholder="https://" aria-label={text("md.imageUrl")} onChange={(e) => onPatch({ src: e.target.value })} onKeyDown={blockKey} onBlur={(e) => onLeave(e.relatedTarget)} />
              <input className="md-field" value={block.alt ?? ""} placeholder={text("md.imageAlt")} aria-label={text("md.imageAlt")} onChange={(e) => onPatch({ alt: e.target.value })} onBlur={(e) => onLeave(e.relatedTarget)} />
            </div>
          ) : (
            block.alt && <figcaption>{block.alt}</figcaption>
          )}
        </figure>
      );
      break;
    case "divider":
      body = (
        <div
          className="md-divider"
          tabIndex={readOnly ? undefined : 0}
          role="separator"
          aria-label={text("md.rule")}
          onKeyDown={(e) => {
            if (e.key !== "Backspace" && e.key !== "Delete") return;
            e.preventDefault();
            onRemove();
          }}
        >
          <hr />
        </div>
      );
      break;
    case "raw":
      body = editing ? (
        <textarea ref={field} className="md-field is-code" value={block.text} rows={1} aria-label={text("md.block")} onChange={(e) => onPatch({ text: e.target.value })} onKeyDown={blockKey} onBlur={(e) => onLeave(e.relatedTarget)} />
      ) : (
        <code
          className="md-definition"
          onMouseDown={(e) => {
            e.preventDefault();
            onFocus("end");
          }}
        >
          {block.text}
        </code>
      );
      break;
  }

  return (
    <div className={["md-row", `is-${block.kind}`, editing ? "is-editing" : "", dragging ? "is-dragged" : "", dropBefore ? "drop-before" : "", dropAfter ? "drop-after" : ""].filter(Boolean).join(" ")} data-id={block.id} id={anchor} role={readOnly && ["bullet", "number", "todo"].includes(block.kind) ? "listitem" : undefined} style={{ "--indent": block.indent ?? 0 } as CSSProperties}>
      {!readOnly && (
        <div className="md-tools">
          <button type="button" className="md-tool" aria-label={text("md.add")} title={text("md.add")} onMouseDown={(e) => e.preventDefault()} onClick={onAdd}>
            <Icon name="plus" size="sm" />
          </button>
          <button type="button" className="md-tool md-grip" aria-label={text("md.drag")} title={text("md.drag")} onPointerDown={onGrab}>
            <Icon name="grip" size="sm" />
          </button>
        </div>
      )}
      <div className="md-body">
        {body}
        {menu}
      </div>
    </div>
  );
}
