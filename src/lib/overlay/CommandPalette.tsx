import { Fragment, useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useI18n } from "../i18n";
import { Icon, type IconName } from "../Icon";
import { fadeBackdrop, motion } from "../motion";
import { useModalFocus } from "./focus";

export type CommandItem = {
  id: string;
  label: string;
  detail?: string;
  icon?: IconName;
  hint?: ReactNode;
  always?: boolean;
};

export type CommandGroup = {
  title: string;
  items: CommandItem[];
};

export type CommandPaletteProps = {
  open?: boolean;
  onClose?: () => void;
  groups: CommandGroup[];
  onSelect?: (id: string) => void;
  onQuery?: (query: string) => void;
  placeholder?: string;
  empty?: ReactNode;
  footer?: ReactNode[];
  inline?: boolean;
};

const matches = (item: CommandItem, query: string) => item.always || item.label.toLowerCase().includes(query.toLowerCase());

export function CommandPalette({ open = true, onClose, groups, onSelect, onQuery, placeholder, empty, footer, inline = false }: CommandPaletteProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const list = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(open);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const id = useId();
  const { locale, text } = useI18n();
  const label = placeholder ?? text("palette.search");
  const filtered = groups.map((group) => ({ ...group, items: group.items.filter((item) => matches(item, query)) })).filter((group) => group.items.length > 0);
  const flat = filtered.flatMap((group) => group.items);
  const optionId = (at: number) => `${id}-${at}`;

  useEffect(() => {
    setIndex(0);
    onQuery?.(query);
  }, [query]);

  useEffect(() => {
    if (open) setMounted(true);
    if (open) setQuery("");
    if (open) setIndex(0);
  }, [open]);

  const trap = useModalFocus(ref, mounted && !inline);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog || inline) return;
    if (open && !dialog.open) {
      dialog.showModal();
      motion(dialog, [{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }], "enter");
      fadeBackdrop(dialog, "enter", 0, 1);
    }
    if (!open && dialog.open) {
      Promise.all([motion(dialog, [{ opacity: 1 }, { opacity: 0 }], "exit"), fadeBackdrop(dialog, "exit", 1, 0)]).then(() => {
        dialog.close();
        setMounted(false);
      });
    }
  }, [open, mounted, inline]);

  useEffect(() => {
    list.current?.querySelector(`[id="${optionId(index)}"]`)?.scrollIntoView({ block: "nearest" });
  }, [index]);

  const pick = (item: CommandItem) => {
    onSelect?.(item.id);
    onClose?.();
  };

  const step = (by: number) => setIndex((at) => (at + by + flat.length) % Math.max(flat.length, 1));

  const key = (event: KeyboardEvent) => {
    if (event.key === "ArrowDown") step(1);
    if (event.key === "ArrowUp") step(-1);
    if (event.key === "Enter" && flat[index]) pick(flat[index]);
    if (event.key === "Escape" && inline) onClose?.();
    if (["ArrowDown", "ArrowUp", "Enter"].includes(event.key)) event.preventDefault();
  };

  let at = -1;
  const content = (
    <div className="palette-box" onKeyDown={key}>
      <input
        className="palette-input"
        role="combobox"
        aria-expanded="true"
        aria-controls={`${id}-list`}
        aria-activedescendant={flat[index] ? optionId(index) : undefined}
        aria-label={label}
        autoFocus={!inline}
        placeholder={label}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      <div ref={list} id={`${id}-list`} className="palette-list" role="listbox" aria-label={label}>
        {flat.length === 0 && <div className="palette-empty">{empty ?? text("palette.empty")}</div>}
        {filtered.map((group) => (
          <Fragment key={group.title}>
            <div className="palette-group" role="presentation">
              {group.title}
            </div>
            {group.items.map((item) => {
              at += 1;
              const mine = at;
              return (
                <div
                  key={item.id}
                  id={optionId(mine)}
                  role="option"
                  className="palette-item"
                  aria-selected={mine === index}
                  onMouseEnter={() => setIndex(mine)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => pick(item)}
                >
                  {item.icon && <Icon name={item.icon} size="sm" />}
                  <span className="palette-label">
                    {item.label}
                    {item.detail && <small>{item.detail}</small>}
                  </span>
                  {item.hint && <span className="palette-hint">{item.hint}</span>}
                </div>
              );
            })}
          </Fragment>
        ))}
      </div>
      <div className="palette-foot">
        {(footer ?? [text("palette.move"), text("palette.open"), text("palette.close")]).map((part, at) => (
          <span key={at}>{part}</span>
        ))}
      </div>
    </div>
  );

  if (inline) {
    return (
      <section className="palette is-inline" lang={locale} role="dialog" aria-label={label}>
        {content}
      </section>
    );
  }
  if (!mounted) return null;
  return createPortal(
    <dialog
      ref={ref}
      onKeyDown={trap}
      className="palette"
      lang={locale}
      aria-label={label}
      onCancel={(event) => {
        event.preventDefault();
        onClose?.();
      }}
      onClick={(event) => {
        if (event.target === ref.current) onClose?.();
      }}
    >
      {content}
    </dialog>,
    document.body,
  );
}
