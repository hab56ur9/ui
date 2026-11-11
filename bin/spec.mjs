export const SPEC_VERSION = 1;
export const BUILTIN_ACTIONS = { navigate: ["screen"], open: ["overlay"], close: [] };
const FRAME_ONLY = new Set(["LangProvider", "UIProvider", "AppShell", "Page", "Article", "WidgetGrid", "Board", "Widget", "Modal", "Sheet", "Toast"]);
const KINDS = ["modal", "sheet"];
const VARIANTS = ["primary", "secondary", "danger"];

const isObject = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
const described = (value) => typeof value?.description === "string" && value.description.trim() !== "";

export function checkSpec(spec, components) {
  const errors = [];
  const fail = (path, message) => errors.push(`${path}: ${message}`);
  const byName = new Map(components.map((component) => [component.name, component]));
  const data = isObject(spec.data) ? spec.data : {};
  const formats = isObject(spec.formats) ? spec.formats : {};
  const actions = isObject(spec.actions) ? spec.actions : {};
  const screens = isObject(spec.screens) ? spec.screens : {};
  const overlays = isObject(spec.overlays) ? spec.overlays : {};

  if (spec.spec !== SPEC_VERSION) fail("spec", `must be ${SPEC_VERSION}`);
  if (!isObject(spec.app) || typeof spec.app.name !== "string") fail("app.name", "is required");
  if (!described(spec.app)) fail("app.description", "is required");
  if (spec.app?.theme !== undefined && !THEMES.includes(spec.app.theme)) fail("app.theme", `must be one of ${THEMES.join(", ")}`);
  if (!screens[spec.start]) fail("start", `names no screen (${spec.start})`);
  for (const [key, slot] of Object.entries(data)) {
    if (!described(slot)) fail(`data.${key}.description`, "is required");
    if (!("example" in (slot ?? {}))) fail(`data.${key}.example`, "is required");
  }
  for (const [key, format] of Object.entries(formats)) if (!described(format)) fail(`formats.${key}.description`, "is required");
  for (const [key, action] of Object.entries(actions)) {
    if (key in BUILTIN_ACTIONS) fail(`actions.${key}`, "is built in; declare only app actions");
    if (!described(action)) fail(`actions.${key}.description`, "is required");
  }
  for (const [i, item] of (spec.nav ?? []).entries()) if (!screens[item.screen]) fail(`nav.${i}.screen`, `names no screen (${item.screen})`);

  const checkAction = (path, action) => {
    if (!isObject(action) || typeof action.name !== "string") return fail(path, "needs a name");
    const params = action.params ?? {};
    if (action.name === "navigate" && !screens[params.screen]) fail(path, `navigates to no screen (${params.screen})`);
    if (action.name === "open" && !overlays[params.overlay]) fail(path, `opens no overlay (${params.overlay})`);
    if (!(action.name in BUILTIN_ACTIONS) && !actions[action.name]) fail(path, `uses undeclared action ${action.name}`);
  };
  const checkButtons = (path, buttons) =>
    (buttons ?? []).forEach((button, i) => {
      if (typeof button.label !== "string") fail(`${path}.${i}.label`, "is required");
      if (button.variant !== undefined && !VARIANTS.includes(button.variant)) fail(`${path}.${i}.variant`, `must be one of ${VARIANTS.join(", ")}`);
      checkAction(`${path}.${i}.action`, button.action);
    });

  const checkValue = (path, value) => {
    if (Array.isArray(value)) return value.forEach((item, i) => checkValue(`${path}.${i}`, item));
    if (!isObject(value)) return;
    if ("$data" in value && !(value.$data in data)) fail(path, `reads undeclared data ${value.$data}`);
    if ("$format" in value && !(value.$format in formats)) fail(path, `uses undeclared format ${value.$format}`);
    if ("$action" in value) return checkAction(path, value.$action);
    if ("$each" in value) {
      checkValue(`${path}.$each`, value.$each);
      return checkValue(`${path}.$as`, value.$as);
    }
    if (typeof value.type === "string" && /^[A-Z]/.test(value.type)) return checkNode(path, value);
    for (const [key, item] of Object.entries(value)) if (!key.startsWith("$")) checkValue(`${path}.${key}`, item);
  };
  const checkNode = (path, node) => {
    const component = byName.get(node.type);
    if (!component) return fail(path, `uses unknown component ${node.type}`);
    if (FRAME_ONLY.has(node.type)) return fail(path, `${node.type} belongs to the app frame; the builder draws it`);
    const props = isObject(node.props) ? node.props : {};
    const known = new Map(component.props.map((prop) => [prop.name, prop]));
    for (const key of Object.keys(props)) if (!known.has(key)) fail(`${path}.props.${key}`, `is not a prop of ${node.type}`);
    for (const prop of component.props) if (!prop.optional && prop.name !== "children" && !(prop.name in props)) fail(`${path}.props.${prop.name}`, `is required by ${node.type}`);
    for (const [key, value] of Object.entries(props)) checkValue(`${path}.props.${key}`, value);
    if (node.children !== undefined) checkValue(`${path}.children`, node.children);
  };

  for (const [id, screen] of Object.entries(screens)) {
    const path = `screens.${id}`;
    if (!described(screen)) fail(`${path}.description`, "is required");
    checkButtons(`${path}.actions`, screen.actions);
    const seen = new Set();
    for (const [i, widget] of (screen.widgets ?? []).entries()) {
      const at = `${path}.widgets.${i}`;
      if (typeof widget.id !== "string") fail(`${at}.id`, "is required");
      if (seen.has(widget.id)) fail(`${at}.id`, `repeats ${widget.id}`);
      seen.add(widget.id);
      if (!described(widget)) fail(`${at}.description`, "is required");
      if (!(Number.isInteger(widget.w) && widget.w >= 1 && widget.w <= 12)) fail(`${at}.w`, "must be 1–12 columns");
      if (!(widget.h === "auto" || (Number.isInteger(widget.h) && widget.h >= 1))) fail(`${at}.h`, "must be a whole number of rows or \"auto\"");
      if (widget.action !== undefined) checkAction(`${at}.action`, widget.action);
      checkValue(`${at}.content`, widget.content);
    }
  }
  const frame = isObject(spec.frame) ? spec.frame : {};
  const checkFrameNode = (path, value) => {
    if (!isObject(value) || typeof value.type !== "string") return checkValue(path, value);
    const component = byName.get(value.type);
    if (!component) return fail(path, `uses unknown component ${value.type}`);
    for (const [key, item] of Object.entries(value.props ?? {})) {
      if (!component.props.some((prop) => prop.name === key)) fail(`${path}.props.${key}`, `is not a prop of ${value.type}`);
      checkValue(`${path}.props.${key}`, item);
    }
    if (value.children !== undefined) checkValue(`${path}.children`, value.children);
  };
  if (frame.brand !== undefined) checkFrameNode("frame.brand", frame.brand);
  (frame.actions ?? []).forEach((node, i) => checkFrameNode(`frame.actions.${i}`, node));
  const groups = new Set((spec.nav ?? []).map((item) => item.group).filter(Boolean));
  (frame.sections ?? []).forEach((section, i) => (section.groups ?? []).forEach((group) => groups.has(group) || fail(`frame.sections.${i}.groups`, `names no nav group (${group})`)));
  for (const [id, screen] of Object.entries(screens)) if (screen.layout !== undefined && !["grid", "article"].includes(screen.layout)) fail(`screens.${id}.layout`, "must be grid or article");
  for (const [id, overlay] of Object.entries(overlays)) {
    const path = `overlays.${id}`;
    if (!KINDS.includes(overlay.kind)) fail(`${path}.kind`, `must be one of ${KINDS.join(", ")}`);
    if (typeof overlay.title !== "string") fail(`${path}.title`, "is required");
    if (!described(overlay)) fail(`${path}.description`, "is required");
    checkButtons(`${path}.actions`, overlay.actions);
  }
  return errors;
}

export function specSchema(components) {
  const usable = components.filter((component) => !FRAME_ONLY.has(component.name));
  const text = { type: "string", minLength: 1 };
  const action = {
    type: "object",
    required: ["name"],
    properties: { name: { type: "string" }, params: { type: "object" }, close: { type: "boolean" } },
    additionalProperties: false,
  };
  const button = {
    type: "object",
    required: ["label", "action"],
    properties: { label: { type: "string" }, variant: { enum: VARIANTS }, description: { type: "string" }, action: { $ref: "#/$defs/action" } },
    additionalProperties: false,
  };
  const node = {
    type: "object",
    required: ["type"],
    properties: { type: { enum: usable.map((component) => component.name) }, description: { type: "string" }, props: { type: "object" }, children: {} },
    additionalProperties: false,
    allOf: usable.map((component) => ({
      if: { properties: { type: { const: component.name } } },
      then: {
        properties: {
          props: {
            type: "object",
            properties: Object.fromEntries(component.props.filter((prop) => prop.name !== "children").map((prop) => [prop.name, {}])),
            required: component.props.filter((prop) => !prop.optional && prop.name !== "children").map((prop) => prop.name),
            additionalProperties: false,
          },
        },
      },
    })),
  };
  const widget = {
    type: "object",
    required: ["id", "w", "h", "description", "content"],
    properties: {
      id: { type: "string" },
      title: { type: "string" },
      subtitle: { type: "string" },
      w: { type: "integer", minimum: 1, maximum: 12 },
      h: { oneOf: [{ type: "integer", minimum: 1 }, { const: "auto" }] },
      frame: { enum: ["card", "plain"] },
      description: text,
      action: { $ref: "#/$defs/action" },
      content: { oneOf: [{ $ref: "#/$defs/node" }, { type: "array", items: { $ref: "#/$defs/node" } }] },
    },
    additionalProperties: false,
  };
  const entry = (extra = {}, required = []) => ({ type: "object", required: ["description", ...required], properties: { description: text, ...extra } });
  return {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    title: "ui app spec",
    type: "object",
    required: ["spec", "app", "start", "screens"],
    properties: {
      spec: { const: SPEC_VERSION },
      app: entry({ name: { type: "string" }, theme: { enum: THEMES }, density: { enum: ["comfortable", "compact"] } }, ["name"]),
      start: { type: "string" },
      frame: {
        type: "object",
        properties: {
          brand: { type: "object", required: ["type"] },
          mobileNav: { enum: ["drawer", "tabs"] },
          scroll: { enum: ["frame", "page"] },
          search: { type: "object", properties: { label: { type: "string" }, placeholder: { type: "string" } }, additionalProperties: false },
          sections: { type: "array", items: { type: "object", required: ["label", "groups"], properties: { label: { type: "string" }, groups: { type: "array", items: { type: "string" } } }, additionalProperties: false } },
          sectionsLabel: { type: "string" },
          actions: { type: "array", items: { type: "object", required: ["type"] } },
          toc: { type: "string" },
          pager: { type: "string" },
        },
        additionalProperties: false,
      },
      nav: { type: "array", items: { type: "object", required: ["screen", "label"], properties: { screen: { type: "string" }, label: { type: "string" }, icon: { type: "string" }, group: { type: "string" }, sub: { type: "string" } }, additionalProperties: false } },
      data: { type: "object", additionalProperties: entry({ example: {} }, ["example"]) },
      formats: { type: "object", additionalProperties: entry({ style: { enum: ["number", "compact", "percent", "date"] }, digits: { type: "integer", minimum: 0 }, unit: { type: "string" } }) },
      actions: { type: "object", additionalProperties: entry({ params: { type: "object" } }) },
      screens: {
        type: "object",
        additionalProperties: entry({ layout: { enum: ["grid", "article"] }, toc: { type: "boolean" }, eyebrow: { type: "string" }, wide: { type: "boolean" }, title: { type: "string" }, lede: { type: "string" }, actions: { type: "array", items: { $ref: "#/$defs/button" } }, widgets: { type: "array", items: { $ref: "#/$defs/widget" } } }, ["widgets"]),
      },
      overlays: {
        type: "object",
        additionalProperties: entry({ kind: { enum: KINDS }, title: { type: "string" }, lede: { type: "string" }, body: { type: "string" }, actions: { type: "array", items: { $ref: "#/$defs/button" } } }, ["kind", "title", "actions"]),
      },
    },
    additionalProperties: false,
    $defs: { action, button, node, widget },
  };
}

const THEMES = ["lime", "sky", "mono"].flatMap((preset) => ["minimal", "expressive", "brutal"].map((style) => `${preset}.${style}`));
const FRAME = ["themes", "AppShell", "Page", "WidgetGrid", "Widget", "Button", "Icon", "Modal", "Sheet", "Pager", "Fragment", "useToast", "useState", "useEffect", "render", "h"];
const quote = (value) => JSON.stringify(value);
const keyOf = (key) => (/^[A-Za-z_$][\w$]*$/.test(key) ? key : quote(key));
const indent = (text, depth) => text.replace(/\n/g, `\n${"  ".repeat(depth)}`);
const screenName = (id) => `${id.replace(/(^|[-_.\s])(\w)/g, (_, __, c) => c.toUpperCase())}Screen`;
const overlayName = (id) => `${id.replace(/(^|[-_.\s])(\w)/g, (_, __, c) => c.toUpperCase())}Overlay`;

function emitter(used) {
  const shown = (value, spec) => {
    if (spec.$labels && typeof spec.$labels === "object") return `label(${quote(spec.$labels)}, ${value})`;
    return spec.$format ? `format[${quote(spec.$format)}](${value})` : value;
  };
  const list = (items, depth) => (items.length ? `[\n  ${indent(items.join(",\n"), 1)},\n]` : "[]");
  const expr = (value, row, depth = 0) => {
    if (Array.isArray(value)) return list(value.map((item) => expr(item, row, depth)), depth);
    if (value === null || typeof value !== "object") return quote(value);
    if ("$data" in value) return shown(`data[${quote(value.$data)}]`, value);
    if ("$field" in value) return shown(`${row}[${quote(value.$field)}]`, value);
    if ("$each" in value) {
      const next = `row${depth + 1}`;
      return `(${expr(value.$each, row, depth)} ?? []).map((${next}, i${depth + 1}) =>\n  ${indent(expr(value.$as, next, depth + 1).replace(/^h\((\w+), \{/, `h($1, { key: i${depth + 1},`), 1)},\n)`;
    }
    if ("$action" in value) return `(value) => act(${quote(value.$action)}, value)`;
    if ("$format" in value) return `format[${quote(value.$format)}]`;
    if (typeof value.type === "string" && /^[A-Z]/.test(value.type)) return node(value, row, depth);
    const entries = Object.entries(value).map(([key, item]) => `${keyOf(key)}: ${expr(item, row, depth)}`);
    return entries.length ? `{\n  ${indent(entries.join(",\n"), 1)},\n}` : "{}";
  };
  const node = (value, row, depth) => {
    used.add(value.type);
    const props = expr(value.props ?? {}, row, depth);
    const children = value.children === undefined ? [] : [value.children].flat().map((child) => expr(child, row, depth));
    return children.length ? `h(${value.type}, ${props},\n  ${indent(children.join(",\n"), 1)},\n)` : `h(${value.type}, ${props})`;
  };
  const content = (value) => {
    if (!Array.isArray(value)) return expr(value, "row0");
    used.add("Stack");
    return `h(Stack, null,\n  ${indent(value.map((item) => `h("div", null, ${expr(item, "row0")})`).join(",\n"), 1)},\n)`;
  };
  return { expr, content };
}

const objectOf = (lines) => (lines.length ? `{\n  ${indent(lines.join(",\n"), 1)},\n}` : "{}");

const PRESS = '{ position: "absolute", inset: 0, zIndex: 1, border: 0, borderRadius: "var(--radius-card)", background: "transparent", cursor: "pointer" }';

export function buildHtml(spec, { module, lang = "en" }) {
  const used = new Set();
  const { expr, content } = emitter(used);
  const buttons = (items = []) =>
    items.map((button) => `h(Button, { variant: ${quote(button.variant ?? "secondary")}, onClick: () => act(${quote(button.action)}) }, ${quote(button.label)})`);
  const screens = Object.entries(spec.screens).map(([id, screen]) => {
    const widgets = (screen.widgets ?? []).map((widget) => {
      const head = { id: widget.id, title: widget.title ?? "", ...(widget.subtitle && { subtitle: widget.subtitle }), w: widget.w, h: widget.h === "auto" ? 1 : widget.h, ...(widget.frame && { frame: widget.frame }) };
      const press = widget.action ? `,\n  h("button", { type: "button", "data-press": "", "aria-label": ${quote(widget.title ?? widget.id)}, style: ${PRESS}, onClick: () => act(${quote(widget.action)}) })` : "";
      return `h(Widget, { ${Object.entries(head).map(([key, value]) => `${key}: ${quote(value)}`).join(", ")} },\n  ${indent(content(widget.content), 1)}${press},\n)`;
    });
    if (screen.layout === "article") {
      for (const name of ["Article", "RichText", "Pager"]) used.add(name);
      const head = [`title: ${quote(screen.title ?? "")}`, ...(screen.eyebrow ? [`eyebrow: ${quote(screen.eyebrow)}`] : []), ...(screen.lede ? [`lede: h(RichText, { text: ${quote(screen.lede)} })`] : []), ...(screen.wide ? ["wide: true"] : []), `pager: pagerFor(${quote(id)})`];
      return `function ${screenName(id)}({ act }) {\n  return h(Article, { ${head.join(", ")} },\n    h(WidgetGrid, { flow: true },\n      ${indent(widgets.join(",\n"), 3)},\n    ),\n  );\n}`;
    }
    const actions = buttons(screen.actions);
    const page = { ...(screen.title && { title: screen.title }), ...(screen.lede && { lede: screen.lede }) };
    const pageProps = actions.length ? `{ ...${quote(page)}, actions: [${actions.join(", ")}] }` : quote(page);
    return `function ${screenName(id)}({ act }) {\n  return h(Page, ${pageProps},\n    h(WidgetGrid, null,\n      ${indent(widgets.join(",\n"), 3)},\n    ),\n  );\n}`;
  });
  const overlays = Object.entries(spec.overlays ?? {}).map(([id, overlay]) => {
    const kind = overlay.kind === "sheet" ? "Sheet" : "Modal";
    const actions = (overlay.actions ?? []).map((button, i) => ({ label: button.label, variant: button.variant ?? "secondary", value: i }));
    return `function ${overlayName(id)}({ act, close }) {\n  const actions = ${quote((overlay.actions ?? []).map((button) => button.action))};\n  return h(${kind}, {\n    open: true,\n    title: ${quote(overlay.title)},\n    ${overlay.lede ? `description: ${quote(overlay.lede)},\n    ` : ""}actions: ${quote(actions)},\n    onClose: (i) => (i === null ? close() : act(actions[i])),\n  }${overlay.body ? `, ${quote(overlay.body)}` : ""});\n}`;
  });
  const formats = Object.entries(spec.formats ?? {}).map(([name, f]) => `${keyOf(name)}: ${f.style === "date" ? "date()" : f.style === "percent" ? `percent(${f.digits ?? 1})` : `number(${f.digits ?? 0}, ${quote(f.unit ?? "")}${f.style === "compact" ? ", true" : ""})`}`);
  const dataLines = Object.entries(spec.data ?? {}).map(([key, slot]) => `${quote(key)}: ${JSON.stringify(slot.example)}`);
  const described = Object.entries(spec.actions ?? {}).map(([name, action]) => `${quote(name)}: ${quote(action.description)}`);
  const nav = (spec.nav ?? []).map((item) => ({ id: item.screen, label: item.label, ...(item.icon && { icon: item.icon }), ...(item.group && { group: item.group }), ...(item.sub && { sub: item.sub }) }));
  const frame = spec.frame ?? {};
  const tocOf = (screen) =>
    (screen.widgets ?? []).flatMap((widget) => [widget.content].flat()).filter((node) => node?.type === "ArticleSection" && node.props?.id && node.props?.title).map((node) => ({ id: node.props.id, label: node.props.title }));
  const tocs = Object.fromEntries(Object.entries(spec.screens).filter(([, screen]) => screen.layout === "article" && screen.toc !== false).map(([id, screen]) => [id, tocOf(screen)]));
  const frameNode = (node) => expr(node, "row0");
  if (frame.toc) used.add("Toc");
  if (frame.search) used.add("TextField");
  if (frame.sections) used.add("Tabs");
  const brandCode = frame.brand ? frameNode(frame.brand) : quote(spec.app.name);
  const actionCodes = (frame.actions ?? []).map(frameNode);
  const names = [...new Set([...FRAME, ...used])].sort();
  const script = `import { ${names.join(", ")} } from ${quote(module)};

const locale = ${quote(lang === "ko" ? "ko-KR" : "en-US")};
const number = (digits, unit = "", compact = false) => {
  const f = new Intl.NumberFormat(locale, { maximumFractionDigits: digits, ...(compact && { notation: "compact" }) });
  return (v) => \`\${f.format(v)}\${unit}\`;
};
const percent = (digits) => (v) => \`\${(v * 100).toFixed(digits)}%\`;
const date = () => {
  const f = new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric", weekday: "short" });
  return (v) => f.format(v);
};
const label = (labels, v) => labels[String(v)] ?? String(v);

const format = ${objectOf(formats)};

const data = ${objectOf(dataLines)};

const actionNotes = ${objectOf(described)};

${screens.join("\n\n")}

${overlays.join("\n\n")}

const screens = { ${Object.keys(spec.screens).map((id) => `${keyOf(id)}: ${screenName(id)}`).join(", ")} };
const overlays = { ${Object.keys(spec.overlays ?? {}).map((id) => `${keyOf(id)}: ${overlayName(id)}`).join(", ")} };
const nav = ${quote(nav)};

const tocs = ${quote(tocs)};
const pagerLabel = ${quote(frame.pager ?? "")};
const sections = ${quote(frame.sections ?? [])};
const order = nav.map((item) => item.id);
const titleOf = (id) => nav.find((item) => item.id === id)?.label ?? id;
const pagerFor = (id) => {
  const at = order.indexOf(id);
  const link = (target) => target && { label: titleOf(target), href: \`#/\${target}\` };
  return h(Pager, { label: pagerLabel, previous: link(order[at - 1]), next: link(order[at + 1]) });
};
const sectionOf = (id) => Math.max(0, sections.findIndex((section) => section.groups.includes(nav.find((item) => item.id === id)?.group)));
const groupsOf = (items) => items.reduce((groups, item) => {
  const last = groups.at(-1);
  if (last && last.key === (item.group ?? "")) last.items.push(item);
  if (!last || last.key !== (item.group ?? "")) groups.push({ key: item.group ?? "", title: item.group, items: [item] });
  return groups;
}, []);
const fromHash = () => {
  const id = location.hash.replace(/^#\\//, "");
  return id in screens ? id : ${quote(spec.start)};
};

function App() {
  const toast = useToast();
  const [screen, setScreen] = useState(fromHash);
  const [overlay, setOverlay] = useState(null);
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onHash = () => {
      setScreen(fromHash());
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);
  const go = (id) => (location.hash = \`#/\${id}\`);
  const act = (action, value) => {
    if (action.name === "navigate") go(action.params?.screen ?? value);
    if (action.name === "open") setOverlay(action.params.overlay);
    if (action.name === "close" || action.close) setOverlay(null);
    const detail = ["string", "number", "boolean"].includes(typeof value) ? value : action.params && JSON.stringify(action.params);
    const shown = detail ? \` \${detail}\` : "";
    if (action.name in actionNotes) toast({ message: \`\${action.name}\${shown}: \${actionNotes[action.name]}\`, status: "info" });
  };
  const Screen = screens[screen];
  const Overlay = overlay && overlays[overlay];
  const section = sectionOf(screen);
  const needle = query.trim().toLowerCase();
  const visible = nav.filter((item) => (needle ? item.label.toLowerCase().includes(needle) : !sections.length || sections[section].groups.includes(item.group)));
  const shellNav = groupsOf(visible).map((group) => ({ ...(group.title && { title: group.title }), items: group.items.map((item) => ({ id: item.id, label: item.label, ...(item.icon && { icon: item.icon }), ...(item.sub && { sub: item.sub }), href: \`#/\${item.id}\`, current: item.id === screen })) }));
  const toc = tocs[screen] ?? [];
  return h("div", { "data-density": ${quote(spec.app.density ?? "comfortable")}, "data-medium": "app" },
    h(AppShell, {
      ${frame.mobileNav ? `mobileNav: ${quote(frame.mobileNav)},` : frame.brand ? "" : 'mobileNav: "tabs",'}
      ${frame.scroll ? `scroll: ${quote(frame.scroll)},` : ""}
      brand: ${brandCode},
      nav: shellNav,
      ${frame.search ? `navHeader: h(TextField, { label: ${quote(frame.search.label ?? "")}, hideLabel: true, type: "search", icon: "search", placeholder: ${quote(frame.search.placeholder ?? frame.search.label ?? "")}, value: query, onChange: setQuery }),` : ""}
      title: ${frame.sections ? `h(Tabs, { variant: "pill", label: ${quote(frame.sectionsLabel ?? "")}, value: String(section), onChange: (index) => go(nav.find((item) => sections[Number(index)].groups.includes(item.group)).id), items: sections.map((item, index) => ({ id: String(index), label: item.label })) })` : "titleOf(screen)"},
      ${actionCodes.length ? `actions: h(Fragment, null, ${actionCodes.join(", ")}),` : ""}
      ${frame.toc ? `aside: toc.length ? h(Toc, { key: screen, title: ${quote(frame.toc)}, items: toc, offset: 120 }) : undefined,` : ""}
    }, h("div", { "data-screen": screen, style: { display: "contents" } }, h(Screen, { act }))),
    Overlay && h("div", { "data-overlay": overlay, style: { display: "contents" } }, h(Overlay, { act, close: () => setOverlay(null) })),
  );
}

render("#app", h(App), { theme: themes.${spec.app.theme ?? "lime.minimal"}, lang: ${quote(lang)} });`;
  return `<!doctype html>
<html lang="${lang}" data-medium="app">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="ui spec build">
<title>${spec.app.name}</title>
</head>
<body>
<div id="app"></div>
<script type="module">
${script.replace(/<\/script/gi, "<\\/script").replace(/<!--/g, "<\\!--")}
</script>
</body>
</html>
`;
}
