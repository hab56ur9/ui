export const SPEC_VERSION = 1;
export const BUILTIN_ACTIONS = { navigate: ["screen"], open: ["overlay"], close: [] };
const FRAME_ONLY = new Set(["LangProvider", "UIProvider", "AppShell", "Page", "WidgetGrid", "Board", "Widget", "JsonUI", "ThemePicker", "Modal", "Sheet", "Toast"]);
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
      if (!(Number.isInteger(widget.h) && widget.h >= 1)) fail(`${at}.h`, "must be a whole number of rows");
      if (widget.action !== undefined) checkAction(`${at}.action`, widget.action);
      checkValue(`${at}.content`, widget.content);
    }
  }
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
      h: { type: "integer", minimum: 1 },
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
      app: entry({ name: { type: "string" }, density: { enum: ["comfortable", "compact"] } }, ["name"]),
      start: { type: "string" },
      nav: { type: "array", items: { type: "object", required: ["screen", "label"], properties: { screen: { type: "string" }, label: { type: "string" }, icon: { type: "string" } }, additionalProperties: false } },
      data: { type: "object", additionalProperties: entry({ example: {} }, ["example"]) },
      formats: { type: "object", additionalProperties: entry({ style: { enum: ["number", "compact", "percent", "date"] }, digits: { type: "integer", minimum: 0 }, unit: { type: "string" } }) },
      actions: { type: "object", additionalProperties: entry({ params: { type: "object" } }) },
      screens: {
        type: "object",
        additionalProperties: entry({ title: { type: "string" }, lede: { type: "string" }, actions: { type: "array", items: { $ref: "#/$defs/button" } }, widgets: { type: "array", items: { $ref: "#/$defs/widget" } } }, ["widgets"]),
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
