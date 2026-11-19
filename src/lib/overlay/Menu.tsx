import { useId, useLayoutEffect, useRef, useState, type KeyboardEvent } from "react";
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

const startsDanger = (items: MenuItem[], index: number) => index > 0 && Boolean(items[index].danger) && !items[index - 1].danger;

export function Menu({ items, onSelect, label, icon = "more" }: MenuProps) {
  const { text } = useI18n();
  const id = useId();
  const anchor = useRef<HTMLSpanElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const turn = useRef(0);
  const [open, setOpen] = useState(false);
  const name = label ?? text("menu.more");

  const trigger = () => anchor.current?.querySelector<HTMLButtonElement>(":scope > button");
  const entries = () => [...(panel.current?.querySelectorAll<HTMLButtonElement>("[role=menuitem]:not(:disabled)") ?? [])];
  const close = () => {
    setOpen(false);
    trigger()?.focus();
  };

  useLayoutEffect(() => {
    const node = panel.current;
    const target = trigger();
    if (!open || !node || !target) return;
    turn.current += 1;
    settle(node);
    if (!node.matches(":popover-open")) node.showPopover();
    const reposition = () => place(node, target.getBoundingClientRect(), "end");
    reposition();
    motion(node, fold, "enter", { fill: "none" });
    entries()[0]?.focus();
    const onPointer = (event: PointerEvent) => {
      if (anchor.current?.contains(event.target as Node)) return;
      setOpen(false);
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

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "Tab") {
      setOpen(false);
      return;
    }
    const list = entries();
    const at = list.indexOf(document.activeElement as HTMLButtonElement);
    const moves: Record<string, number> = { ArrowDown: at + 1, ArrowUp: Math.max(at, 0) - 1, Home: 0, End: list.length - 1 };
    if (!(event.key in moves) || !list.length) return;
    event.preventDefault();
    list[(moves[event.key] + list.length) % list.length].focus();
  };

  return (
    <span ref={anchor} className="menu-anchor">
      <ButtonBase icon={icon} aria-label={name} title={name} aria-haspopup="menu" aria-expanded={open} aria-controls={id} onClick={() => setOpen(!open)} />
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
            onClick={() => {
              close();
              onSelect(item.id);
            }}
          >
            {item.icon && <Icon name={item.icon} size="sm" />}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </span>
  );
}
