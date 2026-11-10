import type { ReactNode } from "react";

export function Browser({ address, children }: { address: string; children: ReactNode }) {
  return (
    <div className="browser">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots" />
        <span className="browser-address">{address}</span>
      </div>
      <div className="browser-screen">{children}</div>
    </div>
  );
}
