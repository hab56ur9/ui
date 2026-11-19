import { Fragment, useMemo, useState, type ReactNode } from "react";
import { AppShell } from "./AppShell";
import { Article, RichText } from "./article";
import { Widget } from "./Board";
import { Button } from "./controls";
import { DesktopShell } from "./DesktopShell";
import { useSize } from "./hooks";
import { useI18n } from "./i18n";
import { draw, resolve, type JsonUIAction, type JsonUIComponents, type JsonUIContent, type JsonUIContext } from "./JsonUI";
import { Page, WidgetGrid } from "./Layout";
import { Pager, Toc } from "./navigation";
import { Modal, Sheet } from "./overlay/Dialog";
import { Panel, PanelAction } from "./Panel";
import { navGroups, sectionOf, specFormats, tocOf, type AppSpec, type SpecButton, type SpecScreen } from "./appSpec";
import { Tabs } from "./Tabs";
import { TextField } from "./TextField";

export type SpecAppProps = {
  spec: AppSpec;
  data?: Record<string, unknown>;
  screen?: string;
  panel?: string | null;
  overlay?: string | null;
  components?: JsonUIComponents;
  onAction?: (action: JsonUIAction, value?: unknown) => void;
};

const NARROW = 1024;

export function SpecApp({ spec, data = {}, screen: asked, panel = null, overlay = null, components, onAction = () => undefined }: SpecAppProps) {
  const { locale, text } = useI18n();
  const [frameRef, size] = useSize<HTMLDivElement>();
  const [query, setQuery] = useState("");
  const formats = useMemo(() => specFormats(spec.formats, locale), [spec.formats, locale]);
  const screen = asked !== undefined && asked in spec.screens ? asked : spec.start;
  const ctx: JsonUIContext = { data, formats, state: { screen, panel }, components, onAction };
  const frame = spec.frame ?? {};
  const nav = spec.nav ?? [];
  const go = (id: string) => onAction({ name: "navigate", params: { screen: id } });
  const show = (content: JsonUIContent) => draw(content, ctx);
  const titleOf = (id: string) => nav.find((item) => item.screen === id)?.label ?? id;
  const buttons = (items: SpecButton[] = []) =>
    items.map((button, i) => (
      <Button key={i} variant={button.variant ?? "secondary"} onClick={() => onAction(button.action)}>
        {button.label}
      </Button>
    ));

  const widgetsOf = (view: SpecScreen) =>
    (view.widgets ?? []).map((widget) => (
      <Widget key={widget.id} id={widget.id} title={widget.title ?? ""} subtitle={widget.subtitle} w={widget.w} h={widget.h === "auto" ? 1 : widget.h} frame={widget.frame}>
        {show(widget.content)}
        {widget.action && <button type="button" className="spec-press" data-press="" aria-label={widget.title ?? widget.id} onClick={() => widget.action && onAction(widget.action)} />}
      </Widget>
    ));

  const pagerFor = (id: string) => {
    const at = nav.findIndex((item) => item.screen === id);
    const link = (index: number) => {
      const target = nav[index]?.screen;
      return target === undefined ? undefined : { label: titleOf(target), onSelect: () => go(target) };
    };
    return <Pager label={frame.pager ?? ""} previous={link(at - 1)} next={link(at + 1)} />;
  };

  const view = spec.screens[screen];
  const body =
    view.layout === "article" ? (
      <Article title={view.title ?? ""} eyebrow={view.eyebrow} lede={view.lede && <RichText text={view.lede} />} wide={view.wide} pager={pagerFor(screen)}>
        <WidgetGrid flow>{widgetsOf(view)}</WidgetGrid>
      </Article>
    ) : (
      <Page title={view.title} lede={view.lede} actions={view.actions?.length ? buttons(view.actions) : undefined}>
        <WidgetGrid>{widgetsOf(view)}</WidgetGrid>
      </Page>
    );

  const panelSpec = panel ? spec.panels?.[panel] : undefined;
  const inspector = panelSpec && (
    <div className="spec-part" data-panel={panel}>
      <Panel variant="pane" title={panelSpec.title} actions={<PanelAction icon="close" label={text("close")} onClick={() => onAction({ name: "panel" })} />}>
        {show(panelSpec.content)}
      </Panel>
    </div>
  );

  const overlaySpec = overlay ? spec.overlays?.[overlay] : undefined;
  const Dialog = overlaySpec?.kind === "sheet" ? Sheet : Modal;
  const dialog = overlaySpec && (
    <div className="spec-part" data-overlay={overlay}>
      <Dialog
        open
        title={overlaySpec.title}
        description={overlaySpec.lede}
        actions={(overlaySpec.actions ?? []).map((button, i) => ({ label: button.label, variant: button.variant ?? "secondary", value: i }))}
        onClose={(i) => onAction(i === null ? { name: "close" } : (overlaySpec.actions ?? [])[i].action)}
      >
        {overlaySpec.body}
      </Dialog>
    </div>
  );

  const brand = (frame.brand === undefined ? spec.app.name : resolve(frame.brand, ctx)) as ReactNode;
  const actions = frame.actions?.length ? <Fragment>{frame.actions.map((node, i) => <Fragment key={i}>{resolve(node, ctx) as ReactNode}</Fragment>)}</Fragment> : undefined;
  const sidebarSpec = view.sidebar ?? frame.sidebar;
  const narrow = size.width > 0 && size.width < NARROW;

  const desktop = frame.shell === "desktop" && !narrow;
  const sections = frame.sections ?? [];
  const section = sectionOf(spec, screen);
  const needle = query.trim().toLowerCase();
  const inSection = (group?: string) => !sections.length || (group !== undefined && sections[section].groups.includes(group));
  const visible = nav.filter((item) => (needle ? item.label.toLowerCase().includes(needle) : inSection(item.group)));
  const shellNav = navGroups(visible).map((group) => ({
    title: group.title,
    items: group.items.map((item) => ({ id: item.screen, label: item.label, icon: item.icon, sub: item.sub, current: item.screen === screen, onSelect: () => go(item.screen) })),
  }));
  const toc = tocOf(view);
  const screenView = (
    <div className={desktop ? "spec-screen" : "spec-part"} data-screen={screen}>
      {body}
    </div>
  );
  const mobileNav = frame.shell === "desktop" ? "tabs" : (frame.mobileNav ?? (frame.brand === undefined ? "tabs" : undefined));
  const title = sections.length ? (
    <Tabs
      variant="pill"
      label={frame.sectionsLabel ?? ""}
      value={String(section)}
      onChange={(index) => {
        const first = nav.find((item) => item.group !== undefined && sections[Number(index)].groups.includes(item.group));
        if (first) go(first.screen);
      }}
      items={sections.map((item, index) => ({ id: String(index), label: item.label }))}
    />
  ) : (
    titleOf(screen)
  );

  return (
    <div ref={frameRef} className="spec-app" data-density={spec.app.density ?? "comfortable"} data-medium="app">
      {desktop ? (
        <DesktopShell
          path={[brand, titleOf(screen)]}
          titleActions={actions}
          rail={nav.map((item) => ({ id: item.screen, label: item.label, icon: item.icon ?? "grid", current: item.screen === screen, onSelect: () => go(item.screen) }))}
          sidebar={sidebarSpec && show(sidebarSpec)}
          inspector={inspector}
        >
          {screenView}
        </DesktopShell>
      ) : (
        <AppShell
          brand={brand}
          nav={shellNav}
          mobileNav={mobileNav}
          scroll={frame.scroll}
          navHeader={frame.search && <TextField label={frame.search.label ?? ""} hideLabel type="search" icon="search" placeholder={frame.search.placeholder ?? frame.search.label ?? ""} value={query} onChange={setQuery} />}
          title={title}
          actions={actions}
          aside={inspector || (frame.toc && toc.length ? <Toc key={screen} title={frame.toc} items={toc} offset={120} /> : undefined)}
        >
          {screenView}
        </AppShell>
      )}
      {dialog}
    </div>
  );
}
