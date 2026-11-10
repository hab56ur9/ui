import { useId, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type TextFieldProps = {
  label: string;
  hideLabel?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  type?: "text" | "search" | "email" | "url" | "tel" | "number" | "password";
  icon?: IconName;
  hint?: ReactNode;
  disabled?: boolean;
};

export function TextField({ label, hideLabel = false, value, defaultValue, onChange, placeholder, type = "text", icon, hint, disabled }: TextFieldProps) {
  const id = useId();
  return (
    <div className="field">
      <label htmlFor={id} className={hideLabel ? "sr-only" : "field-label"}>
        {label}
      </label>
      <span className="field-control">
        {icon && <Icon name={icon} size="sm" />}
        <input id={id} type={type} value={value} defaultValue={defaultValue} placeholder={placeholder} disabled={disabled} aria-describedby={hint ? `${id}-hint` : undefined} onChange={(e) => onChange?.(e.target.value)} />
      </span>
      {hint && (
        <span id={`${id}-hint`} className="field-hint">
          {hint}
        </span>
      )}
    </div>
  );
}
