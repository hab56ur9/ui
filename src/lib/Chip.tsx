import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";

export type ChipProps = {
  label: string;
  icon?: IconName;
  onSelect?: () => void;
  onRemove?: () => void;
};

export function Chip({ label, icon, onSelect, onRemove }: ChipProps) {
  const { text: t } = useI18n();
  const content = (
    <>
      {icon && <Icon name={icon} size="sm" />}
      <span className="chip-text">{label}</span>
    </>
  );
  return (
    <span className="chip">
      {onSelect ? (
        <button type="button" className="chip-label" title={label} onClick={onSelect}>
          {content}
        </button>
      ) : (
        <span className="chip-label" title={label}>
          {content}
        </span>
      )}
      {onRemove && (
        <button type="button" className="chip-remove" aria-label={t("chip.remove", { label })} onClick={onRemove}>
          <Icon name="close" size="sm" />
        </button>
      )}
    </span>
  );
}
