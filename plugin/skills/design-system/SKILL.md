---
name: design-system
description: Builds any page, widget dashboard, technical document or deck on the ui design system so every output shares one look and follows token updates. Invoke on "디자인 토큰으로 만들어", "토큰 써서", "위젯 보드", "대시보드 만들어", "기술 문서 페이지", "슬라이드 토큰", or "design tokens".
user-invocable: true
---

# ui Design System

The token set is the single source of every color, size, space and chart spec. The repository github.com/hab56ur9/ui holds the token source, the built CSS, the resolved JSON snapshot, React components, ready-made blocks and a docs site, and GitHub Pages publishes the docs site as one page at each release; blocks render inside its Blocks tab. Read the docs and a block first; together they are the canonical answer to "how should this look".

```text
https://hab56ur9.github.io/ui/
https://hab56ur9.github.io/ui/#/blocks
https://hab56ur9.github.io/ui/dist/tokens.json
```

## React apps

An interactive page is a React app that installs the package from GitHub. React and react-dom are the only runtime libraries; the package ships its TSX source, so the app's bundler compiles it (Vite needs nothing, Next.js lists ui in transpilePackages). The entry wraps the tree in UIProvider and passes one theme constant. UIProvider loads every stylesheet, applies the theme, hosts toasts and confirms and sets the component language. The app imports no CSS from ui and never reads tokens; it knows only component props.

```bash
npm install github:hab56ur9/ui react react-dom
```

```tsx
import { UIProvider, themes } from "ui";

createRoot(root).render(
  <UIProvider theme={themes.sky.minimal} lang="en">
    <App />
  </UIProvider>,
);
```

## HTML pages

A page without a bundler imports the component module in one line. The module carries React, loads the stylesheets, presets and styles itself, and exports every component together with render, h, Fragment, useState, useEffect, useMemo, useRef, useI18n (lang, locale and text for the current language), useToast, useConfirm, iconNames and DAY (one day in milliseconds). render(target, node, { theme, lang }) already wraps the tree in UIProvider, so toasts and confirms work without adding one; theme is required and comes from themes, and lang sets the component language.

```html
<div id="app"></div>
<script type="module">
  import { render, h, themes, Button } from "https://hab56ur9.github.io/ui/dist/ui.js";
  render("#app", h(Button, { variant: "primary" }, "Save"), { theme: themes.sky.minimal });
</script>
```

A page made for review shows the one theme the product ships. The reviewer checks dark mode by switching the system setting.

Blocks and examples are written in JSX; their source is at https://github.com/hab56ur9/ui/tree/master/src/blocks. In an HTML page, write `<Widget id="a" w={3} h={2}>{child}</Widget>` as `h(Widget, { id: "a", w: 3, h: 2 }, child)` and a fragment as `h(Fragment, null, …)`. To capture a page in one theme, set `data-theme="light"` or `"dark"` on the html element.

Every page draws with components, so it never names a CSS class or a token. Layout comes from Page, WidgetGrid, Stack, Row and CardGrid; a list of choices in a Sheet is an ActionList.

## Modes

Templates set the medium: Doc, Resume and Portfolio use doc, Deck uses slide, and everything else uses app. Dark mode follows the system setting. The language comes from the lang option or attribute: ko picks the Hangul font stack and en the Latin one.

The look comes from the theme constant alone, `themes.<preset>.<style>`. The preset picks the brand colors (lime, sky, mono). The style picks the design language: minimal is the default; expressive uses large radii and an overshooting entrance; brutal uses square corners, thick borders and hard offset shadows. A style changes shape, border, focus ring, elevation, floating-surface material and motion, never color. The app picks one constant at its root and cannot change part of it.

When a page needs a part that no component covers, the part is added to ui as a component first, and the page then uses it.

## Component reference

Every exported component and its props are listed in https://hab56ur9.github.io/ui/dist/components.json (name, required flag, kind and TypeScript type of each prop). Each component also has a docs page at https://hab56ur9.github.io/ui/#/<page> whose last section is an API table with types, defaults and meaning; the same tables are plain source at https://github.com/hab56ur9/ui/blob/master/src/site/api.en.ts for readers that cannot run the site's scripts. These are the props a dashboard needs most; a star marks a required prop.

| Component | Props |
| --- | --- |
| AppShell | brand*, nav* (groups of { title?, items: { id, label, icon?, href?, onSelect?, current?, sub? }[] }), navHeader, title, actions, aside, scroll ("frame" scrolls inside the shell, "page" scrolls the document; use "page" when the page should print or be captured whole), mobileNav, tabBar |
| Page | title, lede, actions (any number of buttons; they line up at the right), children* |
| Board | initialLayout, onLayoutChange (every move, for live mirrors), onLayoutCommit (once after changes settle; save from this one), commitDelay, toolbar, actions, busy |
| Widget | id*, title*, subtitle, w* (1–12 columns), h* (rows of 72px in the app medium; the height is fixed, so a DataTable widget with n rows needs h = ceil((n + 1) / 2) + 1, which can leave up to one row of space; charts read well at h 4–5 and a widget fits about two Meters per row of h), minW, minH, maxH, table (returns DataTable props { columns, rows } for the table view), frame ("card" or "plain") |
| Stat | label, value*, delta ({ change: ratio, goodWhenUp?, neutral?, label }; neutral for values such as spend whose rise is neither good nor bad), note, trend (Point[]), color, size |
| Meter | label*, value*, max (100), target, format, status ("good" reads On track, "warning" At risk, "critical" Off track; the page decides the rule, for example warning when pacing drifts more than 10% from plan and critical when the projection overspends or underspends the budget beyond the page's tolerance; the status label and icon come with it, so note says something else, such as the projection), note; use it for budget spent, quota and goal progress; consecutive meters space themselves |
| LineChart | series* ({ name, points, color?, dashed?, area?, flagBreaches? }[]), format ({ axis, value?, date? }), band, threshold ({ value, label, breach, direction?: "above" or "below" }; below for a floor such as a minimum CTR), baseline, annotations, endLabels, categories |
| BarChart | points*, name, color, colorOf, format, categories |
| Heatmap | rows*, columns*, values*, format* ({ value, column?, cell? }), labelEvery, ramp, zeroIsEmpty |
| Sparkline | points*, color |
| DataTable | columns* ({ label, numeric?, wrap?, width? }[]), rows* (cells are strings or { text?, content?, color?, swatch?, delta?, render? }), fit |
| Badge | children*, tone ("neutral", "main", "good", "warning", "critical"), variant ("soft", "solid", "outline") |
| Callout | children*, tone ("info", "good", "warning", "critical", "do", "dont"), accent ("left", "top"), title |
| ActionList | items* ({ id, label }[]), onSelect* ((id) => void); full-width choices, usually inside a Sheet |
| Option (inside Options) | name*, chosen (decided) or recommended (still open), children of Pros and Cons |
| Segmented | options* ({ value, label }[]), value or defaultValue, label*, onChange |
| Tabs | items* ({ id, label }[]), value or defaultValue, onChange, variant ("line", "pill") |
| WidgetGrid | children* (Widgets), flow (stacks plain full-width widgets as document sections; leave it out for a grid) |
| Stack | children* (stacked vertically with the standard gap; a chart child takes the remaining height) |
| RequirementTable | items* ({ text, priority: "must", "should" or "could", status?: "open", "done" or "dropped", note? }[]), prefix ("R" by default, "F" or "A" for other tables); the status column appears only when an item has a status |
| Phone · Browser | Phone: scale, children; Browser: address*, width, height (number or "auto"), children. Both screens use the app medium, so widgets inside size as in an app |

Time series are { t, v } with t as a millisecond timestamp in local time. A color is a series slot number or a token path such as "chart.emphasis". Format numbers with the locale from useI18n so they follow the page language; useI18n is a hook, so call it inside a component and pass formatters down. A category axis passes categories (string[]) and uses the index as t. Numbers are formatted by the page with Intl.NumberFormat; compact Korean amounts read better with useGrouping: "always" (₩9,542.5만, not ₩9542.5만).

## Product specs

A product requirements document (PRD) is a Doc page whose screens and behavior are specified together, so it starts from the prd example. Screens are drawn with real components inside Phone or Browser frames. Phone takes scale (0.5 fits three phones across a document) and holds a Stack of components, which gets the screen's inner padding; a Badge or a Button that should not stretch goes in a Card's aside or a Row. Browser takes address, width (the desktop width it scales down from, such as 1200) and height (a number, or "auto" to fit the content); an app screen inside it is a Page with a WidgetGrid. In print, browser frames drop their scaling and reflow to the page width, and figures and frames do not split across pages. Name each screen (S1, S2, O1) in the figure caption. The behavior spec is a RequirementTable whose items read "condition → result" and name the screen; the text refers to them with Ref, which also reaches tables with another prefix such as F for fraud rules or A for advertiser rules. Leave status out for a requirement that has no state yet. States and tracked events are DataTables: an empty state is an info Callout with the next step, an error is a critical Callout with a retry Button, and a pending state is a Badge or Callout that says what is being checked. Decisions still open go in Options without chosen; mark the preferred one recommended.

```tsx
<Figure caption="User screens: list (S1), detail (S2)">
  <Row>
    <Phone scale={0.5}>
      <Stack>…</Stack>
    </Phone>
  </Row>
</Figure>
<RequirementTable items={[{ text: "Tapping an offer on S1 → opens S2 and records a detail view.", priority: "must" }]} />
```

## Snapshot outputs

A snapshot is any output that cannot load a stylesheet: a pptx, a claude.ai Artifact, an image, a PDF. It inlines resolved values from tokens.json for one theme and one medium, and records the tokens version so a later rebuild can spot drift.

## Interactive dashboards

Components take props only. Data points are { t, v }, color is a series slot or a token name, and format holds the axis, value and date formatters. Charts measure their parent and redraw on resize, so they sit inside a parent with a height. Dashboards are widget boards: each widget is a Widget tag with an id, title, subtitle, default size in grid columns and rows and, for charts, a table function, wrapped around an existing component. Board draws the add-widget menu and the layout reset and stores nothing itself: it takes initialLayout from the app; onLayoutCommit fires once with the final layout after changes settle, and the app saves it wherever it keeps layouts; the board supplies drag to reorder, corner resize snapped to the grid, keyboard move and resize, and hide with an undo toast. useDisplay with DisplaySwitch holds the theme and medium switches; it takes starting values and reports changes, and the app remembers them. AppShell frames an app with a sidebar and a top bar. A new dashboard starts from the dashboard-01 block (https://github.com/hab56ur9/ui/tree/master/src/blocks/dashboard-01) and swaps in its own widgets; a mobile one starts from dashboard-mobile.

```tsx
<Board initialLayout={saved} onLayoutCommit={save} toolbar={<Segmented label="Period" value={range} onChange={setRange} options={ranges} />}>
  <Widget id="users" title="Active users" w={8} h={5} table={() => tableOf(series)}>
    <LineChart series={[{ name, color: 1, points }]} format={{ axis }} />
  </Widget>
  <Widget id="revenue" title="Revenue" w={4} h={2}>
    <Stat value={value} delta={{ change, label }} />
  </Widget>
</Board>
const ok = await confirm({ title, description, confirmLabel, danger: true });
```

Toasts and confirms come from hooks: `const toast = useToast(); toast({ message, status, action: { label, onClick }, duration })` with status info, good, warning or critical, and `const confirm = useConfirm(); const ok = await confirm({ title, description, confirmLabel, danger })`. Icons are named; iconNames lists them: alert, arrow-down, arrow-up, bell, bookmark, calendar, chart-bar, chart-line, check, chevron-down, chevron-left, chevron-right, chevron-up, clock, close, compass, copy, download, error, expand, external, eye, eye-off, filter, globe, grid, grip, heart, home, image, info, link, menu, message, minus, monitor, moon, more, phone, plus, printer, refresh, resize, search, send, sliders, success, sun, table, tablet, trash, trend-down, trend-up, undo, user, warning.

Shared overlays follow one rule set. A destructive action asks through useConfirm, whose cancel button holds focus, and a reversible action reports through useToast with an undo action. Modal and Sheet are controlled by open and onClose; narrow screens use a Sheet where wide screens use a menu. Component text such as Cancel or Close follows the provider language; the page supplies only its own sentences. Icons come from the Icon component, or an svg use element points at dist/icons.svg; icons take the surrounding text color.

## Slides

A deck is HTML. Deck holds the slides on a 1920×1080 canvas with the slide medium tokens, arrow-key paging, a presenter view, speaker notes and a print button whose dialog saves a PDF with one page per slide. Each slide carries a title and a one-line Takeaway that states the conclusion, and number or chart slides cite a source. A new deck starts from the monthly-review example and uses the twelve layouts before composing a custom Slide.

```tsx
<Deck title="Monthly review">
  <TitleSlide kicker="Acme · November" title="Monthly review" subtitle="Last 30 days" />
  <MetricSlide title="Month in brief" takeaway="Users and revenue rose together." metrics={[{ label, value, delta: { change, label } }]} source="Source: …" />
  <ChartSlide title="Active users" takeaway="iOS grew fastest."><LineChart series={series} /></ChartSlide>
  <Slide><SlideHeader title="Next steps" /><Steps items={steps} /></Slide>
</Deck>
```

## Tech docs

A technical document is HTML. Doc holds the header, contents and numbered sections with the doc medium tokens, and prints only itself on A4 portrait through its print button. Its meta takes status (draft, review, final), authors, reviewers, date and version, each optional. Steps fits four items across a document column; use TextList ordered for longer sequences. The summary states the conclusion in one sentence, requirements live in a RequirementTable and the design refers to them with Ref, alternatives go in Options, and open questions get their own section. A design doc starts from the design-doc example; a question-driven proposal starts from the rfc example, one Problem and one Solution paragraph per question.

## Reference pages

A guide, reference or how-to page uses the parts the documentation site is built from, so it looks like the site. Article holds the eyebrow, title, lede and a Pager; each topic is an ArticleSection with an id and a title. Inside a section, Paragraphs and TextList take strings where backticks become code, CardGrid lines up Cards, Anatomy numbers the parts of a thing, Guidelines pairs do and don't, Example shows a live preview with a code tab and a copy button, CopyCode shows code to copy, PropsTable lists props as name, type, default and description, and TokenTable lists tokens with their values per mode. AppShell with Toc in its aside gives the site's frame.

```tsx
<Article eyebrow="Inputs" title="Button" lede="A button runs an action. Make only the most important action primary." pager={<Pager previous={prev} next={next} />}>
  <ArticleSection id="basic" title="Basic">
    <Example layout="centered" files={[{ name: "button.tsx", code }]}>
      <Row>
        <Button>Cancel</Button>
        <Button variant="primary">Save</Button>
      </Row>
    </Example>
  </ArticleSection>
  <ArticleSection id="kinds" title="Kinds">
    <Anatomy items={[["Secondary `.button`", "Most actions."], ["Primary `.is-primary`", "The one key action."]]} />
  </ArticleSection>
  <ArticleSection id="api" title="API">
    <PropsTable rows={[["variant", "\"primary\" | \"secondary\" | \"danger\"", "\"secondary\"", "Look of the button."]]} />
  </ArticleSection>
</Article>
```

## Chart rules

- Series take color slots 1 to 8 in fixed order and keep their slot when filters change. A single series uses slot 1, in every chart that has one, and series of equal weight take slots in order.
- Axis formats carry enough precision that ticks never repeat (1.25% and 1.30%, not 1.3% twice).
- One y-axis per chart; compare different units by indexing to 100.
- Two or more series get a legend, plus direct end labels while they do not collide.
- One series that carries the story uses chart.emphasis; its comparison uses chart.de-emphasis.
- Every chart widget offers a table view; tooltips list every series at the hovered date.
- Status colors mean state only and always travel with a second cue: a Badge's dot plus its label is enough; Meter and alerts add an icon.
- Text uses fg tokens; series colors belong to marks.

## Check

The lint rejects raw color literals and local machine paths. Run it on any page with the CLI, which works without a clone; inside a clone, the repository's own lint covers the source. After a token change, open the token review page; its summary lists contrast failures and unused primitives.

```bash
npm run check
npx --yes github:hab56ur9/ui lint path/to/page.html
https://hab56ur9.github.io/ui/#/theme
```
