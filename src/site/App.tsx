import { useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import enText from "./text/en.json";
import koText from "./text/ko.json";
import chromeText from "./text/chrome.json";
import {
  Anatomy,
  AppShell,
  Article as UIArticle,
  ArticleSection,
  Badge,
  Brand,
  CardGrid,
  CopyCode,
  ErrorBoundary,
  Example,
  Guidelines,
  Paragraphs,
  PropsTable,
  RichText,
  TextList,
  TokenTable,
  useCopy,
  Button,
  Callout,
  Card as UICard,
  CodeBlock,
  Icon,
  Pager,
  Segmented,
  Tabs as UITabs,
  TextField,
  Toc,
  UIProvider,
  themes,
  useI18n,
  type ShellGroup,
} from "ui";
import { ThemePicker } from "./ThemePicker";
import { api as apiKo } from "./api";
import { api as apiEn } from "./api.en";
import { homepage, MODE_LABELS, tokensFor, version } from "./catalog";
import { pages, type Page, type Section } from "./pages";
import { pages as pagesEn } from "./pages.en";
import { Phone } from "./Phone";
import { SpecPreview } from "./SpecPreview";
import { reviewOutline, TokenReview } from "./TokenReview";

const modules = import.meta.glob<{ default: () => ReactNode }>("./examples/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./examples/*.tsx", { eager: true, query: "?raw", import: "default" });
type BlockText = { title: string; description: string; uses: string[] };
const blockMeta = import.meta.glob<BlockText & { kind?: "deck" | "doc" | "mobile"; category?: string; en: BlockText }>("../blocks/*/block.json", { eager: true, import: "default" });
const blockFiles = import.meta.glob<string>(["../blocks/*/*.tsx", "../blocks/*/*.ts", "../blocks/*/*.json", "!../blocks/*/block.json"], { eager: true, query: "?raw", import: "default" });
const blockViews = import.meta.glob<{ default: ComponentType }>(["../blocks/*/Dashboard.tsx", "../blocks/*/Deck.tsx", "../blocks/*/Doc.tsx", "../blocks/*/Screen.tsx"], { eager: true });

const example = (name: string) => ({ Demo: modules[`./examples/${name}.tsx`].default, source: sources[`./examples/${name}.tsx`] });
const textOf = (name: string, lang: Lang) => (lang === "en" ? enText : koText)[name as keyof typeof enText];

type Chrome = { titles: Record<string, string>; tabs: string[]; groups: Record<string, string>; toc: string; pager: string; find: string; sections: string; language: string; when: string; avoid: string };
const chrome = chromeText as Record<"ko" | "en", Chrome>;

const COPY = {
  ko: {
    ...chrome.ko,
    device: "화면 크기",
    desktop: "데스크톱",
    mobile: "모바일",
    copied: (label: string) => `${label} 복사했습니다`,
    copyFailed: "복사하지 못했습니다",
    theCode: "코드를",
    copy: "복사",
    preview: "미리보기",
    code: "코드",
    view: "보기",
    viewports: ["데스크톱", "태블릿", "모바일"],
    width: "화면 너비",
    rerun: "다시 그리기",
    tokenHead: ["토큰", "값", "쓰임"],
    apiHead: ["이름", "타입", "기본값", "설명"],
    do: "권장",
    dont: "지양",
    prev: "이전",
    next: "다음",
    docs: "문서",
  },
  en: {
    ...chrome.en,
    device: "Screen size",
    desktop: "Desktop",
    mobile: "Mobile",
    copied: (label: string) => `Copied ${label}`,
    copyFailed: "Could not copy",
    theCode: "the code",
    copy: "Copy",
    preview: "Preview",
    code: "Code",
    view: "View",
    viewports: ["Desktop", "Tablet", "Phone"],
    width: "Screen width",
    rerun: "Redraw",
    tokenHead: ["Token", "Value", "Use"],
    apiHead: ["Name", "Type", "Default", "Description"],
    do: "Do",
    dont: "Don't",
    prev: "Previous",
    next: "Next",
    docs: "Docs",
  },
};
const CONTENT = { ko: { pages, api: apiKo }, en: { pages: pagesEn, api: apiEn } };

function useDocs() {
  const { lang } = useI18n();
  const key: Lang = lang === "en" ? "en" : "ko";
  return { lang: key, c: COPY[key], ...CONTENT[key] };
}

const TABS = [["시작하기", "기반"], ["입력", "탐색", "피드백", "데이터", "콘텐츠", "렌더러", "틀"], ["블록"], ["앱 스펙"], ["슬라이드", "기술 문서", "이력서", "포트폴리오"], ["테마"]].map(
  (groups, index) => ({ index, groups }),
);
const fullWidth = (page: Page) => page.group === "블록" || page.group === "앱 스펙";
const tabOf = (page: Page) => TABS.find((tab) => tab.groups.includes(page.group)) ?? TABS[0];
const groupsInOrder = [...new Set(pages.map((p) => p.group))];

type Lang = "ko" | "en";

const stored = (key: string) => {
  try {
    return new URLSearchParams(location.search).get(key) ?? localStorage.getItem(`docs.${key}`);
  } catch {
    return null;
  }
};
const store = (key: string, value: string) => {
  try {
    localStorage.setItem(`docs.${key}`, value);
  } catch {
    return;
  }
};

function Card({ title, body, items }: { title?: string; body?: string; items?: string[] }) {
  return (
    <UICard title={title}>
      {body && (
        <p>
          <RichText text={body} />
        </p>
      )}
      {items && <TextList items={items} />}
    </UICard>
  );
}

function Tabs<K extends string>({ value, onChange, options, label }: { value: K; onChange: (key: K) => void; options: [K, string][]; label?: string }) {
  return <UITabs label={label} value={value} onChange={(id) => onChange(id as K)} items={options.map(([id, text]) => ({ id, label: text }))} />;
}

function Demo({
  name,
  variants,
  caption,
  layout = "padded",
  medium,
}: {
  name: string;
  variants?: { label: string; example: string }[];
  caption?: string;
  layout?: "centered" | "padded" | "fullscreen";
  medium?: string;
}) {
  const { lang } = useDocs();
  const { locale } = useI18n();
  const filesOf = (id: string) => {
    const text = textOf(id, lang);
    return [{ name: `${id}.tsx`, code: example(id).source }, ...(text ? [{ name: `text.${lang}.json`, code: JSON.stringify(text, null, 2), lang: "json" as const }] : [])];
  };
  const previewOf = (id: string) => {
    const { Demo: Preview } = example(id);
    return <Preview />;
  };
  return (
    <Example
      caption={caption}
      layout={layout}
      medium={medium}
      lang={locale}
      files={variants ? undefined : filesOf(name)}
      variants={variants?.map((item) => ({ value: item.example, label: item.label, preview: previewOf(item.example), files: filesOf(item.example) }))}
    >
      {variants ? undefined : previewOf(name)}
    </Example>
  );
}

const VIEWPORTS = [
  ["100%", "monitor"],
  ["768px", "tablet"],
  ["390px", "phone"],
];

function Block({ id }: { id: string }) {
  const copy = useCopy();
  const [entry, { default: View }] = Object.entries(blockViews).find(([path]) => path.startsWith(`../blocks/${id}/`)) as [string, { default: ComponentType }];
  const main = entry.split("/").at(-1);
  const { lang, c } = useDocs();
  const json = blockMeta[`../blocks/${id}/block.json`];
  const meta = lang === "en" ? json.en : json;
  const files = Object.entries(blockFiles)
    .filter(([path]) => path.startsWith(`../blocks/${id}/`))
    .map(([path, content]) => ({ name: path.split("/").at(-1) as string, content }))
    .sort((a, b) => Number(b.name === main) - Number(a.name === main) || a.name.localeCompare(b.name));
  const [tab, setTab] = useState("preview");
  const [width, setWidth] = useState("100%");
  const [dragging, setDragging] = useState(false);
  const preview = useRef<HTMLDivElement>(null);
  const frameWidth = () => preview.current?.querySelector(".docs-block-frame")?.getBoundingClientRect().width ?? 0;
  const resize = (px: number) => {
    const max = preview.current?.clientWidth ?? px;
    setWidth(px >= max - 1 ? "100%" : `${Math.round(Math.max(320, px))}px`);
  };
  const startResize = (e: ReactPointerEvent<HTMLSpanElement>) => {
    e.preventDefault();
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    const startX = e.clientX;
    const start = frameWidth();
    setDragging(true);
    const move = (event: PointerEvent) => resize(start + (event.clientX - startX) * 2);
    const end = () => {
      setDragging(false);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", end);
      handle.removeEventListener("pointercancel", end);
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", end);
    handle.addEventListener("pointercancel", end);
  };
  const [run, setRun] = useState(0);
  const [file, setFile] = useState(files[0]?.name);
  const current = files.find((f) => f.name === file) ?? files[0];
  return (
    <>
      <p>
        <RichText text={meta.description} />
      </p>
      <div className="docs-block-uses">
        {meta.uses.map((name) => (
          <Badge key={name} variant="outline">
            {name}
          </Badge>
        ))}
      </div>
      <div className="docs-block-bar">
        <Segmented
          label={c.view}
          value={tab}
          onChange={setTab}
          options={[
            { value: "preview", label: c.preview },
            { value: "code", label: c.code },
          ]}
        />
        <span className="docs-block-divider" aria-hidden="true" />
        <span className="docs-block-title">{meta.title}</span>
        <span className="toolbar-spacer" />
        {tab === "preview" && !json.kind && (
          <div className="docs-block-tools">
            <Segmented label={c.width} value={width} onChange={setWidth} options={VIEWPORTS.map(([value, icon], i) => ({ value, title: c.viewports[i], label: <Icon name={icon} size="sm" /> }))} />
            <Button icon="refresh" aria-label={c.rerun} title={c.rerun} onClick={() => setRun((n) => n + 1)} />
          </div>
        )}
        <Button icon="copy" onClick={() => copy(current.content, current.name)}>
          {current.name}
        </Button>
      </div>
      <div ref={preview} className={`block-preview${dragging ? " is-dragging" : ""}`} hidden={tab !== "preview"} style={{ "--frame-w": width } as CSSProperties}>
        {!json.kind && (
          <span
            className="docs-block-handle"
            role="separator"
            aria-orientation="vertical"
            aria-label={c.width}
            aria-valuenow={Math.round(frameWidth())}
            tabIndex={0}
            onPointerDown={startResize}
            onKeyDown={(e) => {
              const step = e.key === "ArrowLeft" ? -16 : e.key === "ArrowRight" ? 16 : 0;
              if (!step) return;
              e.preventDefault();
              resize(frameWidth() + step * 2);
            }}
          />
        )}
        <div className={`docs-block-frame${json.kind ? ` is-${json.kind}` : ""}`} data-medium="app" lang={lang}>
          <ErrorBoundary>
            {json.kind === "mobile" ? (
              <Phone>
                <View key={run} />
              </Phone>
            ) : (
              <View key={run} />
            )}
          </ErrorBoundary>
        </div>
      </div>
      {tab === "code" && current && (
        <div className="docs-example docs-block-code">
          <div className="docs-block-files">
            <UITabs label={c.code} orientation="vertical" variant="pill" value={current.name} onChange={setFile} items={files.map((f) => ({ id: f.name, label: f.name }))} />
          </div>
          <div className="docs-example-code">
            <CodeBlock code={current.content} lang={current.name.endsWith(".json") ? "json" : "tsx"} />
          </div>
        </div>
      )}
    </>
  );
}

const THUMB = { deck: [1280, 720], doc: [880, 1100], mobile: [440, 880] } as const;

function Thumb({ id }: { id: string }) {
  const { lang } = useDocs();
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const kind = blockMeta[`../blocks/${id}/block.json`].kind ?? "deck";
  const [width, height] = THUMB[kind];
  const View = Object.entries(blockViews).find(([path]) => path.startsWith(`../blocks/${id}/`))?.[1].default;
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const observer = new ResizeObserver(() => setScale(el.clientWidth / width));
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div ref={box} className={`docs-template-thumb is-${kind}`} style={{ aspectRatio: `${width} / ${kind === "deck" ? height : height * 0.5}` }} inert>
      <div className="docs-template-canvas" data-medium="app" lang={lang} style={{ width, height, transform: `scale(${scale})` }}>
        {View && scale > 0 && (
          <ErrorBoundary>
            <View />
          </ErrorBoundary>
        )}
      </div>
    </div>
  );
}

function Templates({ category }: { category: string }) {
  const { lang } = useDocs();
  const ids = Object.entries(blockMeta)
    .filter(([, json]) => json.category === category)
    .map(([path]) => path.split("/")[2])
    .sort();
  const [selected, setSelected] = useState(ids[0]);
  return (
    <>
      <div className="docs-templates">
        {ids.map((id) => {
          const json = blockMeta[`../blocks/${id}/block.json`];
          const meta = lang === "en" ? json.en : json;
          return (
            <UICard key={id} selected={id === selected} onClick={() => setSelected(id)}>
              <Thumb id={id} />
              <span className="docs-template-title">{meta.title}</span>
              <span className="docs-template-description">{meta.description}</span>
            </UICard>
          );
        })}
      </div>
      {selected && <Block key={selected} id={selected} />}
    </>
  );
}

function Tokens({ paths, notes }: { paths: string[]; notes?: Record<string, string> }) {
  const { lang } = useDocs();
  return (
    <TokenTable
      rows={tokensFor(paths).map((t) => ({
        name: t.name,
        color: t.type === "color",
        values: Object.entries(t.values).map(([mode, value]) => ({ mode: MODE_LABELS[lang][mode] || undefined, value })),
        use: notes?.[t.path] ?? t.description ?? "",
      }))}
    />
  );
}

function Api({ description, rows }: { description?: string; rows: string[][] }) {
  return <PropsTable description={description} rows={rows as [string, string, string, string][]} />;
}

function SectionBody({ section }: { section: Section }) {
  const { lang, c } = useDocs();
  switch (section.type) {
    case "text":
      return <Paragraphs items={section.body} />;
    case "list":
      return <TextList items={section.items} ordered={section.ordered} />;
    case "a11y":
      return <TextList items={section.items} />;
    case "cards":
      return (
        <CardGrid>
          {section.items.map((item, i) => (
            <Card key={item.title ?? i} {...item} />
          ))}
        </CardGrid>
      );
    case "usage":
      return (
        <CardGrid>
          <Card title={c.when} items={section.when} />
          <Card title={c.avoid} items={section.avoid} />
        </CardGrid>
      );
    case "anatomy":
      return <Anatomy items={section.items as [string, string][]} />;
    case "demo":
      return <Demo name={section.example} variants={section.variants} caption={section.caption} layout={section.layout} medium={section.medium} />;
    case "gallery":
      return (
        <div className="docs-gallery">
          {section.items.map((item) => (
            <div className="docs-gallery-item" key={item.title}>
              <h3>{item.title}</h3>
              <Demo name={item.example} caption={item.caption} medium={item.medium} />
            </div>
          ))}
        </div>
      );
    case "block":
      return <Block id={section.id} />;
    case "templates":
      return <Templates category={section.category} />;
    case "guidelines":
      return <Guidelines items={section.items as [string, string][]} />;
    case "tokens":
      return <Tokens paths={section.paths} notes={section.notes} />;
    case "code":
      return <CopyCode code={section.code.trim().replaceAll("{homepage}", homepage)} />;
    case "api":
      return <Api description={section.description} rows={section.rows} />;
    case "review":
      return <TokenReview lang={lang} />;
    case "spec":
      return <SpecPreview />;
  }
}

const titleOf = (section: Section, titles: Record<string, string>) => section.title ?? titles[section.type] ?? "";

function useOutline(page: Page) {
  const { lang, c, api } = useDocs();
  const sections = [...page.sections, ...(api[page.id] ?? [])];
  return [
    ...sections.map((s, i) => ({ id: `section-${i}`, label: titleOf(s, c.titles) })).filter((entry) => entry.label),
    ...(page.sections.some((s) => s.type === "review") ? reviewOutline(lang).map((entry) => ({ id: entry.id, label: entry.title })) : []),
  ];
}

function Article({ page }: { page: Page }) {
  const { c, pages, api } = useDocs();
  const sections = [...page.sections, ...(api[page.id] ?? [])];
  const index = pages.findIndex((p) => p.id === page.id);
  const link = (target?: Page) => target && { label: target.title, href: `#/${target.id}` };
  return (
    <UIArticle
      eyebrow={c.groups[page.group] ?? page.group}
      title={page.title}
      lede={<RichText text={page.lede} />}
      wide={page.wide}
      pager={<Pager label={c.pager} previous={link(pages[index - 1])} next={link(pages[index + 1])} />}
    >
      {sections.map((section, i) => (
        <ArticleSection id={`section-${i}`} key={`${page.id}-${i}`} title={titleOf(section, c.titles) || undefined}>
          <SectionBody section={section} />
        </ArticleSection>
      ))}
    </UIArticle>
  );
}

function useNav(page: Page, query: string): ShellGroup[] {
  const { c, pages } = useDocs();
  const needle = query.trim().toLowerCase();
  const active = tabOf(page);
  const matches = (p: Page) => (needle ? `${p.title} ${p.group} ${p.lede}`.toLowerCase().includes(needle) : active.groups.includes(p.group));
  return groupsInOrder
    .filter((group) => pages.some((p) => p.group === group && matches(p)))
    .map((group) => ({
      title: c.groups[group] ?? group,
      items: pages.filter((p) => p.group === group && matches(p)).map((p) => ({ id: p.id, label: p.title, href: `#/${p.id}`, sub: p.sub && (c.groups[p.sub] ?? p.sub), current: p.id === page.id })),
    }));
}

function Shell({ page, lang, setLang }: { page: Page; lang: Lang; setLang: (lang: Lang) => void }) {
  const { c, pages } = useDocs();
  const [query, setQuery] = useState("");
  const nav = useNav(page, query);
  const outline = useOutline(page);
  const full = fullWidth(page);
  return (
    <div className="docs-shell" data-medium="app" lang={lang}>
      <AppShell
        scroll="page"
        brand={
          <Brand name="ui" version={`v${version}`} href="#/intro" />
        }
        nav={nav}
        navHeader={<TextField label={c.find} hideLabel type="search" icon="search" placeholder={c.find} value={query} onChange={setQuery} />}
        title={
          <UITabs
            variant="pill"
            label={c.sections}
            value={String(tabOf(page).index)}
            onChange={(id) => (location.hash = `#/${(pages.find((p) => TABS[Number(id)].groups.includes(p.group)) as Page).id}`)}
            items={TABS.map((tab) => ({ id: String(tab.index), label: c.tabs[tab.index] }))}
          />
        }
        actions={
          <>
            <Segmented
              label={c.language}
              value={lang}
              onChange={setLang}
              options={[
                { value: "en", label: "English", lang: "en" },
                { value: "ko", label: "한국어", lang: "ko" },
              ]}
            />
            <ThemePicker
              preset={stored("preset")}
              theme={stored("theme")}
              style={stored("style")}
              onChange={({ preset, theme, style }) => {
                store("preset", preset);
                store("theme", theme);
                store("style", style);
              }}
            />
          </>
        }
        aside={full || outline.length === 0 ? undefined : <Toc key={page.id} title={c.toc} items={outline} offset={120} />}
      >
        <Article key={`${page.id}-${lang}`} page={page} />
      </AppShell>
    </div>
  );
}

const storedTheme = () => {
  const family = themes[stored("preset") as keyof typeof themes] ?? themes.lime;
  return family[stored("style") as keyof typeof family] ?? family.minimal;
};

const currentId = () => location.hash.replace(/^#\//, "") || pages[0].id;

export function App() {
  const [id, setId] = useState(currentId);
  const [lang, setLang] = useState<Lang>(() => (stored("lang") as Lang) ?? "en");
  const [theme] = useState(storedTheme);
  const content = CONTENT[lang];
  const page = content.pages.find((p) => p.id === id) ?? content.pages[0];

  useEffect(() => {
    const onHash = () => {
      setId(currentId());
      window.scrollTo(0, 0);
    };
    addEventListener("hashchange", onHash);
    return () => removeEventListener("hashchange", onHash);
  }, []);

  useEffect(() => {
    store("lang", lang);
    document.documentElement.lang = lang;
  }, [lang]);

  useEffect(() => {
    document.title = `${page.title} · ui`;
  }, [page]);

  return (
    <UIProvider theme={theme} lang={lang}>
      <Shell page={page} lang={lang} setLang={setLang} />
    </UIProvider>
  );
}
