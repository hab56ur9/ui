import { Component, useEffect, useState, type ErrorInfo, type ReactNode } from "react";
import { Board, Button, iconNames, useI18n, useToast, Widget, type LayoutItem, type TabBarStyle } from "ui";
import { AppView } from "../blocks/sdui/AppView";
import { data as fitnessData } from "../blocks/sdui/fitness/data";
import fitnessEn from "../blocks/sdui/fitness/en.json";
import fitnessKo from "../blocks/sdui/fitness/ko.json";
import { formatsFor, isNode, renderNode, type Action, type App, type Content, type NavItem, type Node, type ScreenWidget } from "../blocks/sdui/render";
import { data as socialData, dataEn as socialDataEn } from "../blocks/sdui/social/data";
import socialEn from "../blocks/sdui/social/en.json";
import socialKo from "../blocks/sdui/social/ko.json";
import schema from "../dist/components.json";
import { Phone } from "./Phone";

type Lang = "ko" | "en";
type Draft = ScreenWidget & { hidden?: boolean };
type Fields = Record<string, unknown>;
type Prop = { name: string; optional: boolean; kind: string; values?: (string | number)[]; type?: string };
type Device = "mobile" | "desktop";
type Sample = { app: App; data: Fields };

const SAMPLES: Record<Device, Record<Lang, Sample>> = {
  mobile: { ko: { app: socialKo as App, data: socialData }, en: { app: socialEn as App, data: socialDataEn } },
  desktop: { ko: { app: fitnessKo as App, data: fitnessData }, en: { app: fitnessEn as App, data: fitnessData } },
};
const draftsOf = (app: App) => Object.fromEntries(Object.entries(app.screens).map(([id, screen]) => [id, screen.widgets as Draft[]]));
const SCHEMA = new Map((schema.components as { name: string; props: Prop[] }[]).map(({ name, props }) => [name, props]));
const COMPONENTS = [...SCHEMA.keys()].filter((name) => name !== "JsonUI").sort();

const COPY = {
  ko: {
    preview: "사용자 화면",
    builder: "화면 조립",
    width: "너비(열)",
    height: "높이(행)",
    frame: "테두리",
    card: "카드",
    plain: "없음",
    reset: "처음으로",
    menu: "메뉴바",
    menuHint: "메뉴 항목의 이름·아이콘·순서와 메뉴바 모양을 정합니다. 항목은 화면과 하나씩 짝을 이룹니다.",
    barVariant: "모양",
    barLabels: "이름 표시",
    variants: { bar: "하단 고정", floating: "플로팅" },
    labelModes: { show: "항상", active: "현재 탭만", hide: "숨김" },
    name: "이름",
    icon: "아이콘",
    up: "위로",
    down: "아래로",
    copy: "JSON 복사",
    copied: "서버에 보낼 JSON을 복사했습니다",
    hint: (mobile: boolean) => `위젯을 끌어 순서를 바꾸고, 눌러서 내용과 크기를 고칩니다. ${mobile ? "왼쪽 휴대폰" : "위의 브라우저 창"}이 실제 사용자에게 보이는 화면이고, 그 메뉴를 누르면 그 화면을 편집합니다.`,
    pick: "위젯을 누르면 여기서 내용을 고칩니다.",
    title: "제목",
    subtitle: "부제",
    none: "없음",
    direct: "직접 입력",
    format: "형식",
    remove: "빼기",
    addWidget: "위젯으로 추가",
    addPart: "이 위젯에 더하기",
    component: "컴포넌트",
    press: "누르면",
    openModal: "모달 열기",
    openSheet: "시트 열기",
    goTo: "화면 이동",
    server: "서버 동작",
    invalid: "JSON 형식이 아닙니다",
    schemaNote: "속성 목록은 컴포넌트의 TypeScript 타입에서 빌드 때 만들어집니다.",
    broken: "그리지 못했습니다",
  },
  en: {
    preview: "User screen",
    builder: "Screen builder",
    width: "Width (columns)",
    height: "Height (rows)",
    frame: "Frame",
    card: "Card",
    plain: "None",
    reset: "Start over",
    menu: "Menu bar",
    menuHint: "Set each menu item's name, icon and order, and the bar's look. Each item pairs with one screen.",
    barVariant: "Style",
    barLabels: "Labels",
    variants: { bar: "Docked", floating: "Floating" },
    labelModes: { show: "Always", active: "Current tab only", hide: "Hidden" },
    name: "Name",
    icon: "Icon",
    up: "Move up",
    down: "Move down",
    copy: "Copy JSON",
    copied: "Copied the JSON to send from the server",
    hint: (mobile: boolean) => `Drag widgets to reorder them, and click one to edit its content and size. The ${mobile ? "phone on the left" : "browser window above"} is the screen users actually see; tap its menu to edit that screen.`,
    pick: "Click a widget to edit it here.",
    title: "Title",
    subtitle: "Subtitle",
    none: "None",
    direct: "Typed in",
    format: "Format",
    remove: "Remove",
    addWidget: "Add as widget",
    addPart: "Add to this widget",
    component: "Component",
    press: "On tap",
    openModal: "Open modal",
    openSheet: "Open sheet",
    goTo: "Go to",
    server: "Server action",
    invalid: "Not valid JSON",
    schemaNote: "The prop list comes from each component's TypeScript types at build time.",
    broken: "Couldn't draw",
  },
};
type Copy = (typeof COPY)[Lang];

const nodesOf = (value: unknown): Node[] => {
  if (Array.isArray(value)) return value.flatMap(nodesOf);
  if (typeof value !== "object" || value === null) return [];
  return [...(isNode(value) ? [value] : []), ...Object.values(value).flatMap(nodesOf)];
};
const SEEN = nodesOf([SAMPLES.mobile.ko.app, SAMPLES.desktop.ko.app]);
const serverActions = (app: App) => [...new Set(JSON.stringify(app).match(/"name":"[a-z-]+"/g) ?? [])].map((match) => match.slice(8, -1)).filter((name) => !["open", "navigate", "close"].includes(name));
const templateOf = (type: string): Node => structuredClone(SEEN.find((node) => node.type === type) ?? { type, props: {} });

const MENU = "__menu";
const loadMenu = (key: string) => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "null") as Menu | null;
  } catch {
    return null;
  }
};
const saveMenu = (key: string, value: Menu) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

const load = (key: string) => {
  try {
    const drafts = JSON.parse(localStorage.getItem(key) ?? "null") as Record<string, Draft[]> | null;
    return drafts && Object.values(drafts).flat().every((widget) => [widget.content].flat().every(isNode)) ? drafts : null;
  } catch {
    return null;
  }
};
const save = (key: string, value: Record<string, Draft[]>) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    return;
  }
};

class Guard extends Component<{ fallback: string; children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.warn(error.message, info.componentStack?.split("\n")[1]);
  }
  render() {
    if (this.state.error) return <p className="sdui-error">{`${this.props.fallback}: ${this.state.error.message}`}</p>;
    return this.props.children;
  }
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="sdui-field">
      <span>{label}</span>
      {children}
    </label>
  );
}

function Choice({ value, options, onChange, empty, labels }: { value?: string; options: string[]; onChange: (value?: string) => void; empty?: string; labels?: Record<string, string> }) {
  return (
    <select value={value ?? ""} onChange={(e) => onChange(e.target.value || undefined)}>
      {empty && <option value="">{empty}</option>}
      {options.map((option) => (
        <option key={option} value={option}>
          {labels?.[option] ?? option}
        </option>
      ))}
    </select>
  );
}

const actionKey = (action?: Action) => {
  if (!action) return undefined;
  if (action.name === "open") return `open:${action.params?.overlay}`;
  if (action.name === "navigate") return `navigate:${action.params?.screen}`;
  return `server:${action.name}`;
};
const actionOf = (key?: string): Action | undefined => {
  const [kind, target] = key?.split(":") ?? [];
  if (kind === "open") return { name: kind, params: { overlay: target } };
  if (kind === "navigate") return { name: kind, params: { screen: target } };
  if (kind === "server") return { name: target };
  return undefined;
};

const typedValue = (kind: string, text: string) => {
  if (text === "") return undefined;
  if (kind === "number" || (kind === "scalar" && Number.isFinite(Number(text)))) return Number(text);
  return text;
};

type Env = { c: Copy; formats: string[]; targets: Record<string, string>; data: Fields };

function JsonField({ value, c, onChange }: { value: unknown; c: Copy; onChange: (value: unknown) => void }) {
  const [text, setText] = useState(() => JSON.stringify(value ?? null, null, 1));
  const [bad, setBad] = useState(false);
  return (
    <>
      <textarea
        rows={4}
        className="sdui-json"
        aria-invalid={bad}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          try {
            onChange(JSON.parse(text));
            setBad(false);
          } catch {
            setBad(true);
          }
        }}
      />
      {bad && <span className="sdui-error">{c.invalid}</span>}
    </>
  );
}

function PropField({ prop, value, env, onChange }: { prop: Prop; value: unknown; env: Env; onChange: (value: unknown) => void }) {
  const { c, formats, targets, data } = env;
  const label = `${prop.name}${prop.optional ? "" : " *"}`;
  const ref = typeof value === "object" && value !== null && !Array.isArray(value) ? (value as Fields) : undefined;
  if (prop.kind === "action")
    return (
      <Field label={label}>
        <Choice value={actionKey(ref?.$action as Action | undefined)} options={Object.keys(targets)} labels={targets} empty={c.none} onChange={(key) => onChange(key ? { $action: actionOf(key) } : undefined)} />
      </Field>
    );
  if (prop.kind === "enum")
    return (
      <Field label={label}>
        <Choice value={value === undefined ? undefined : String(value)} options={(prop.values ?? []).map(String)} empty={c.none} onChange={(next) => onChange(next === undefined ? undefined : prop.values?.find((v) => String(v) === next))} />
      </Field>
    );
  if (prop.kind === "boolean")
    return (
      <Field label={label}>
        <Choice value={value === undefined ? undefined : String(value)} options={["true", "false"]} empty={c.none} onChange={(next) => onChange(next === undefined ? undefined : next === "true")} />
      </Field>
    );
  const source = ref && "$data" in ref ? String(ref.$data) : undefined;
  const nested = isNode(value) || (Array.isArray(value) && value.some(isNode));
  const plain = ["string", "number", "scalar", "node"].includes(prop.kind) && !nested && (value === undefined || typeof value !== "object");
  return (
    <div className="sdui-prop">
      <Field label={label}>
        <Choice value={source} options={Object.keys(data)} empty={c.direct} onChange={(key) => onChange(key ? { $data: key } : undefined)} />
      </Field>
      {source && typeof data[source] === "number" && (
        <Field label={c.format}>
          <Choice value={ref?.$format as string | undefined} options={formats} empty={c.none} onChange={($format) => onChange({ $data: source, ...($format ? { $format } : {}) })} />
        </Field>
      )}
      {!source && plain && (
        <input
          aria-label={prop.name}
          type={prop.kind === "number" ? "number" : "text"}
          value={value === undefined ? "" : String(value)}
          onChange={(e) => onChange(typedValue(prop.kind, e.target.value))}
        />
      )}
      {!source && !plain && <JsonField key={JSON.stringify(value)} value={value} c={c} onChange={onChange} />}
    </div>
  );
}

function NodeEditor({ node, env, onChange, onRemove }: { node: Node; env: Env; onChange: (node: Node) => void; onRemove?: () => void }) {
  const props = SCHEMA.get(node.type) ?? [];
  const valueOf = (name: string) => (name === "children" ? node.children : node.props?.[name]);
  const set = (name: string, value: unknown) => {
    if (name === "children") return onChange({ ...node, children: value });
    const next = { ...node.props, [name]: value };
    if (value === undefined) delete next[name];
    onChange({ ...node, props: next });
  };
  return (
    <fieldset className="sdui-node">
      <legend>
        <code>{`<${node.type}>`}</code>
        {onRemove && (
          <Button icon="close" onClick={onRemove}>
            {env.c.remove}
          </Button>
        )}
      </legend>
      {props.map((prop) => (
        <PropField key={prop.name} prop={prop} value={valueOf(prop.name)} env={env} onChange={(value) => set(prop.name, value)} />
      ))}
    </fieldset>
  );
}

type Menu = { items: NavItem[]; style: TabBarStyle };

function MenuEditor({ menu, c, mobile, onChange }: { menu: Menu; c: Copy; mobile: boolean; onChange: (next: Menu) => void }) {
  const setItem = (i: number, patch: Partial<NavItem>) => onChange({ ...menu, items: menu.items.map((item, j) => (j === i ? { ...item, ...patch } : item)) });
  const move = (i: number, by: number) => {
    const items = [...menu.items];
    const [item] = items.splice(i, 1);
    items.splice(i + by, 0, item);
    onChange({ ...menu, items });
  };
  return (
    <div className="sdui-inspector">
      <p className="sdui-hint">{c.menuHint}</p>
      {mobile && (
        <div className="sdui-fields">
          <Field label={c.barVariant}>
            <Choice value={menu.style.variant ?? "bar"} options={["bar", "floating"]} labels={c.variants} onChange={(variant) => onChange({ ...menu, style: { ...menu.style, variant: variant as TabBarStyle["variant"] } })} />
          </Field>
          <Field label={c.barLabels}>
            <Choice value={menu.style.labels ?? "show"} options={["show", "active", "hide"]} labels={c.labelModes} onChange={(labels) => onChange({ ...menu, style: { ...menu.style, labels: labels as TabBarStyle["labels"] } })} />
          </Field>
        </div>
      )}
      {menu.items.map((item, i) => (
        <fieldset className="sdui-node" key={item.id}>
          <legend>
            <code>{item.id}</code>
            <Button icon="arrow-up" aria-label={c.up} title={c.up} disabled={i === 0} onClick={() => move(i, -1)} />
            <Button icon="arrow-down" aria-label={c.down} title={c.down} disabled={i === menu.items.length - 1} onClick={() => move(i, 1)} />
          </legend>
          <Field label={c.name}>
            <input value={item.label} onChange={(e) => setItem(i, { label: e.target.value })} />
          </Field>
          <Field label={c.icon}>
            <Choice value={item.icon} options={iconNames} onChange={(icon) => icon && setItem(i, { icon })} />
          </Field>
        </fieldset>
      ))}
    </div>
  );
}

function Inspector({ widget, env, mobile, onChange }: { widget: Draft; env: Env; mobile: boolean; onChange: (next: Draft) => void }) {
  const { c, targets } = env;
  const parts: Node[] = Array.isArray(widget.content) ? widget.content : [widget.content];
  const setParts = (next: Node[]) => onChange({ ...widget, content: (next.length === 1 ? next[0] : next) as Content });
  return (
    <div className="sdui-inspector">
      <div className="sdui-fields">
        <Field label={c.title}>
          <input value={widget.title ?? ""} onChange={(e) => onChange({ ...widget, title: e.target.value || undefined })} />
        </Field>
        <Field label={c.subtitle}>
          <input value={widget.subtitle ?? ""} onChange={(e) => onChange({ ...widget, subtitle: e.target.value || undefined })} />
        </Field>
        {!mobile && (
          <Field label={c.width}>
            <Choice value={String(widget.w)} options={["2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]} onChange={(w) => onChange({ ...widget, w: Number(w) })} />
          </Field>
        )}
        <Field label={c.frame}>
          <Choice value={widget.frame ?? "card"} options={["card", "plain"]} labels={{ card: c.card, plain: c.plain }} onChange={(frame) => onChange({ ...widget, frame: frame === "plain" ? "plain" : undefined })} />
        </Field>
        <Field label={c.height}>
          <Choice value={String(widget.h)} options={["2", "3", "4", "5", "6", "7", "8"]} onChange={(h) => onChange({ ...widget, h: Number(h) })} />
        </Field>
        <Field label={c.press}>
          <Choice value={actionKey(widget.action)} options={Object.keys(targets).filter((key) => !key.startsWith("server:"))} labels={targets} empty={c.none} onChange={(key) => onChange({ ...widget, action: actionOf(key) })} />
        </Field>
      </div>
      {parts.map((node, i) => (
        <NodeEditor
          key={`${i}:${node.type}`}
          node={node}
          env={env}
          onChange={(next) => setParts(parts.map((part, j) => (j === i ? next : part)))}
          onRemove={parts.length > 1 ? () => setParts(parts.filter((_, j) => j !== i)) : undefined}
        />
      ))}
      <Field label={c.addPart}>
        <Choice options={COMPONENTS} empty="—" onChange={(type) => type && setParts([...parts, templateOf(type)])} />
      </Field>
      <p className="sdui-hint">{c.schemaNote}</p>
    </div>
  );
}

export function SduiPlayground({ device = "mobile" }: { device?: Device }) {
  const { lang: current, locale } = useI18n();
  const lang: Lang = current === "en" ? "en" : "ko";
  const c = COPY[lang];
  const toast = useToast();
  const key = `docs.sdui.v4.${device}.${lang}`;
  const mobile = device === "mobile";
  const { app: sample, data } = SAMPLES[device][lang];
  const formats = Object.keys(formatsFor(locale));
  const [adding, setAdding] = useState<string | undefined>();
  const [drafts, setDrafts] = useState<Record<string, Draft[]>>(() => load(key) ?? draftsOf(sample));
  const [screenId, setScreenId] = useState(sample.start);
  const [selected, setSelected] = useState<string | undefined>();

  const menuKey = `${key}.menu`;
  const [menu, setMenu] = useState<Menu>(() => loadMenu(menuKey) ?? { items: sample.nav, style: sample.navBar ?? {} });

  useEffect(() => save(key, drafts), [key, drafts]);
  useEffect(() => saveMenu(menuKey, menu), [menuKey, menu]);

  const widgets = drafts[screenId] ?? [];
  const setWidgets = (next: Draft[] | ((list: Draft[]) => Draft[])) => setDrafts((all) => ({ ...all, [screenId]: typeof next === "function" ? next(all[screenId] ?? []) : next }));
  const app: App = { ...sample, nav: menu.items, navBar: menu.style, screens: Object.fromEntries(Object.entries(sample.screens).map(([id, def]) => [id, { ...def, widgets: (drafts[id] ?? []).filter((widget) => !widget.hidden).map(({ hidden: _, ...widget }) => widget) }])) };
  const targets = Object.fromEntries([
    ...Object.entries(sample.overlays ?? {}).map(([id, overlay]) => [`open:${id}`, `${overlay.kind === "sheet" ? c.openSheet : c.openModal}: ${overlay.title}`]),
    ...sample.nav.map((item) => [`navigate:${item.id}`, `${c.goTo}: ${item.label}`]),
    ...serverActions(sample).map((name) => [`server:${name}`, `${c.server}: ${name}`]),
  ]);
  const env = { c, formats, targets, data };
  const layout: LayoutItem[] = widgets.map(({ id, w, h, hidden }) => ({ id, w, h, hidden: Boolean(hidden) }));
  const editing = widgets.find((widget) => widget.id === selected && !widget.hidden);
  const ctx = { data, formats: formatsFor(locale), onAction: () => undefined };

  const arrange = (next: LayoutItem[]) =>
    setWidgets((list) => next.map((item) => ({ ...(list.find((widget) => widget.id === item.id) as Draft), w: item.w, h: item.h, hidden: item.hidden || undefined })));
  const add = (type: string) => {
    const ids = new Set(widgets.map((widget) => widget.id));
    let n = 1;
    while (ids.has(`${type}-${n}`)) n += 1;
    setWidgets([...widgets, { id: `${type}-${n}`, title: type, w: 6, h: 3, content: templateOf(type) }]);
    setSelected(`${type}-${n}`);
  };
  const update = (next: Draft) => setWidgets(widgets.map((widget) => (widget.id === next.id ? next : widget)));
  const copy = async () => {
    await navigator.clipboard?.writeText(JSON.stringify(app, null, 2)).catch(() => undefined);
    toast({ message: c.copied, status: "good", duration: 1800 });
  };

  const preview = (
    <Guard key={JSON.stringify(app)} fallback={c.broken}>
      <AppView app={app} values={data} mobileNav="tabs" screen={screenId} onNavigate={(id) => {
        setScreenId(id);
        setSelected(undefined);
      }} />
    </Guard>
  );
  const builder = (
    <Board key={`${device}:${widgets.map((widget) => widget.id).join()}:${widgets.map((widget) => `${widget.w}x${widget.h}`).join()}`} initialLayout={layout} onLayoutChange={arrange} commitDelay={0}>
      {widgets.map(({ id, title, subtitle, w, h, content }) => (
        <Widget key={id} id={id} title={title ?? id} subtitle={subtitle} w={w} h={h}>
          <div className={`sdui-pick${id === selected ? " is-selected" : ""}`} onClick={() => setSelected(id)}>
            <Guard key={JSON.stringify(content)} fallback={c.broken}>
              {renderNode(content, ctx)}
            </Guard>
          </div>
        </Widget>
      ))}
    </Board>
  );

  return (
    <div className={`sdui-playground is-${device}`} data-medium="app">
      <section className="sdui-pane">
        <div className="sdui-pane-head">
          <strong>{c.preview}</strong>
        </div>
        {mobile ? (
          <Phone>{preview}</Phone>
        ) : (
          <div className="browser">
            <div className="browser-bar" aria-hidden="true">
              <span className="browser-dots" />
              <span className="browser-address">fitnote.app/today</span>
            </div>
            <div className="browser-screen">{preview}</div>
          </div>
        )}
      </section>
      <section className="sdui-pane">
        <div className="sdui-pane-head">
          <strong>{c.builder}</strong>
          <span className="toolbar-spacer" />
          <Button icon="menu" aria-pressed={selected === MENU} onClick={() => setSelected(selected === MENU ? undefined : MENU)}>
            {c.menu}
          </Button>
          <Button
            icon="refresh"
            onClick={() => {
              setDrafts(draftsOf(sample));
              setMenu({ items: sample.nav, style: sample.navBar ?? {} });
            }}
          >
            {c.reset}
          </Button>
          <Button icon="copy" onClick={copy}>
            {c.copy}
          </Button>
        </div>
        <p className="sdui-hint">{c.hint(mobile)}</p>
        <div className="sdui-palette">
          <Field label={c.component}>
            <Choice value={adding} options={COMPONENTS} empty="—" onChange={setAdding} />
          </Field>
          <Button icon="plus" disabled={!adding} onClick={() => adding && add(adding)}>
            {c.addWidget}
          </Button>
        </div>
        <div className="sdui-work">
          <div className="sdui-builder">{builder}</div>
          <div className="sdui-inspector-wrap">{selected === MENU ? <MenuEditor menu={menu} c={c} mobile={mobile} onChange={setMenu} /> : editing ? <Inspector key={editing.id} widget={editing} env={env} mobile={mobile} onChange={update} /> : <p className="sdui-hint">{c.pick}</p>}</div>
        </div>
      </section>
    </div>
  );
}
