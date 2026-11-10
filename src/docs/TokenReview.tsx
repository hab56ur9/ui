import { createContext, useContext, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Delta, Icon, Segmented, useToast } from "ui";
import { byPath, catalog, groups, media, modes, tokensUnder, varOf, type Token } from "./catalog";

type Lang = "ko" | "en";
type Pair = [string, string];
type Text = (ko: string, en: string) => string;

const LangContext = createContext<Lang>("ko");
const translator =
  (lang: Lang): Text =>
  (ko, en) =>
    lang === "en" ? en : ko;
const useText = () => translator(useContext(LangContext));

const THEME_LABEL: Record<string, Pair> = { light: ["라이트", "Light"], dark: ["다크", "Dark"] };
const MEDIUM_LABEL: Record<string, Pair> = { app: ["앱", "App"], doc: ["문서", "Doc"], slide: ["슬라이드", "Slide"] };
const LAYER_LABEL: Record<string, Pair> = {
  primitive: ["원시", "Primitive"],
  foundation: ["기반", "Foundation"],
  theme: ["테마", "Theme"],
  medium: ["용도", "Medium"],
  lang: ["언어", "Language"],
};
const LANG_LABEL: Record<string, string> = { ko: "한국어", en: "English" };
const OUTLINE: Record<string, Pair> = {
  summary: ["요약", "Summary"],
  primitive: ["원시 색", "Primitive colors"],
  semantic: ["의미 색", "Semantic colors"],
  contrast: ["대비", "Contrast"],
  dataviz: ["데이터 시각화", "Data visualization"],
  type: ["타이포그래피", "Typography"],
  space: ["간격과 레이아웃", "Spacing and layout"],
  shape: ["모양과 그림자", "Shape and elevation"],
  marks: ["차트 마크", "Chart marks"],
  motion: ["모션", "Motion"],
  all: ["전체 토큰", "All tokens"],
};

const valueIn = (token: Token, mode: string) => token.values[mode] ?? token.values.all;
const px = (path: string, mode = "all") => parseFloat(valueIn(byPath.get(path) as Token, mode));
const last = (path: string) => path.split(".").at(-1) as string;
const groupOf = (path: string) => path.split(".").slice(0, -1).join(".");
const sw = (value: string) => ({ "--sw": value }) as CSSProperties;
const paint = (path: string) => ({ "--c": varOf(path) }) as CSSProperties;
const all = (path: string) => byPath.get(path)?.values.all ?? "";

const channel = (c: number) => {
  const v = c / 255;
  return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const rgbOf = (hex: string) => (hex.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i)?.slice(1) ?? ["0", "0", "0"]).map((h) => parseInt(h, 16));
const luminance = ([r, g, b]: number[]) => 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
const ratio = (fg: string, bg: string, theme: string) => {
  const [a, b] = [fg, bg].map((path) => luminance(rgbOf(valueIn(byPath.get(path) as Token, theme))));
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
};

const usage = new Map<string, string[]>();
catalog
  .filter((t) => t.layer !== "primitive")
  .forEach((t) => new Set(Object.values(t.chains).flat()).forEach((path) => usage.set(path, [...(usage.get(path) ?? []), t.path])));

const TEXT_PAIRS: [string, number][] = [
  ["color.fg.default", 4.5],
  ["color.fg.secondary", 4.5],
  ["color.fg.muted", 3],
  ["color.delta.good", 4.5],
  ["color.delta.bad", 4.5],
  ["color.main.default", 3],
];
const SURFACES = ["color.bg.page", "color.bg.surface", "color.bg.raised", "color.bg.subtle"];
const TYPE_ORDER = ["caption", "label", "body", "title", "heading"];
const FILL_PAIRS = [
  ["color.main.on", "color.main.fill"],
  ["color.danger.on", "color.danger.default"],
];

type Finding = { level: "critical" | "warning" | "good" | "info"; title: string; detail: string };

function findings(t: Text) {
  const list: Finding[] = [];
  modes.theme.forEach((theme) =>
    TEXT_PAIRS.forEach(([fg, min]) =>
      SURFACES.forEach((bg) => {
        const r = ratio(fg, bg, theme);
        if (r >= min) return;
        list.push({ level: "critical", title: `${fg} / ${bg} — ${t(...THEME_LABEL[theme])}`, detail: t(`${r.toFixed(2)}:1, 기준 ${min}:1`, `${r.toFixed(2)}:1, target ${min}:1`) });
      }),
    ),
  );
  FILL_PAIRS.forEach(([on, fill]) =>
    modes.theme.forEach((theme) => {
      const r = ratio(on, fill, theme);
      if (r >= 4.5) return;
      list.push({ level: "critical", title: `${on} / ${fill} — ${t(...THEME_LABEL[theme])}`, detail: t(`버튼 글자 ${r.toFixed(2)}:1, 기준 4.5:1`, `Button text ${r.toFixed(2)}:1, target 4.5:1`) });
    }),
  );
  modes.theme.forEach((theme) =>
    tokensUnder("color.code")
      .filter((token) => token.path !== "color.code.background")
      .forEach((token) => {
        const r = ratio(token.path, "color.code.background", theme);
        if (r >= 4.5) return;
        list.push({ level: "critical", title: `${token.path} / color.code.background — ${t(...THEME_LABEL[theme])}`, detail: t(`코드 강조 ${r.toFixed(2)}:1, 기준 4.5:1`, `Code highlight ${r.toFixed(2)}:1, target 4.5:1`) });
      }),
  );
  const contrastFailures = list.length;
  modes.theme.forEach((theme) => {
    const low = tokensUnder("color.series").filter((token) => ratio(token.path, "color.bg.surface", theme) < 3);
    if (!low.length) return;
    const slots = low.map((token) => last(token.path)).join("·");
    list.push({
      level: "warning",
      title: t(`시리즈 ${slots}번이 ${t(...THEME_LABEL[theme])} 표면 대비 3:1 미만`, `Series ${slots} below 3:1 against the ${t(...THEME_LABEL[theme])} surface`),
      detail: t("이 색을 쓰는 차트는 직접 라벨이나 표 보기를 함께 둡니다", "Charts that use these colors carry direct labels or a table view"),
    });
  });
  modes.medium.forEach((medium) => {
    const sizes = TYPE_ORDER.map((step) => px(`font.size.${step}`, medium));
    if (sizes.every((size, i) => i === 0 || size > sizes[i - 1])) return;
    list.push({ level: "warning", title: t(`${t(...MEDIUM_LABEL[medium])} 글자 크기 순서가 뒤바뀜`, `${t(...MEDIUM_LABEL[medium])} font sizes are out of order`), detail: sizes.map((s, i) => `${TYPE_ORDER[i]} ${s}`).join(" · ") });
  });
  const unused = catalog.filter((token) => token.layer === "primitive" && !usage.has(token.path));
  if (unused.length)
    list.push({
      level: "info",
      title: t(`원시 색 ${unused.length}개가 아직 쓰이지 않음`, `${unused.length} primitive colors are not used yet`),
      detail: unused.map((token) => token.path.replace("color.", "")).join(", "),
    });
  if (!contrastFailures)
    list.unshift({
      level: "good",
      title: t("텍스트 대비 기준 통과", "Text contrast targets met"),
      detail: t(
        `${modes.theme.length}개 테마 × (${TEXT_PAIRS.length}개 텍스트 색 × ${SURFACES.length}개 배경 + 버튼 ${FILL_PAIRS.length}종)`,
        `${modes.theme.length} themes × (${TEXT_PAIRS.length} text colors × ${SURFACES.length} backgrounds + ${FILL_PAIRS.length} button types)`,
      ),
    });
  return list;
}

function useCopy() {
  const toast = useToast();
  const t = useText();
  return async (path: string) => {
    const text = varOf(path);
    const copied = await (navigator.clipboard?.writeText(text).then(
      () => true,
      () => false,
    ) ?? false);
    toast({ message: copied ? t(`복사됨 ${text}`, `Copied ${text}`) : text, status: copied ? "good" : "info", duration: 1800 });
  };
}

function Section({ id, lede, count, children }: { id: string; lede: string; count?: number; children: ReactNode }) {
  const t = useText();
  const title = t(...OUTLINE[id]);
  return (
    <section className="review-section" id={`theme-${id}`}>
      <h2>{count === undefined ? title : `${title} ${count}`}</h2>
      <p>{lede}</p>
      {children}
    </section>
  );
}

function ThemePair({ children }: { children: (theme: string) => ReactNode }) {
  const t = useText();
  return (
    <div className="theme-pair">
      {modes.theme.map((theme) => (
        <div className="theme-panel" data-theme={theme} key={theme}>
          <div className="panel-label">{t(...THEME_LABEL[theme])}</div>
          {children(theme)}
        </div>
      ))}
    </div>
  );
}

const ICON = { critical: "error", warning: "warning", good: "success", info: "info" };
const LEVEL: Record<Finding["level"], Pair> = { critical: ["실패", "Fail"], warning: ["주의", "Warning"], good: ["통과", "Pass"], info: ["참고", "Note"] };

function Summary() {
  const t = useText();
  return (
    <Section
      id="summary"
      lede={t(
        "빌드 산출물에서 자동으로 계산한 검토 결과입니다. 토큰을 고치고 다시 빌드한 뒤 새로고침하면 갱신됩니다.",
        "Review results computed automatically from the build output. Edit the tokens, rebuild and reload to update them.",
      )}
    >
      <div className="review-stats">
        {[
          [t("전체 토큰", "All tokens"), catalog.length],
          ...Object.entries(LAYER_LABEL).map(([layer, label]) => [t(`${label[0]} 계층`, `${label[1]} layer`), catalog.filter((token) => token.layer === layer).length]),
        ].map(([label, value]) => (
          <div className="review-card" key={label}>
            <div className="review-stat-label">{label}</div>
            <div className="review-stat-value">{value}</div>
          </div>
        ))}
      </div>
      <div className="review-card">
        <ul className="findings">
          {findings(t).map(({ level, title, detail }) => (
            <li className={`is-${level}`} key={title}>
              <span className="finding-icon">
                <Icon name={ICON[level]} size="sm" />
              </span>
              <span className="finding-level">{t(...LEVEL[level])}</span>
              <div>
                <div>{title}</div>
                <div className="finding-detail">{detail}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

function Primitives() {
  const copy = useCopy();
  const t = useText();
  const colors = catalog.filter((t) => t.layer === "primitive");
  return (
    <Section
      id="primitive"
      count={colors.length}
      lede={t(
        "팔레트 원본입니다. 단계 번호는 OKLab 명도를 따릅니다. 점선 테두리는 아직 의미 토큰이 참조하지 않는 색입니다.",
        "The source palette. Step numbers follow OKLab lightness. A dashed border marks a color that no semantic token references yet.",
      )}
    >
      <div className="review-card ramps">
        {[...new Set(colors.map((t) => groupOf(t.path)))].map((hue) => (
          <div className="ramp" key={hue}>
            <div className="ramp-name">{last(hue)}</div>
            <div className="chips">
              {colors
                .filter((token) => groupOf(token.path) === hue)
                .map((token) => {
                  const users = usage.get(token.path) ?? [];
                  return (
                    <button
                      type="button"
                      key={token.path}
                      className={`chip${users.length ? "" : " is-unused"}`}
                      title={users.length ? t(`참조: ${users.join(", ")}`, `Referenced by: ${users.join(", ")}`) : t("미사용", "Unused")}
                      onClick={() => copy(token.path)}
                    >
                      <span className="swatch" style={sw(varOf(token.path))} />
                      <span className="chip-step">{last(token.path)}</span>
                      <span className="chip-meta">{token.values.all}</span>
                      <span className="chip-meta">{users.length ? t(`사용 ${users.length}`, `Used ${users.length}`) : t("미사용", "Unused")}</span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}

function Semantic() {
  const copy = useCopy();
  const t = useText();
  const colors = catalog.filter((t) => t.layer === "theme" && t.type === "color");
  return (
    <Section
      id="semantic"
      count={colors.length}
      lede={t(
        "화면이 실제로 쓰는 색입니다. 같은 이름이 테마마다 다른 원시 색을 가리킵니다. 행을 누르면 var() 이름이 복사됩니다.",
        "The colors screens actually use. One name points to a different primitive color per theme. Click a row to copy its var() name.",
      )}
    >
      <ThemePair>
        {(theme) =>
          [...new Set(colors.map((t) => groupOf(t.path)))].map((group) => (
            <div className="token-group" key={group}>
              <div className="token-group-title">{group}</div>
              {groups[group] && <div className="token-group-note">{groups[group]}</div>}
              {colors
                .filter((token) => groupOf(token.path) === group)
                .map((token) => (
                  <button type="button" className="token-row" key={token.path} onClick={() => copy(token.path)}>
                    <span className="swatch" style={sw(varOf(token.path))} />
                    <span>
                      <span className="token-name">{token.name}</span>
                      <span className="token-chain">{`→ ${token.chains[theme].join(" → ")}`}</span>
                    </span>
                    <span className="token-value">{token.values[theme]}</span>
                  </button>
                ))}
            </div>
          ))
        }
      </ThemePair>
    </Section>
  );
}

function Contrast() {
  const t = useText();
  return (
    <Section
      id="contrast"
      lede={t(
        "텍스트 색과 배경 색의 WCAG 대비입니다. 본문은 4.5:1, 보조 텍스트와 강조색은 3:1이 기준입니다.",
        "WCAG contrast between text colors and background colors. The target is 4.5:1 for body text and 3:1 for supporting text and the accent.",
      )}
    >
      <ThemePair>
        {(theme) => (
          <div className="contrast-grid" style={{ "--cols": SURFACES.length } as CSSProperties}>
            <div className="contrast-head" />
            {SURFACES.map((bg) => (
              <div className="contrast-head" key={bg}>
                {last(bg)}
              </div>
            ))}
            {TEXT_PAIRS.flatMap(([fg, min]) => [
              <div className="contrast-head" key={fg}>
                {fg.replace("color.", "")}
              </div>,
              ...SURFACES.map((bg) => {
                const r = ratio(fg, bg, theme);
                return (
                  <div className="contrast-cell" key={`${fg}-${bg}`} style={{ "--fg": varOf(fg), "--bg": varOf(bg) } as CSSProperties}>
                    <span className="contrast-sample">가Aa</span>
                    <span className={`contrast-ratio${r < min ? " is-fail" : ""}`}>{`${r.toFixed(2)}:1`}</span>
                  </div>
                );
              }),
            ])}
          </div>
        )}
      </ThemePair>
    </Section>
  );
}

const wave = (k: number) => {
  let y = 24 + k * 13;
  return Array.from({ length: 21 }, (_, i) => {
    y += Math.sin(i * 0.9 + k * 1.7) * 6;
    return `${i ? "L" : "M"}${i * 20},${y.toFixed(1)}`;
  }).join("");
};
const STATUS_ICON: Record<string, string> = { good: "success", warning: "warning", serious: "alert", critical: "error" };

function Dataviz() {
  const t = useText();
  const series = tokensUnder("color.series");
  return (
    <Section
      id="dataviz"
      count={series.length + tokensUnder("color.sequential").length}
      lede={t(
        "시리즈 색은 고정 순서로 배정하고, 연속형 색은 한 색상의 명도 단계, 상태 색은 아이콘과 라벨을 함께 씁니다.",
        "Series colors apply in a fixed order, sequential colors are lightness steps of one hue, and status colors come with an icon and a label.",
      )}
    >
      <ThemePair>
        {(theme) => (
          <>
            <div className="series-swatches">
              {series.map((token) => {
                const r = ratio(token.path, "color.bg.surface", theme);
                return (
                  <div className="series-swatch" key={token.path}>
                    <span className="swatch" style={sw(varOf(token.path))} />
                    <span>{`series.${last(token.path)}  ${token.values[theme]}`}</span>
                    <span className={r < 3 ? "is-low" : "token-value"}>{t(`표면 대비 ${r.toFixed(2)}:1`, `Surface contrast ${r.toFixed(2)}:1`)}</span>
                  </div>
                );
              })}
            </div>
            <svg className="series-preview" viewBox="0 0 400 140" preserveAspectRatio="none">
              <g className="chart-grid">
                {[20, 60, 100, 136].map((y) => (
                  <line key={y} x1={0} x2={400} y1={y} y2={y} />
                ))}
              </g>
              {series.map((token, k) => (
                <path key={token.path} className="series-line" d={wave(k)} style={paint(token.path)} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>
            <div className="seq-ramp">
              {tokensUnder("color.sequential").map((token) => (
                <span key={token.path} style={sw(varOf(token.path))} />
              ))}
            </div>
            <div className="seq-labels">
              <span>{t("sequential.1 낮음", "sequential.1 low")}</span>
              <span>{t("높음 sequential.7", "high sequential.7")}</span>
            </div>
            <div className="status-list">
              {tokensUnder("color.status").map((token) => (
                <span className="status-item" key={token.path}>
                  <span className="dot" style={sw(varOf(token.path))}>
                    <Icon name={STATUS_ICON[last(token.path)] ?? "info"} size="sm" />
                  </span>
                  <span>{last(token.path)}</span>
                </span>
              ))}
              <span className="status-item">
                <Delta change={0.031} />
                delta.good
              </span>
              <span className="status-item">
                <Delta change={-0.024} />
                delta.bad
              </span>
            </div>
          </>
        )}
      </ThemePair>
    </Section>
  );
}

const SAMPLE: Record<string, Pair> = {
  caption: ["보조 설명과 축 라벨 0123456789", "Supporting text and axis labels 0123456789"],
  label: ["컨트롤과 표 텍스트 0123456789", "Control and table text 0123456789"],
  body: ["본문은 이 크기로 읽힙니다. 다람쥐 헌 쳇바퀴에 타고파.", "Body text reads at this size. The quick brown fox jumps over the lazy dog."],
  title: ["위젯과 섹션 제목", "Widget and section titles"],
  heading: ["페이지 제목", "Page title"],
  stat: ["47.1만 ₩38.1억", "471K ₩3.81B"],
  display: ["182ms", "182ms"],
};
const STRONG = ["title", "heading", "stat", "display"];

function Typography() {
  const t = useText();
  const sizes = tokensUnder("font.size");
  return (
    <Section
      id="type"
      count={sizes.length}
      lede={t(
        "글자 크기는 용도(medium)마다 다릅니다. 같은 이름을 앱·문서·슬라이드에서 각각 렌더링합니다.",
        "Font size differs per medium. Each name renders once in the app, doc and slide media.",
      )}
    >
      {modes.medium.map((medium) => (
        <div className="medium-panel" data-medium={medium} key={medium}>
          <div className="panel-label">{`${t(...MEDIUM_LABEL[medium])} · ${media[medium]}`}</div>
          {sizes.map((token) => (
            <div className="specimen" key={token.path}>
              <span className="specimen-meta">{`${last(token.path)} · ${token.values[medium]}`}</span>
              <span className="specimen-text" style={{ fontSize: varOf(token.path), fontWeight: STRONG.includes(last(token.path)) ? "var(--font-weight-semibold)" : undefined }}>
                {t(...(SAMPLE[last(token.path)] ?? ["가나다 Aa 123", "Abc Aa 123"]))}
              </span>
            </div>
          ))}
          <div className="specimen">
            <span className="specimen-meta">line-height</span>
            <span className="specimen-meta">{tokensUnder("line-height").map((token) => `${last(token.path)} ${token.values[medium]}`).join(" · ")}</span>
          </div>
        </div>
      ))}
    </Section>
  );
}

function Spacing() {
  const t = useText();
  const space = tokensUnder("space");
  const perMedium = catalog.filter((token) => token.layer === "medium" && token.type === "dimension" && !token.path.startsWith("font."));
  return (
    <Section
      id="space"
      count={space.length + perMedium.length}
      lede={t("4px 격자 위의 간격 스케일과, 용도마다 달라지는 레이아웃 치수입니다.", "The spacing scale on a 4px grid, and the layout dimensions that change per medium.")}
    >
      <div className="review-card">
        {space.map((token) => (
          <div className="measure-row" key={token.path}>
            <span className="token-name">{token.name}</span>
            <span className="measure-bar" style={{ "--size": varOf(token.path) } as CSSProperties} />
            <span className="measure-value">{token.values.all}</span>
          </div>
        ))}
      </div>
      <div className="review-card" style={{ marginTop: "var(--layout-gap)" }}>
        <table className="mode-table">
          <thead>
            <tr>
              <th>{t("토큰", "Token")}</th>
              {modes.medium.map((m) => (
                <th key={m}>{t(...MEDIUM_LABEL[m])}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...perMedium, ...tokensUnder("line-height")].map((token) => (
              <tr key={token.path}>
                <td>{token.name}</td>
                {modes.medium.map((m) => (
                  <td key={m}>{token.values[m]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

function Shape() {
  const t = useText();
  const radius = tokensUnder("radius");
  return (
    <Section
      id="shape"
      count={radius.length + tokensUnder("elevation").length}
      lede={t("모서리 반경과 높이(그림자)입니다. 그림자 색은 테마를 따릅니다.", "Corner radius and elevation (shadow). The shadow color follows the theme.")}
    >
      <div className="review-card shape-grid">
        {radius.map((token) => (
          <div className="shape" key={token.path}>
            <div className="shape-box" style={{ "--r": varOf(token.path) } as CSSProperties} />
            <span className="token-name">{`${token.name} · ${token.values.all}`}</span>
          </div>
        ))}
      </div>
      <div style={{ marginTop: "var(--layout-gap)" }}>
        <ThemePair>
          {() => (
            <div className="shape-grid">
              {tokensUnder("elevation").map((token) => (
                <div className="shape" key={token.path}>
                  <div className="shape-box" style={{ "--r": "var(--radius-card)", "--e": varOf(token.path) } as CSSProperties} />
                  <span className="token-name">{token.name}</span>
                </div>
              ))}
            </div>
          )}
        </ThemePair>
      </div>
    </Section>
  );
}

const LINE = "M12,52 L52,30 L92,40 L132,18 L188,28";
const SLOT1 = paint("color.series.1");

function Specimen({ caption, children }: { caption: string; children: ReactNode }) {
  return (
    <div className="mark">
      <svg viewBox="0 0 200 72">{children}</svg>
      <span className="token-name">{caption}</span>
    </div>
  );
}

function Marks() {
  const t = useText();
  const w = px("chart.bar.max");
  const r = px("chart.bar.radius");
  const gap = px("chart.gap");
  const hit = px("chart.hit");
  const bar = (x: number, h: number) => {
    const top = 64 - h;
    return `M${x},64V${top + r}A${r},${r} 0 0 1 ${x + r},${top}H${x + w - r}A${r},${r} 0 0 1 ${x + w},${top + r}V64Z`;
  };
  const segments = [
    [1, 20],
    [2, 16],
    [3, 22],
  ].reduce<{ x: number; slot: number; w: number }[]>((acc, [slot, width]) => {
    const prev = acc[acc.length - 1];
    return [...acc, { x: prev ? prev.x + prev.w + gap : 24, slot, w: width * 2 }];
  }, []);
  return (
    <Section
      id="marks"
      count={tokensUnder("chart").length}
      lede={t(
        "모든 차트가 공유하는 마크 규격입니다. 굵기, 막대 폭, 마커 링, 간격, 히트 영역이 토큰으로 고정됩니다.",
        "The mark specs every chart shares. Tokens fix the stroke width, bar width, marker ring, gap and hit area.",
      )}
    >
      <div className="review-card mark-grid">
        <Specimen caption={`chart.stroke.line · ${all("chart.stroke.line")}`}>
          <path className="series-line" d={LINE} style={SLOT1} />
        </Specimen>
        <Specimen caption={`chart.stroke.hairline · ${all("chart.stroke.hairline")}`}>
          <g className="chart-grid">
            {[16, 36, 56].map((y) => (
              <line key={y} x1={12} x2={188} y1={y} y2={y} />
            ))}
          </g>
        </Specimen>
        <Specimen caption={`chart.bar.max · ${all("chart.bar.max")} / radius ${all("chart.bar.radius")}`}>
          {[
            [40, 44],
            [88, 30],
            [136, 52],
          ].map(([x, h]) => (
            <path key={x} className="chart-bar" d={bar(x, h)} style={SLOT1} />
          ))}
        </Specimen>
        <Specimen caption={`chart.marker.radius · ${all("chart.marker.radius")} + ring ${all("chart.marker.ring")}`}>
          <path className="series-line" d="M12,40 L188,40" style={paint("color.series.2")} />
          <circle className="series-dot" cx={100} cy={40} style={SLOT1} />
        </Specimen>
        <Specimen caption={`chart.area.opacity · ${all("chart.area.opacity")}`}>
          <path className="series-area" d={`${LINE} L188,64 L12,64Z`} style={SLOT1} />
          <path className="series-line" d={LINE} style={SLOT1} />
        </Specimen>
        <Specimen caption={`chart.gap · ${all("chart.gap")}`}>
          {segments.map((s) => (
            <rect key={s.slot} x={s.x} y={24} width={s.w} height={24} style={{ fill: varOf(`color.series.${s.slot}`) }} />
          ))}
        </Specimen>
        <Specimen caption={`chart.hit · ${all("chart.hit")}`}>
          <rect className="hit" x={100 - hit / 2} y={40 - hit / 2} width={hit} height={hit} rx={4} />
          <circle className="series-dot" cx={100} cy={40} style={SLOT1} />
        </Specimen>
      </div>
    </Section>
  );
}

function MotionRow({ token, easing }: { token: Token; easing: string }) {
  const t = useText();
  const track = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLSpanElement>(null);
  const forward = useRef(true);
  const play = () => {
    if (!track.current || !dot.current) return;
    const distance = track.current.clientWidth - dot.current.offsetWidth - 8;
    const frames = [{ transform: "translateX(0)" }, { transform: `translateX(${distance}px)` }];
    dot.current.animate(forward.current ? frames : frames.reverse(), { duration: parseFloat(token.values.all), easing, fill: "forwards" });
    forward.current = !forward.current;
  };
  return (
    <div className="motion-row">
      <span className="token-name">{`${token.name} · ${token.values.all}`}</span>
      <div className="motion-track" ref={track}>
        <span className="motion-dot" ref={dot} />
      </div>
      <button type="button" className="button" onClick={play}>
        {t("재생", "Play")}
      </button>
    </div>
  );
}

function Motion() {
  const t = useText();
  const durations = tokensUnder("motion.duration");
  const easing = all("motion.easing.standard");
  return (
    <Section
      id="motion"
      count={durations.length + 1}
      lede={t(`전환에 쓰는 시간과 가속 곡선입니다. 곡선은 ${easing}입니다.`, `The durations and easing curve for transitions. The curve is ${easing}.`)}
    >
      <div className="review-card">
        {durations.map((token) => (
          <MotionRow key={token.path} token={token} easing={easing} />
        ))}
      </div>
    </Section>
  );
}

const searchable = (t: Token) =>
  [t.name, t.path, t.type, ...Object.values(t.values), ...Object.values(t.chains).flat(), t.description ?? "", groups[groupOf(t.path)] ?? ""].join(" ").toLowerCase();
const modeName = (t: Text, mode: string) => {
  const pair = THEME_LABEL[mode] ?? MEDIUM_LABEL[mode];
  return pair ? t(...pair) : (LANG_LABEL[mode] ?? mode);
};

function AllTokens() {
  const copy = useCopy();
  const t = useText();
  const [query, setQuery] = useState("");
  const [layer, setLayer] = useState("all");
  const needle = query.trim().toLowerCase();
  const rows = catalog.filter((token) => layer === "all" || token.layer === layer).filter((token) => !needle || searchable(token).includes(needle));
  return (
    <Section id="all" count={catalog.length} lede={t("이름·값·참조로 검색합니다. 이름을 누르면 var()가 복사됩니다.", "Search by name, value or reference. Click a name to copy its var().")}>
      <div className="table-tools">
        <input
          className="search"
          type="search"
          placeholder={t("예: series, surface, 16px, neutral.900", "e.g. series, surface, 16px, neutral.900")}
          aria-label={t("토큰 검색", "Search tokens")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Segmented
          label={t("계층", "Layer")}
          value={layer}
          onChange={setLayer}
          options={Object.entries({ all: ["전체", "All"] as Pair, ...LAYER_LABEL }).map(([value, label]) => ({ value, label: t(...label) }))}
        />
      </div>
      <div className="all-tokens">
        <table className="data-table">
          <thead>
            <tr>
              {[t("이름", "Name"), t("타입", "Type"), t("계층", "Layer"), t("값", "Value"), t("참조", "References"), t("설명", "Description")].map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((token) => (
              <tr key={token.path}>
                <td>
                  <button type="button" className="copy-name" onClick={() => copy(token.path)}>
                    {token.name}
                  </button>
                </td>
                <td>{token.type}</td>
                <td>{t(...LAYER_LABEL[token.layer])}</td>
                <td>
                  <div className="mode-values">
                    {Object.entries(token.values).map(([mode, value]) => (
                      <span className="mode-value" key={mode}>
                        {mode !== "all" && <em>{modeName(t, mode)}</em>}
                        {token.type === "color" && <span className="swatch" style={sw(value)} />}
                        <span>{value}</span>
                      </span>
                    ))}
                  </div>
                </td>
                <td className="token-chain">{[...new Set(Object.values(token.chains).map((c) => c.join(" → ")))].filter(Boolean).join(" / ")}</td>
                <td>{token.description ?? groups[groupOf(token.path)] ?? ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Section>
  );
}

export const reviewOutline = (lang: Lang) => {
  const t = translator(lang);
  return Object.entries(OUTLINE).map(([id, title]) => ({ id: `theme-${id}`, title: t(...title) }));
};

export function TokenReview({ lang }: { lang: Lang }) {
  return (
    <LangContext value={lang}>
      <Summary />
      <Primitives />
      <Semantic />
      <Contrast />
      <Dataviz />
      <Typography />
      <Spacing />
      <Shape />
      <Marks />
      <Motion />
      <AllTokens />
    </LangContext>
  );
}
