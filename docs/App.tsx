import { Component, Fragment, useEffect, useLayoutEffect, useRef, useState, type ComponentType, type CSSProperties, type ErrorInfo, type ReactNode } from "react";
import { Button, Highlight, Icon, Segmented, ThemePicker, UIProvider, useI18n, useToast } from "ui";
import { api as apiKo } from "./api";
import { api as apiEn } from "./api.en";
import { homepage, MODE_LABEL, tokensFor, version } from "./catalog";
import { pages, type Page, type Section } from "./pages";
import { pages as pagesEn } from "./pages.en";
import { Phone } from "./Phone";
import { SduiPlayground } from "./SduiPlayground";
import { reviewOutline, TokenReview } from "./TokenReview";

const modules = import.meta.glob<{ default: () => ReactNode }>("./examples/*.tsx", { eager: true });
const sources = import.meta.glob<string>("./examples/*.tsx", { eager: true, query: "?raw", import: "default" });
type BlockText = { title: string; description: string; uses: string[] };
const blockMeta = import.meta.glob<BlockText & { kind?: "deck" | "doc" | "mobile"; category?: string; en: BlockText }>("../blocks/*/block.json", { eager: true, import: "default" });
const blockFiles = import.meta.glob<string>(["../blocks/*/*.tsx", "../blocks/*/*.ts", "../blocks/*/*.json", "!../blocks/*/block.json"], { eager: true, query: "?raw", import: "default" });
const blockViews = import.meta.glob<{ default: ComponentType }>(["../blocks/*/Dashboard.tsx", "../blocks/*/Deck.tsx", "../blocks/*/Doc.tsx", "../blocks/*/Screen.tsx"], { eager: true });

const example = (name: string) => ({ Demo: modules[`./examples/${name}.tsx`].default, source: sources[`./examples/${name}.tsx`] });

const COPY = {
  ko: {
    titles: { usage: "언제 쓰나", anatomy: "구성", demo: "예시", guidelines: "권장과 지양", tokens: "쓰는 토큰", code: "사용법", api: "API", a11y: "접근성" } as Record<string, string>,
    tabs: ["문서", "컴포넌트", "블록", "SDUI", "템플릿", "테마"],
    groups: {} as Record<string, string>,
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
    when: "이럴 때 씁니다",
    avoid: "이럴 땐 다른 것을 씁니다",
    do: "권장",
    dont: "지양",
    pager: "이전과 다음 페이지",
    prev: "이전",
    next: "다음",
    toc: "이 페이지에서",
    docs: "문서",
    find: "페이지 찾기",
    sections: "섹션",
    language: "언어",
  },
  en: {
    titles: { usage: "When to use", anatomy: "Anatomy", demo: "Examples", guidelines: "Do and don't", tokens: "Tokens", code: "Usage", api: "API", a11y: "Accessibility" } as Record<string, string>,
    tabs: ["Docs", "Components", "Blocks", "SDUI", "Templates", "Theme"],
    groups: { 시작하기: "Get started", 기반: "Foundations", 컴포넌트: "Components", 차트: "Charts", 블록: "Blocks", 슬라이드: "Slides", "기술 문서": "Tech docs", 이력서: "Resume", 테마: "Theme" } as Record<string, string>,
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
    when: "Use it when",
    avoid: "Use something else when",
    do: "Do",
    dont: "Don't",
    pager: "Previous and next page",
    prev: "Previous",
    next: "Next",
    toc: "On this page",
    docs: "Docs",
    find: "Find a page",
    sections: "Sections",
    language: "Language",
  },
};
const CONTENT = { ko: { pages, api: apiKo }, en: { pages: pagesEn, api: apiEn } };

function useDocs() {
  const { lang } = useI18n();
  const key: Lang = lang === "en" ? "en" : "ko";
  return { lang: key, c: COPY[key], ...CONTENT[key] };
}

const TABS = [["시작하기", "기반"], ["컴포넌트"], ["블록"], ["SDUI"], ["슬라이드", "기술 문서", "이력서"], ["테마"]].map((groups, index) => ({ index, groups }));
const fullWidth = (page: Page) => page.group === "블록" || page.group === "SDUI";
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

function Rich({ text }: { text: string }) {
  return (
    <>
      {String(text)
        .split(/`([^`]+)`/)
        .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))}
    </>
  );
}

function useCopy() {
  const toast = useToast();
  const { c } = useDocs();
  return async (text: string, label: string) => {
    const copied = await (navigator.clipboard?.writeText(text).then(
      () => true,
      () => false,
    ) ?? false);
    toast({ message: copied ? c.copied(label) : c.copyFailed, status: copied ? "good" : "warning", duration: 1800 });
  };
}

function Card({ title, body, items, kind, label, icon }: { title?: string; body?: string; items?: string[]; kind?: string; label?: string; icon?: string }) {
  return (
    <div className={`docs-card${kind ? ` is-${kind}` : ""}`}>
      {label && (
        <div className="docs-card-label">
          {icon && <Icon name={icon} size="sm" />}
          {label}
        </div>
      )}
      {title && <h3>{title}</h3>}
      {body && (
        <p>
          <Rich text={body} />
        </p>
      )}
      {items && <List items={items} />}
    </div>
  );
}

function List({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag>
      {items.map((item) => (
        <li key={item}>
          <Rich text={item} />
        </li>
      ))}
    </Tag>
  );
}

function CodeBox({ code, className = "" }: { code: string; className?: string }) {
  const copy = useCopy();
  const { c } = useDocs();
  return (
    <figure className={`docs-code ${className}`.trim()}>
      <pre>
        <Highlight code={code} />
      </pre>
      <Button onClick={() => copy(code, c.theCode)}>{c.copy}</Button>
    </figure>
  );
}

class Boundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }
  render() {
    if (this.state.error) return <pre className="docs-example-error">{String(this.state.error)}</pre>;
    return this.props.children;
  }
}

function Tabs<K extends string>({ value, onChange, options }: { value: K; onChange: (key: K) => void; options: [K, string][] }) {
  return (
    <div className="docs-tabs" role="tablist">
      {options.map(([key, label]) => (
        <button key={key} type="button" role="tab" aria-selected={key === value} onClick={() => onChange(key)}>
          {label}
        </button>
      ))}
    </div>
  );
}

function Demo({ name, caption, center, medium }: { name: string; caption?: string; center?: boolean; medium?: string }) {
  const copy = useCopy();
  const { c } = useDocs();
  const { locale } = useI18n();
  const [tab, setTab] = useState<"preview" | "code">("preview");
  const { Demo: Preview, source } = example(name);
  return (
    <>
      {caption && (
        <p className="docs-example-caption">
          <Rich text={caption} />
        </p>
      )}
      <div className="docs-example">
        <div className="docs-example-bar">
          <Tabs
            value={tab}
            onChange={setTab}
            options={[
              ["preview", c.preview],
              ["code", c.code],
            ]}
          />
          <span className="toolbar-spacer" />
          <Button className="docs-copy" onClick={() => copy(source, c.theCode)}>
            {c.copy}
          </Button>
        </div>
        <div className={`docs-example-preview${center ? " is-center" : ""}`} data-medium={medium ?? "app"} lang={locale} hidden={tab !== "preview"}>
          <div className="docs-example-stage">
            <Boundary>
              <Preview />
            </Boundary>
          </div>
        </div>
        {tab === "code" && (
          <figure className="docs-code docs-example-code">
            <pre>
              <Highlight code={source.trimEnd()} lang="tsx" numbers />
            </pre>
          </figure>
        )}
      </div>
    </>
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
  const [run, setRun] = useState(0);
  const [file, setFile] = useState(files[0]?.name);
  const current = files.find((f) => f.name === file) ?? files[0];
  return (
    <>
      <p>
        <Rich text={meta.description} />
      </p>
      <div className="docs-block-uses">
        {meta.uses.map((name) => (
          <span key={name}>{name}</span>
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
          <div className="docs-block-tools" role="group" aria-label={c.width}>
            {VIEWPORTS.map(([value, icon], i) => (
              <button key={value} type="button" aria-pressed={width === value} aria-label={c.viewports[i]} title={c.viewports[i]} onClick={() => setWidth(value)}>
                <Icon name={icon} size="sm" />
              </button>
            ))}
            <span className="docs-block-divider" aria-hidden="true" />
            <button type="button" aria-label={c.rerun} title={c.rerun} onClick={() => setRun((n) => n + 1)}>
              <Icon name="refresh" size="sm" />
            </button>
          </div>
        )}
        <Button icon="copy" onClick={() => copy(current.content, current.name)}>
          {current.name}
        </Button>
      </div>
      <div className="docs-block-preview" hidden={tab !== "preview"} style={{ "--frame-w": width } as CSSProperties}>
        <div className={`docs-block-frame${json.kind ? ` is-${json.kind}` : ""}`} data-medium="app" lang={lang}>
          <Boundary>{json.kind === "mobile" ? <Phone><View key={run} /></Phone> : <View key={run} />}</Boundary>
        </div>
      </div>
      {tab === "code" && current && (
        <div className="docs-example docs-block-code">
          <div className="docs-block-files">
            {files.map((f) => (
              <button key={f.name} type="button" aria-current={f.name === current.name} onClick={() => setFile(f.name)}>
                {f.name}
              </button>
            ))}
          </div>
          <figure className="docs-code docs-example-code">
            <pre>
              <Highlight code={current.content.trimEnd()} lang={current.name.endsWith(".json") ? "json" : "tsx"} numbers />
            </pre>
          </figure>
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
          <Boundary>
            <View />
          </Boundary>
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
      <div className="docs-templates" role="radiogroup">
        {ids.map((id) => {
          const json = blockMeta[`../blocks/${id}/block.json`];
          const meta = lang === "en" ? json.en : json;
          return (
            <button key={id} type="button" role="radio" aria-checked={id === selected} className="docs-template" onClick={() => setSelected(id)}>
              <Thumb id={id} />
              <span className="docs-template-title">{meta.title}</span>
              <span className="docs-template-description">{meta.description}</span>
            </button>
          );
        })}
      </div>
      {selected && <Block key={selected} id={selected} />}
    </>
  );
}

function Tokens({ paths, notes }: { paths: string[]; notes?: Record<string, string> }) {
  const copy = useCopy();
  const { c } = useDocs();
  return (
    <div className="docs-table-wrap">
      <table className="data-table">
        <thead>
          <tr>
            {c.tokenHead.map((head) => (
              <th key={head}>{head}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tokensFor(paths).map((t) => (
            <tr key={t.path}>
              <td>
                <button type="button" className="copy-name" onClick={() => copy(`var(${t.name})`, t.name)}>
                  {t.name}
                </button>
              </td>
              <td>
                {Object.entries(t.values).map(([mode, value]) => (
                  <span className="docs-token-value" key={mode}>
                    {MODE_LABEL[mode] && <em>{MODE_LABEL[mode]}</em>}
                    {t.type === "color" && <i style={{ "--sw": value } as CSSProperties} />}
                    <span>{value}</span>
                  </span>
                ))}
              </td>
              <td>
                <Rich text={notes?.[t.path] ?? t.description ?? ""} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Api({ description, rows }: { description?: string; rows: string[][] }) {
  const { c } = useDocs();
  return (
    <>
      {description && (
        <p>
          <Rich text={description} />
        </p>
      )}
      <div className="docs-table-wrap">
        <table className="data-table docs-api">
          <thead>
            <tr>
              {c.apiHead.map((head) => (
                <th key={head}>{head}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([name, type, fallback, description]) => (
              <tr key={name}>
                <td className="docs-api-name">{name}</td>
                <td className="docs-api-type">
                  {type.split(" · ").map((part, i) => (
                    <span key={i}>{part}</span>
                  ))}
                </td>
                <td className="docs-api-default">{fallback}</td>
                <td>
                  <Rich text={description} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

function SectionBody({ section }: { section: Section }) {
  const { lang, c } = useDocs();
  switch (section.type) {
    case "text":
      return (
        <>
          {section.body.map((text) => (
            <p key={text}>
              <Rich text={text} />
            </p>
          ))}
        </>
      );
    case "list":
      return <List items={section.items} ordered={section.ordered} />;
    case "a11y":
      return <List items={section.items} />;
    case "cards":
      return (
        <div className="docs-cards">
          {section.items.map((item, i) => (
            <Card key={item.title ?? i} {...item} />
          ))}
        </div>
      );
    case "usage":
      return (
        <div className="docs-cards">
          <Card title={c.when} items={section.when} />
          <Card title={c.avoid} items={section.avoid} />
        </div>
      );
    case "anatomy":
      return (
        <ol className="docs-anatomy">
          {section.items.map(([name, description]) => (
            <li key={name}>
              <strong>
                <Rich text={name} />
              </strong>
              <span>
                <Rich text={description} />
              </span>
            </li>
          ))}
        </ol>
      );
    case "demo":
      return <Demo name={section.example} caption={section.caption} center={section.center} medium={section.medium} />;
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
      return (
        <>
          {section.items.map(([good, bad]) => (
            <div className="docs-cards" style={{ marginBottom: "var(--space-4)" }} key={good}>
              <Card kind="do" icon="check" label={c.do} body={good} />
              <Card kind="dont" icon="close" label={c.dont} body={bad} />
            </div>
          ))}
        </>
      );
    case "tokens":
      return <Tokens paths={section.paths} notes={section.notes} />;
    case "code":
      return <CodeBox code={section.code.trim().replaceAll("{homepage}", homepage)} />;
    case "api":
      return <Api description={section.description} rows={section.rows} />;
    case "review":
      return <TokenReview lang={lang} />;
    case "sdui":
      return <SduiPlayground device={section.device} />;
  }
}

const titleOf = (section: Section, titles: Record<string, string>) => section.title ?? titles[section.type] ?? "";
const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

function Article({ page }: { page: Page }) {
  const { lang, c, pages, api } = useDocs();
  const sections = [...page.sections, ...(api[page.id] ?? [])];
  const index = pages.findIndex((p) => p.id === page.id);
  const outline = [
    ...sections.map((s, i) => ({ id: `section-${i}`, title: titleOf(s, c.titles) })).filter((entry) => entry.title),
    ...(page.sections.some((s) => s.type === "review") ? reviewOutline(lang) : []),
  ];
  return (
    <>
      <main className="docs-main">
        <article className={`docs-article${page.wide ? " is-wide" : ""}`} data-medium="doc" lang={lang}>
          <div className="docs-eyebrow">{c.groups[page.group] ?? page.group}</div>
          {fullWidth(page) && pages.filter((p) => p.group === page.group).length > 1 && (
            <nav className="docs-subtabs" aria-label={c.groups[page.group] ?? page.group}>
              {pages
                .filter((p) => p.group === page.group)
                .map((p) => (
                  <a key={p.id} href={`#/${p.id}`} aria-current={p.id === page.id ? "page" : undefined}>
                    {p.title}
                  </a>
                ))}
            </nav>
          )}
          <h1 className="docs-title">{page.title}</h1>
          <p className="docs-lede">
            <Rich text={page.lede} />
          </p>
          {sections.map((section, i) => (
            <section className="docs-section" id={`section-${i}`} key={`${page.id}-${i}`}>
              {titleOf(section, c.titles) && <h2>{titleOf(section, c.titles)}</h2>}
              <SectionBody section={section} />
            </section>
          ))}
          <nav className="docs-pager" aria-label={c.pager}>
            {[
              [pages[index - 1], c.prev, ""],
              [pages[index + 1], c.next, "is-next"],
            ]
              .filter((entry): entry is [Page, string, string] => Boolean(entry[0]))
              .map(([target, label, className]) => (
                <a className={className} href={`#/${target.id}`} key={label}>
                  <small>{label}</small>
                  <span>{target.title}</span>
                </a>
              ))}
          </nav>
        </article>
      </main>
      {!fullWidth(page) && (
        <aside className="docs-toc" aria-label={c.toc} lang={lang}>
          {outline.length > 0 && <div className="docs-toc-title">{c.toc}</div>}
          {outline.map((entry) => (
            <a
              key={entry.id}
              href={`#/${page.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(entry.id);
              }}
            >
              {entry.title}
            </a>
          ))}
        </aside>
      )}
    </>
  );
}

function Nav({ page }: { page: Page }) {
  const [query, setQuery] = useState("");
  const needle = query.trim().toLowerCase();
  const active = tabOf(page);
  const { lang, c, pages } = useDocs();
  const matches = (p: Page) => (needle ? `${p.title} ${p.group} ${p.lede}`.toLowerCase().includes(needle) : active.groups.includes(p.group));
  return (
    <nav className="docs-nav" aria-label={c.docs} lang={lang} data-medium="app">
      <input className="search" type="search" placeholder={c.find} aria-label={c.find} value={query} onChange={(e) => setQuery(e.target.value)} />
      <div>
        {groupsInOrder
          .filter((group) => pages.some((p) => p.group === group && matches(p)))
          .map((group) => (
            <div className="docs-nav-group" key={group}>
              <div className="docs-nav-title">{c.groups[group] ?? group}</div>
              {pages
                .filter((p) => p.group === group && matches(p))
                .map((p, i, list) => (
                  <Fragment key={p.id}>
                    {p.sub && p.sub !== list[i - 1]?.sub && <div className="docs-nav-sub">{c.groups[p.sub] ?? p.sub}</div>}
                    <a href={`#/${p.id}`} className={p.sub ? "is-sub" : undefined} aria-current={p.id === page.id ? "page" : undefined}>
                      {p.title}
                    </a>
                  </Fragment>
                ))}
            </div>
          ))}
      </div>
    </nav>
  );
}

const currentId = () => location.hash.replace(/^#\//, "") || pages[0].id;

export function App() {
  const [id, setId] = useState(currentId);
  const [lang, setLang] = useState<Lang>(() => (stored("lang") as Lang) ?? "en");
  const content = CONTENT[lang];
  const c = COPY[lang];
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
    <UIProvider lang={lang}>
      <header className="docs-top" lang={lang} data-medium="app">
        <a className="docs-brand" href="#/intro">
          ui <span>{`v${version}`}</span>
        </a>
        <nav className="docs-tabs-top" aria-label={c.sections}>
          {TABS.map((tab) => {
            const first = pages.find((p) => tab.groups.includes(p.group)) as Page;
            return (
              <a key={tab.index} href={`#/${first.id}`} aria-current={tab === tabOf(page) ? "page" : undefined}>
                {c.tabs[tab.index]}
              </a>
            );
          })}
        </nav>
        <span className="toolbar-spacer" />
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
          onChange={({ preset, theme }) => {
            store("preset", preset);
            store("theme", theme);
          }}
        />
      </header>
      <div className={`docs-layout${fullWidth(page) ? " is-full" : ""}`}>
        {!fullWidth(page) && <Nav page={page} />}
        <Article key={`${page.id}-${lang}`} page={page} />
      </div>
    </UIProvider>
  );
}
