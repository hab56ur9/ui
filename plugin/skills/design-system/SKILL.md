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
https://hab56ur9.github.io/ui/dist/tokens.css
https://hab56ur9.github.io/ui/dist/tokens.json
```

## React apps

An interactive page is a React app that installs the package from GitHub. React and react-dom are the only runtime libraries; the package ships its TSX source, so the app's bundler compiles it (Vite needs nothing, Next.js lists ui in transpilePackages). The entry imports the token stylesheet and wraps the tree in UIProvider, which hosts toasts and confirms and sets the component language.

```bash
npm install github:hab56ur9/ui react react-dom
```

```tsx
import "ui/tokens.css";
import { UIProvider } from "ui";

createRoot(root).render(
  <UIProvider lang="ko">
    <App />
  </UIProvider>,
);
```

## HTML pages

A page without React, such as a technical document or a deck, links the token stylesheet and the component stylesheet and uses the CSS classes directly: button, segmented, data-table, page, toolbar. Charts and overlays need React.

```html
<html lang="ko" data-medium="doc">
<link rel="stylesheet" href="https://hab56ur9.github.io/ui/dist/tokens.css">
<link rel="stylesheet" href="https://hab56ur9.github.io/ui/dist/ui.css">
```

## Modes

The page sets its medium on the root element: app for dense tools and dashboards, doc for long-form technical pages, and slide for projected decks. The theme follows the system unless the page sets data-theme. The language comes from the lang attribute: ko picks the Hangul font stack and en the Latin one, and a nested element with its own lang switches fonts for that element. Every color, size and space is a var(--*) token.

## Snapshot outputs

A snapshot is any output that cannot load a stylesheet: a pptx, a claude.ai Artifact, an image, a PDF. It inlines resolved values from tokens.json for one theme and one medium, and records the tokens version so a later rebuild can spot drift.

## Interactive dashboards

Components take props only. Data points are { t, v }, color is a series slot or a token name, and format holds the axis, value and date formatters. Charts measure their parent and redraw on resize, so they sit inside a parent with a height. Dashboards are widget boards: each widget is a Widget tag with an id, title, subtitle, default size in grid columns and rows and, for charts, a table function, wrapped around an existing component. Board draws the add-widget menu and the layout reset and stores nothing itself: it takes initialLayout from the app; onLayoutCommit fires once with the final layout after changes settle, and the app saves it wherever it keeps layouts; the board supplies drag to reorder, corner resize snapped to the grid, keyboard move and resize, and hide with an undo toast. useDisplay with DisplaySwitch holds the theme and medium switches; it takes starting values and reports changes, and the app remembers them. AppShell frames an app with a sidebar and a top bar. A new dashboard starts from the closest block and swaps in its own widgets. For server-driven UI, start from the sdui-fitness block: a registry maps JSON node types to components, values come through $data keys, and actions leave as named events.

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

A technical document is HTML. Doc holds the header, contents and numbered sections with the doc medium tokens, and prints only itself on A4 portrait. The summary states the conclusion in one sentence, requirements live in a RequirementTable and the design refers to them with Ref, alternatives go in Options, and open questions get their own section. A design doc starts from the design-doc example; a question-driven proposal starts from the rfc example, one Problem and one Solution paragraph per question.

## Chart rules

- Series take color slots 1 to 8 in fixed order and keep their slot when filters change.
- One y-axis per chart; compare different units by indexing to 100.
- Two or more series get a legend, plus direct end labels while they do not collide.
- One series that carries the story uses chart.emphasis; its comparison uses chart.de-emphasis.
- Every chart widget offers a table view; tooltips list every series at the hovered date.
- Status colors mean state only and always travel with an icon and a label.
- Text uses fg tokens; series colors belong to marks.

## Check

The lint rejects raw color literals and local machine paths. Run it from a clone of the repository, on the repository itself or on any page built elsewhere. After a token change, open the token review page; its summary lists contrast failures and unused primitives.

```bash
npm run check
node scripts/lint.mjs path/to/page.html
https://hab56ur9.github.io/ui/#/theme
```
