import type { ReactNode } from "react";

export function Wireframe({ mobile, children }: { mobile?: boolean; children: ReactNode }) {
  return (
    <div className={`docs-wire${mobile ? " is-mobile" : ""}`}>
      <div className="docs-wire-app" aria-hidden="true">
        {!mobile && (
          <div className="docs-wire-side">
            <span className="docs-wire-line is-brand" />
            {[0, 1, 2, 3].map((i) => (
              <span key={i} className={`docs-wire-line${i === 0 ? " is-current" : ""}`} />
            ))}
          </div>
        )}
        <div className="docs-wire-main">
          <div className="docs-wire-top">
            <span className="docs-wire-line" />
          </div>
          <div className="docs-wire-body">
            <span className="docs-wire-line is-title" />
            <div className="docs-wire-cards">
              {Array.from({ length: mobile ? 3 : 6 }, (_, i) => (
                <span key={i} className="docs-wire-card" />
              ))}
            </div>
          </div>
        </div>
        {mobile && <span className="docs-wire-tabs" />}
      </div>
      <div className="docs-wire-overlay">{children}</div>
    </div>
  );
}
