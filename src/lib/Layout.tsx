import type { ReactNode } from "react";

export type PageProps = { title?: ReactNode; lede?: ReactNode; actions?: ReactNode; full?: boolean; children: ReactNode };

export function Page({ title, lede, actions, full, children }: PageProps) {
  return (
    <main className={full ? "page is-full" : "page"}>
      {(title || actions) && (
        <header className="page-head">
          <div>
            {title && <h1 className="page-title">{title}</h1>}
            {lede && <p className="page-lede">{lede}</p>}
          </div>
          {actions && <div className="page-actions">{actions}</div>}
        </header>
      )}
      {children}
    </main>
  );
}

export type WidgetGridProps = { flow?: boolean; fill?: boolean; children: ReactNode };

export function WidgetGrid({ flow, fill, children }: WidgetGridProps) {
  if (flow) return <div className="board is-flow">{children}</div>;
  return (
    <div className={fill ? "board-frame is-fill" : "board-frame"}>
      <div className="board">{children}</div>
    </div>
  );
}

export function Stack({ children }: { children: ReactNode }) {
  return <div className="stack">{children}</div>;
}
