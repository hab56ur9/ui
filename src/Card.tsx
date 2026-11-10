import type { ReactNode } from "react";

export type CardProps = { title?: ReactNode; aside?: ReactNode; description?: ReactNode; selected?: boolean; children?: ReactNode };

export function Card({ title, aside, description, selected = false, children }: CardProps) {
  return (
    <div className={`card${selected ? " is-selected" : ""}`}>
      {(title || aside) && (
        <div className="card-head">
          {title && <strong className="card-title">{title}</strong>}
          {aside}
        </div>
      )}
      {description && <p className="card-description">{description}</p>}
      {children && <div className="card-body">{children}</div>}
    </div>
  );
}
