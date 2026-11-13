import type { ReactNode } from "react";
import { PresenceAvatar, type Face } from "./chat";
import { useI18n } from "./i18n";
import { Icon } from "./Icon";
import { ProgressBar } from "./ProgressBar";

export type ProjectCardItem = {
  id: string;
  name: string;
  value: number;
  max?: number;
  badge?: ReactNode;
  owner?: Face;
  meta?: ReactNode;
  aside?: ReactNode;
};

export type ProjectCardsProps = {
  items: ProjectCardItem[];
  value?: string;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  newLabel?: string;
};

export function ProjectCards({ items, value, onSelect, onNew, newLabel }: ProjectCardsProps) {
  const { text } = useI18n();
  return (
    <div className="project-cards">
      {items.map((item) => (
        <button key={item.id} type="button" className={value === item.id ? "project-card is-selected" : "project-card"} aria-pressed={value === item.id} onClick={() => onSelect?.(item.id)}>
          <span className="project-card-head">
            <span className="project-card-name">{item.name}</span>
            {item.badge}
          </span>
          <ProgressBar label={item.name} value={item.value} max={item.max} />
          <span className="project-card-meta">
            <span className="project-card-owner">
              {item.owner && <PresenceAvatar name={item.owner.name} tone={item.owner.tone} avatar={item.owner.avatar} size="xs" />}
              {item.meta}
            </span>
            {item.aside !== undefined && <span>{item.aside}</span>}
          </span>
        </button>
      ))}
      {onNew && (
        <button type="button" className="project-card is-new" onClick={onNew}>
          <Icon name="plus" />
          {newLabel ?? text("projects.new")}
        </button>
      )}
    </div>
  );
}

export type ProjectHeaderProps = {
  name: string;
  value: number;
  max?: number;
  goal?: ReactNode;
  meta?: ReactNode;
  owner?: Face;
  badge?: ReactNode;
  actions?: ReactNode;
};

export function ProjectHeader({ name, value, max, goal, meta, owner, badge, actions }: ProjectHeaderProps) {
  return (
    <div className="project-header">
      <span className="project-card-head">
        <span className="project-card-name">{name}</span>
        <span className="project-card-meta">
          {owner && <PresenceAvatar name={owner.name} tone={owner.tone} avatar={owner.avatar} size="xs" />}
          {meta}
        </span>
        {badge}
      </span>
      {goal && <p>{goal}</p>}
      <ProgressBar label={name} value={value} max={max} />
      {actions && <span className="project-header-actions">{actions}</span>}
    </div>
  );
}

export type LaneProps = {
  title: string;
  value?: number;
  max?: number;
  meta?: ReactNode[];
  badge?: ReactNode;
  children?: ReactNode;
};

export function Lane({ title, value, max, meta = [], badge, children }: LaneProps) {
  return (
    <section className="lane" aria-label={title}>
      <div className="lane-head">
        <strong>{title}</strong>
        {value !== undefined && <ProgressBar label={title} value={value} max={max} />}
        {meta.map((part, index) => (
          <span key={index}>{part}</span>
        ))}
        {badge}
      </div>
      {children}
    </section>
  );
}
