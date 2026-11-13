import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export type PanelProps = {
  title?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  variant?: "section" | "pane";
  children?: ReactNode;
};

export function Panel({ title, meta, actions, variant = "section", children }: PanelProps) {
  const head = title !== undefined || meta !== undefined || actions !== undefined;
  return (
    <section className={`panel is-${variant}`}>
      {head && (
        <div className="panel-head">
          {title !== undefined && <span className="panel-title">{title}</span>}
          {meta !== undefined && <span className="panel-meta">{meta}</span>}
          <span className="panel-gap" />
          {actions !== undefined && <div className="panel-actions">{actions}</div>}
        </div>
      )}
      <div className="panel-body">{children}</div>
    </section>
  );
}

export type PanelActionProps = {
  icon: IconName;
  label: string;
  onClick?: () => void;
};

export function PanelAction({ icon, label, onClick }: PanelActionProps) {
  return (
    <button type="button" className="panel-action" title={label} aria-label={label} onClick={onClick}>
      <Icon name={icon} size="sm" />
    </button>
  );
}
