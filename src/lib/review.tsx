import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";
import { PresenceAvatar, type Face } from "./chat";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");
const HIGHLIGHTS = ["annotate-open", "annotate-active", "annotate-resolved"] as const;
const SKIPPED = /[*_`]/;
const BLOCKS = "p,li,h1,h2,h3,h4,h5,h6,pre,blockquote,td,th,div";
const squash = (text: string) => text.replace(/[*_`]/g, "").replace(/\s+/g, " ").trim();

type Point = [Text, number];
type HighlightRegistry = { set: (name: string, value: unknown) => void; delete: (name: string) => void };
type HighlightConstructor = new (...ranges: Range[]) => unknown;

const registry = () => (globalThis as { CSS?: { highlights?: HighlightRegistry } }).CSS?.highlights;
const Highlight = () => (globalThis as { Highlight?: HighlightConstructor }).Highlight;

function indexText(root: HTMLElement) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const map: Point[] = [];
  let text = "";
  let block: Element | null = null;
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    const owner = node.parentElement?.closest(BLOCKS) ?? null;
    if (block && owner !== block && text && !text.endsWith(" ")) {
      text += " ";
      map.push(map[map.length - 1]);
    }
    block = owner;
    const value = node.nodeValue ?? "";
    for (let i = 0; i < value.length; i += 1) {
      const char = value[i];
      if (SKIPPED.test(char)) continue;
      const space = /\s/.test(char);
      if (space && (text === "" || text.endsWith(" "))) continue;
      text += space ? " " : char;
      map.push([node, i]);
    }
  }
  return { text, map };
}

export type Anchor = { id: string; quote: string; resolved?: boolean };
export type QuoteAction = { id: string; label: string; icon?: IconName };

export type AnnotatorProps = {
  anchors?: Anchor[];
  active?: string | null;
  quoteLabel?: string;
  actions?: QuoteAction[];
  onPick?: (id: string) => void;
  onQuote?: (quote: string) => void;
  onAction?: (id: string, quote: string) => void;
  children: ReactNode;
};

export function Annotator({ anchors = [], active, quoteLabel, actions = [], onPick, onQuote, onAction, children }: AnnotatorProps) {
  const { text: t } = useI18n();
  const box = useRef<HTMLDivElement>(null);
  const ranges = useRef(new Map<string, Range>());
  const latest = useRef({ anchors, active });
  const [pop, setPop] = useState<{ quote: string; x: number; y: number } | null>(null);
  latest.current = { anchors, active };
  const paint = () => {
    const root = box.current;
    const highlights = registry();
    const Make = Highlight();
    if (!root || !highlights || !Make) return;
    const { text, map } = indexText(root);
    const groups: Record<(typeof HIGHLIGHTS)[number], Range[]> = { "annotate-open": [], "annotate-active": [], "annotate-resolved": [] };
    ranges.current = new Map();
    for (const anchor of latest.current.anchors) {
      const needle = squash(anchor.quote);
      const at = needle ? text.indexOf(needle) : -1;
      if (at < 0) continue;
      const [startNode, startOffset] = map[at];
      const [endNode, endOffset] = map[at + needle.length - 1];
      const range = new Range();
      range.setStart(startNode, startOffset);
      range.setEnd(endNode, endOffset + 1);
      ranges.current.set(anchor.id, range);
      groups[anchor.id === latest.current.active ? "annotate-active" : anchor.resolved ? "annotate-resolved" : "annotate-open"].push(range);
    }
    for (const name of HIGHLIGHTS) highlights.set(name, new Make(...groups[name]));
  };
  useEffect(paint);
  useEffect(() => {
    const root = box.current;
    if (!root) return;
    let frame = 0;
    const observer = new MutationObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true });
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      HIGHLIGHTS.forEach((name) => registry()?.delete(name));
    };
  }, []);
  useEffect(() => {
    const range = active ? ranges.current.get(active) : undefined;
    range?.startContainer.parentElement?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [active]);
  const click = (event: MouseEvent) => {
    const caret = (document as Document & { caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null }).caretPositionFromPoint?.(event.clientX, event.clientY);
    if (!caret) return;
    for (const [id, range] of ranges.current) {
      if (range.isPointInRange(caret.offsetNode, caret.offset)) return onPick?.(id);
    }
  };
  const up = () => {
    const root = box.current;
    if (!root) return;
    const frame = root.getBoundingClientRect();
    const field = document.activeElement;
    if (field instanceof HTMLTextAreaElement && root.contains(field) && field.selectionEnd > field.selectionStart) {
      const rect = field.getBoundingClientRect();
      return setPop({ quote: field.value.slice(field.selectionStart, field.selectionEnd).trim(), x: rect.left - frame.left + rect.width / 2, y: rect.top - frame.top - 6 });
    }
    const selection = getSelection();
    const quote = selection?.toString().trim();
    if (!selection || !quote || !root.contains(selection.anchorNode)) return setPop(null);
    const rect = selection.getRangeAt(0).getBoundingClientRect();
    setPop({ quote, x: rect.left - frame.left + rect.width / 2, y: rect.top - frame.top - 6 });
  };
  return (
    <div ref={box} className="annotate" onClick={click} onMouseUp={up} onKeyUp={(event) => event.shiftKey && up()}>
      {children}
      {pop?.quote && (onQuote || actions.length > 0) && (
        <span className="annotate-pop" style={{ left: `${pop.x}px`, top: `${pop.y}px` }} onMouseDown={(event) => event.preventDefault()}>
          {[...(onQuote ? [{ id: "", label: quoteLabel ?? t("annotate.comment"), icon: "message" as IconName }] : []), ...actions].map((action) => (
            <button
              key={action.id || "quote"}
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                if (action.id) onAction?.(action.id, pop.quote);
                if (!action.id) onQuote?.(pop.quote);
                setPop(null);
                getSelection()?.removeAllRanges();
              }}
            >
              {action.icon && <Icon name={action.icon} size="sm" />}
              {action.label}
            </button>
          ))}
        </span>
      )}
    </div>
  );
}

export type CommentReply = Face & { time?: string; text: ReactNode };

export type CommentCardProps = Face & {
  quote: string;
  role?: string;
  time?: string;
  text: ReactNode;
  resolved?: boolean;
  stale?: boolean;
  suggestion?: string | null;
  onApply?: () => void;
  footer?: ReactNode;
  active?: boolean;
  replies?: CommentReply[];
  onPick?: () => void;
  onResolve?: () => void;
  onReply?: () => void;
};

export function CommentCard({ quote, name, tone, avatar, role, time, text, resolved = false, stale = false, suggestion, onApply, footer, active = false, replies = [], onPick, onResolve, onReply }: CommentCardProps) {
  const { text: t } = useI18n();
  const stop = (run?: () => void) => (event: MouseEvent) => {
    event.stopPropagation();
    run?.();
  };
  return (
    <div className={cx("comment-card", active && "is-active", resolved && "is-resolved", stale && "is-stale")} onClick={onPick}>
      <blockquote>{quote}</blockquote>
      {stale && !resolved && <Badge tone="warning">{t("comment.stale")}</Badge>}
      <div className="comment-head">
        <PresenceAvatar name={name} tone={tone} avatar={avatar} size="sm" />
        <strong>{name}</strong>
        {role && <Badge tone="neutral">{role}</Badge>}
        {time && <time>{time}</time>}
        <span className="comment-gap" />
        {onReply && <button type="button" className="comment-action" onClick={stop(onReply)}><Icon name="undo" size="sm" />{t("comment.reply")}</button>}
        {resolved ? <Badge tone="good">{t("comment.resolved")}</Badge> : onResolve && <button type="button" className="comment-action" onClick={stop(onResolve)}><Icon name="check" size="sm" />{t("comment.resolve")}</button>}
      </div>
      <p>{text}</p>
      {suggestion && (
        <div className="comment-suggestion">
          <span>{t("comment.suggestion")}</span>
          <del>{quote}</del>
          <ins>{suggestion}</ins>
          {!resolved && onApply && <button type="button" className="comment-action" onClick={stop(onApply)}><Icon name="check" size="sm" />{t("comment.apply")}</button>}
        </div>
      )}
      {replies.map((reply, i) => (
        <div key={i} className="comment-reply">
          <PresenceAvatar name={reply.name} tone={reply.tone} avatar={reply.avatar} size="xs" />
          <strong>{reply.name}</strong>
          {reply.time && <time>{reply.time}</time>}
          <span>{reply.text}</span>
        </div>
      ))}
      {footer && <div className="comment-foot" onClick={(event) => event.stopPropagation()}>{footer}</div>}
    </div>
  );
}

export type DiffLine = { kind: "same" | "add" | "del"; text: string };

export function DiffView({ lines, empty }: { lines: DiffLine[]; empty?: string }) {
  const { text: t } = useI18n();
  if (!lines.some((line) => line.kind !== "same")) return <div className="diff-empty">{empty ?? t("diff.empty")}</div>;
  const mark = { add: "+", del: "−", same: " " };
  return (
    <pre className="diff">
      {lines.map((line, i) => <span key={i} className={`is-${line.kind}`}>{`${mark[line.kind]} ${line.text}\n`}</span>)}
    </pre>
  );
}

export type Reviewer = Face & { label: string; badge?: BadgeTone };

export function ReviewBar({ label, reviewers = [], aside }: { label: ReactNode; reviewers?: Reviewer[]; aside?: ReactNode }) {
  return (
    <div className="review-bar">
      <span>{label}</span>
      {reviewers.map((reviewer) => (
        <span key={reviewer.name} className="review-person">
          <PresenceAvatar name={reviewer.name} tone={reviewer.tone} avatar={reviewer.avatar} size="xs" />
          {reviewer.name}
          <Badge tone={reviewer.badge ?? "neutral"}>{reviewer.label}</Badge>
        </span>
      ))}
      <span className="comment-gap" />
      {aside && <span>{aside}</span>}
    </div>
  );
}
