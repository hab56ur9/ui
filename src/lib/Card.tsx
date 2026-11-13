import type { ReactNode } from "react";
import { useEnter } from "./MotionScope";

export type CardProps = { title?: ReactNode; aside?: ReactNode; description?: ReactNode; selected?: boolean; onClick?: () => void; children?: ReactNode };

export function Card({ title, aside, description, selected = false, onClick, children }: CardProps) {
  const { enter } = useEnter();
  const className = `card${selected ? " is-selected" : ""}${onClick ? " is-interactive" : ""}`;
  const body = (
    <>
      {(title || aside) && (
        <div className="card-head">
          {title && (
            <strong className="card-title" title={typeof title === "string" ? title : undefined}>
              {title}
            </strong>
          )}
          {aside}
        </div>
      )}
      {description && <p className="card-description">{description}</p>}
      {children && <div className="card-body">{children}</div>}
    </>
  );
  if (onClick) {
    return (
      <button type="button" className={className} data-motion={enter} aria-pressed={selected} onClick={onClick}>
        {body}
      </button>
    );
  }
  return (
    <div className={className} data-motion={enter}>
      {body}
    </div>
  );
}
