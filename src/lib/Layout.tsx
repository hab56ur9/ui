import type { ReactNode } from "react";

export type PageProps = { title?: ReactNode; lede?: ReactNode; actions?: ReactNode; children: ReactNode };

export function Page({ title, lede, actions, children }: PageProps) {
  return (
    <main className="page">
      {(title || actions) && (
        <header className="page-head">
          <div>
            {title && <h1 className="page-title">{title}</h1>}
            {lede && <p className="page-lede">{lede}</p>}
          </div>
          {actions}
        </header>
      )}
      {children}
    </main>
  );
}

export type WidgetGridProps = { flow?: boolean; children: ReactNode };

export function WidgetGrid({ flow, children }: WidgetGridProps) {
  if (flow) return <div className="board is-flow">{children}</div>;
  return (
    <div className="board-frame">
      <div className="board">{children}</div>
    </div>
  );
}
