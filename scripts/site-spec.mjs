import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = join(import.meta.dirname, "..");
const site = join(root, "src/site");
const read = (path) => JSON.parse(readFileSync(path, "utf8"));
const [out = "."] = process.argv.slice(2);

const chrome = read(join(site, "text/chrome.json"));
const texts = { ko: read(join(site, "text/ko.json")), en: read(join(site, "text/en.json")) };
const catalog = read(join(root, "dist/catalog.json"));
const pagesOf = { ko: (await import(join(site, "pages.ts"))).pages, en: (await import(join(site, "pages.en.ts"))).pages };
const apiOf = { ko: (await import(join(site, "api.ts"))).api, en: (await import(join(site, "api.en.ts"))).api };
const TABS = [["시작하기", "기반"], ["입력", "탐색", "피드백", "데이터", "콘텐츠", "렌더러", "틀"], ["블록"], ["앱 스펙"], ["슬라이드", "기술 문서", "이력서", "포트폴리오"], ["테마"]];
const FULL = ["블록", "앱 스펙"];
const MODE_LABELS = {
  ko: { light: "라이트", dark: "다크", app: "앱", doc: "문서", slide: "슬라이드", ko: "한국어", en: "English" },
  en: { light: "Light", dark: "Dark", app: "App", doc: "Doc", slide: "Slide", ko: "한국어", en: "English" },
};

const PREVIEWS = {
  "button-basic": (text) => ({
    type: "Row",
    children: [
      { type: "Button", children: text.secondary },
      { type: "Button", props: { variant: "primary" }, children: text.primary },
      { type: "Button", props: { variant: "danger" }, children: text.danger },
      { type: "Button", props: { disabled: true }, children: text.disabled },
    ],
  }),
};

const tokensFor = (patterns) =>
  patterns.flatMap((pattern) => {
    const prefix = pattern.endsWith(".*") ? pattern.slice(0, -2) : undefined;
    return catalog.catalog.filter((t) => (prefix ? t.path.startsWith(`${prefix}.`) : t.path === pattern));
  });

function nodesOf(section, lang, c) {
  const card = ({ title, body, items }) => ({
    type: "Card",
    ...(title && { props: { title } }),
    children: [...(body ? [{ type: "Paragraphs", props: { items: [body] } }] : []), ...(items ? [{ type: "TextList", props: { items } }] : [])],
  });
  const example = (id) => {
    const text = texts[lang][id];
    const files = [{ name: `${id}.tsx`, code: readFileSync(join(site, "examples", `${id}.tsx`), "utf8") }, ...(text ? [{ name: `text.${lang}.json`, code: JSON.stringify(text, null, 2), lang: "json" }] : [])];
    const preview = PREVIEWS[id]?.(text ?? {}) ?? { type: "Callout", props: { tone: "warning", title: `${id}` }, children: "Not converted yet" };
    return { files, preview };
  };
  switch (section.type) {
    case "text":
      return [{ type: "Paragraphs", props: { items: section.body } }];
    case "list":
      return [{ type: "TextList", props: { items: section.items, ...(section.ordered && { ordered: true }) } }];
    case "a11y":
      return [{ type: "TextList", props: { items: section.items } }];
    case "cards":
      return [{ type: "CardGrid", children: section.items.map(card) }];
    case "usage":
      return [{ type: "CardGrid", children: [card({ title: c.when, items: section.when }), card({ title: c.avoid, items: section.avoid })] }];
    case "anatomy":
      return [{ type: "Anatomy", props: { items: section.items } }];
    case "guidelines":
      return [{ type: "Guidelines", props: { items: section.items } }];
    case "tokens":
      return [
        {
          type: "TokenTable",
          props: {
            rows: tokensFor(section.paths).map((t) => ({
              name: t.name,
              color: t.type === "color",
              values: Object.entries(t.values).map(([mode, value]) => ({ ...(MODE_LABELS[lang][mode] && { mode: MODE_LABELS[lang][mode] }), value })),
              use: section.notes?.[t.path] ?? t.description ?? "",
            })),
          },
        },
      ];
    case "code":
      return [{ type: "CopyCode", props: { code: section.code.trim().replaceAll("{homepage}", catalog.homepage) } }];
    case "api":
      return [{ type: "PropsTable", props: { ...(section.description && { description: section.description }), rows: section.rows } }];
    case "demo": {
      const props = { ...(section.caption && { caption: section.caption }), layout: section.layout ?? "padded", ...(section.medium && { medium: section.medium }), lang };
      if (section.variants) {
        const variants = section.variants.map((item) => {
          const { files, preview } = example(item.example);
          return { value: item.example, label: item.label, files, preview };
        });
        return [{ type: "Example", props: { ...props, variants: variants.map(({ preview, ...rest }) => ({ ...rest, preview })) } }];
      }
      const { files, preview } = example(section.example);
      return [{ type: "Example", props: { ...props, files }, children: preview }];
    }
    default:
      return [{ type: "Callout", props: { tone: "warning", title: section.type }, children: "Not converted yet" }];
  }
}

function specOf(lang) {
  const c = chrome[lang];
  const group = (name) => c.groups[name] ?? name;
  const pages = pagesOf[lang];
  const screens = Object.fromEntries(
    pages.map((page) => {
      const sections = [...page.sections, ...(apiOf[lang][page.id] ?? [])];
      const widgets = sections.map((section, i) => {
        const title = section.title ?? c.titles[section.type] ?? "";
        return {
          id: `section-${i}`,
          w: 12,
          h: "auto",
          frame: "plain",
          description: `${page.title}: ${title || section.type}`,
          content: { type: "ArticleSection", props: { id: `section-${i}`, ...(title && { title }) }, children: nodesOf(section, lang, c) },
        };
      });
      return [page.id, { layout: "article", eyebrow: group(page.group), title: page.title, lede: page.lede, ...(page.wide && { wide: true }), ...(FULL.includes(page.group) && { toc: false }), description: page.lede, widgets }];
    }),
  );
  return {
    spec: 1,
    app: { name: "ui", description: "The ui design system documentation site." },
    start: pages[0].id,
    frame: {
      brand: { type: "Brand", props: { name: "ui", version: `v${catalog.version}`, href: "#/intro" } },
      scroll: "page",
      mobileNav: "drawer",
      search: { label: c.find, placeholder: c.find },
      sections: TABS.map((groups, i) => ({ label: c.tabs[i], groups: groups.map(group) })),
      sectionsLabel: c.sections,
      actions: [
        {
          type: "Segmented",
          props: {
            label: c.language,
            defaultValue: lang,
            onChange: { $action: { name: "set-language" } },
            options: [
              { value: "en", label: "English", lang: "en" },
              { value: "ko", label: "한국어", lang: "ko" },
            ],
          },
        },
      ],
      toc: c.toc,
      pager: c.pager,
    },
    nav: pages.map((page) => ({ screen: page.id, label: page.title, group: group(page.group), ...(page.sub && { sub: group(page.sub) }) })),
    actions: { "set-language": { description: "Switches the site language.", params: { value: "en | ko" } } },
    screens,
  };
}

for (const lang of ["ko", "en"]) writeFileSync(join(out, `spec.${lang}.json`), `${JSON.stringify(specOf(lang), null, 2)}\n`);
console.log(`wrote spec.ko.json and spec.en.json to ${out}`);
