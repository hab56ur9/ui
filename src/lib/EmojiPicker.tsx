import { useMemo, useRef, useState, type KeyboardEvent } from "react";
import { EMOJI, EMOJI_CATEGORIES, emojiOf, searchEmoji, type Emoji, type EmojiCategory } from "./emoji";
import { useI18n, type MessageKey } from "./i18n";
import { TextField } from "./TextField";
import { Tooltip } from "./overlay/Tooltip";

export type EmojiPickerProps = { selected?: string[]; recent?: string[]; onSelect?: (emoji: string) => void; label?: string };

type Section = EmojiCategory | "recent";

const COLUMNS = 8;

const MOVE: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => Math.min(index + 1, count - 1),
  ArrowLeft: (index) => Math.max(index - 1, 0),
  ArrowDown: (index, count) => Math.min(index + COLUMNS, count - 1),
  ArrowUp: (index) => (index < COLUMNS ? index : index - COLUMNS),
  Home: () => 0,
  End: (_, count) => count - 1,
};

const TAB: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
};

const ICON: Record<Section, string> = {
  recent: "🕘",
  smileys: "😀",
  people: "👍",
  nature: "🌱",
  food: "☕",
  activity: "🎉",
  travel: "🚀",
  objects: "💡",
  symbols: "✅",
};

export function EmojiPicker({ selected = [], recent: given = [], onSelect, label }: EmojiPickerProps) {
  const { lang, text: t } = useI18n();
  const recent = [...new Set(given)];
  const sections: Section[] = recent.length > 0 ? ["recent", ...EMOJI_CATEGORIES] : EMOJI_CATEGORIES;
  const [section, setSection] = useState<Section>(sections[0]);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState(0);
  const grid = useRef<HTMLDivElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  const searching = query.trim() !== "";
  const items: Emoji[] = useMemo(() => {
    if (searching) return searchEmoji(query);
    if (section === "recent") return recent.map(emojiOf);
    return EMOJI[section];
  }, [searching, query, section, recent]);
  const at = Math.min(cursor, Math.max(items.length - 1, 0));
  const nameOf = (item: Emoji) => (lang === "ko" ? item.ko : item.en)[0] ?? item.emoji;
  const sectionName = (key: Section) => t(`emoji.${key}` as MessageKey);

  const focusCell = (index: number) => {
    setCursor(index);
    grid.current?.querySelectorAll<HTMLButtonElement>("button")[index]?.focus();
  };

  const show = (next: Section) => {
    setSection(next);
    setQuery("");
    setCursor(0);
  };

  const onGridKey = (event: KeyboardEvent) => {
    const move = MOVE[event.key];
    if (!move) return;
    event.preventDefault();
    focusCell(move(at, items.length));
  };

  const onTabKey = (event: KeyboardEvent) => {
    const move = TAB[event.key];
    if (!move) return;
    event.preventDefault();
    const next = sections[move(sections.indexOf(section), sections.length)];
    show(next);
    tabs.current?.querySelectorAll<HTMLButtonElement>("button")[sections.indexOf(next)]?.focus();
  };

  const onSearchKey = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown" && items.length > 0) {
      event.preventDefault();
      focusCell(0);
    }
    if (event.key === "Enter" && searching && items.length > 0) {
      event.preventDefault();
      onSelect?.(items[0].emoji);
    }
  };

  return (
    <div className="emoji-picker" role="group" aria-label={label ?? t("emoji.label")}>
      <div onKeyDown={onSearchKey}>
        <TextField label={t("emoji.search")} hideLabel icon="search" placeholder={t("emoji.search")} value={query} onChange={(value) => { setQuery(value); setCursor(0); }} />
      </div>
      <div ref={tabs} className="emoji-picker-tabs" role="tablist" aria-label={label ?? t("emoji.label")} onKeyDown={onTabKey}>
        {sections.map((key) => {
          const active = !searching && key === section;
          return (
            <Tooltip key={key} label={sectionName(key)}>
              <button type="button" role="tab" aria-selected={active} aria-label={sectionName(key)} tabIndex={key === section ? 0 : -1} className={active ? "is-active" : undefined} onClick={() => show(key)}>
                {ICON[key]}
              </button>
            </Tooltip>
          );
        })}
      </div>
      <strong className="emoji-picker-title">{searching ? t("emoji.results") : sectionName(section)}</strong>
      {items.length === 0 ? (
        <p className="emoji-picker-empty">{t("emoji.empty")}</p>
      ) : (
        <div ref={grid} className="emoji-picker-grid" role="group" aria-label={searching ? t("emoji.results") : sectionName(section)} onKeyDown={onGridKey}>
          {items.map((item, index) => {
            const mine = selected.includes(item.emoji);
            return (
              <button key={item.emoji} type="button" title={nameOf(item)} aria-label={nameOf(item)} aria-pressed={mine} tabIndex={index === at ? 0 : -1} className={mine ? "is-selected" : undefined} onFocus={() => setCursor(index)} onClick={() => onSelect?.(item.emoji)}>
                {item.emoji}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
