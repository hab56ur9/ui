import type { ReactNode } from "react";

export type CardProps = { title?: ReactNode; aside?: ReactNode; description?: ReactNode; selected?: boolean; onClick?: () => void; children?: ReactNode };

export function Card({ title, aside, description, selected = false, onClick, children }: CardProps) {
  const className = `card${selected ? " is-selected" : ""}${onClick ? " is-interactive" : ""}`;
  const body = (
    <>
      {(title || aside) && (
        <div className="card-head">
          {title && <strong className="card-title">{title}</strong>}
          {aside}
        </div>
      )}
      {description && <p className="card-description">{description}</p>}
      {children && <div className="card-body">{children}</div>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={className} aria-pressed={selected} onClick={onClick}>
        {body}
      </button>
    );
  }
  return <div className={className}>{body}</div>;
}
