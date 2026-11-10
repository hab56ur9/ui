import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type TabItem = { id: string; label: string; icon?: IconName; badge?: string | number; disabled?: boolean; content?: ReactNode };
export type TabsProps = { items: TabItem[]; value?: string; defaultValue?: string; onChange?: (id: string) => void; variant?: "line" | "pill"; fill?: boolean; label?: string };

const STEP: Record<string, (index: number, count: number) => number> = {
  ArrowRight: (index, count) => (index + 1) % count,
  ArrowLeft: (index, count) => (index - 1 + count) % count,
  Home: () => 0,
  End: (_, count) => count - 1,
};

export function Tabs({ items, value, defaultValue, onChange, variant = "line", fill = false, label }: TabsProps) {
  const base = useId();
  const list = useRef<HTMLDivElement>(null);
  const [own, setOwn] = useState(defaultValue ?? items.find((item) => !item.disabled)?.id);
  const selected = value ?? own;
  const current = items.find((item) => item.id === selected);
  const panels = items.some((item) => item.content !== undefined);
  const tabId = (id: string) => `${base}-tab-${id}`;

  const select = (id: string) => {
    setOwn(id);
    if (id !== selected) onChange?.(id);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    const step = STEP[e.key];
    if (!step) return;
    e.preventDefault();
    const enabled = items.filter((item) => !item.disabled);
    const next =
      enabled[
        step(
          Math.max(
            0,
            enabled.findIndex((item) => item.id === selected),
          ),
          enabled.length,
        )
      ];
    if (!next) return;
    select(next.id);
    document.getElementById(tabId(next.id))?.focus();
  };

  return (
    <div className={`tabs is-${variant}${fill ? " is-fill" : ""}`}>
      <div ref={list} className="tabs-list" role="tablist" aria-label={label} onKeyDown={onKeyDown}>
        {items.map((item) => {
          const active = item.id === selected;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              id={tabId(item.id)}
              className="tabs-tab"
              aria-selected={active}
              aria-controls={active && panels ? `${base}-panel` : undefined}
              tabIndex={active ? 0 : -1}
              disabled={item.disabled}
              onClick={() => select(item.id)}
            >
              {item.icon && <Icon name={item.icon} />}
              <span>{item.label}</span>
              {item.badge !== undefined && <span className="tabs-badge">{item.badge}</span>}
            </button>
          );
        })}
      </div>
      {panels && (
        <div className="tabs-panel" role="tabpanel" id={`${base}-panel`} aria-labelledby={selected ? tabId(selected) : undefined} tabIndex={0}>
          {current?.content}
        </div>
      )}
    </div>
  );
}
