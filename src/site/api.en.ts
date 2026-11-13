import type { Section } from "./pages";

const POINTS = "Point[]";
const COLOR = 'number | "emphasis" | "de-emphasis"';
const COLOR_NOTE = "A number is a series slot (1–8), and `\"emphasis\"` or `\"de-emphasis\"` marks the one series that matters and its comparison.";
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
      description: "Provides the theme, the place where toasts and confirm dialogs open, and the language. Place it once at the app root; it also loads the CSS.",
      rows: [
        ["theme", "Theme", "required", "One of `themes.<preset>.<style>`, such as `themes.sky.expressive`. The app picks one and cannot spread or change it."],
        ["lang", "string", "<html lang>", "The language of built-in component text (Close, Cancel and so on) and of date and number formats. Languages outside the table fall back to `en`."],
        ["useToast()", "(props) => ToastHandle", "", "Returns a function that opens a toast."],
        ["useConfirm()", "(props) => Promise<boolean>", "", "Returns a function that opens a confirm dialog and waits for the result."],
        ["useI18n()", "{ lang, locale, text }", "", "Returns the current language and the language tag to pass to `Intl`."],
      ],
    },
    {
      type: "api",
      title: "Helpers",
      rows: [
        ["DAY", "number", "86400000", "One day (ms)."],
      ],
    },
  ],
  button: [
    {
      type: "api",
      title: "<Button>",
      description: "A button takes only these props. Its look is chosen with `variant` alone.",
      rows: [
        ["variant", '"secondary" | "primary" | "danger"', '"secondary"', "The button variant."],
        ["icon", "IconName", "", "An `sm` icon placed before the text."],
        ["label", "string", "", "The accessible name and tooltip of an icon-only button."],
        ["onClick · disabled · type", '() => void · boolean · "button" | "submit"', '· false · "button"', "What a press does, whether it is disabled, and whether it submits a form."],
      ],
    },
  ],
  chat: [
    { type: "api", title: "<ChatMessage>", rows: [
      ["author · tone · avatar", "string, number, string", "", "Author name, color slot and photo."],
      ["badge · time · via", "{ tone?, label }, string, string", "", "Role badge, time and source."],
      ["continued · selected · pending", "boolean", "false", "Continued run (folds the avatar), selection, typing dots."],
      ["actions", "MessageAction[]", "[]", "Buttons that appear on hover; one with menu opens a menu."],
      ["reactions · onReact", "{ emoji, count, mine?, title? }[], (emoji) => void", "[]", "Reaction pills and the click event."],
      ["replies · onOpenThread", "{ label, last?, members }, () => void", "", "Thread reply summary and the click event."],
    ] },
    { type: "api", title: "<Composer>", rows: [
      ["placeholder · submitLabel", "string", "\"Send\"", "Empty-field text and the send button name."],
      ["mentions", "{ id, label, description?, tone?, avatar?, state? }[]", "[]", "Candidates after @, matched by name, id and Korean initial consonants."],
      ["chips · onRemoveChip", "{ id, label, icon?, image?, size?, error? }[], (id) => void", "[]", "Quote or attachment chips under the field. image shows a thumbnail and size shows the byte count. error turns the chip red and shows the reason. A chip with size and no error lets the viewer send without text."],
      ["insert", "{ text, nonce }", "", "When nonce changes, puts text at the start and the caret after it."],
      ["onChange · onSubmit", "(text) => void", "", "On every change and on send."],
    ] },
    { type: "api", title: "<ChatPane> · <MessageLog> · <SystemNote> · <TypingIndicator> · <DayDivider> · <PresenceAvatar>", rows: [
      ["ChatPane composer · footer", "ReactNode", "", "The composer at the bottom and one line above it."],
      ["MessageLog", "children", "", "A message list that sticks to the bottom as it grows."],
      ["SystemNote icon · time · onSelect", "IconName, string, () => void", "\"info\"", "One system line; with onSelect it is a link."],
      ["TypingIndicator members", "Face[]", "[]", "Faces of who is working; empty without children."],
      ["DayDivider tone · align", "\"new\", \"center\" | \"start\"", "\"center\"", "A date or new-messages divider."],
      ["PresenceAvatar name · tone · avatar · state · size", "Face, \"xs\" | \"sm\" | \"md\" | \"lg\"", "\"md\"", "Photo or initial with a status dot."],
    ] },
  ],
  projects: [
    {
      type: "api",
      title: "<ProjectCards>",
      rows: [
        ["items", "ProjectCardItem[]", "", "The cards. Each is `{ id, name, value, max?, badge?, owner?, meta?, aside? }`, and `value`·`max` draw the progress bar."],
        ["value · onSelect", "string · (id) => void", "", "The selected card's `id` and the handler called on a click."],
        ["onNew · newLabel", "() => void · string", "· \"New project\"", "When given, a dashed card is added at the end."],
      ],
    },
    {
      type: "api",
      title: "<ProjectHeader>",
      rows: [
        ["name · goal", "string · ReactNode", "", "The project name and its one-sentence goal."],
        ["value · max", "number · number", "· 100", "The amount done and the total."],
        ["owner · meta · badge", "Face · ReactNode · ReactNode", "", "The owner avatar next to the name, supporting details, and a badge at the far end."],
        ["actions", "ReactNode", "", "The button slot below the progress bar."],
      ],
    },
    {
      type: "api",
      title: "<Lane>",
      rows: [
        ["title", "string", "", "The row title and the name of its `section`."],
        ["value · max", "number · number", "· 100", "When given, a short progress bar sits next to the title."],
        ["meta · badge", "ReactNode[] · ReactNode", "", "Supporting details placed one after another next to the title, and a badge."],
        ["children", "ReactNode", "", "The row body, usually a `Kanban` with `lane` on."],
      ],
    },
  ],
  kanban: [
    { type: "api", title: "<Kanban>", rows: [
      ["columns", "{ id, title, dot?, empty?, cards }[]", "", "Columns and cards; a card is { id, title, key?, assignee?, tags?, replies?, meta?, working? }."],
      ["value · onSelect", "string, (id) => void", "", "The selected card and the click event."],
      ["onMove", "(id, column) => void", "", "Fires when a card lands in another column; without it cards do not drag."],
      ["onAdd · addLabel", "(column) => void, string", "\"Add\"", "The + button in a column head."],
      ["heads · lane", "boolean", "true · false", "Hide the heads and use the board as a swimlane; draw the heads once with KanbanHeads."],
      ["switcher", "boolean", "false", "When the board is 640px wide or less, shows one column at a time with a Segmented. Wider boards are unchanged."],
      ["column · defaultColumn · onColumnChange", "string, string, (column) => void", "first column", "The column shown on narrow screens."],
    ] },
  ],
  annotator: [
    { type: "api", title: "<Annotator>", rows: [
      ["anchors", "{ id, quote, resolved? }[]", "[]", "Sentences to highlight, matched ignoring markdown marks and spacing."],
      ["active · onPick", "string, (id) => void", "", "The emphasized anchor and the click event on a highlight."],
      ["onQuote · quoteLabel", "(quote) => void, string", "\"Comment\"", "The button on a selection and its event; works in an editing block too."],
      ["actions · onAction", "{ id, label, icon? }[], (id, quote) => void", "[]", "Extra actions beside the selection button, such as making a ticket from the quote."],
    ] },
    { type: "api", title: "<CommentCard> · <ReviewBar> · <DiffView>", rows: [
      ["CommentCard quote · name · text · replies", "string, string, ReactNode, { name, time?, text }[]", "", "Quote, author, comment and replies."],
      ["CommentCard resolved · active · onResolve · onReply · onPick", "boolean, () => void", "", "Resolution, emphasis and button events."],
      ["CommentCard suggestion · onApply · footer", "string, () => void, ReactNode", "", "A suggested edit with an apply button, and extra content under the card such as vote buttons."],
      ["ReviewBar reviewers · aside", "{ name, label, badge? }[], ReactNode", "", "A state badge per reviewer and a summary on the right."],
      ["DiffView lines · empty", "{ kind: \"same\" | \"add\" | \"del\", text }[], string", "", "Line diff; the empty text shows when nothing changed."],
    ] },
  ],
  "progress-bar": [
    {
      type: "api",
      title: "<ProgressBar>",
      rows: [
        ["label", "string", "", "What is progressing; read by screen readers and shown as a tooltip."],
        ["value · max", "number · number", "· 100", "The done amount and the whole, such as 3 of 5 checks."],
        ["length", "\"fill\" | \"short\"", "\"fill\"", "`fill` takes the free width of its row; `short` stays a fixed short bar beside text."],
      ],
    },
  ],
  meter: [
    {
      type: "api",
      title: "<Meter>",
      rows: [
        ["label", "ReactNode", "", "What is being measured."],
        ["value · max", "number", "max 100", "The amount used and the total."],
        ["target", "number", "", "Draws a mark at a planned amount."],
        ["format", "(value: number) => string", "toLocaleString", "Formats the value and the total."],
        ["status", "\"good\" | \"warning\" | \"critical\"", "", "Colors the bar and adds an icon with a label; leave it out for a neutral meter."],
        ["note", "ReactNode", "", "A supporting line below the bar."],
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
        ["delta", "{ change, goodWhenUp?, neutral?, label }", "", "`change` is a ratio (0.063 = 6.3%). By default a rise is good; `neutral` shows the change without good or bad color."],
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
        ["motion", "boolean", "true", "Entrance motion; false turns it off. Widgets appear in order, numbers roll up, and bars, lines and Meters draw in."],
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
        ["categories", "string[]", "", "Names for a category axis; point t is the index into it instead of a time."],
        ["band", "{ name, lower, upper, color? }", "", "Fills between an upper and a lower bound, such as a forecast band."],
        ["threshold", "{ value, label, breach, direction? }", "", "The threshold line. It marks breaches in `flagBreaches` series and adds `breach` to the tooltip; `direction: \"below\"` makes values under the line the breaches."],
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
        ["categories", "string[]", "", "Names for a category axis; point t is the index into it instead of a time."],
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
  diagram: [
    {
      type: "api",
      title: "<Diagram>",
      rows: [
        ["title", "string", "required", "The diagram's name; it becomes the accessible name and the title of the built SVG."],
        ["id", "string", "", "The built file name; the title is used when it is missing."],
        ["direction", '"right" | "down"', '"right"', "The direction of the flow."],
        ["flow", '"packets" | "dots" | "pulses" | "both"', '"packets"', "The motion preset: icons travelling step by step, marching dots, one dot gliding along each arrow, or icons with marching dots."],
        ["motion", "boolean", "true", "Turns on entrance motion: nodes appear in order, Stat numbers roll up inside nodes, and Meters and line charts draw in."],
        ["children", "Diagram.Group · Diagram.Node · Diagram.Arrow", "", "The tags that make up the diagram."],
      ],
    },
    {
      type: "api",
      title: "<Diagram.Group> · <Diagram.Node>",
      rows: [
        ["id · label", "string", "required", "The name of the node or group; arrows connect by `id`."],
        ["caption", "string", "", "A secondary line under the node name."],
        ["col · row", "number", "automatic", "Pins the node to a grid cell, counted from 0; use it to fill one screen. A group follows the column of any member that sets one."],
        ["lane", "string", "", "Gathers nodes with the same name into a horizontal band, such as client, app or data; bands stack in the order they first appear."],
        ["icon", "IconName", "", "The icon on the left of the node; inside a group it takes the group color."],
        ["children", "ReactNode", "", "A group holds nodes, and a node holds any component."],
      ],
    },
    {
      type: "api",
      title: "<Diagram.Arrow>",
      rows: [
        ["from · to", "string", "required", "The `id`s of the two nodes it connects."],
        ["label", "string", "", "A label in the middle of the arrow."],
        ["step", "number", "", "The step number; arrows with the same number move together and the number is drawn once."],
        ["packet", "IconName", "", "The icon that travels along this arrow on its step."],
        ["motion", '"packet" | "dots" | "pulse" | "dots-pulse" | "still"', "the diagram's flow", "The motion of this arrow alone; `pulse` glides one glowing dot along it at a steady speed, and `dots-pulse` lets one enlarged dot ride with the marching dots at their speed."],
        ["dashed", "boolean", "false", "Draws a dashed arrow."],
      ],
    },
  ],
  infographic: [
    {
      type: "api",
      title: "<Infographic>",
      rows: [
        ["title", "string", "required", "The poster title; it becomes the title of the built SVG."],
        ["id", "string", "", "The built file name."],
        ["lede", "string", "", "One sentence under the title."],
        ["motion", "boolean", "true", "Turns on entrance motion: panels appear in order, and the diagrams and numbers inside follow that order."],
        ["children", "Infographic.Panel", "", "The panel tags."],
      ],
    },
    {
      type: "api",
      title: "<Infographic.Panel>",
      rows: [
        ["title", "string", "required", "The panel title."],
        ["icon", "IconName", "", "A large icon drawn in the panel color."],
        ["message", "string", "", "The panel's takeaway in one sentence."],
        ["children", "ReactNode", "", "A Diagram or any component."],
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
  "command-palette": [
    {
      type: "api",
      title: "<CommandPalette>",
      rows: [
        ["groups", "{ title, items: CommandItem[] }[]", "", "Results by group. A group with no match is hidden."],
        ["CommandItem", "{ id, label, detail?, icon?, hint?, always? }", "", "Filtered by `label`; `always` keeps it shown. `hint` is the shortcut on the right."],
        ["onSelect · onQuery", "(id: string) => void · (query: string) => void", "", "Picking an item calls `onSelect`, then `onClose`. Each query change calls `onQuery`."],
        ["placeholder · empty", "string · ReactNode", "i18n `palette.search` · `palette.empty`", "The input prompt and the text shown with no results."],
        ["footer", "ReactNode[]", "i18n move · open · close", "The key hints in the footer."],
        ["open · onClose", "boolean · () => void", "true", "Opens and closes the window. Each open clears the query."],
        ["inline", "boolean", "false", "Draws in place instead of as a window. Used in docs and previews."],
      ],
    },
  ],
  viewer: [
    {
      type: "api",
      title: "<Viewer>",
      rows: [
        ["title · icon", "string · IconName", "\"\" · \"file\"", "The name and icon in the header. The name is also the window's accessible name."],
        ["meta", "ReactNode", "", "Small text under the name. Keep it short, such as the kind and edit time."],
        ["tools · actions", "ReactNode · ReactNode", "", "Tools beside the name and actions on the right. The close button always ends the actions."],
        ["aside", "ReactNode", "", "The right column. When given, it sits beside the content sheet."],
        ["wide", "boolean", "false", "Lets the content sheet fill the column instead of stopping at 880px."],
        ["open · onClose", "boolean · () => void", "true", "Opens and closes the window. Esc, an outside click and the close button call `onClose`."],
        ["inline", "boolean", "false", "Draws in place instead of as a window. Used in docs and previews."],
        ["children", "ReactNode", "", "The file contents placed on the center sheet."],
      ],
    },
  ],
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
  sheet: [
    { type: "api", title: "<Sheet>", rows: DIALOG_PROPS },
    {
      type: "api",
      title: "<ActionList>",
      rows: [
        ["items", "{ id, label }[]", "", "The choices, one full-width row each."],
        ["onSelect", "(id: string) => void", "", "Called with the chosen id."],
      ],
    },
  ],
  popover: [
    {
      type: "api",
      title: "<Popover>",
      rows: [
        ["content", "ReactNode", "", "The content of the panel."],
        ["title", "string", "", "The panel header and its accessible name. It ends in an ellipsis on one line."],
        ["trigger", "\"hover\" | \"click\"", "\"click\"", "`hover` opens on hover or keyboard focus, `click` on press."],
        ["defaultOpen", "boolean", "false", "The initial open state."],
        ["onOpenChange", "(open: boolean) => void", "", "Called when it opens or closes."],
        ["children", "ReactElement", "", "The one button the popover belongs to. With `click` it receives `aria-expanded` and `onClick`."],
      ],
    },
  ],
  tooltip: [
    {
      type: "api",
      title: "<Tooltip>",
      rows: [
        ["label", "string", "", "The text to show, as given. It wraps to two lines and ends in an ellipsis beyond that."],
        ["children", "ReactElement", "", "The one element the tooltip belongs to. It receives `aria-describedby`, so screen readers read the text as its description."],
      ],
    },
  ],
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
        ["grid", "boolean", "false", "Starts with the grid on: the safe area, 12 columns and the title, content, hero and footer lines. G or the grid button toggles it."],
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
  "work-lists": [
    { type: "api", title: "<ActivityList>", rows: [
      ["items", "{ id, kind, author, tone?, avatar?, title, where?, time?, text, unread? }[]", "", "One row per notification. `kind` is mention · approval · reply · failure · file and sets the corner icon and its color."],
      ["value · onSelect", "string, (id) => void", "", "The selected row and the press event."],
      ["empty", "string", "\"None\"", "Text when there are no rows."],
    ] },
    { type: "api", title: "<QueueList>", rows: [
      ["items", "{ id, from, tone?, avatar?, where?, text, active?, waiting? }[]", "", "Rows in handling order. `active` marks the current job, `waiting` one that awaits a reply."],
      ["title · empty", "string, string", "\"None\"", "Header and empty-state text."],
    ] },
    { type: "api", title: "<DocList>", rows: [
      ["items", "{ id, title, meta?, badge?, reviewers?, aside? }[]", "", "One row per document. `reviewers` is the same `Reviewer[]` as `ReviewBar`; its `badge` tone colors the ring."],
      ["onSelect · empty", "(id) => void, string", "\"None\"", "Press event and empty-state text."],
    ] },
    { type: "api", title: "<EntryList>", rows: [
      ["items", "{ id, icon?, title?, meta?, text?, removable? }[]", "", "One record per row. `meta` sits beside `title`, and `text` shows up to three lines below. A row with `removable: false` has no delete button."],
      ["title · empty", "string, string", "\"None\"", "The header and the empty-state text. The item count sits beside the header."],
      ["onRemove", "(id) => void", "", "Fires when the delete button is pressed. Without it no button is drawn. Confirmation and permission checks belong to the app."],
    ] },
  ],
  "approval": [
    { type: "api", title: "<ApprovalCard>", rows: [
      ["title · description", "ReactNode, ReactNode", "", "One line on who wants to do what, and why."],
      ["command", "string", "", "The command to approve, verbatim. It renders in monospace and long lines wrap so all of it shows."],
      ["state · scope", "\"pending\" | \"allowed\" | \"denied\", \"once\" | \"always\"", "\"pending\"", "The state badge and border. `allowed` with `always` reads \"Always allowed\"."],
      ["onDecide", "(decision, scope) => void", "", "While pending it draws Deny, Always allow and Allow once, and passes the decision and scope on press."],
      ["meta", "string", "", "One footer line shown once decided or when `onDecide` is absent."],
    ] },
  ],
  "archive": [
    { type: "api", title: "<ArchiveCard>", rows: [
      ["title · count", "string, string", "", "The header title and the pill on its right. Put the compression in `count`, such as \"88 messages → 1\"."],
      ["sections", "{ label, entries: { text, meta?, badge? }[] }[]", "", "Each section's name and entries. The app names them, such as progress, discussion, decisions and open work."],
      ["evidence · note", "ReactNode, string", "", "The evidence line under the body and the note on the right of the footer."],
      ["actions · onAction", "{ id, label, variant? }[], (id) => void", "[]", "Footer buttons and the press event. Without buttons the footer is not drawn."],
      ["draft", "boolean", "false", "A draft gets a highlighted border and a 📦 icon."],
    ] },
    { type: "api", title: "<ArchivePicker>", rows: [
      ["title · count", "string, string", "", "The header title and the pill on its right."],
      ["columns", "[string, string, string, string]", "", "Names of the title, progress, discussion and status columns."],
      ["rows", "{ id, title, progress?, discussion?, status?, excluded? }[]", "", "One row per thread. An `excluded` row has its checkbox disabled and shows the reason in its `status` badge."],
      ["limit", "number", "Infinity", "Rows shown per group, included and excluded. The rest fold into one \"+ n more\" row whose checkbox picks the hidden rows together and shows `indeterminate` when only some are picked. Collapse folds them again after expanding."],
      ["value · defaultValue · onChange", "string[], string[], (value) => void", "every row not excluded", "Ids of the picked rows."],
      ["actions · onAction · note", "{ id, label, variant? }[], (id, value) => void, string", "[]", "Footer buttons, the press event with the picked ids, and the note on the right of the footer."],
    ] },
    { type: "api", title: "<ArchivedLine>", rows: [
      ["title · summary · meta", "string, string, string", "", "The folded line's title, one-line summary and right-hand meta."],
      ["onOpen · onRestore", "() => void, () => void", "", "Each one adds an \"Open\" or \"Restore\" button."],
    ] },
  ],
  "split-pane": [
    {
      type: "api",
      title: "<SplitPane>",
      rows: [
        ["direction", "\"row\" · \"column\"", "\"row\"", "Lays panes side by side or stacks them."],
        ["sizes", "number[]", "· equal", "The starting ratio of each pane. They need not add up to 1."],
        ["min", "number", "120", "The smallest size in px a handle can shrink a pane to."],
        ["onResize", "(sizes) => void", "", "Called with the new ratios after a handle is released or moved by key."],
        ["children", "ReactNode", "", "The panes. Each child is one pane."],
      ],
    },
    {
      type: "api",
      title: "<ResizeHandle>",
      rows: [
        ["orientation", "\"vertical\" · \"horizontal\"", "\"vertical\"", "A vertical handle moves sideways and a horizontal one moves up and down."],
        ["onMove · onEnd", "(dx, dy) => void · () => void", "", "The distance moved from where the drag started, and the function called when it ends."],
        ["label", "string", "· \"Resize\"", "The name of the handle."],
      ],
    },
  ],
  panel: [
    {
      type: "api",
      title: "<Panel>",
      rows: [
        ["title · meta", "ReactNode · ReactNode", "", "Title and secondary info on the one-line header; both truncate with an ellipsis."],
        ["actions", "ReactNode", "", "Slot at the header's right end, usually `PanelAction` buttons."],
        ["variant", "\"section\" | \"pane\"", "\"section\"", "`section` groups items in a sidebar; `pane` fills one pane and scrolls only its body."],
        ["children", "ReactNode", "", "The body."],
      ],
    },
    {
      type: "api",
      title: "<PanelAction>",
      rows: [
        ["icon · label", "IconName · string", "", "The icon and its name; `label` is the tooltip and accessible name."],
        ["onClick", "() => void", "", "Called on press."],
      ],
    },
  ],
  "image-preview": [
    {
      type: "api",
      title: "<ImagePreview>",
      rows: [
        ["src · alt", "string · string", "", "The image and its description; `alt` is also the tooltip when the preview opens."],
        ["onOpen", "() => void", "", "Makes the preview a button that opens the full image, such as in a viewer."],
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
        ["children", "ReactNode", "", "The button row below. In `member`, content placed under the facts."],
        ["variant", "\"social\" | \"member\"", "\"social\"", "`member` puts the name beside an avatar with a presence dot, then a button row and a list of facts."],
        ["tone · state", "number · Presence", "", "Avatar color and presence dot in `member`, as in `PresenceAvatar`."],
        ["role · status", "string · ReactNode", "", "Role badge and status text under the name in `member`."],
        ["actions", "ReactNode", "", "Button row under the name in `member`."],
        ["facts", "{ label, value }[]", "[]", "Facts shown as a `DescriptionList` in `member`. Values use the monospace font."],
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
  markdown: [
    {
      type: "api",
      title: "<Markdown>",
      rows: [
        ["defaultValue · children", "string", "\"\"", "The starting markdown; read-only views can pass it as `children`."],
        ["readOnly", "boolean", "false", "Shows the same look without editing; also for server rendering and print."],
        ["imageHosts", "string[]", "", "Hosts that external images load from, with the port when it is not the default (`localhost:4411`). When set, only same-origin images and images from listed hosts load; the rest show as links, so rendering someone else's text does not leak the viewer's IP."],
        ["onChange", "(markdown: string) => void", "", "Called with the whole standard markdown on every edit."],
        ["data · formats · onAction", "data map · format functions · action handler", "", "Used by ` ```ui ` blocks. ` ```mermaid ` `xychart-beta` and `pie` blocks draw with the chart components; other Mermaid blocks stay as code."],
      ],
    },
  ],
  tree: [
    {
      type: "api",
      title: "<Tree>",
      rows: [
        ["items · label", "TreeItem[] · string", "", "The rows and the name of the tree. A row is `{ id, label, icon?, avatar?, tone?, state?, unread?, aside?, mark?, description?, children? }`."],
        ["value · onSelect", "string · (id) => void", "", "The `id` of the selected row, and the function called when a row without children is clicked."],
        ["expanded · defaultExpanded", "string[] · string[]", "· all open", "The `id`s of open rows. Passing `expanded` keeps the state outside."],
        ["onToggle", "(id, open) => void", "", "Called when a row unfolds or folds."],
        ["mono", "boolean", "false", "Draws shorter rows in the monospace font. Use it for file lists."],
      ],
    },
  ],
  tabs: [
    {
      type: "api",
      title: "<Tabs>",
      rows: [
        ["items", "{ id, label, icon?, badge?, disabled?, content? }[]", "", "The tabs. When items have `content`, the selected one renders below."],
        ["value · defaultValue", "string", "first enabled tab", "The selected tab (controlled) and the initial tab (uncontrolled)."],
        ["onChange", "(id: string) => void", "", "Called with the id when another tab is picked."],
        ["variant", "\"line\" | \"pill\"", "\"line\"", "Underline or pill."],
        ["fill", "boolean", "false", "Tabs share the full width."],
        ["orientation", "\"horizontal\" | \"vertical\"", "\"horizontal\"", "A row or a vertical list; vertical moves with ↑ and ↓."],
        ["label", "string", "", "The tab group's name for screen readers."],
      ],
    },
  ],
  "description-list": [
    {
      type: "api",
      title: "<DescriptionList>",
      rows: [
        ["items", "{ label, value }[]", "", "The pairs in order; `value` takes text or any node."],
        ["align", "\"start\" | \"end\"", "\"start\"", "`end` lines the values up on the right, for numbers in a narrow panel."],
      ],
    },
  ],
  badge: [
    {
      type: "api",
      title: "<Badge>",
      rows: [
        ["tone", "\"neutral\" | \"main\" | \"good\" | \"warning\" | \"critical\"", "\"neutral\"", "The color for the meaning."],
        ["variant", "\"soft\" | \"outline\" | \"solid\"", "\"soft\"", "Soft fill, outline or solid fill."],
        ["children", "ReactNode", "", "A word or two, or a number."],
      ],
    },
  ],
  chip: [
    {
      type: "api",
      title: "<Chip>",
      rows: [
        ["label", "string", "", "The text, one line; a long label ends in an ellipsis with a tooltip."],
        ["icon", "IconName", "", "A leading icon."],
        ["onSelect", "() => void", "", "Makes the chip a button, such as opening the item it names."],
        ["onRemove", "() => void", "", "Adds a remove button read as \"Remove {label}\"."],
      ],
    },
  ],
  card: [
    {
      type: "api",
      title: "<Card>",
      rows: [
        ["title · description", "ReactNode", "", "The title and a one-line description."],
        ["aside", "ReactNode", "", "A badge or button beside the title."],
        ["selected", "boolean", "false", "Emphasizes the chosen card."],
        ["onClick", "() => void", "", "Makes the whole card a button; `selected` is read as its pressed state."],
        ["children", "ReactNode", "", "The card's content."],
      ],
    },
  ],
  callout: [
    {
      type: "api",
      title: "<Callout>",
      rows: [
        ["tone", "\"info\" | \"good\" | \"warning\" | \"do\" | \"dont\"", "\"info\"", "Note, tip, warning, do or don't; do and don't get a Do or Don't title when none is given."],
        ["accent", "\"left\" | \"top\"", "\"left\"", "Where the color rule sits: `left` for notes in the flow, `top` for cards set side by side, such as do and don't."],
        ["title", "string", "", "A bold title."],
        ["children", "ReactNode", "", "The body."],
      ],
    },
  ],
  "takeaway": [
    {
      type: "api",
      title: "<Takeaway>",
      rows: [
        ["children", "ReactNode", "", "The one-sentence conclusion."],
      ],
    },
  ],
  "bullets": [
    {
      type: "api",
      title: "<Bullets>",
      rows: [
        ["items", "(string | { text, items? })[]", "", "A list up to two levels deep. About five lines reads best."],
      ],
    },
  ],
  "steps": [
    {
      type: "api",
      title: "<Steps>",
      rows: [
        ["items", "{ title, body? }[]", "", "A process joined by numbers and arrows. Three to five steps read best."],
      ],
    },
  ],
  "figure": [
    {
      type: "api",
      title: "<Figure>",
      rows: [
        ["caption", "ReactNode", "", "The caption."],
        ["kind", "\"figure\" | \"table\"", "\"figure\"", "With `table` the caption moves above."],
        ["height", "number", "", "The height when it holds a chart."],
      ],
    },
  ],
  "code": [
    {
      type: "api",
      title: "<CodeBlock>",
      rows: [
        ["code", "string", "", "The code to show."],
        ["lang", "\"tsx\" | \"html\" | \"json\" | \"sql\" | \"plain\"", "guessed", "Picks the syntax colors."],
        ["title", "string", "", "A header such as a file name."],
      ],
    },
  ],
  "code-editor": [
    {
      type: "api",
      title: "<CodeEditor>",
      rows: [
        ["value", "string", "", "The code in controlled mode. Update it from `onChange`."],
        ["defaultValue", "string", "\"\"", "The starting code in uncontrolled mode."],
        ["onChange", "(value: string) => void", "", "Called when the code changes."],
        ["lang", "CodeLang", "\"tsx\"", "Picks the syntax colors. Get it from a file name with `langOf(path)`."],
        ["start", "number", "1", "The first line number."],
        ["focus", "number[]", "[]", "Line numbers shown in bold."],
        ["label", "string", "\"Code\"", "The accessible name of the editing area."],
        ["readOnly", "boolean", "false", "Blocks edits; selecting and copying still work."],
      ],
    },
  ],
  "requirement-table": [
    {
      type: "api",
      title: "<RequirementTable>",
      rows: [
        ["items", "{ text, priority, status?, note? }[]", "", "`priority` is `must`, `should` or `could`; `status` is `open`, `done` or `dropped`."],
        ["prefix", "string", "\"R\"", "The ID prefix; IDs run R1, R2…"],
      ],
    },
  ],
  "options": [
    {
      type: "api",
      title: "<Options>",
      rows: [
        ["children", "<Option>…", "", "The option cards; columns follow their count."],
      ],
    },
    {
      type: "api",
      title: "<Option>",
      rows: [
        ["name", "ReactNode", "", "The option name."],
        ["chosen", "boolean", "false", "The chosen option, with an accent border and a Chosen badge."],
        ["children", "ReactNode", "", "Everything inside as tags: a summary, `<Pros>` and `<Cons>`, stats, code."],
      ],
    },
    {
      type: "api",
      title: "<Pros> · <Cons>",
      rows: [
        ["children", "ReactNode", "", "Pros and cons; each child is one line, and it can be a component such as a badge."],
      ],
    },
  ],
  "changelog": [
    {
      type: "api",
      title: "<ChangeLog>",
      rows: [
        ["items", "{ version, date, author, note }[]", "", "One row per version."],
      ],
    },
  ],
  "resume": [
    {
      type: "api",
      title: "<Resume>",
      rows: [
        ["name · role", "string", "", "Name and role."],
        ["contacts", "{ label, href? }[]", "[]", "Contacts; with `href` they become links."],
        ["summary", "ReactNode", "", "A one- or two-sentence intro."],
        ["density", "\"comfortable\" | \"compact\"", "\"comfortable\"", "`compact` sets 14px body, 1.5 line height and tighter spacing to fit more text per page; a portfolio also narrows its image column."],
        ["printable", "boolean", "true", "Shows the print button."],
      ],
    },
    {
      type: "api",
      title: "<ResumeSection> · <ResumeEntry>",
      rows: [
        ["<ResumeSection title>", "string", "", "A group such as experience or education."],
        ["<ResumeEntry>", "title? · org? · period? · place? · items? · tags?", "", "One entry; `items` lists achievements and `tags` are skill badges."],
      ],
    },
  ],
  "portfolio": [
    {
      type: "api",
      title: "<Portfolio>",
      rows: [
        ["name · role · intro", "string · string · ReactNode", "", "Name, role and intro."],
        ["contacts", "{ label, href? }[]", "[]", "Contacts."],
        ["density", "\"comfortable\" | \"compact\"", "\"comfortable\"", "`compact` sets 14px body, 1.5 line height and tighter spacing to fit more text per page; a portfolio also narrows its image column."],
        ["printable", "boolean", "true", "Shows the print button."],
      ],
    },
    {
      type: "api",
      title: "<PortfolioSection> · <Project>",
      rows: [
        ["<PortfolioSection title>", "string", "", "A group of projects."],
        ["<Project>", "title · period? · role? · image? · summary? · metrics? · tags?", "", "`metrics` is `{ label, value }[]` drawn with `Stat`; `tags` are skill badges."],
      ],
    },
  ],
  "textfield": [
    {
      type: "api",
      title: "<TextField>",
      rows: [
        ["label", "string", "", "The label; always set it."],
        ["hideLabel", "boolean", "false", "Hides the label on screen only."],
        ["value · defaultValue · onChange", "string · string · (value) => void", "", "Controlled and uncontrolled values, and the change handler."],
        ["type", "\"text\" | \"search\" | \"email\" | …", "\"text\"", "The input type."],
        ["icon · placeholder · hint · disabled", "", "", "A leading icon, placeholder, hint below, and disabled state."],
      ],
    },
  ],
  "checkbox": [
    {
      type: "api",
      title: "<Checkbox>",
      rows: [
        ["label", "string", "", "The choice, one line; a long label ends in an ellipsis with a tooltip."],
        ["checked · defaultChecked · onChange", "boolean · boolean · (checked) => void", "", "Controlled and uncontrolled state, and the change handler."],
        ["disabled", "boolean", "false", "Turns the choice off."],
      ],
    },
  ],
  "select": [
    {
      type: "api",
      title: "<Select>",
      rows: [
        ["label", "string", "", "The label; always set it."],
        ["hideLabel", "boolean", "false", "Hides the label on screen only."],
        ["options", "{ value, label }[]", "", "The choices in order; an empty `value` stands for \"none\"."],
        ["value · defaultValue · onChange", "string · string · (value) => void", "", "Controlled and uncontrolled choice, and the change handler."],
        ["disabled", "boolean", "false", "Turns the field off."],
      ],
    },
  ],
  "multi-select": [
    {
      type: "api",
      title: "<MultiSelect>",
      rows: [
        ["label", "string", "", "The name of the list, drawn as a `legend`."],
        ["items", "{ id, label, description?, avatar?, tone?, locked? }[]", "", "The items. An `avatar` or `tone` draws a face, and a `locked` item cannot change."],
        ["value · defaultValue · onChange", "string[] · string[] · (value) => void", "", "The controlled and uncontrolled picks, and the function called when they change."],
        ["selectAllLabel", "string", "", "Adds a select-all row on top when two or more items can change."],
      ],
    },
  ],
  "drop-zone": [
    {
      type: "api",
      title: "<DropZone>",
      rows: [
        ["label", "string", "", "The sentence shown over the area while files are dragged over it, such as where they will go."],
        ["onFiles", "(files: File[]) => void", "", "Called with the dropped files; uploading them is the app's job."],
        ["children", "ReactNode", "", "The area that takes the drop, such as a message box."],
      ],
    },
  ],
  "toc": [
    {
      type: "api",
      title: "<Toc>",
      rows: [
        ["items", "{ id, label }[]", "", "The sections; `id` is an element id on the page."],
        ["title", "string", "\"On this page\"", "The list's name."],
        ["current", "string", "", "The highlighted section; without it, scroll position decides."],
        ["offset", "number", "96", "How far from the top a section counts as passed, such as the header height."],
        ["onSelect", "(id) => void", "", "Called on click; without it the page scrolls to the section."],
      ],
    },
  ],
  "pager": [
    {
      type: "api",
      title: "<Pager>",
      rows: [
        ["previous · next", "{ label, href?, onSelect? }", "", "The neighbouring pages; with `href` a link, otherwise a button."],
        ["label", "string", "\"Pages\"", "The name for screen readers."],
      ],
    },
  ],
  "appshell": [
    {
      type: "api",
      title: "<AppShell>",
      rows: [
        ["brand · title · actions", "ReactNode", "", "The name above the menu, the bar's middle and the bar's right side."],
        ["onBack", "() => void", "", "Puts a back button at the far left of the bar, in place of the menu button and the name. Use it on a detail screen opened from a list."],
        ["nav", "{ title?, items: { id, label, icon?, href?, sub?, current?, onSelect? }[] }[]", "", "The left menu; `href` makes links, and items sharing `sub` indent as one group. Empty means no menu."],
        ["navHeader", "ReactNode", "", "Something above the menu, such as search."],
        ["aside", "ReactNode", "", "The right column, such as a table of contents; hidden below 1280px."],
        ["scroll", "\"frame\" | \"page\"", "\"frame\"", "Scroll inside the frame or with the whole page."],
        ["mobileNav · tabBar", "\"drawer\" | \"tabs\" · TabBarStyle", "\"drawer\"", "Below 1024px, the menu becomes a drawer or a bottom tab bar."],
      ],
    },
  ],
  "desktop-shell": [
    {
      type: "api",
      title: "<DesktopShell>",
      rows: [
        ["frame", "\"viewport\" | \"window\"", "\"viewport\"", "Fill the whole screen, or draw a bordered window. `window` draws window buttons."],
        ["path", "ReactNode[]", "[]", "The path in the title bar. The last part shows in bold."],
        ["search", "{ placeholder?, shortcut?, onOpen? }", "", "The search button in the title bar; pressing it calls `onOpen`."],
        ["titleActions", "ReactNode", "", "Tools on the right of the title bar."],
        ["rail · railFooter", "{ id, label, icon, current?, dot?, onSelect? }[]", "[]", "The top and bottom items of the left icon rail. `dot` is a Presence state dot."],
        ["sidebar · inspector", "ReactNode", "", "The left and right columns. Leaving one out drops its column and divider."],
        ["sizes", "{ sidebar?, inspector? }", "{ sidebar: 248, inspector: 300 }", "The starting widths in px."],
        ["onResize", "(sizes: { sidebar, inspector }) => void", "", "Reports the new widths when a divider is released."],
        ["status", "ReactNode", "", "The status line at the bottom."],
        ["overlay · overlayScope", "ReactNode · \"content\" | \"main\" | \"modal\"", "\"content\"", "An overlay above the body. `content` covers from the left edge to the inspector, `main` only the middle column, and `modal` centers it on a dark backdrop."],
        ["onOverlayClose", "() => void", "", "Called when the outside of a `modal` overlay is pressed."],
      ],
    },
  ],
};
