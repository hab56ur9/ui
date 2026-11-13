import { Fragment, useRef, useState, type ReactNode } from "react";
import { clamp } from "./charts/scale";
import type { Presence } from "./chat";
import { useI18n } from "./i18n";
import { Icon, type IconName } from "./Icon";
import { ResizeHandle } from "./SplitPane";

export type DesktopRailItem = { id: string; label: string; icon: IconName; current?: boolean; dot?: Presence; onSelect?: () => void };

export type DesktopShellSizes = { sidebar: number; inspector: number };

export type DesktopShellProps = {
  frame?: "viewport" | "window";
  path?: ReactNode[];
  search?: { placeholder?: string; shortcut?: string; onOpen?: () => void };
  titleActions?: ReactNode;
  rail?: DesktopRailItem[];
  railFooter?: DesktopRailItem[];
  sidebar?: ReactNode;
  inspector?: ReactNode;
  status?: ReactNode;
  sizes?: Partial<DesktopShellSizes>;
  onResize?: (sizes: DesktopShellSizes) => void;
  overlay?: ReactNode;
  overlayScope?: "content" | "main" | "modal";
  onOverlayClose?: () => void;
  children?: ReactNode;
};

export function DesktopShell({ frame = "viewport", path = [], search, titleActions, rail = [], railFooter = [], sidebar, inspector, status, sizes, onResize, overlay, overlayScope = "content", onOverlayClose, children }: DesktopShellProps) {
  const { text } = useI18n();
  const [side, setSide] = useState(sizes?.sidebar ?? 248);
  const [aside, setAside] = useState(sizes?.inspector ?? 300);
  const live = useRef({ side, aside });
  const base = useRef({ side, aside });

  const moveSide = (dx: number) => {
    live.current.side = clamp(base.current.side + dx, 180, 420);
    setSide(live.current.side);
  };

  const moveAside = (dx: number) => {
    live.current.aside = clamp(base.current.aside - dx, 240, 480);
    setAside(live.current.aside);
  };

  const commit = () => {
    base.current = { ...live.current };
    onResize?.({ sidebar: live.current.side, inspector: live.current.aside });
  };

  const hasRail = rail.length > 0 || railFooter.length > 0;
  const columns = [hasRail && "var(--desktop-rail)", sidebar && `${side}px`, sidebar && "var(--desktop-handle)", "minmax(0, 1fr)", inspector && "var(--desktop-handle)", inspector && `${aside}px`].filter(Boolean).join(" ");
  const mainLeft = overlayScope === "main" && sidebar ? `calc(${hasRail ? "var(--desktop-rail) + " : ""}${side}px + var(--desktop-handle))` : 0;

  const railButton = (item: DesktopRailItem) => (
    <button key={item.id} type="button" title={item.label} aria-label={item.label} aria-current={item.current ? "page" : undefined} onClick={item.onSelect}>
      <Icon name={item.icon} />
      {item.dot && <span className={`presence-dot is-${item.dot}`} aria-hidden />}
    </button>
  );

  return (
    <div className={`desktop is-${frame}${status ? " has-status" : ""}`}>
      <header className="desktop-bar">
        <div>
          {frame === "window" && (
            <div className="desktop-lights" aria-hidden>
              <i />
              <i />
              <i />
            </div>
          )}
        </div>
        <div className="desktop-crumbs">
          {path.map((part, i) => (
            <Fragment key={i}>
              {i > 0 && <Icon name="chevron-right" size="sm" />}
              {i === path.length - 1 ? <strong>{part}</strong> : <span>{part}</span>}
            </Fragment>
          ))}
          {search && (
            <button type="button" className="desktop-search" onClick={search.onOpen}>
              <Icon name="search" size="sm" />
              {search.placeholder ?? text("desktop.search")}
              {search.shortcut && <kbd>{search.shortcut}</kbd>}
            </button>
          )}
        </div>
        <div className="desktop-bar-end">{titleActions}</div>
      </header>
      <div className="desktop-body" style={{ gridTemplateColumns: columns }}>
        {hasRail && (
          <nav className="desktop-rail" aria-label={text("desktop.rail")}>
            {rail.map(railButton)}
            <div className="desktop-rail-gap" />
            {railFooter.map(railButton)}
          </nav>
        )}
        {sidebar && <aside className="desktop-side">{sidebar}</aside>}
        {sidebar && <ResizeHandle label={text("desktop.sidebar")} onMove={moveSide} onEnd={commit} />}
        <main className="desktop-main">{children}</main>
        {inspector && <ResizeHandle label={text("desktop.inspector")} onMove={moveAside} onEnd={commit} />}
        {inspector && <aside className="desktop-inspector">{inspector}</aside>}
        {overlay && overlayScope === "modal" && (
          <div className="desktop-overlay is-modal" onMouseDown={(event) => event.target === event.currentTarget && onOverlayClose?.()}>
            {overlay}
          </div>
        )}
        {overlay && overlayScope !== "modal" && (
          <div className="desktop-overlay" style={{ left: mainLeft, right: inspector ? `calc(${aside}px + var(--desktop-handle))` : 0 }}>
            {overlay}
          </div>
        )}
      </div>
      {status}
    </div>
  );
}
