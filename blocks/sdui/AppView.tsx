import { useEffect, useState, type CSSProperties } from "react";
import { AppShell, Button, Icon, Modal, Sheet, useI18n, useToast, Widget } from "ui";
import { formatsFor, renderNode, type Action, type App } from "./render";

const TEXT = {
  ko: { action: (name: string) => `서버 동작 요청: ${name}` },
  en: { action: (name: string) => `Server action requested: ${name}` },
};

const PRESS: CSSProperties = { position: "absolute", inset: 0, zIndex: 1, border: 0, borderRadius: "var(--radius-card)", background: "transparent", cursor: "pointer" };
const LAYER: CSSProperties = { position: "absolute", inset: 0, zIndex: 3, display: "flex", justifyContent: "center", padding: "var(--space-4)", background: "var(--color-bg-scrim)" };

type AppViewProps = { app: App; values: Record<string, unknown>; mobileNav?: "drawer" | "tabs"; screen?: string; onNavigate?: (screen: string) => void };

export function AppView({ app, values, mobileNav = "tabs", screen: controlled, onNavigate }: AppViewProps) {
  const { lang, locale } = useI18n();
  const toast = useToast();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const [own, setOwn] = useState(app.start);
  const [overlay, setOverlay] = useState<string | null>(null);
  const current = controlled ?? own;
  const screen = app.screens[current] ?? app.screens[app.start];
  const navigate = (id: string) => {
    setOwn(id);
    onNavigate?.(id);
  };

  useEffect(() => {
    if (!overlay) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOverlay(null);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [overlay]);

  const run = (action: Action) => {
    if (action.name === "navigate") navigate(String(action.params?.screen));
    if (action.name === "open") setOverlay(String(action.params?.overlay));
    if (action.name === "close" || action.close) setOverlay(null);
    if (!["navigate", "open", "close"].includes(action.name)) toast({ message: t.action(action.name), status: "info" });
  };
  const ctx = { data: values, formats: formatsFor(locale), onAction: run };
  const nav = [{ items: app.nav.map((item) => ({ ...item, current: item.id === current, onSelect: () => navigate(item.id) })) }];
  const open = overlay ? app.overlays?.[overlay] : undefined;
  const Layer = open?.kind === "sheet" ? Sheet : Modal;

  return (
    <div style={{ position: "relative", height: "100%" }} data-density={app.density}>
      <AppShell
        mobileNav={mobileNav}
        tabBar={app.navBar}
        brand={
          <>
            <Icon name="trend-up" />
            {app.app}
          </>
        }
        nav={nav}
        title={app.nav.find((item) => item.id === current)?.label}
        actions={screen.actions?.map(({ label, variant, action }) => (
          <Button key={label} variant={variant} onClick={() => run(action)}>
            {label}
          </Button>
        ))}
      >
        <main className="page">
          {screen.title && (
            <header className="page-head">
              <div>
                <h1 className="page-title">{screen.title}</h1>
                {screen.lede && <p className="page-lede">{screen.lede}</p>}
              </div>
            </header>
          )}
          <div className="board-frame">
            <div className="board">
              {screen.widgets.map(({ id, title, subtitle, w, h, frame, content, action }) => (
                <Widget key={id} id={id} title={title ?? ""} subtitle={subtitle} w={w} h={h} frame={frame}>
                  {renderNode(content, ctx)}
                  {action && <button type="button" style={PRESS} aria-label={title ?? id} onClick={() => run(action)} />}
                </Widget>
              ))}
            </div>
          </div>
        </main>
      </AppShell>
      {open && (
        <div style={{ ...LAYER, alignItems: open.kind === "sheet" ? "flex-end" : "center", padding: open.kind === "sheet" ? "var(--space-4) 0 0" : LAYER.padding }} onClick={(e) => e.target === e.currentTarget && setOverlay(null)}>
          <Layer
            inline
            open
            title={open.title}
            description={open.description}
            actions={open.actions.map(({ label, variant, action }) => ({ label, variant, value: JSON.stringify(action) }))}
            onClose={(value) => (value ? run(JSON.parse(value) as Action) : setOverlay(null))}
          >
            {open.body}
          </Layer>
        </div>
      )}
    </div>
  );
}
