import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";
import { Button } from "./controls";
import { bytes } from "./format";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";
import { usePresence } from "./motion";
import { Tooltip } from "./overlay/Tooltip";

export type Presence = "idle" | "good" | "busy" | "active" | "warning" | "critical";
export type Face = { name: string; tone?: number; avatar?: string; state?: Presence };

const Sent = createContext<{ count: number; mark: () => void }>({ count: 0, mark: () => {} });

const cx = (...names: (string | false | null | undefined)[]) => names.filter(Boolean).join(" ");

export type PresenceAvatarProps = Face & { size?: "xs" | "sm" | "md" | "lg" };

export function PresenceAvatar({ name, tone = 1, avatar, state, size = "md" }: PresenceAvatarProps) {
  const initial = name.trim().split(/[-\s·]+/).pop()?.slice(0, 1).toUpperCase() ?? "";
  return (
    <span className={cx("presence-avatar", `is-${size}`, avatar && "has-image")} style={{ "--tone": `var(--color-series-${tone})` } as CSSProperties} title={name}>
      {avatar ? <img src={avatar} alt={name} /> : <span aria-hidden>{initial}</span>}
      {state && <span className={`presence-dot is-${state}`} aria-hidden />}
    </span>
  );
}

export function Faces({ members, size = "xs" }: { members: Face[]; size?: "xs" | "sm" }) {
  return (
    <span className="presence-faces">
      {members.map((member) => <PresenceAvatar key={member.name} {...member} size={size} />)}
    </span>
  );
}

export function Mention({ children, self = false }: { children: ReactNode; self?: boolean }) {
  return <span className={cx("chat-mention", self && "is-self")}>@{children}</span>;
}

export type MessageAction = {
  id: string;
  label: string;
  icon?: IconName;
  emoji?: string;
  inline?: boolean;
  menu?: { id: string; label: string; emoji?: string; description?: string; tone?: number; avatar?: string }[];
  onSelect?: (id: string) => void;
};

function MessageActions({ actions }: { actions: MessageAction[] }) {
  const [open, setOpen] = useState<string | null>(null);
  const [last, setLast] = useState(open);
  if (open && open !== last) setLast(open);
  const menu = actions.find((action) => action.id === (open ?? last));
  const [shown, panel] = usePresence<HTMLDivElement>(Boolean(open && menu?.menu));
  return (
    <div className={cx("chat-actions", open && "is-open")} onMouseLeave={() => setOpen(null)}>
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          title={action.label}
          aria-label={action.label}
          aria-expanded={action.menu ? open === action.id : undefined}
          onClick={() => (action.menu ? setOpen(open === action.id ? null : action.id) : action.onSelect?.(action.id))}
        >
          {action.icon ? <Icon name={action.icon} size="sm" /> : <span className="chat-emoji">{action.emoji}</span>}
        </button>
      ))}
      {shown && menu?.menu && (
        <div className={cx("chat-action-menu", menu.inline && "is-inline")} role="menu" ref={panel}>
          {menu.menu.map((item) => (
            <button key={item.id} type="button" role="menuitem" title={item.label} onClick={() => { setOpen(null); menu.onSelect?.(item.id); }}>
              {item.emoji ? <span className="chat-emoji">{item.emoji}</span> : <PresenceAvatar name={item.label} tone={item.tone} avatar={item.avatar} size="xs" />}
              {!menu.inline && <strong>{item.label}</strong>}
              {!menu.inline && item.description && <span>{item.description}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export type ChatReaction = { emoji: string; count: number; mine?: boolean; title?: string };

export type ChatMessageProps = {
  author: string;
  tone?: number;
  avatar?: string;
  badge?: { tone?: BadgeTone; label: ReactNode };
  time?: string;
  via?: string;
  continued?: boolean;
  selected?: boolean;
  pending?: boolean;
  actions?: MessageAction[];
  reactions?: ChatReaction[];
  onReact?: (emoji: string) => void;
  replies?: { label: string; last?: string; members: Face[] };
  onOpenThread?: () => void;
  anchor?: string;
  children?: ReactNode;
};

export function ChatMessage({ author, tone = 1, avatar, badge, time, via, continued = false, selected = false, pending = false, actions = [], reactions = [], onReact, replies, onOpenThread, anchor, children }: ChatMessageProps) {
  return (
    <article id={anchor} className={cx("chat-message", continued && "is-continued", selected && "is-selected")} tabIndex={-1}>
      {actions.length > 0 && <MessageActions actions={actions} />}
      {continued ? <span className="chat-time is-side">{time}</span> : <PresenceAvatar name={author} tone={tone} avatar={avatar} />}
      <div className="chat-body">
        {!continued && (
          <header className="chat-head">
            <strong className="chat-author">{author}</strong>
            {badge && <Badge tone={badge.tone ?? "neutral"}>{badge.label}</Badge>}
            {time && <time className="chat-time">{time}</time>}
            {via && <span className="chat-via">{via}</span>}
          </header>
        )}
        {typeof children === "string" ? <p>{children}</p> : children}
        {reactions.length > 0 && (
          <div className="chat-reactions">
            {reactions.map((reaction) => {
              const button = (
                <button key={reaction.emoji} type="button" className={cx("chat-reaction", reaction.mine && "is-mine")} onClick={() => onReact?.(reaction.emoji)}>
                  <span className="chat-emoji">{reaction.emoji}</span>
                  {reaction.count}
                </button>
              );
              if (!reaction.title) return button;
              return <Tooltip key={reaction.emoji} label={reaction.title}>{button}</Tooltip>;
            })}
          </div>
        )}
        {pending && <span className="chat-dots" aria-hidden><i /><i /><i /></span>}
        {replies && (
          <button type="button" className="chat-replies" onClick={onOpenThread}>
            <Faces members={replies.members} />
            <strong>{replies.label}</strong>
            {replies.last && <span>{replies.last}</span>}
          </button>
        )}
      </div>
    </article>
  );
}

export function MessageLog({ children }: { children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const stick = useRef(true);
  const sent = useContext(Sent).count;
  useEffect(() => {
    const el = box.current;
    if (!el || !sent) return;
    stick.current = true;
    el.scrollTop = el.scrollHeight;
  }, [sent]);
  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const pin = () => {
      if (stick.current) el.scrollTop = el.scrollHeight;
    };
    const scroll = () => {
      stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 24;
    };
    const observer = new ResizeObserver(pin);
    observer.observe(el);
    [...el.children].forEach((child) => observer.observe(child));
    el.addEventListener("scroll", scroll);
    pin();
    return () => {
      observer.disconnect();
      el.removeEventListener("scroll", scroll);
    };
  }, [children]);
  return <div ref={box} className="chat-log" role="log">{children}</div>;
}

export function DayDivider({ tone, align = "center", children }: { tone?: "new"; align?: "center" | "start"; children: ReactNode }) {
  return <div className={cx("chat-day", tone && `is-${tone}`, align === "start" && "is-start")} role="separator"><span>{children}</span></div>;
}

export function SystemNote({ icon = "info", time, onSelect, children }: { icon?: IconName; time?: string; onSelect?: () => void; children: ReactNode }) {
  const parts = <><Icon name={icon} size="sm" /><span>{children}</span>{time && <time>{time}</time>}</>;
  if (onSelect) return <button type="button" className="chat-system is-link" onClick={onSelect}>{parts}</button>;
  return <div className="chat-system">{parts}</div>;
}

export function TypingIndicator({ members = [], children }: { members?: Face[]; children?: ReactNode }) {
  return (
    <div className="chat-typing" aria-live="polite">
      {children && (
        <>
          {members.length > 0 && <Faces members={members} />}
          <span className="chat-dots" aria-hidden><i /><i /><i /></span>
          {children}
        </>
      )}
    </div>
  );
}

export type MentionCandidate = { id: string; label: string; description?: string; tone?: number; avatar?: string; state?: Presence };
export type ComposerChip = { id: string; label: string; icon?: IconName; image?: string; size?: number; error?: string };

const sendable = (chip: ComposerChip) => chip.size !== undefined && !chip.error;

export type ComposerProps = {
  placeholder?: string;
  submitLabel?: string;
  mentions?: MentionCandidate[];
  chips?: ComposerChip[];
  onRemoveChip?: (id: string) => void;
  insert?: { text: string; nonce: number };
  actions?: ReactNode;
  onChange?: (text: string) => void;
  onSubmit?: (text: string) => void;
};

const QUERY = /(^|\s)@([\p{L}\p{N}_-]*)$/u;
const CHOSEONG = "ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎ";

const initials = (text: string) => [...text].map((char) => {
  const code = char.charCodeAt(0) - 0xac00;
  return code >= 0 && code <= 11171 ? CHOSEONG[Math.floor(code / 588)] : char.toLowerCase();
}).join("");

function isSubsequence(needle: string, haystack: string) {
  let at = 0;
  for (const char of needle) {
    at = haystack.indexOf(char, at);
    if (at < 0) return false;
    at += 1;
  }
  return true;
}

function rank(candidate: MentionCandidate, query: string) {
  const q = query.toLowerCase();
  if (!q) return 0;
  const keys = [candidate.label.toLowerCase(), candidate.id.toLowerCase()];
  if (keys.some((key) => key.startsWith(q))) return 1;
  if (initials(candidate.label).startsWith(q)) return 2;
  if (keys.some((key) => key.includes(q))) return 3;
  if (keys.some((key) => isSubsequence(q, key)) || isSubsequence(q, initials(candidate.label))) return 4;
  return -1;
}

export function Composer({ placeholder, submitLabel, mentions = [], chips = [], onRemoveChip, insert, actions, onChange, onSubmit }: ComposerProps) {
  const { text: t } = useI18n();
  const [draft, setDraft] = useState("");
  const [caret, setCaret] = useState(0);
  const [index, setIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);
  const field = useRef<HTMLTextAreaElement>(null);
  const sent = useContext(Sent);
  useEffect(() => {
    if (!insert) return;
    setDraft((current) => `${insert.text}${current}`);
    setCaret(insert.text.length);
    requestAnimationFrame(() => {
      field.current?.focus();
      field.current?.setSelectionRange(insert.text.length, insert.text.length);
    });
  }, [insert?.nonce]);
  const match = QUERY.exec(draft.slice(0, caret));
  const active = match ? { start: caret - match[2].length - 1, query: match[2] } : null;
  const candidates = active && !dismissed
    ? mentions
      .map((candidate, order) => ({ candidate, score: rank(candidate, active.query), order }))
      .filter((entry) => entry.score >= 0)
      .sort((a, b) => a.score - b.score || a.order - b.order)
      .map((entry) => entry.candidate)
      .slice(0, 8)
    : [];
  const current = Math.min(index, candidates.length - 1);
  const change = (next: string, at = next.length) => {
    setDraft(next);
    setCaret(at);
    setIndex(0);
    setDismissed(false);
    onChange?.(next);
  };
  const submit = () => {
    const blank = !draft.trim();
    if (blank && !chips.some(sendable)) return;
    onSubmit?.(blank ? "" : draft);
    sent.mark();
    change("", 0);
  };
  const choose = (candidate: MentionCandidate) => {
    if (!active) return;
    const inserted = `@${candidate.label} `;
    const at = active.start + inserted.length;
    change(draft.slice(0, active.start) + inserted + draft.slice(caret), at);
    requestAnimationFrame(() => {
      field.current?.focus();
      field.current?.setSelectionRange(at, at);
    });
  };
  const key = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    const composing = event.nativeEvent.isComposing;
    if (candidates.length > 0 && !composing && (event.key === "ArrowDown" || event.key === "ArrowUp")) {
      event.preventDefault();
      setIndex((i) => (i + (event.key === "ArrowDown" ? 1 : candidates.length - 1)) % candidates.length);
      return;
    }
    if (candidates.length > 0 && !composing && (event.key === "Enter" || event.key === "Tab")) {
      event.preventDefault();
      choose(candidates[current]);
      return;
    }
    if (candidates.length > 0 && event.key === "Escape") {
      event.preventDefault();
      setDismissed(true);
      return;
    }
    if (event.key !== "Enter" || event.shiftKey || composing) return;
    event.preventDefault();
    submit();
  };
  const track = (event: { currentTarget: HTMLTextAreaElement }) => setCaret(event.currentTarget.selectionStart ?? 0);
  return (
    <form className="chat-composer" onSubmit={(event) => { event.preventDefault(); submit(); }}>
      {candidates.length > 0 && (
        <ul className="chat-mentions" role="listbox">
          {candidates.map((candidate, i) => (
            <li key={candidate.id}>
              <button type="button" role="option" aria-selected={i === current} onMouseDown={(event) => { event.preventDefault(); choose(candidate); }} onMouseEnter={() => setIndex(i)}>
                <PresenceAvatar name={candidate.label} tone={candidate.tone} avatar={candidate.avatar} state={candidate.state} size="sm" />
                <strong>{candidate.label}</strong>
                {candidate.description ? <span>{candidate.description}</span> : <span />}
                <code>@{candidate.id}</code>
              </button>
            </li>
          ))}
        </ul>
      )}
      <textarea
        ref={field}
        rows={2}
        placeholder={placeholder}
        aria-label={placeholder}
        value={draft}
        onChange={(event) => change(event.target.value, event.target.selectionStart ?? event.target.value.length)}
        onKeyDown={key}
        onKeyUp={track}
        onClick={track}
        onBlur={() => setDismissed(true)}
        onFocus={() => setDismissed(false)}
      />
      <div className="chat-composer-bar">
        <div className="chat-chips">
          {chips.map((chip) => (
            <span key={chip.id} className={cx("chat-chip", chip.image && "has-image", chip.error && "is-error")} title={chip.error}>
              {chip.image ? <img src={chip.image} alt="" /> : chip.icon && <Icon name={chip.icon} size="sm" />}
              <span className="chat-chip-label">{chip.label}</span>
              {(chip.error || chip.size !== undefined) && <span className="chat-chip-meta">{chip.error || bytes(chip.size ?? 0)}</span>}
              {onRemoveChip && <button type="button" aria-label={t("chat.remove", { label: chip.label })} onClick={() => onRemoveChip(chip.id)}><Icon name="close" size="sm" /></button>}
            </span>
          ))}
        </div>
        {actions}
        <Button type="submit" variant="primary" icon="send" label={submitLabel ?? t("chat.send")} />
      </div>
    </form>
  );
}

export function ChatPane({ composer, footer, children }: { composer?: ReactNode; footer?: ReactNode; children: ReactNode }) {
  const [count, setCount] = useState(0);
  const mark = useRef(() => setCount((n) => n + 1)).current;
  return (
    <Sent.Provider value={{ count, mark }}>
      <div className="chat-pane">
        {children}
        <div className="chat-pane-foot">{footer}{composer}</div>
      </div>
    </Sent.Provider>
  );
}
