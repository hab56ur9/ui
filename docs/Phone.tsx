import type { ReactNode } from "react";

export function Phone({ children }: { children: ReactNode }) {
  return (
    <div className="phone">
      <div className="phone-status" aria-hidden="true">
        <span>9:41</span>
        <span className="phone-island" />
        <span className="phone-signal" />
      </div>
      <div className="phone-screen">{children}</div>
      <div className="phone-home" aria-hidden="true" />
    </div>
  );
}
