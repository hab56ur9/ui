import type { Section } from "./pages";

const POINTS = "Point[]";
const COLOR = "number | string";
const COLOR_NOTE = "A number is a series slot (1–8), and a string is a token name (`\"chart.emphasis\"`).";
const DIALOG_PROPS = [
  ["open", "boolean", "", "The open state. The parent holds it."],
  ["onClose", "(value: V | null) => void", "", "Called with the button's `value`, or with `null` on Esc, an outside click, the close button or a drag down."],
  ["title", "string", "", "The dialog title."],
  ["description", "string", "", "One or two sentences below the title."],
  ["children", "ReactNode", "", "The body. A string is wrapped in a paragraph."],
  ["actions", "{ label, value?, variant?, autoFocus? }[]", "[]", "The bottom buttons. When `value` is omitted, `label` is the result. `variant` is `secondary` · `primary` · `danger`."],
  ["dismissible", "boolean", "true", "Whether Esc, an outside click, the close button or dragging a sheet down closes the dialog."],
];

export const api: Record<string, Section[]> = {
  "getting-started": [
    {
      type: "api",
      title: "Common rules",
      description: "Every component is a React component that takes only props. Charts measure their parent and redraw themselves, so place them inside a parent with a height.",
      rows: [
        ["points", POINTS, "", "Time series data. In `{ t, v }`, `t` is the time (ms) and `v` is the value."],
        ["color", COLOR, "", COLOR_NOTE],
        ["format", "{ axis?, value?, date? }", "", "Formats for axis ticks, tooltip and label values, and dates. When `value` is omitted, `axis` applies."],
        ["name · label · title", "string", "", "`name` is the data name (legend), `label` is the visible text, and `title` is the component's accessible name."],
      ],
    },
    {
      type: "api",
      title: "UIProvider",
      description: "Provides the place where toasts and confirm dialogs open, and the language. Place it once at the app root.",
      rows: [
        ["lang", "string", "<html lang>", "The language of built-in component text (Close, Cancel and so on) and of date and number formats. Languages outside the table fall back to `ko`."],
        ["useToast()", "(props) => ToastHandle", "", "Returns a function that opens a toast."],
        ["useConfirm()", "(props) => Promise<boolean>", "", "Returns a function that opens a confirm dialog and waits for the result."],
        ["useI18n()", "{ lang, locale, text }", "", "Returns the current language and the language tag to pass to `Intl`."],
      ],
    },
    {
      type: "api",
      title: "Helpers",
      rows: [
        ["color(value)", "string", "", "Converts a `color` prop into a CSS value."],
        ["DAY", "number", "86400000", "One day (ms)."],
      ],
    },
  ],
  button: [
    {
      type: "api",
      title: "<Button>",
      description: "All other props pass through to `<button>`.",
      rows: [
        ["variant", '"secondary" | "primary" | "danger"', '"secondary"', "The button variant."],
        ["icon", "IconName", "", "An `sm` icon placed before the text."],
      ],
    },
  ],
  stat: [
    {
      type: "api",
      title: "<Stat>",
      rows: [
        ["label", "ReactNode", "", "A label above the value. Leave it out inside a widget, whose title bar names it."],
        ["value", "ReactNode", "", "The formatted large value."],
        ["delta", "{ change, goodWhenUp?, label }", "", "`change` is a ratio (0.063 = 6.3%). By default a rise is good."],
        ["note", "string", "", "A supporting line below the value."],
        ["trend", POINTS, "", "Draws a sparkline when present."],
        ["color", COLOR, "1", "The color of the sparkline's last point."],
      ],
    },
    {
      type: "api",
      title: "<Delta>",
      rows: [
        ["change", "number", "", "A ratio (0.063 = 6.3%). An up or down arrow icon follows its sign."],
        ["goodWhenUp", "boolean", "true", "When `false`, a fall takes the good color."],
      ],
    },
  ],
  segmented: [
    {
      type: "api",
      title: "<Segmented>",
      description: "With `value` the parent holds the state, and with only `defaultValue` the component holds it.",
      rows: [
        ["options", "{ value, label, lang? }[]", "", "The options."],
        ["value · defaultValue", "string", "First option", "The selected value."],
        ["label", "string", "", "The group's accessible name."],
        ["onChange", "(value) => void", "", "Called when another value is picked."],
      ],
    },
  ],
  board: [
    {
      type: "api",
      title: "<Board>",
      description: "Place content wrapped in `<Widget>` tags on the board. The board doesn't know where layouts are stored: it takes one through `initialLayout`, fires `onLayoutChange` on every change and, once changes stop for `commitDelay`, fires `onLayoutCommit` once with the final layout. A pending commit fires right away when the page closes or moves to the background. Where to store, failures and retries are up to the app that listens.",
      rows: [
        ["children", "<Widget>…", "", "The widgets. Their order is the initial layout order."],
        ["initialLayout", "LayoutItem[]", "", "A layout the app loads from anywhere (browser, server) and passes in. It applies even when it arrives late, as long as the user hasn't changed the layout yet, and is ignored when its widget list differs. Without it, widgets follow tag order."],
        ["onLayoutChange", "(layout) => void", "", "Fires with the new layout on every move, resize, hide, add and reset."],
        ["onLayoutCommit", "(layout) => void", "", "Fires once with the final layout after changes stop. Save to a server here."],
        ["commitDelay", "number", "1500", "How long (ms) the board waits after the last change before committing."],
        ["toolbar", "ReactNode", "", "Controls such as filters on the left of the toolbar."],
        ["actions", "boolean", "true", "Draws the add-widget and reset-layout buttons."],
        ["busy", "boolean", "false", "Keeps the previous view translucent while new data loads."],
      ],
    },
    {
      type: "api",
      title: "<Widget>",
      description: "Inside a board it becomes a widget that drags and resizes; outside a board it draws as a titled card.",
      rows: [
        ["id · title", "string", "", "The unique saved name and the title bar title."],
        ["subtitle", "ReactNode", "", "Supporting text next to the title."],
        ["w · h", "number", "", "The initial size, in columns (1–12) and rows."],
        ["minW · minH · maxH", "number", "2 · 2 · 10", "The resize range."],
        ["children", "ReactNode", "", "The body. Charts, stat cards and tables go in as they are."],
        ["table", "() => DataTableProps", "", "When present, a `Table` button appears and shows the same data in a `<DataTable>`."],
      ],
    },
    {
      type: "api",
      title: "useDisplay({ theme?, medium?, mediumSwitch?, onChange? }) · <DisplaySwitch>",
      description: "Two switches that pick the theme and the medium. The chosen values land on `data-theme` and `data-medium` of `<html>`. The app passes the starting values and hears changes through `onChange`; where to remember them is up to the app. With `mediumSwitch: false` the medium stays app and only the theme switch is drawn, as on this docs site.",
      rows: [
        ["theme · setTheme", '"system" | "light" | "dark"', '"system"', "`system` follows the operating system setting."],
        ["medium · setMedium", '"app" | "doc" | "slide"', '"app"', "When the medium changes, `<Board key={display.medium}>` redraws the board."],
        ["<DisplaySwitch display>", "Display", "", "Takes the return value of `useDisplay()` and draws the two switches."],
      ],
    },
    {
      type: "api",
      title: "<AppShell>",
      description: "An app frame with a left sidebar and a top bar. Below 1024px it hides the sidebar, and a menu button in the top bar opens the same list in a drawer that slides in from the left. A tap outside or Esc closes it.",
      rows: [
        ["brand", "ReactNode", "", "The name at the top of the sidebar."],
        ["nav", "{ title?, items: { id, label, icon, current?, onSelect? }[] }[]", "", "Menu groups. The `current` item gets `aria-current`."],
        ["title · actions", "ReactNode", "", "The top bar title and its right-hand buttons."],
        ["children", "ReactNode", "", "The content. Only the content scrolls; the sidebar and top bar stay put."],
        ["mobileNav", "\"drawer\" | \"tabs\"", "\"drawer\"", "The menu below 1024px: `tabs` shows a bottom tab bar, `drawer` a left drawer."],
        ["tabBar", "{ variant?, labels? }", "", "The tab bar's look when `tabs`; same values as `TabBar`."],
      ],
    },
  ],
  "line-chart": [
    {
      type: "api",
      title: "<LineChart>",
      rows: [
        ["series", "{ name, points, color?, dashed?, area?, flagBreaches? }[]", "", `When color is omitted, slots 1, 2, 3 apply in order. ${COLOR_NOTE}`],
        ["format", "{ axis, value?, date? }", "", "Formats for axis ticks, tooltip and end values, and tooltip dates."],
        ["band", "{ name, lower, upper, color? }", "", "Fills between an upper and a lower bound, such as a forecast band."],
        ["threshold", "{ value, label, breach }", "", "The threshold line. It marks breaches in `flagBreaches` series and adds `breach` to the tooltip."],
        ["baseline", "number", "", "The baseline, such as 100 in an index comparison."],
        ["annotations", "{ t, label }[]", "[]", "Marks events with vertical lines. When labels overlap, the later ones are dropped."],
        ["endLabels", "boolean", "true", "Writes the name and last value at the end of each line. Overlapping labels are dropped."],
        ["title", "string", "", "The chart name for screen readers."],
      ],
    },
  ],
  "bar-chart": [
    {
      type: "api",
      title: "<BarChart>",
      rows: [
        ["points", POINTS, "", "The bar data."],
        ["name", "string", "", "The data name in the tooltip."],
        ["color", COLOR, "1", COLOR_NOTE],
        ["colorOf", "(point, index) => Color", "", "The color per bar. Used to highlight only the current period."],
        ["format", "{ axis, value?, date? }", "", "Formats for axis ticks, tooltip values and tooltip dates."],
        ["title", "string", "", "The chart name for screen readers."],
      ],
    },
  ],
  heatmap: [
    {
      type: "api",
      title: "<Heatmap>",
      rows: [
        ["rows · columns", "string[] · C[]", "", "The row labels and the column values."],
        ["values", "(number | null)[][]", "", "`values[row][column]`. `null` cells are not drawn."],
        ["format", "{ value, column?, cell? }", "", "Formats for values, column labels and the tooltip title `(row, col) => string`. An empty column label is omitted."],
        ["labelEvery", "number", "Auto", "The column label interval."],
        ["ramp", '"sequential" | "sequential-main"', '"sequential"', "The token set for the color steps."],
        ["zeroIsEmpty", "boolean", "false", "Treats 0 as 'none' and paints it gray."],
        ["title", "string", "", "The chart name for screen readers."],
      ],
    },
  ],
  sparkline: [
    {
      type: "api",
      title: "<Sparkline>",
      rows: [
        ["points", POINTS, "", "The trend data."],
        ["color", COLOR, "1", "The color of the last value's point. The line is always gray."],
      ],
    },
  ],
  table: [
    {
      type: "api",
      title: "<DataTable>",
      rows: [
        ["columns", "{ label, numeric? }[]", "", "`numeric` columns use right alignment and tabular figures."],
        ["rows", "Cell[][]", "", "A cell is a string or `{ text?, color?, swatch?, className?, delta?, render? }`. `delta` draws a change with an arrow icon, like `<Delta>`. `render` returns an element to place in the cell, such as a sparkline."],
      ],
    },
  ],
  modal: [{ type: "api", title: "<Modal>", rows: [...DIALOG_PROPS, ["size", '"sm" | "md" | "lg"', '"md"', "The modal width."]] }],
  confirm: [
    {
      type: "api",
      title: "useConfirm()(props) → Promise<boolean>",
      rows: [
        ["title · description · body", "", "", "Same as the modal."],
        ["confirmLabel", "string", "'OK' in the page language", "The confirm button text. Write it as a verb that states the result."],
        ["cancelLabel", "string", "'Cancel' in the page language", "The cancel button text. The initial focus sits here."],
        ["danger", "boolean", "false", "Switches the confirm button to the danger color."],
      ],
    },
  ],
  sheet: [{ type: "api", title: "<Sheet>", rows: DIALOG_PROPS }],
  toast: [
    {
      type: "api",
      title: "useToast()(props) → ToastHandle",
      description: "The handle's `update(props)` changes the content, and `dismiss()` closes the toast.",
      rows: [
        ["message", "string", "", "A one-sentence message."],
        ["status", '"info" | "good" | "warning" | "critical"', '"info"', "Changes the icon and the label together. `critical` is read as an alert."],
        ["action", "{ label, onClick? }", "", "A single action, such as Undo. Pressing it closes the toast."],
        ["duration", "number (ms)", "4000 · error 8000", "With 0 the toast stays until closed."],
      ],
    },
  ],
  icons: [
    {
      type: "api",
      title: "<Icon>",
      rows: [
        ["name", "IconName", "", "A file name in `assets/icons`. `iconNames` is the full list."],
        ["size", '"sm" | "md" | "lg"', '"md"', "A size from the `icon.size.*` tokens."],
        ["label", "string", "", "When present, the icon gets `role=img` and a name. Otherwise it counts as decoration and is hidden from screen readers."],
      ],
    },
  ],
  slides: [
    {
      type: "api",
      title: "<Deck>",
      rows: [
        ["title", "string", "", "The deck title. It appears in every footer and names the region for screen readers."],
        ["start", "number", "0", "The slide shown first, counted from 0."],
        ["controls", "boolean", "true", "Shows the next, notes, print and present buttons. Turn it off for one-slide previews."],
        ["children", "ReactNode", "", "`Slide` or layout components, in order."],
      ],
    },
    {
      type: "api",
      title: "<Slide>",
      rows: [
        ["tone", '"plain" | "dark" | "accent"', '"plain"', "The background tone. `dark` uses the dark theme tokens and `accent` the accent fill."],
        ["source", "ReactNode", "", "The source at the bottom left."],
        ["footer", "boolean", "true", "Shows the footer: source, deck title and page number."],
        ["notes", "string", "", "Speaker notes, opened with the notes button of `Deck`."],
      ],
    },
    { type: "api", title: "<SlideHeader>", rows: [["kicker · title · subtitle", "ReactNode", "", "Kicker, title and subtitle."]] },
  ],
  "slide-layouts": [
    {
      type: "api",
      title: "Common",
      description: "Every layout takes `notes` and `source` and draws a `Slide`.",
      rows: [
        ["<TitleSlide>", "kicker · title · subtitle · meta · tone", "", "The cover. It draws no footer."],
        ["<AgendaSlide>", "title · items · current?", "", "The agenda. It highlights item number `current`."],
        ["<SectionSlide>", "number? · title · subtitle? · tone", 'tone "dark"', "A section divider."],
        ["<StatementSlide>", "kicker? · statement · detail? · tone", "", "A one-line message."],
        ["<MetricSlide>", "title · takeaway? · metrics", "", "`metrics` is `{ label, value, delta?, note? }[]`; two to four work best. Each cell draws a large `<Stat>`."],
        ["<ChartSlide>", "title · takeaway? · aside? · children", "", "Put the chart in `children`. `aside` is a 480px column on the right."],
        ["<SplitSlide>", "title · takeaway? · left · right · ratio", '"1:1"', '`ratio` is `"1:1"`, `"2:3"` or `"3:2"`.'],
        ["<CompareSlide>", "title · takeaway? · before · after", "", "`before` and `after` are `{ label, body }`. The right pane (`after`) gets an accent border."],
        ["<TimelineSlide>", "title · takeaway? · items", "", "`items` is `{ date, title, body?, done? }[]`. Finished stages get an accent dot and line."],
        ["<TableSlide>", "title · takeaway? · table", "", "`table` takes the props of `<DataTable>`. About ten rows per slide works best."],
        ["<QuoteSlide>", "quote · by? · role? · tone", "", "A quote and who said it."],
        ["<ClosingSlide>", "title · items? · contact? · tone", 'tone "dark"', "The last slide, with a summary list and contact. It draws no footer."],
      ],
    },
  ],
  "slide-parts": [
    {
      type: "api",
      title: "Parts",
      rows: [
        ["<Takeaway>", "children", "", "One concluding line under the title."],
        ["<Bullets>", "items: (string | { text, items? })[]", "", "A list up to two levels deep. About five lines per slide works best."],
        ["<Steps>", "items: { title, body? }[]", "", "A process joined by numbers and arrows. Three to five steps work best."],
        ["<Callout>", "tone? · title? · children", '"info"', '`tone` is `"info"`, `"warning"` or `"good"`.'],
      ],
    },
  ],
  "doc-frame": [
    {
      type: "api",
      title: "<Doc>",
      rows: [
        ["title · summary", "ReactNode", "", "The title and the one-sentence conclusion."],
        ["meta", "{ status, authors, reviewers?, date, version? }", "", '`status` is `"draft"`, `"review"` or `"final"`.'],
        ["toc", "boolean", "true", "Draws the contents from the section titles."],
        ["printable", "boolean", "true", "Shows the print button at the top right."],
      ],
    },
    {
      type: "api",
      title: "<DocSection> · <Ref>",
      rows: [
        ["<DocSection title id?>", "string", "", "A section. Nested sections become subsections, numbered two levels deep."],
        ["<Ref to>", "string", "", "A link to a requirement ID (`R2`) in the same document."],
      ],
    },
  ],
  "doc-parts": [
    {
      type: "api",
      title: "Parts",
      rows: [
        ["<RequirementTable>", "items · prefix?", '"R"', "`items` is `{ text, priority, status?, note? }[]`. IDs run R1, R2… in order."],
        ["<Options>", "items", "", "`items` is `{ name, summary?, pros, cons, chosen? }[]`. The chosen option gets an accent border."],
        ["<CodeBlock>", "code · lang? · title?", "", '`lang` is `"tsx"`, `"html"`, `"json"`, `"sql"` or `"plain"`; left out, it is guessed.'],
        ["<Figure>", "caption · kind? · height?", '"figure"', "With `kind` set to `table`, the caption moves above and reads \"Table N.\". Give `height` when it holds a chart."],
        ["<ChangeLog>", "items", "", "`items` is `{ version, date, author, note }[]`."],
      ],
    },
  ],
  tabbar: [
    {
      type: "api",
      title: "<TabBar>",
      rows: [
        ["variant", "\"bar\" | \"floating\"", "\"bar\"", "A bar docked to the bottom, or a floating pill."],
        ["labels", "\"show\" | \"active\" | \"hide\"", "\"show\"", "Show names always, on the current tab only, or never."],
        ["items", "{ id, label, icon, badge? }[]", "", "The tabs. Three to five work best."],
        ["value · onChange", "string · (id) => void", "", "The current tab, and the function that gets the id of the tapped one."],
        ["label", "string", "\"Navigation\"", "The menu name screen readers read."],
      ],
    },
  ],
  calendar: [
    {
      type: "api",
      title: "<Calendar>",
      rows: [
        ["value · onChange", "number | null · (day) => void", "", "The picked day (milliseconds at its midnight) and the function that gets a tapped day."],
        ["marks", "number[]", "[]", "Days that get a dot. Only the date counts, not the time."],
        ["month", "number", "value or today", "The month to show first."],
        ["today", "number", "Date.now()", "The day marked as today. Pin it in examples and tests."],
        ["label", "string", "month name", "The grid name screen readers read."],
      ],
    },
  ],
  image: [
    {
      type: "api",
      title: "<Image>",
      rows: [
        ["alt", "string", "", "Alternative text."],
        ["src", "string", "", "Image URL. Without it a placeholder draws."],
        ["seed", "number", "1", "Picks the placeholder colors."],
        ["ratio", "\"1:1\" | \"3:4\" | \"4:3\" | \"16:9\"", "\"1:1\"", "Aspect ratio."],
        ["fit · rounded", "\"cover\" | \"contain\" · boolean", "\"cover\" · false", "How the image fills, and rounded corners."],
      ],
    },
    {
      type: "api",
      title: "<ImageCard>",
      rows: [
        ["image", "ImageProps", "", "The card's image; ratio defaults to 4:3."],
        ["title · description · meta", "string", "", "Title, description and extra info."],
        ["badge", "string", "", "A badge at the image's top left."],
        ["onSelect", "() => void", "", "When given, the whole card becomes a button."],
      ],
    },
    {
      type: "api",
      title: "<MiniCard>",
      rows: [
        ["image", "ImageProps", "", "A square image."],
        ["title · meta", "string", "", "Each clips to one line."],
        ["onSelect", "() => void", "", "When given, the card becomes a button."],
      ],
    },
    {
      type: "api",
      title: "<Carousel>",
      rows: [
        ["children", "ReactNode", "", "The slides; each child is one slide."],
        ["size", "\"full\" | \"card\" | \"mini\"", "\"full\"", "Slide width: `full` is one slide, `card` a card up to 260px, `mini` a 104px small card. Dots show only on `full`."],
        ["peek", "boolean", "true", "Shows a sliver of the next slide."],
        ["label", "string", "", "The carousel's name."],
      ],
    },
  ],
  social: [
    {
      type: "api",
      title: "<Avatar>",
      rows: [
        ["name · src", "string", "", "Name and photo; without a photo it shows the first letter."],
        ["size", "\"sm\" | \"md\" | \"lg\"", "\"md\"", ""],
        ["ring", "\"new\" | \"seen\"", "", "Story ring."],
      ],
    },
    {
      type: "api",
      title: "<Stories>",
      rows: [
        ["items", "{ id, name, src?, seen? }[]", "", ""],
        ["onSelect", "(id) => void", "", ""],
      ],
    },
    {
      type: "api",
      title: "<Post>",
      rows: [
        ["author · avatar · place", "string", "", ""],
        ["photo", "ImageProps", "", "Ratio defaults to 3:4."],
        ["likes · liked", "number · boolean", "", "Like count and initial state."],
        ["caption · comments · time", "string · number · string", "", ""],
        ["onLike · onComment · onShare · onSave", "(liked) => void · () => void", "", "Tap events."],
      ],
    },
    {
      type: "api",
      title: "<ProfileHeader>",
      rows: [
        ["name · handle · avatar · bio", "string", "", ""],
        ["stats", "{ label, value }[]", "[]", "Numbers are shortened."],
        ["children", "ReactNode", "", "The button row below."],
      ],
    },
    {
      type: "api",
      title: "<PhotoGrid>",
      rows: [
        ["items", "(ImageProps & { id })[]", "", "A three-column square grid."],
        ["onSelect", "(id) => void", "", ""],
      ],
    },
    {
      type: "api",
      title: "<List>",
      rows: [
        ["items", "{ id, title, description?, avatar?, meta? }[]", "", ""],
        ["onSelect", "(id) => void", "", ""],
        ["label", "string", "", ""],
      ],
    },
  ],
};
