import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { ButtonBase } from "../controls";
import { Icon, type IconName } from "../Icon";
import { useI18n } from "../i18n";
import { fold, motion, settle, unfold } from "../motion";
import { place } from "./Popover";

export type MenuItem = { id: string; label: string; icon?: IconName; danger?: boolean; disabled?: boolean };

export type MenuProps = {
  items: MenuItem[];
  onSelect: (id: string) => void;
  label?: string;
  icon?: IconName;
};

export type ContextMenuProps = {
  at: { x: number; y: number } | null;
  items: MenuItem[];
  label: string;
  onSelect: (id: string) => void;
  onClose: () => void;
};

const EDGE = 8;

const startsDanger = (items: MenuItem[], index: number) => index > 0 && Boolean(items[index].danger) && !items[index - 1].danger;
const entriesOf = (node: HTMLElement | null) => [...(node?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];

function useLayer(open: boolean, panel: RefObject<HTMLDivElement | null>, reposition: () => void, inside: (target: Node) => boolean, close: () => void) {
  const turn = useRef(0);
  useLayoutEffect(() => {
    const node = panel.current;
    if (!open || !node) return;
    turn.current += 1;
    settle(node);
    if (!node.matches(":popover-open")) node.showPopover();
    reposition();
    motion(node, fold, "enter", { fill: "none" });
    entriesOf(node)[0]?.focus();
    const onPointer = (event: PointerEvent) => {
      if (inside(event.target as Node)) return;
      close();
    };
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      const closing = ++turn.current;
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
      document.removeEventListener("pointerdown", onPointer);
      motion(node, unfold, "exit").then(() => {
        if (closing !== turn.current || !node.matches(":popover-open")) return;
        node.hidePopover();
        settle(node);
      });
    };
  }, [open]);
}

type PanelProps = {
  id?: string;
  panel: RefObject<HTMLDivElement | null>;
  name: string;
  items: MenuItem[];
  onPick: (id: string) => void;
  onEscape: () => void;
  onTab: () => void;
};

function MenuPanel({ id, panel, name, items, onPick, onEscape, onTab }: PanelProps) {
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onEscape();
      return;
    }
    if (event.key === "Tab") {
      onTab();
      return;
    }
    const list = entriesOf(panel.current);
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    const moves: Record<string, number> = { ArrowDown: at + 1, ArrowUp: Math.max(at, 0) - 1, Home: 0, End: list.length - 1 };
    if (!(event.key in moves) || !list.length) return;
    event.preventDefault();
    list[(moves[event.key] + list.length) % list.length].focus();
  };

  return (
    <div id={id} ref={panel} className="menu" role="menu" aria-label={name} popover="manual" onKeyDown={onKeyDown}>
      {items.map((item, index) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          tabIndex={-1}
          className={item.danger ? "menu-item is-danger" : "menu-item"}
          data-divided={startsDanger(items, index) || undefined}
          disabled={item.disabled}
          title={item.label}
          onClick={() => onPick(item.id)}
        >
          {item.icon && <Icon name={item.icon} size="sm" />}
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

export function Menu({ items, onSelect, label, icon = "more" }: MenuProps) {
  const { text } = useI18n();
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const name = label ?? text("menu.more");

  const trigger = () => anchor.current?.querySelector<HTMLButtonElement>(":scope > button");
  const close = () => {
    setOpen(false);
    trigger()?.focus();
  };

  useLayer(
    open,
    panel,
    () => {
      const target = trigger();
      if (panel.current && target) place(panel.current, target.getBoundingClientRect(), "end");
    },
    (target) => Boolean(anchor.current?.contains(target)),
    () => setOpen(false),
  );

  return (
    <span ref={anchor} className="menu-anchor">
      <ButtonBase icon={icon} aria-label={name} title={name} aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} />
      <MenuPanel
        id={id}
        panel={panel}
        name={name}
        items={items}
        onPick={(picked) => {
          close();
          onSelect(picked);
        }}
        onEscape={close}
        onTab={() => setOpen(false)}
      />
    </span>
  );
}

export function ContextMenu({ at, items, label, onSelect, onClose }: ContextMenuProps) {
  const panel = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState({ at, items, label });
  if (at && (at !== shown.at || items !== shown.items)) setShown({ at, items, label });

  useLayer(
    at !== null,
    panel,
    () => {
      const node = panel.current;
      if (!node || !shown.at) return;
      const fitsBelow = shown.at.y + node.offsetHeight <= window.innerHeight - EDGE;
      node.style.left = `${Math.min(Math.max(shown.at.x, EDGE), window.innerWidth - EDGE - node.offsetWidth)}px`;
      node.style.top = `${fitsBelow ? shown.at.y : Math.max(shown.at.y - node.offsetHeight, EDGE)}px`;
    },
    (target) => Boolean(panel.current?.contains(target)),
    onClose,
  );

  return (
    <MenuPanel
      panel={panel}
      name={shown.label}
      items={shown.items}
      onPick={(picked) => {
        onClose();
        onSelect(picked);
      }}
      onEscape={onClose}
      onTab={onClose}
    />
  );
}
