import type { ReactNode } from "react";
import { Browser } from "./Browser";
import { Phone } from "./Phone";

type Place = "corner" | "center" | "bottom";

const line = (className = "") => <span className={`mock-line ${className}`} />;

const chart = (
  <svg className="mock-chart" viewBox="0 0 200 60" preserveAspectRatio="none">
    <path d="M0 48 L20 40 L40 44 L60 30 L80 34 L100 22 L120 28 L140 16 L160 20 L180 10 L200 14" vectorEffect="non-scaling-stroke" />
  </svg>
);

function Stat() {
  return (
    <span className="mock-card is-stat">
      {line("is-xs")}
      {line("is-value")}
    </span>
  );
}

function ListRow() {
  return (
    <span className="mock-row">
      <span className="mock-dot is-lg" />
      <span className="mock-stack">
        {line("is-sm")}
        {line("is-xs")}
      </span>
      {line("is-end")}
    </span>
  );
}

function DesktopApp() {
  return (
    <div className="mock-app is-desktop">
      <div className="mock-side">
        <span className="mock-brand">
          <span className="mock-dot is-square" />
          {line("is-sm")}
        </span>
        {[0, 1, 2, 3, 4].map((i) => (
          <span key={i} className={`mock-nav${i === 0 ? " is-current" : ""}`}>
            <span className="mock-dot is-icon" />
            {line("is-sm")}
          </span>
        ))}
      </div>
      <div className="mock-main">
        <div className="mock-top">
          <span className="mock-search" />
          <span className="mock-dot is-avatar" />
        </div>
        <div className="mock-body">
          <div className="mock-head">
            {line("is-title")}
            <span className="mock-button" />
          </div>
          <div className="mock-stats">
            {[0, 1, 2, 3].map((i) => (
              <Stat key={i} />
            ))}
          </div>
          <div className="mock-split">
            <span className="mock-card is-chart">
              {line("is-sm")}
              {chart}
            </span>
            <span className="mock-card is-list">
              {line("is-sm")}
              {[0, 1, 2].map((i) => (
                <ListRow key={i} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileApp() {
  return (
    <div className="mock-app is-mobile">
      <div className="mock-body">
        <div className="mock-head">
          <span className="mock-stack">
            {line("is-xs")}
            {line("is-title")}
          </span>
          <span className="mock-dot is-avatar" />
        </div>
        <div className="mock-chips">
          <span className="mock-chip is-current" />
          <span className="mock-chip" />
          <span className="mock-chip" />
        </div>
        <span className="mock-card is-hero">
          {line("is-xs")}
          {line("is-value")}
          {chart}
        </span>
        <div className="mock-stats">
          <Stat />
          <Stat />
        </div>
        <span className="mock-card is-list">
          {[0, 1, 2].map((i) => (
            <ListRow key={i} />
          ))}
        </span>
      </div>
      <div className="mock-tabs">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`mock-tab${i === 0 ? " is-current" : ""}`}>
            <span className="mock-dot is-icon" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function Mockup({ device = "desktop", place = "corner", address = "app.example.com", children }: { device?: "desktop" | "mobile"; place?: Place; address?: string; children: ReactNode }) {
  const screen = (
    <div className={`mock is-${device}`}>
      <div className="mock-screen" aria-hidden="true" inert>
        {device === "mobile" ? <MobileApp /> : <DesktopApp />}
      </div>
      <div className={`mock-overlay is-${place}`}>{children}</div>
    </div>
  );
  if (device === "mobile")
    return (
      <div className="mock-phone">
        <Phone>{screen}</Phone>
      </div>
    );
  return <Browser address={address}>{screen}</Browser>;
}
