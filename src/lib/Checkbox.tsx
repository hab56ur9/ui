export type CheckboxProps = {
  label: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
};

export function Checkbox({ label, checked, defaultChecked, onChange, disabled }: CheckboxProps) {
  return (
    <label className="checkbox" title={label}>
      <input type="checkbox" checked={checked} defaultChecked={defaultChecked} disabled={disabled} onChange={(e) => onChange?.(e.target.checked)} />
      <span className="checkbox-label">{label}</span>
    </label>
  );
}
