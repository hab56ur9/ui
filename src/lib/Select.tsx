import { useId } from "react";
import { Icon } from "./Icon";

export type SelectOption = { value: string; label: string };

export type SelectProps = {
  label: string;
  hideLabel?: boolean;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

export function Select({ label, hideLabel = false, options, value, defaultValue, onChange, disabled }: SelectProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "field-label"}>
        {label}
      </label>
      <span className="field-control select-control">
        <select id={id} value={value} defaultValue={defaultValue} disabled={disabled} onChange={(e) => onChange?.(e.target.value)}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Icon name="chevron-down" size="sm" />
      </span>
    </div>
  );
}
