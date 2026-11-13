import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";
import { TabBar, type TabBarStyle } from "./TabBar";

export type ShellItem = { id: string; label: string; icon?: IconName; href?: string; sub?: string; current?: boolean; onSelect?: () => void };
export type ShellGroup = { title?: string; items: ShellItem[] };
export type AppShellProps = { brand: ReactNode; nav: ShellGroup[]; navHeader?: ReactNode; title?: ReactNode; onBack?: () => void; actions?: ReactNode; aside?: ReactNode; scroll?: "frame" | "page"; mobileNav?: "drawer" | "tabs"; tabBar?: TabBarStyle; children: ReactNode };

function ShellNav({ nav, onPick }: { nav: ShellGroup[]; onPick?: () => void }) {
  const { text } = useI18n();
  return (
    <nav className="shell-nav" aria-label={text("navigation")}>
      {nav.map((group, g) => (
        <div className="shell-group" key={group.title ?? g}>
          {group.title && <div className="shell-group-title">{group.title}</div>}
          {group.items.map((item, i) => {
            const body = (
              <>
                {item.icon && <Icon name={item.icon} size="sm" />}
                <span className="shell-label" title={item.label}>
                  {item.label}
                </span>
              </>
            );
            const className = `shell-link${item.sub ? " is-sub" : ""}`;
            const pick = () => {
              item.onSelect?.();
              onPick?.();
            };
            return (
              <Fragment key={item.id}>
                {item.sub && item.sub !== group.items[i - 1]?.sub && <div className="shell-sub">{item.sub}</div>}
                {item.href ? (
                  <a className={className} href={item.href} aria-current={item.current ? "page" : undefined} onClick={pick}>
                    {body}
                  </a>
                ) : (
                  <button type="button" className={className} aria-current={item.current ? "page" : undefined} onClick={pick}>
                    {body}
                  </button>
                )}
              </Fragment>
            );
          })}
        </div>
      ))}
    </nav>
  );
}

export function AppShell({ brand, nav, navHeader, title, onBack, actions, aside, scroll = "frame", mobileNav = "drawer", tabBar, children }: AppShellProps) {
  const side = nav.length > 0 || navHeader !== undefined;
  const { text } = useI18n();
  const [open, setOpen] = useState(false);
  const items = nav.flatMap((group) => group.items);
  const menu = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLElement>(null);
  const tabs = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = tabs.current;
    if (!el) return;
    const root = document.documentElement;
    const frame = el.closest<HTMLElement>(".shell-frame");
    const measure = () => {
      if (frame && frame.offsetHeight >= window.innerHeight - 1) root.style.setProperty("--shell-tabs-height", `${el.offsetHeight}px`);
    };
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    if (frame) observer.observe(frame);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--shell-tabs-height");
    };
  }, [mobileNav]);
  const close = () => {
    setOpen(false);
    menu.current?.focus();
  };
  useEffect(() => {
    if (!open) return;
    (panel.current?.querySelector<HTMLElement>("[aria-current=page]") ?? panel.current?.querySelector<HTMLElement>(".shell-link"))?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      menu.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);
  return (
    <div className={`shell-frame is-${scroll}${mobileNav === "tabs" ? " has-tabs" : ""}`}>
      <div className={`shell${side ? "" : " no-side"}`}>
        {side && (
          <aside className="shell-side">
            <div className="shell-brand">{brand}</div>
            {navHeader}
            <ShellNav nav={nav} />
          </aside>
        )}
        <div className="shell-main">
          <header className="shell-bar">
            {onBack ? (
              <button type="button" className="shell-back" aria-label={text("back")} title={text("back")} onClick={onBack}>
                <Icon name="chevron-left" />
              </button>
            ) : side ? (
              <button ref={menu} type="button" className="shell-menu" aria-label={text("openMenu")} title={text("openMenu")} aria-expanded={open} onClick={() => setOpen(true)}>
                <Icon name="menu" />
              </button>
            ) : (
              <div className="shell-brand">{brand}</div>
            )}
            {title && <div className="shell-title">{title}</div>}
            <span className="toolbar-spacer" />
            {actions}
          </header>
          {aside ? (
            <div className="shell-content">
              <div className="shell-body">{children}</div>
              <aside className="shell-aside">{aside}</aside>
            </div>
          ) : (
            <div className="shell-body">{children}</div>
          )}
          {mobileNav === "tabs" && (
            <div ref={tabs} className={`shell-tabs is-${tabBar?.variant ?? "bar"}`}>
              <TabBar {...tabBar} items={items.map((item) => ({ ...item, icon: item.icon ?? "home" }))} value={items.find((item) => item.current)?.id} onChange={(id) => items.find((item) => item.id === id)?.onSelect?.()} />
            </div>
          )}
        </div>
      </div>
      <div className={`shell-drawer${open ? " is-open" : ""}`} inert={!open}>
        <div className="shell-scrim" onClick={close} />
        <aside ref={panel} className="shell-drawer-panel" role="dialog" aria-modal="true" aria-label={text("navigation")}>
          <div className="shell-brand">
            {brand}
            <span className="toolbar-spacer" />
            <button type="button" className="shell-menu" aria-label={text("close")} title={text("close")} onClick={close}>
              <Icon name="close" />
            </button>
          </div>
          {navHeader}
          <ShellNav nav={nav} onPick={close} />
        </aside>
      </div>
    </div>
  );
}
