import { useState } from "react";
import { PresenceAvatar } from "./chat";

export type MultiSelectItem = { id: string; label: string; description?: string; avatar?: string; tone?: number; locked?: boolean };

export type MultiSelectProps = {
  items: MultiSelectItem[];
  label?: string;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  selectAllLabel?: string;
};

export function MultiSelect({ items, label, value, defaultValue = [], onChange, selectAllLabel }: MultiSelectProps) {
  const [own, setOwn] = useState(defaultValue);
  const picked = value ?? own;
  const change = (next: string[]) => {
    setOwn(next);
    onChange?.(next);
  };
  const locked = items.filter((item) => item.locked).map((item) => item.id);
  const selectable = items.filter((item) => !item.locked).map((item) => item.id);
  const count = selectable.filter((id) => picked.includes(id)).length;
  const all = selectable.length > 0 && count === selectable.length;
  const some = count > 0 && !all;
  const toggle = (id: string) => change(picked.includes(id) ? picked.filter((v) => v !== id) : [...picked, id]);
  const toggleAll = () => change(all ? locked.filter((id) => picked.includes(id)) : [...new Set([...picked, ...selectable])]);
  return (
    <fieldset className="multi-select">
      {label && <legend>{label}</legend>}
      {selectAllLabel && selectable.length > 1 && (
        <label className="multi-select-row is-all">
          <input type="checkbox" checked={all} ref={(input) => { if (input) input.indeterminate = some; }} onChange={toggleAll} />
          <span className="multi-select-text">
            <strong>{selectAllLabel}</strong>
            <span>{`${count} / ${selectable.length}`}</span>
          </span>
        </label>
      )}
      {items.map((item) => (
        <label key={item.id} className={`multi-select-row${item.locked ? " is-locked" : ""}`}>
          <input type="checkbox" checked={picked.includes(item.id)} disabled={item.locked} onChange={() => toggle(item.id)} />
          {(item.avatar !== undefined || item.tone !== undefined) && <PresenceAvatar name={item.label} tone={item.tone} avatar={item.avatar} size="sm" />}
          <span className="multi-select-text">
            <strong>{item.label}</strong>
            {item.description && <span>{item.description}</span>}
          </span>
        </label>
      ))}
    </fieldset>
  );
}
