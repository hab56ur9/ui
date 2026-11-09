import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";

export type TabBarItem = { id: string; label: string; icon: IconName; badge?: string | number };
export type TabBarProps = { items: TabBarItem[]; value?: string; onChange?: (id: string) => void; label?: string };

export function TabBar({ items, value, onChange, label }: TabBarProps) {
  const { text } = useI18n();
  return (
    <nav className="tab-bar" aria-label={label ?? text("navigation")}>
      {items.map((item) => (
        <button key={item.id} type="button" className="tab-bar-item" aria-current={item.id === value ? "page" : undefined} onClick={() => onChange?.(item.id)}>
          <span className="tab-bar-icon">
            <Icon name={item.icon} />
            {item.badge !== undefined && <span className="tab-bar-badge">{item.badge}</span>}
          </span>
          <span className="tab-bar-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}
