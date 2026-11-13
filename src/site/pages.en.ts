import type { Page } from "./pages";

export const pages: Page[] = [
  {
    "id": "intro",
    "group": "시작하기",
    "title": "Introduction",
    "lede": "This design system is a personal set of tokens and React components that gives apps, technical documents and slides the same look. Editing one token file changes every live page that uses the token.",
    "sections": [
      {
        "type": "cards",
        "title": "Principles",
        "items": [
          {
            "title": "Data leads",
            "body": "The frame of the screen recedes into grays, and color goes only to data and state."
          },
          {
            "title": "Defined in one place",
            "body": "Color, size and spacing live only in tokens. Components read them; pages use component props only."
          },
          {
            "title": "Sized for the medium",
            "body": "A token with one name takes the right size in apps, documents and slides."
          },
          {
            "title": "Accessible by default",
            "body": "Contrast targets, keyboard control and table views are built in from the start."
          },
          {
            "title": "Reversible",
            "body": "Irreversible actions ask for confirmation, and reversible actions offer undo."
          }
        ]
      },
      {
        "type": "text",
        "title": "Contents",
        "body": [
          "Foundations are the rules every screen shares, such as color, typography, spacing, shape and motion.",
          "Components are the React components you assemble, from buttons to charts, the widget board, modals and toasts.",
          "The token review page checks every token value and every contrast failure automatically."
        ]
      }
    ]
  },
  {
    "id": "getting-started",
    "group": "시작하기",
    "title": "Getting started",
    "lede": "Every page draws with the components of `ui`: a React app installs the package, and an HTML page imports `dist/ui.js`. Neither names a token or a CSS class, so both pick up every change when ui updates.",
    "sections": [
      {
        "type": "list",
        "title": "React apps",
        "ordered": true,
        "items": [
          "Install `ui`, `react` and `react-dom` from the GitHub repository.",
          "Wrap the app root in `UIProvider` and pass one theme from `themes` as `theme`. `UIProvider` loads the CSS.",
          "Templates set the medium. The default is `app`; `Doc` uses `doc` and `Deck` uses `slide`. Dark mode follows the system setting.",
          "Components decide color, size and spacing. The app uses component props only and never reads tokens."
        ]
      },
      {
        "type": "code",
        "code": "npm install github:hab56ur9/ui react react-dom"
      },
      {
        "type": "code",
        "code": "import { createRoot } from \"react-dom/client\";\nimport { UIProvider, themes } from \"ui\";\nimport { App } from \"./App\";\n\ncreateRoot(document.getElementById(\"root\")!).render(\n  <UIProvider theme={themes.lime.minimal}>\n    <App />\n  </UIProvider>,\n);"
      },
      {
        "type": "text",
        "title": "HTML without a bundler",
        "body": [
          "One line of `dist/ui.js` is enough. It carries React and loads its stylesheets itself. Next to every component it exports `render(target, content, { theme })`, `h` for elements, and hooks such as `useState`.",
          "The `dist/ui.js` on the site is always the latest release. To pin a version, use `v/<tag>/ui.js` on the site; the latest 100 releases stay there."
        ]
      },
      {
        "type": "code",
        "code": "<div id=\"app\"></div>\n<script type=\"module\">\n  import { render, h, themes, Button, Calendar } from \"{homepage}dist/ui.js\";\n\n  render(\"#app\", [h(Button, { variant: \"primary\" }, \"Save\"), h(Calendar)], { theme: themes.lime.minimal });\n</script>"
      },
      {
        "type": "text",
        "title": "Building with Claude",
        "body": [
          "The `design-system` skill knows these rules. Ask for something like \"Build a dashboard with the design system\".",
          "Outputs that cannot load CSS, such as PPT files or Artifacts, copy the values from `dist/tokens.json` at that moment and record the token version."
        ]
      },
      {
        "type": "code",
        "title": "Checks",
        "code": "npm run check\nnode scripts/lint.mjs path/to/page.html"
      }
    ]
  },
  {
    "id": "structure",
    "group": "시작하기",
    "title": "Token structure",
    "lede": "Tokens have three layers: primitive, theme and medium. Pages use only names from the theme and medium layers.",
    "sections": [
      {
        "type": "anatomy",
        "title": "Three layers",
        "items": [
          [
            "Primitive",
            "The source palette and scales. Names state the value itself, such as `color.blue.450` and `space.4`."
          ],
          [
            "Theme",
            "Names state the role. `color.bg.surface` points to a light gray in the light theme and a dark gray in the dark theme."
          ],
          [
            "Medium",
            "Tokens such as `font.size.body` take a different size in apps, documents and slides."
          ]
        ]
      },
      {
        "type": "text",
        "title": "Naming",
        "body": [
          "A name puts the property first and the role after it. For example, `color.fg.secondary` is the secondary role among text colors.",
          "Primitive color steps follow OKLab lightness, so the same step number has similar brightness across hues."
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Use theme tokens such as `var(--color-bg-surface)`.",
            "Use primitive colors such as `var(--color-neutral-25)` directly in a page. They do not change in dark mode."
          ],
          [
            "When a new value is needed, add a primitive step and point a theme token at it.",
            "Write hex values directly in page CSS."
          ]
        ]
      },
      {
        "type": "code",
        "title": "Files",
        "code": "tokens/primitive/color.json\ntokens/primitive/base.json\ntokens/theme/light.json\ntokens/theme/dark.json\ntokens/medium/app.json\ntokens/medium/doc.json\ntokens/medium/slide.json"
      }
    ]
  },
  {
    "id": "color",
    "group": "기반",
    "title": "Color",
    "lede": "Colors divide into the roles background, text, border, accent and danger. The light theme uses a warm off-white instead of white so large surfaces do not glare.",
    "sections": [
      {
        "type": "demo",
        "title": "Colors by role",
        "example": "color-roles"
      },
      {
        "type": "text",
        "title": "Presets",
        "body": [
          "A preset is a pair of main and sub colors. Components use only the `main` and `sub` role tokens, so switching the preset of the theme constant passed to `UIProvider` changes buttons, links, focus, the current item and emphasized charts together. Compare them with the Color switch at the top right."
        ]
      },
      {
        "type": "list",
        "items": [
          "`lime` Light green + neutral: the default, used when no preset is set.",
          "`sky` Sky + neutral",
          "`blue` Blue + blue-gray: a deep blue whose buttons keep white text above 4.5:1 contrast.",
          "`mono` Neutral: a calm set where the main color is neutral too.",
          "For a new preset, copy `tokens/preset/lime.json` and change the colors; the build writes the preset stylesheet. Then add the same name to `themes` in `src/lib/theme.ts`. Pick steps that pass the contrast checks."
        ]
      },
      {
        "type": "code",
        "lang": "html",
        "code": "<UIProvider theme={themes.sky.minimal}>\n  <App />\n</UIProvider>"
      },
      {
        "type": "anatomy",
        "title": "Roles",
        "items": [
          [
            "bg",
            "Backgrounds. Surfaces rise in the order page < surface < raised. subtle is the background for hover and controls."
          ],
          [
            "fg",
            "Text. default is body text, secondary is supporting text, and muted is axes and captions."
          ],
          [
            "border",
            "Borders. Cards and tables use default, and dividers that need emphasis use strong."
          ],
          [
            "main",
            "The preset's main color (light green by default). Primary buttons put `on` text on `fill`; links, focus, the current item and emphasized data use the deeper `default`."
          ],
          [
            "sub",
            "The preset's sub color (neutral by default). Secondary buttons use `fill`, and tags and chips use `subtle`."
          ],
          [
            "danger",
            "Used only for buttons of irreversible actions such as delete."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Build hierarchy with `fg.default` for body text and `fg.secondary` for descriptions.",
            "Color text with series or status colors for emphasis."
          ],
          [
            "Use `bg.raised` only for overlaps, such as a card on a card.",
            "Paint every area near white so the surfaces lose their separation."
          ],
          [
            "Mark success and healthy states with the `status.good` green and the `success` icon, distinct from the brand light green.",
            "Mark a success state with the brand light green."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.bg.*",
          "color.fg.*",
          "color.border.*",
          "color.main.*",
          "color.danger.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Body text reaches 4.5:1 or more on every background.",
          "Muted text and the accent reach 3:1 or more and serve only supporting information such as axes and captions.",
          "The contrast matrix on the token review page checks both themes."
        ]
      }
    ]
  },
  {
    "id": "dataviz-color",
    "group": "기반",
    "title": "Data visualization color",
    "lede": "Chart colors follow their job. Series colors tell items apart, sequential colors show magnitude, and status colors show state.",
    "sections": [
      {
        "type": "demo",
        "title": "Palette",
        "caption": "8 series colors, 7 sequential steps, 7 brand sequential steps, 4 status colors",
        "example": "dataviz-palette"
      },
      {
        "type": "anatomy",
        "title": "What each color does",
        "items": [
          [
            "Series",
            "Tells different items apart. Colors apply in a fixed order from slot 1, and a color stays the same when a filter removes items."
          ],
          [
            "Sequential",
            "Shows magnitude as the lightness of one hue. In dark mode the order flips, so small values sit close to the background."
          ],
          [
            "Status",
            "Means good, warning, serious or critical. It always comes with an icon and a label."
          ],
          [
            "Change",
            "`delta.good` and `delta.bad` are text colors chosen by whether a rise or a fall is good."
          ],
          [
            "Emphasis",
            "Draw the one key series with `color: \"emphasis\"` (brand light green) and comparisons with `color: \"de-emphasis\"` (gray). Brand heatmaps use the 7 steps of `sequential-main`."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "With many series, color at most 4 and group the rest as 'Other' or split them into small charts.",
            "Invent a 9th color."
          ],
          [
            "To highlight one series, color only that series and leave the rest at `\"de-emphasis\"`.",
            "Use status colors as ordinary series colors."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.series.*",
          "color.sequential.*",
          "color.sequential-main.*",
          "color.status.*",
          "color.delta.*",
          "color.chart.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The series palette passed a color vision deficiency simulation with a ΔE of 8 or more between adjacent colors.",
          "Some series colors fall below 3:1 on light surfaces, so charts carry direct labels or a table view."
        ]
      }
    ]
  },
  {
    "id": "typography",
    "group": "기반",
    "title": "Typography",
    "lede": "Font size has seven steps, and each name takes a different size per medium. Numeric columns use tabular figures.",
    "sections": [
      {
        "type": "demo",
        "title": "Sizes by medium",
        "caption": "One token name becomes a different size in apps, documents and slides",
        "example": "typography-sizes"
      },
      {
        "type": "demo",
        "title": "Mixed languages",
        "caption": "An element with a `lang` attribute uses that language's font and letter spacing, whatever the page language",
        "example": "typography-lang"
      },
      {
        "type": "anatomy",
        "title": "Language structure",
        "items": [
          [
            "`font.stack.*`",
            "Font stacks per writing system. Two exist today: `hangul` and `latin`."
          ],
          [
            "`tokens/lang/*.json`",
            "One file per language. It sets which stack serves as `font.family.sans` and how much letter spacing to use."
          ],
          [
            "`:lang()` selector",
            "The build generates a `:lang(ko)` or `:lang(en)` block per language file. A page only sets `<html lang>` or an element's `lang`."
          ],
          [
            "Adding a language",
            "For Japanese, add `font.stack.kana` and create `tokens/lang/ja.json`, and the build picks it up automatically."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Korean paragraphs keep word-unit line breaks with `word-break: keep-all`. The component styles apply it under `:lang(ko)`.",
            "Break Korean sentences between any two characters."
          ],
          [
            "Align numbers in tables and axes with `tabular-nums`.",
            "Use tabular figures in large stat cards so the digits spread apart."
          ],
          [
            "Build hierarchy with two weights: semibold for titles and numbers, regular for body text.",
            "Mix four or more weights."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "font.size.*",
          "line-height.*",
          "font.stack.*",
          "font.family.*",
          "letter-spacing.*",
          "font.weight.*"
        ]
      }
    ]
  },
  {
    "id": "spacing",
    "group": "기반",
    "title": "Spacing and layout",
    "lede": "Spacing follows a 4px grid. Common values, such as card padding and the gap between cards, are set as layout tokens per medium.",
    "sections": [
      {
        "type": "demo",
        "title": "Spacing scale",
        "example": "spacing-scale"
      },
      {
        "type": "anatomy",
        "title": "Layout tokens",
        "items": [
          [
            "layout.inset",
            "The inner padding of cards and panels."
          ],
          [
            "layout.gap",
            "The gap between cards and widgets."
          ],
          [
            "layout.section",
            "The large gap between sections."
          ],
          [
            "layout.stack",
            "The gap between closely related elements, such as a title and its body."
          ],
          [
            "widget.row",
            "The height of one widget board row."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "layout.*",
          "widget.*",
          "grid.columns",
          "chart-size.*"
        ]
      }
    ]
  },
  {
    "id": "shape",
    "group": "기반",
    "title": "Shape and elevation",
    "lede": "Corner radius comes in four sizes, and shadows show in three steps how far a surface floats.",
    "sections": [
      {
        "type": "demo",
        "title": "Radius and shadow",
        "example": "shape-radius"
      },
      {
        "type": "anatomy",
        "title": "Elevation",
        "items": [
          [
            "card",
            "Cards and widgets resting on the page."
          ],
          [
            "lifted",
            "Surfaces that float briefly, such as a dragged widget, a tooltip or a menu."
          ],
          [
            "overlay",
            "Surfaces that cover the screen, such as a modal, a bottom sheet or a toast."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "radius.*",
          "elevation.*"
        ]
      }
    ]
  },
  {
    "id": "motion",
    "group": "기반",
    "title": "Motion",
    "lede": "Motion serves only to explain a change of state. Entrances use a decelerating curve, exits use an accelerating curve, and exits are shorter.",
    "sections": [
      {
        "type": "demo",
        "title": "Duration and easing",
        "caption": "Press play to compare the three combinations",
        "example": "motion-curves"
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Use motion to follow a change of position, such as a widget moving to a new slot.",
            "Add decorative effects that move continuously."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "motion.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "When the user turns on reduced motion, every component animation turns off."
        ]
      }
    ]
  },
  {
    "id": "icons",
    "group": "기반",
    "title": "Icons",
    "lede": "The icons are a custom set drawn with round-capped strokes on a 24 grid. Color follows the surrounding text color, and tokens set the size and stroke width.",
    "sections": [
      {
        "type": "demo",
        "title": "All icons",
        "caption": "Click an icon to copy its name",
        "example": "icons-all"
      },
      {
        "type": "demo",
        "title": "Size and color",
        "caption": "Sizes are `sm` · `md` · `lg`, and the color is the text color of the wrapping element",
        "example": "icons-size",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Icons in buttons",
        "example": "icons-button",
        "layout": "centered"
      },
      {
        "type": "anatomy",
        "title": "Drawing rules",
        "items": [
          [
            "Grid",
            "Draw inside 24 × 24 and leave the outer 2px empty."
          ],
          [
            "Stroke",
            "Draw only with strokes that have round caps and round joins. The `icon.stroke` token sets the on-screen width."
          ],
          [
            "Color",
            "Use only `currentColor`. Status icons also take their color from the wrapping element."
          ],
          [
            "Adding",
            "Add `assets/icons/<name>.svg` and build, and the icon joins the list, the sprite and the data automatically."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Give a meaningful standalone icon a `label` so screen readers announce it.",
            "Add a `label` with the same meaning to a decorative icon next to text."
          ],
          [
            "Show state with the icon shape (`success` for done, `warning` for caution) together with text.",
            "Tell states apart with the same icon in different colors."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "icon.*"
        ]
      },
      {
        "type": "code",
        "code": "<svg class=\"icon icon-sm\"><use href=\"{homepage}dist/icons.svg#chart-line\"/></svg>",
        "title": "In HTML"
      }
    ]
  },
  {
    "id": "button",
    "group": "입력",
    "title": "Button",
    "lede": "A button runs an action. Only the single most important action on a screen becomes a primary button.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "button-basic",
        "layout": "centered"
      },
      {
        "type": "anatomy",
        "title": "Variants",
        "items": [
          [
            "Secondary `.button`",
            "Most actions."
          ],
          [
            "Primary `.is-primary`",
            "The one key action of a screen. It moves the flow forward, such as Save or OK."
          ],
          [
            "Danger `.is-danger`",
            "An irreversible action such as delete. It appears inside a confirm dialog."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Name a button with a verb that states the result, such as \"Save\" or \"Reset\".",
            "Use names that hide what happens, such as \"OK\" or \"Yes\"."
          ],
          [
            "Place only one primary button on a screen.",
            "Make every button a primary button."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.main.fill",
          "color.main.on",
          "color.danger.*",
          "radius.control"
        ]
      },
      {
        "type": "code",
        "code": "<button class=\"button\">Cancel</button>\n<button class=\"button is-primary\">Save</button>\n<button class=\"button is-danger\">Delete</button>",
        "title": "In HTML"
      }
    ]
  },
  {
    "id": "segmented",
    "group": "입력",
    "title": "Segmented control",
    "lede": "A segmented control picks one of two to five options. It serves values that affect the whole screen, such as the period, the theme or the view.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "segmented-basic",
        "layout": "centered"
      },
      {
        "type": "usage",
        "when": [
          "There are 2 to 5 options and all of them must be visible at a glance",
          "A choice changes the result immediately"
        ],
        "avoid": [
          "6 or more options call for a dropdown menu",
          "A single on/off setting calls for a switch"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The group carries `role=\"group\"` and an `aria-label`.",
          "The selected button carries `aria-pressed=\"true\"`."
        ]
      },
      {
        "type": "code",
        "code": "<div class=\"segmented\" role=\"group\" aria-label=\"Period\">\n  <button aria-pressed=\"false\">7 days</button>\n  <button aria-pressed=\"true\">30 days</button>\n</div>",
        "title": "In HTML"
      }
    ]
  },
  {
    "id": "textfield",
    "group": "입력",
    "title": "Text field",
    "lede": "A text field takes one line of text. It always has a label; hide it on screen (screen readers keep it) only when an icon and placeholder make the meaning obvious, as in search. A hint sits under the field.",
    "sections": [
      {
        "type": "demo",
        "title": "Search, label and hint, disabled",
        "example": "textfield-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The label is tied to the input, and the hint is read through `aria-describedby`."
        ]
      }
    ]
  },
  {
    "id": "checkbox",
    "group": "입력",
    "title": "Checkbox",
    "lede": "A checkbox turns one choice on or off, such as \"Also send to channel\" next to a reply box. Its label sits on the right and stays on one line. The state leaves through `onChange`; the checkbox stores nothing.",
    "sections": [
      {
        "type": "demo",
        "title": "Controlled, default on, disabled",
        "example": "checkbox-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "A native checkbox inside its `label`, so a click on the text toggles it and Space toggles it from the keyboard."
        ]
      }
    ]
  },
  {
    "id": "select",
    "group": "입력",
    "title": "Select",
    "lede": "A select keeps one value from a closed list, such as a ticket's project or builder. Like a text field it always has a label, and it hides the label on screen only when the row already names it. The choice leaves through `onChange`; the select stores nothing.",
    "sections": [
      {
        "type": "demo",
        "title": "Label, hidden label, disabled",
        "example": "select-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "A native `select`: arrow keys move through the choices and typing jumps to a match.",
          "The label is tied to the select even when it is hidden on screen."
        ]
      }
    ]
  },
  {
    "id": "multi-select",
    "group": "입력",
    "title": "Multi-select",
    "lede": "A multi-select lets people tick several items in a list. Picking reviewers or members is an example. Each item has a name and a description, and a `tone` or `avatar` draws a face beside it. `selectAllLabel` adds a select-all row on top, and a `locked` item cannot change. Picks go out through `onChange`, and the component stores nothing.",
    "sections": [
      {
        "type": "demo",
        "title": "Members with select all",
        "example": "multi-select-members",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Descriptions only",
        "example": "multi-select-plain",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "A `fieldset` with a `legend` names the list.",
          "Each item is a native checkbox, so Tab moves between items and Space toggles one.",
          "When only some items are picked, the select-all checkbox shows the mixed state."
        ]
      }
    ]
  },
  {
    "id": "drop-zone",
    "group": "입력",
    "title": "Drop zone",
    "lede": "A drop zone lets people drag files from their computer onto an area, such as a message box, to attach them. While files hover over it, a dashed frame names where they will go. It hands the files to `onFiles` and uploads nothing itself.",
    "sections": [
      {
        "type": "demo",
        "title": "Drop files onto a box",
        "example": "drop-zone-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "Dragging needs a pointer, so keep a button or file field that attaches files from the keyboard.",
          "Only file drags open the frame; dragged text passes through."
        ]
      }
    ]
  },
  {
    "id": "calendar",
    "group": "입력",
    "title": "Calendar",
    "lede": "A calendar shows a month as a grid and lets people pick one day. Today has a ring, the picked day takes the main color, and days with records get a dot. The picked day leaves through `onChange`; the calendar stores nothing.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "calendar-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The grid is `role=\"grid\"`: arrows move by a day or a week, PageUp and PageDown by a month, Home and End to the start and end of the week.",
          "Each date button reads as the full date, today carries `aria-current=\"date\"`, and the picked day `aria-selected`."
        ]
      }
    ]
  },
  {
    "id": "tabs",
    "group": "탐색",
    "title": "Tabs",
    "lede": "Tabs switch between views of the same subject on one screen. Picking a tab changes only the content below; the address and screen stay. There are two looks, underline (`line`) and pill (`pill`), and a long row of tabs scrolls sideways. Use the tab bar to move between screens, and a segmented control for two or three ways to filter the same data.",
    "sections": [
      {
        "type": "demo",
        "title": "Underline tabs with panels",
        "example": "tabs-basic"
      },
      {
        "type": "demo",
        "title": "Pill tabs",
        "example": "tabs-pill"
      },
      {
        "type": "demo",
        "title": "Many tabs",
        "example": "tabs-scroll",
        "layout": "centered"
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Keep tab names to one or two words.",
            "Don't use tabs to move to another screen."
          ],
          [
            "Put the most used tab first.",
            "Don't nest tabs inside tabs."
          ],
          [
            "Use `line` on wide screens and `pill` inside cards or narrow spaces.",
            "Don't split sequential steps into tabs."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Follows the WAI-ARIA tabs pattern: `tablist`, `tab`, `tabpanel`, `aria-selected`.",
          "Tab enters on the selected tab only; ←, →, Home and End move and select, skipping disabled tabs.",
          "Name the tab group with `label`."
        ]
      }
    ]
  },
  {
    "id": "tabbar",
    "group": "탐색",
    "title": "Tab bar",
    "lede": "A tab bar is the menu fixed to the bottom of a phone app. It moves between three to five main screens with icons and names. Give `AppShell` `mobileNav=\"tabs\"` and it draws a tab bar instead of the drawer on narrow screens. It comes docked (`bar`) or floating (`floating`), and its names show always, on the current tab only, or never. `AppShell` takes the same settings through `tabBar`.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "tabbar-basic"
      },
      {
        "type": "demo",
        "title": "Floating and labels",
        "example": "tabbar-floating"
      },
      {
        "type": "a11y",
        "items": [
          "The current tab announces itself with `aria-current=\"page\"`.",
          "Every tab keeps its name next to the icon.",
          "With names hidden, each button carries its name as `aria-label`."
        ]
      }
    ]
  },
  {
    "id": "toc",
    "group": "탐색",
    "title": "Table of contents",
    "lede": "A table of contents lists a long page's sections and scrolls to one on click. As you scroll, the section you are reading is highlighted. Put it in the app frame's right column (`aside`).",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "toc-basic",
        "layout": "centered"
      }
    ]
  },
  {
    "id": "pager",
    "group": "탐색",
    "title": "Pager",
    "lede": "A pager is two links between ordered pages. Put it at the end of a page; the first and last pages show only one side.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "pager-basic"
      }
    ]
  },
  {
    "id": "tree",
    "group": "탐색",
    "title": "Tree",
    "lede": "A tree shows a grouped list such as shortcuts, channels or files with indentation, and a click on a row selects that item. A row with children folds and unfolds when clicked.",
    "sections": [
      {
        "type": "demo",
        "title": "Sidebar",
        "example": "tree-basic"
      },
      {
        "type": "demo",
        "title": "File list",
        "example": "tree-files"
      },
      {
        "type": "a11y",
        "items": [
          "The list is a `tree` named by `label`, and each row carries `treeitem`, `aria-level` and `aria-selected`. A row with children also carries `aria-expanded`.",
          "Tab enters the list once. It lands on the row focused last, or else the selected row or the first row.",
          "Up and down arrows move between rows, and Home and End go to the first and last rows.",
          "The right arrow unfolds a folded row and moves from an unfolded row to its first child. The left arrow folds an unfolded row and moves from a folded or child row to its parent."
        ]
      }
    ]
  },
  {
    "id": "modal",
    "group": "피드백",
    "title": "Modal",
    "lede": "A modal pauses the current task to collect a required input or decision. While it is open, the screen behind it cannot be used.",
    "sections": [
      {
        "type": "demo",
        "title": "Sizes",
        "example": "modal-sizes",
        "variants": [
          {
            "label": "Desktop",
            "example": "modal-sizes"
          },
          {
            "label": "Mobile",
            "example": "modal-mobile"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Title",
            "One line that says what the dialog does."
          ],
          [
            "Description",
            "One or two sentences on the result of the choice."
          ],
          [
            "Body",
            "Inputs or content. When it grows long, only this area scrolls."
          ],
          [
            "Actions",
            "The primary action sits at the far right. Cancel sits to its left."
          ]
        ]
      },
      {
        "type": "usage",
        "when": [
          "An input or decision is required before moving on"
        ],
        "avoid": [
          "A simple notice calls for a toast",
          "A list of options on mobile calls for a bottom sheet",
          "A reversible action runs without confirmation and offers undo"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The native `<dialog>` keeps focus inside the dialog.",
          "Esc and an outside click close it.",
          "On close, focus returns to the element that opened it."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.modal.*",
          "color.bg.scrim",
          "elevation.overlay",
          "motion.easing.enter",
          "motion.easing.exit"
        ]
      }
    ]
  },
  {
    "id": "viewer",
    "group": "피드백",
    "title": "Viewer",
    "lede": "A viewer opens one file in a large window at the center of the screen. The header holds the name and actions, the content sits on the center sheet, and side details go in the right column.",
    "sections": [
      {
        "type": "demo",
        "title": "Document",
        "example": "viewer-document"
      },
      {
        "type": "demo",
        "title": "Right column",
        "example": "viewer-aside"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Icon and name",
            "The file-kind icon and name. A long name ends in an ellipsis."
          ],
          [
            "Meta",
            "Short details such as the kind and edit time."
          ],
          [
            "Tools and actions",
            "Tools sit beside the name and actions on the right. Close always comes last."
          ],
          [
            "Sheet",
            "The file contents. It is up to 880px wide, or fills the column with `wide`."
          ],
          [
            "Right column",
            "Details read beside the content, such as comments or properties."
          ]
        ]
      },
      {
        "type": "usage",
        "when": [
          "Focusing on one file at a large size, such as a document, image or code review"
        ],
        "avoid": [
          "A modal when only an input or decision is needed",
          "A split pane when work continues beside a list"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "It uses the native `<dialog>`, so focus stays inside the window.",
          "Esc, an outside click and the close button close it. The close button name is the i18n `close`.",
          "The window's accessible name is `title`."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "radius.sheet",
          "elevation.overlay",
          "color.bg.page",
          "color.bg.surface",
          "color.main.subtle"
        ]
      }
    ]
  },
  {
    "id": "command-palette",
    "group": "피드백",
    "title": "Command palette",
    "lede": "A command palette opens one search box near the top of the screen to find tickets, docs, channels and commands by name and open them at once. Results are split into groups and picked with the keyboard alone.",
    "sections": [
      {
        "type": "demo",
        "title": "Find and open",
        "example": "palette-search"
      },
      {
        "type": "demo",
        "title": "Commands and shortcuts",
        "example": "palette-commands"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Input",
            "Holds the name to find. Each change calls `onQuery`."
          ],
          [
            "Group",
            "A small heading that splits results by kind. A group with no match is hidden."
          ],
          [
            "Item",
            "An icon, a name, a one-line detail and a shortcut hint on the right. The picked item takes the subtle main color."
          ],
          [
            "Footer",
            "Briefly lists the keys you can use."
          ]
        ]
      },
      {
        "type": "usage",
        "when": [
          "Finding anything by name and opening it at once, as with ⌘K",
          "Running a command buried deep in menus by name"
        ],
        "avoid": [
          "Filtering only within a list: a search input",
          "Viewing one file large: a viewer"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The input is a `combobox` and the results a `listbox`. Focus stays in the input, and the picked item is announced through `aria-activedescendant`.",
          "Up and Down pick an item and Enter opens it. Moving past one end wraps to the other.",
          "It uses the native `<dialog>`, so Esc and an outside click close it.",
          "The window's accessible name is `placeholder`."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "radius.sheet",
          "elevation.overlay",
          "color.bg.raised",
          "color.bg.scrim",
          "color.main.subtle"
        ]
      }
    ]
  },
  {
    "id": "confirm",
    "group": "피드백",
    "title": "Confirm dialog",
    "lede": "A confirm dialog is a small modal that asks once more right before an irreversible action.",
    "sections": [
      {
        "type": "demo",
        "title": "Destructive action",
        "example": "confirm-danger",
        "variants": [
          {
            "label": "Desktop",
            "example": "confirm-danger"
          },
          {
            "label": "Mobile",
            "example": "confirm-mobile"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Write the title as a question, such as \"Delete this widget?\", and the button as the result, such as \"Delete\".",
            "Write vague text that hides what happens, such as \"Are you sure you want to proceed?\"."
          ],
          [
            "Put the initial focus on the Cancel button.",
            "Let a single Enter run the dangerous action."
          ]
        ]
      }
    ]
  },
  {
    "id": "sheet",
    "group": "피드백",
    "title": "Bottom sheet",
    "lede": "A bottom sheet is a panel that rises from the bottom of the screen. On narrow screens it puts menus, options and short decisions within reach of the thumb.",
    "sections": [
      {
        "type": "demo",
        "title": "List and action sheets",
        "example": "sheet-desktop",
        "variants": [
          {
            "label": "Desktop",
            "example": "sheet-desktop"
          },
          {
            "label": "Mobile",
            "example": "sheet-list"
          }
        ]
      },
      {
        "type": "usage",
        "when": [
          "Menus or options appear on mobile",
          "A dropdown on wide screens needs a narrow-screen replacement"
        ],
        "avoid": [
          "Wide screens call for a menu or a modal",
          "Long forms call for a separate screen"
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.sheet",
          "radius.sheet",
          "motion.duration.slow"
        ]
      }
    ]
  },
  {
    "id": "tooltip",
    "group": "피드백",
    "title": "Tooltip",
    "lede": "A tooltip shows a short note a button cannot show itself, on hover or keyboard focus. Listing who reacted on a reaction button is an example. It appears centered above the button, slides inward at the screen edge, and drops below when there is no room above.",
    "sections": [
      {
        "type": "demo",
        "title": "Reaction button",
        "example": "tooltip-reaction",
        "layout": "centered"
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Put a short note that helps before pressing.",
            "Put information or actions that only the tooltip holds."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Hover opens it after 200ms and keyboard focus opens it at once. Touch does not open it.",
          "It has `role=\"tooltip\"` and links to its element through `aria-describedby`.",
          "Esc, scrolling and resizing the window close it."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.tooltip",
          "elevation.overlay",
          "motion.duration.fast"
        ]
      }
    ]
  },
  {
    "id": "toast",
    "group": "피드백",
    "title": "Toast",
    "lede": "A toast briefly reports what just happened and then disappears. For a reversible action it also offers undo. On desktop it appears at the bottom right; on mobile it spans the bottom of the screen, above a bottom tab bar and clear of the iPhone home indicator.",
    "sections": [
      {
        "type": "demo",
        "title": "States and undo",
        "example": "toast-status",
        "variants": [
          {
            "label": "Desktop",
            "example": "toast-status"
          },
          {
            "label": "Mobile",
            "example": "toast-place-mobile"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Icon",
            "Shows the status by shape as well. The icons are `info` for notices, `success` for done, `warning` for caution and `error` for errors."
          ],
          [
            "Message",
            "One sentence on what happened. Warnings and errors start with a label."
          ],
          [
            "Action",
            "Only one, such as Undo or Retry."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Run reversible actions without a confirm dialog and offer Undo in a toast.",
            "Open a confirm dialog before every action."
          ],
          [
            "Toasts stack up to 3, and the oldest disappears first.",
            "Deliver content that must be read only through a toast."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Info, done and warning toasts are read as `role=\"status\"`, and errors as `role=\"alert\"`.",
          "Hover or focus pauses the dismiss timer.",
          "Toasts show above an open modal."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "size.toast",
          "color.status.*",
          "elevation.overlay"
        ]
      }
    ]
  },
  {
    "id": "stat",
    "group": "데이터",
    "title": "Stat card",
    "lede": "A stat card shows the single most important value right now and its change. It replaces a chart with a single bar.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "stat-basic"
      },
      {
        "type": "gallery",
        "title": "More examples",
        "items": [
          {
            "title": "Stat card",
            "example": "stat-card"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Value",
            "The large number. Values of 1,000 or more are abbreviated, such as \"48K\"."
          ],
          [
            "Change",
            "An up or down arrow icon together with the comparison period. The color depends on whether a rise is good. Inside a table, the `delta` cell uses the same form."
          ],
          [
            "Trend",
            "A small sparkline. The line is gray, and only the last value takes the accent color."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "For values where lower is better, such as response time, pass `goodWhenUp: false` so a fall shows in green.",
            "Always show a rise in green and a fall in red."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "font.size.stat",
          "color.delta.*"
        ]
      }
    ]
  },
  {
    "id": "chat",
    "group": "콘텐츠",
    "title": "Chat",
    "lede": "Chat is the message log people and agents share. It is made of messages, day dividers, system notes, a working indicator and a composer that completes @mentions.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "caption": "Type @ in the composer for mention suggestions; Korean initial consonants match too",
        "example": "chat-basic"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "ChatMessage",
            "Author, role badge, time, body, reactions and a thread reply summary. A run from one author folds the avatar with continued."
          ],
          [
            "SystemNote",
            "One line saying who did what. With onSelect it becomes a link to the subject."
          ],
          [
            "TypingIndicator",
            "The faces of who is working and three dots."
          ],
          [
            "Composer",
            "Enter sends and Shift+Enter breaks a line. Arrow keys pick a mention."
          ]
        ]
      }
    ]
  },
  {
    "id": "work-lists",
    "group": "데이터",
    "title": "Work lists",
    "lede": "Work lists show, one row at a time, the work people and agents hand each other. Use `ActivityList` for notifications, `QueueList` for handling order and `DocList` for documents under review and `EntryList` for deletable records such as routines and memos. For one person and a one-line description, use `List`.",
    "sections": [
      {
        "type": "demo",
        "title": "Notifications",
        "example": "activity-list-basic",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Queue",
        "example": "queue-list-basic",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Documents",
        "example": "doc-list-basic",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Records",
        "example": "entry-list-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "Rows of `ActivityList` and `DocList` are buttons; the selected notification is announced with `aria-current`.",
          "The unread dot and the waiting clock carry names.",
          "The `EntryList` delete button shows on hover or focus and always on touch screens. Its name is \"Delete {title}\"."
        ]
      }
    ]
  },
  {
    "id": "archive",
    "group": "데이터",
    "title": "Archive",
    "lede": "An archive keeps a finished thread as one document and folds it in the feed. Use `ArchiveCard` for one thread, `ArchivePicker` to pick a day's threads at once, and `ArchivedLine` for the folded line left behind.",
    "sections": [
      {
        "type": "demo",
        "title": "Draft card",
        "example": "archive-card",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Batch picking",
        "caption": "Threads still in progress or with an open question cannot be picked. The folded row's checkbox picks the hidden rows together",
        "example": "archive-picker",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Folded line",
        "example": "archived-line",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "Each `ArchivePicker` checkbox is named after its thread title, and excluded rows are `disabled`.",
          "The checkbox on the \"+ n more\" row is named after the hidden count.",
          "Open and Restore on `ArchivedLine` are buttons."
        ]
      }
    ]
  },
  {
    "id": "kanban",
    "group": "데이터",
    "title": "Kanban",
    "lede": "A kanban board lays cards out in columns by state. Dragging a card into another column changes its state.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "caption": "Drag a card to another column; a card in progress carries a stripe on its left",
        "example": "kanban-basic"
      }
    ]
  },
  {
    "id": "projects",
    "group": "데이터",
    "title": "Project cards",
    "lede": "Project cards lay out one card per project with its name, a progress bar, the owner and the due date, and a click selects that project. Above the selected project goes a `ProjectHeader` with its goal and buttons; in the overview each project gets a `Lane` row.",
    "sections": [
      {
        "type": "demo",
        "title": "Pick a card",
        "example": "project-cards"
      },
      {
        "type": "demo",
        "title": "Selected project header",
        "example": "project-header"
      },
      {
        "type": "demo",
        "title": "Kanban row per project",
        "example": "lane-basic"
      },
      {
        "type": "a11y",
        "items": [
          "Each card is a button, and the selected one carries `aria-pressed`.",
          "The progress bar is a `progressbar` named after the project, and a `Lane` is a `section` named after its title."
        ]
      }
    ]
  },
  {
    "id": "annotator",
    "group": "콘텐츠",
    "title": "Annotator",
    "lede": "The annotator lets people comment on sentences in a text. Selecting a sentence shows a comment button, and commented sentences are highlighted. A review bar and a line diff go with it.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "caption": "Clicking a highlight or a comment card points at the other; select a sentence to comment",
        "example": "annotator-basic"
      }
    ]
  },
  {
    "id": "progress-bar",
    "group": "데이터",
    "title": "Progress bar",
    "lede": "A progress bar shows how much of a task is done, such as checks ticked on a ticket or tickets closed in a project. It is a thin bar with no text of its own; put the count beside it when people need the number. A meter, by contrast, reads a value against a limit and names it.",
    "sections": [
      {
        "type": "demo",
        "title": "Fill, short beside text",
        "example": "progress-bar-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "`role=\"progressbar\"` with its label, value and maximum, so screen readers read the share."
        ]
      }
    ]
  },
  {
    "id": "meter",
    "group": "데이터",
    "title": "Meter",
    "lede": "A meter shows how much of a known total is used, such as budget spent or a goal reached. It adds an optional target mark and a status that always comes with an icon and a label.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "meter-basic"
      }
    ]
  },
  {
    "id": "board",
    "group": "데이터",
    "title": "Widget board",
    "lede": "The widget board is a dashboard frame that places widgets on a 12-column grid. Users drag widgets to move them, resize them and hide them, and the layout is saved.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "caption": "Drag a title bar to move a widget, and drag the bottom-right corner to resize it",
        "example": "board-basic"
      },
      {
        "type": "demo",
        "title": "Layout events",
        "caption": "Move the widgets a few times. A change event fires on every move and a commit event fires once, 1.5 seconds after you stop. The example code, not the board, takes the commit event and saves it to a server",
        "example": "board-events"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Title bar",
            "Grab and drag it to move the widget. A drag starts only after 4px of movement, which keeps it distinct from a click."
          ],
          [
            "Actions",
            "The table view and hide buttons. They appear on hover."
          ],
          [
            "Body",
            "The element that `render()` returns. Charts redraw themselves to fit the widget size."
          ],
          [
            "Resize handle",
            "The bottom-right corner. While dragging it shows the size, such as `8 × 4`."
          ],
          [
            "Board actions",
            "The toolbar above the board. It puts hidden widgets back and resets the layout, and takes filters through `toolbar`."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Focus the handle button in a title bar and use the arrow keys to change the order.",
          "Focus the resize handle and use the arrow keys to change the size.",
          "Moves and resizes are announced to screen readers."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "grid.columns",
          "widget.*",
          "elevation.lifted",
          "layer.ghost"
        ]
      }
    ]
  },
  {
    "id": "line-chart",
    "group": "데이터",
    "sub": "차트",
    "title": "Line chart",
    "lede": "A line chart shows change over time. It supports multiple series, forecast bands, baselines and event markers such as launches.",
    "sections": [
      {
        "type": "demo",
        "title": "Multiple series and event annotations",
        "caption": "Hover to see every value on that date",
        "example": "line-annotations"
      },
      {
        "type": "demo",
        "title": "Threshold and breaches",
        "example": "line-threshold"
      },
      {
        "type": "gallery",
        "title": "More examples",
        "items": [
          {
            "title": "Multiple series",
            "example": "line-series"
          },
          {
            "title": "Single area",
            "example": "line-area"
          },
          {
            "title": "Emphasis comparison",
            "caption": "The key series in the brand accent, comparisons as gray dashed lines",
            "example": "line-emphasis"
          },
          {
            "title": "Forecast band",
            "example": "line-forecast"
          },
          {
            "title": "Index comparison",
            "caption": "Two values with different units on one axis, indexed to 100 at the start date",
            "example": "line-index"
          }
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Legend",
            "Shown above the chart when there are two or more series."
          ],
          [
            "Line",
            "2px wide. Forecasts are dashed."
          ],
          [
            "End label",
            "The last value sits at the end of the line. Overlapping labels are dropped and left to the legend."
          ],
          [
            "Crosshair",
            "A vertical line snaps to the nearest date, and the tooltip shows the values of every series."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Plot two values with different units on one axis by indexing both to 100 at the start date.",
            "Build a dual-axis chart with two y-axes."
          ],
          [
            "Keep gridlines as thin solid lines in the background.",
            "Draw gridlines as dashed lines that look like a threshold."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "chart.stroke.*",
          "chart.marker.*",
          "chart.area.opacity",
          "color.chart.*"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "When the chart has focus, the arrow keys move between dates and read the values.",
          "The widget's `Table` button shows the same data as a table."
        ]
      }
    ]
  },
  {
    "id": "bar-chart",
    "group": "데이터",
    "sub": "차트",
    "title": "Bar chart",
    "lede": "A bar chart compares amounts per period. Bars start at the baseline, and only their top corners are rounded.",
    "sections": [
      {
        "type": "demo",
        "title": "Current period highlighted",
        "caption": "Only the last bar takes the brand accent, and the rest are gray",
        "example": "bar-emphasis"
      },
      {
        "type": "gallery",
        "title": "More examples",
        "items": [
          {
            "title": "Basic",
            "example": "bar-basic"
          },
          {
            "title": "Current period highlighted",
            "example": "bar-weekly"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "When there are many bars, group days into weeks to reduce the count.",
            "Fill the whole slot with the bar so the bars merge into a block."
          ],
          [
            "When only one bar remains, use a stat card instead.",
            "Paint each value a different color."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "chart.bar.*",
          "chart.gap"
        ]
      }
    ]
  },
  {
    "id": "heatmap",
    "group": "데이터",
    "sub": "차트",
    "title": "Heatmap",
    "lede": "A heatmap shows the magnitude of each cell where two axes meet as color intensity. It serves to find repeating patterns, such as weekdays by hour.",
    "sections": [
      {
        "type": "demo",
        "title": "Weekday × hour",
        "example": "heatmap-week"
      },
      {
        "type": "gallery",
        "title": "More examples",
        "items": [
          {
            "title": "Calendar · brand sequential",
            "caption": "Rest days in gray, distance run in 7 light green steps",
            "example": "heatmap-calendar"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Use 7 lightness steps of one hue together with a legend.",
            "Express magnitude by mixing many hues like a rainbow."
          ]
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.sequential.*",
          "chart.gap"
        ]
      }
    ]
  },
  {
    "id": "sparkline",
    "group": "데이터",
    "sub": "차트",
    "title": "Sparkline",
    "lede": "A sparkline is a small line that shows only the trend, without axes. It appears inside stat cards and tables.",
    "sections": [
      {
        "type": "demo",
        "title": "Color per slot",
        "example": "sparkline-slots",
        "layout": "centered"
      },
      {
        "type": "usage",
        "when": [
          "Only the direction needs to show next to a value",
          "Trends are compared row by row in a table"
        ],
        "avoid": [
          "Exact values must be readable, which calls for a line chart"
        ]
      }
    ]
  },
  {
    "id": "diagram",
    "group": "데이터",
    "title": "Diagram",
    "lede": "A diagram shows how the parts of a system connect and where data flows. Nodes, groups and arrows are written as tags and laid out automatically, and an icon travels along the arrow of each numbered step. A node can hold any component.",
    "sections": [
      {
        "type": "demo",
        "title": "Steps and groups",
        "caption": "Icons travel in step order, and the receiving node lights up on arrival",
        "example": "diagram-basic"
      },
      {
        "type": "demo",
        "title": "Components in nodes",
        "caption": "A stat, a meter and badges sit inside nodes. The last arrow uses motion=\"dots\" for continuous flow",
        "example": "diagram-components"
      },
      {
        "type": "usage",
        "when": [
          "Showing how parts connect and where data flows, such as request paths, data pipelines or service architecture",
          "Explaining an ordered process with numbered steps"
        ],
        "avoid": [
          "Values or trends are the point, which calls for a chart"
        ]
      },
      {
        "type": "list",
        "title": "Putting it in a document",
        "items": [
          "Documents embed a built SVG as an image, not the page.",
          "`<id>.svg` moves for three loops and then rests; `<id>.still.svg` is the still frame for PDF and print.",
          "The fonts for the characters used are embedded, so the file looks the same everywhere."
        ]
      },
      {
        "type": "code",
        "code": "npx --yes github:hab56ur9/ui diagram build flow.html --out diagrams/"
      },
      {
        "type": "a11y",
        "items": [
          "A diagram is a figure named by its `title`; use the title as the alt text in documents too.",
          "Looping motion has a pause button, and reduced motion and print show the still frame only.",
          "Step numbers and labels carry the flow, so nothing is lost without motion."
        ]
      }
    ]
  },
  {
    "id": "infographic",
    "group": "데이터",
    "title": "Infographic",
    "lede": "An infographic is one poster of stacked panels, each with a title, an icon and a one-line message. Each panel gets one color, and a diagram inside it follows that color. Wide posters put the title column on the left; narrow ones put it on top.",
    "sections": [
      {
        "type": "demo",
        "title": "Two-panel poster",
        "caption": "Groups, highlighted arrows and travelling icons inside each panel follow the panel color",
        "example": "infographic-basic"
      },
      {
        "type": "usage",
        "when": [
          "Comparing or collecting several structures or flows on one page",
          "A single shareable figure for a document, a talk or a post"
        ],
        "avoid": [
          "Use Diagram alone when there is only one diagram",
          "Split a long poster into two when it has many panels"
        ]
      },
      {
        "type": "list",
        "title": "Putting it in a document",
        "items": [
          "`ui diagram build` writes one animated and one still SVG per poster.",
          "Posters build 1280 px wide, with their diagrams and motion inside."
        ]
      },
      {
        "type": "code",
        "code": "npx --yes github:hab56ur9/ui diagram build poster.html --out diagrams/"
      }
    ]
  },
  {
    "id": "table",
    "group": "데이터",
    "title": "Table",
    "lede": "A table compares exact values. Every chart must be able to show the same data as a table.",
    "sections": [
      {
        "type": "demo",
        "title": "Table with trends",
        "example": "table-trend"
      },
      {
        "type": "gallery",
        "title": "More examples",
        "items": [
          {
            "title": "Table with trends",
            "example": "table-small"
          }
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Numeric columns use right alignment and tabular figures.",
            "Center numbers so digits are hard to compare."
          ]
        ]
      }
    ]
  },
  {
    "id": "description-list",
    "group": "데이터",
    "title": "Description list",
    "lede": "A description list shows a few labeled values, such as an agent's ticket counts and time spent. Labels sit in a muted column on the left and stay on one line; values wrap. For rows that share columns, use a table instead.",
    "sections": [
      {
        "type": "demo",
        "title": "Values on the left, values on the right",
        "example": "description-list-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "A native `dl` with `dt` and `dd`, so screen readers announce each label with its value."
        ]
      }
    ]
  },
  {
    "id": "badge",
    "group": "콘텐츠",
    "title": "Badge",
    "lede": "A badge labels a status, a count or a category in a word. Its `tone` is neutral, main, good, warning or critical, and its `variant` is soft, outline or solid. Soft status badges carry a colored dot so color never carries meaning alone. Tabs, the tab bar, document status, resume tags and option comparisons all use this badge.",
    "sections": [
      {
        "type": "demo",
        "title": "Tones and variants",
        "example": "badge-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The badge text carries the meaning; color only supports it.",
          "Count badges are read with the label beside them; don't leave a bare number."
        ]
      }
    ]
  },
  {
    "id": "chip",
    "group": "콘텐츠",
    "title": "Chip",
    "lede": "A chip is a small token that names one item, such as a ticket a task waits for. It can open the item and can be removed; a badge, by contrast, only shows a state. Lay several chips out with `Row`, which wraps them.",
    "sections": [
      {
        "type": "demo",
        "title": "Plain, button, removable",
        "example": "chip-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "Opening and removing are two separate buttons, so neither sits inside the other.",
          "The remove button reads as \"Remove\" with the chip's label."
        ]
      }
    ]
  },
  {
    "id": "card",
    "group": "콘텐츠",
    "title": "Card",
    "lede": "A card groups a title, a description and content inside one border. `selected` emphasizes the chosen card, and `aside` puts a badge or button beside the title. Dashboard cells use `Widget`; every other grouping uses a card.",
    "sections": [
      {
        "type": "demo",
        "title": "Default and selected",
        "example": "card-basic"
      }
    ]
  },
  {
    "id": "callout",
    "group": "콘텐츠",
    "title": "Callout",
    "lede": "A callout lifts one must-read passage out of the flow. It comes in note, tip and warning, each with an icon. Markdown `> [!NOTE]` blocks, tech docs and slides share this callout. Do and don't (`do`, `dont`) are callouts too, with a check or cross and a Do or Don't title added for you. The color rule sits on the left (`left`, default) or on top (`top`).",
    "sections": [
      {
        "type": "demo",
        "title": "Three tones",
        "example": "callout-basic"
      }
    ]
  },
  {
    "id": "takeaway",
    "group": "콘텐츠",
    "title": "Takeaway",
    "lede": "A takeaway states the conclusion of a section in one sentence right below its title, set apart by an accent rule and larger type.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "takeaway-basic"
      }
    ]
  },
  {
    "id": "bullets",
    "group": "콘텐츠",
    "title": "Bullets",
    "lede": "Bullets list key points up to two levels; sub-items sit indented, smaller and lighter. Around five lines reads best.",
    "sections": [
      {
        "type": "demo",
        "title": "Two levels",
        "example": "bullets-basic"
      }
    ]
  },
  {
    "id": "steps",
    "group": "콘텐츠",
    "title": "Steps",
    "lede": "Steps connect an ordered process with numbers and arrows: side by side on wide screens, stacked on narrow ones. Three to five steps read best.",
    "sections": [
      {
        "type": "demo",
        "title": "Three steps",
        "example": "steps-basic"
      }
    ]
  },
  {
    "id": "figure",
    "group": "콘텐츠",
    "title": "Figure",
    "lede": "A figure captions a chart or table: below for figures, above for tables. Inside the tech doc frame, numbers like \"Figure N.\" and \"Table N.\" are added automatically.",
    "sections": [
      {
        "type": "demo",
        "title": "Figure and table",
        "example": "figure-basic"
      }
    ]
  },
  {
    "id": "code",
    "group": "콘텐츠",
    "title": "Code block",
    "lede": "A code block shows code with syntax colors and a copy button; without a language it guesses from the content.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "code-basic"
      }
    ]
  },
  {
    "id": "code-editor",
    "group": "콘텐츠",
    "title": "Code editor",
    "lede": "A code editor lets people change code while keeping line numbers and syntax colors. Tab inserts two spaces, and Tab after Esc moves focus to the next element. Focused line numbers show in bold.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "code-editor-basic"
      },
      {
        "type": "demo",
        "title": "Inside a viewer",
        "example": "code-editor-viewer"
      }
    ]
  },
  {
    "id": "requirement-table",
    "group": "콘텐츠",
    "title": "Requirement table",
    "lede": "A requirement table numbers each requirement (R1, R2…) with its priority and status, so other text can point to it by number.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "requirements-basic"
      }
    ]
  },
  {
    "id": "options",
    "group": "콘텐츠",
    "title": "Options",
    "lede": "Options set each candidate's summary, pros and cons side by side in cards and highlight the chosen one.",
    "sections": [
      {
        "type": "demo",
        "title": "Two options",
        "example": "options-basic"
      }
    ]
  },
  {
    "id": "changelog",
    "group": "콘텐츠",
    "title": "Change log",
    "lede": "A change log records versions, dates, authors and changes in a table.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "changelog-basic"
      }
    ]
  },
  {
    "id": "panel",
    "group": "콘텐츠",
    "title": "Panel",
    "lede": "A panel splits off one area of a screen with a one-line header and a body. The header holds a title, secondary info and icon buttons. Unlike `Card`, which draws a border, a panel fills a sidebar or pane without one. Header buttons use `PanelAction`.",
    "sections": [
      {
        "type": "demo",
        "title": "Sidebar groups",
        "example": "panel-section",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "A panel that fills a pane",
        "example": "panel-pane",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The panel is a `section`; `PanelAction` is a button whose accessible name is its `label`."
        ]
      }
    ]
  },
  {
    "id": "split-pane",
    "group": "콘텐츠",
    "title": "Split pane",
    "lede": "A split pane lays panes side by side or stacked, and dragging the handle between two panes resizes them. Sizes go in and out as ratios, and `onResize` reports the new ratios when the handle is released. No pane shrinks below `min`.",
    "sections": [
      {
        "type": "demo",
        "title": "Side by side",
        "example": "split-row"
      },
      {
        "type": "demo",
        "title": "Stacked",
        "example": "split-column"
      },
      {
        "type": "a11y",
        "items": [
          "Each handle is a `separator` with `aria-orientation` and a name (default \"Resize\"), and Tab reaches it.",
          "Left and right arrows move a vertical handle, up and down arrows move a horizontal one, by 16px, or 64px with Shift."
        ]
      }
    ]
  },
  {
    "id": "image-preview",
    "group": "콘텐츠",
    "title": "Image preview",
    "lede": "An image preview shows an attached image at its own shape inside a size limit, such as a screenshot in a message. Unlike `Image`, which fills a fixed ratio, it never crops. With `onOpen` it becomes a button that opens the full image.",
    "sections": [
      {
        "type": "demo",
        "title": "Wide and tall images that open",
        "example": "image-preview-basic",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The image keeps its `alt`; as a button it is reachable by Tab and opens with Enter or Space."
        ]
      }
    ]
  },
  {
    "id": "image",
    "group": "콘텐츠",
    "title": "Image",
    "lede": "An image fills its box at a fixed ratio. Without `src` it draws a gradient placeholder from the series colors, so it also serves examples and loading states. Portrait photos use 3:4, landscape ones 16:9 or 4:3. An image card groups an image with a title and description, and a carousel pages sideways in three sizes: one slide at a time (`full`), several cards (`card`) or many small cards (`mini`).",
    "sections": [
      {
        "type": "demo",
        "title": "Image and image card",
        "example": "image-basic"
      },
      {
        "type": "demo",
        "title": "Carousel",
        "example": "carousel-basic"
      },
      {
        "type": "demo",
        "title": "Card carousel",
        "example": "carousel-card"
      },
      {
        "type": "demo",
        "title": "Mini card carousel",
        "example": "carousel-mini"
      },
      {
        "type": "a11y",
        "items": [
          "Every image gets `alt`; the placeholder reads it as its name too.",
          "Each carousel slide reads as `n / total`, and it pages with the previous and next buttons or a swipe."
        ]
      }
    ]
  },
  {
    "id": "social",
    "group": "콘텐츠",
    "title": "Social",
    "lede": "Social components make up the screens of a photo-sharing app: avatar, stories, post, profile header, photo grid and list. Taps such as a like leave as events, and the app does the storing.",
    "sections": [
      {
        "type": "demo",
        "title": "Feed",
        "example": "social-feed",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Profile and activity",
        "example": "social-profile",
        "layout": "centered"
      },
      {
        "type": "demo",
        "title": "Member profile",
        "example": "profile-header-member",
        "layout": "centered"
      },
      {
        "type": "a11y",
        "items": [
          "The like button reports its state with `aria-pressed`, and a double tap on the photo likes it too.",
          "Every icon button has a name.",
          "The presence dot in a member profile is not read aloud, so also give the state as `status` text. Facts read as a `dl` list."
        ]
      }
    ]
  },
  {
    "id": "markdown",
    "group": "렌더러",
    "title": "Markdown",
    "lede": "Markdown is a document component you read and edit in place, like Notion. It parses standard markdown (CommonMark plus GitHub extensions) into blocks drawn with our components, and typing `- `, `1. `, `[] `, `# `, `> `, three backticks or `---` changes a block on the spot. `/` inserts blocks and UI components, and blocks move by their drag handle. Where nothing should change (AI answers, shared views, SDUI notices, print), `readOnly` shows the same look. Edits leave through `onChange` as standard markdown, and the app does the storing.",
    "sections": [
      {
        "type": "demo",
        "title": "Editing",
        "example": "markdown-editor"
      },
      {
        "type": "demo",
        "title": "Read-only",
        "example": "markdown-basic"
      },
      {
        "type": "demo",
        "title": "UI blocks",
        "example": "markdown-ui"
      },
      {
        "type": "api",
        "title": "Keys",
        "rows": [
          [
            "- · 1. · [] · # · > · ``` · ---",
            "",
            "",
            "At the start of a paragraph, turns the block on the spot"
          ],
          [
            "/",
            "",
            "",
            "Opens the block and UI menu; type to filter, pick with ↑ ↓ Enter"
          ],
          [
            "Enter",
            "",
            "",
            "New block; next item in a list, leaves the list on an empty item"
          ],
          [
            "Shift + Enter",
            "",
            "",
            "Line break inside the block"
          ],
          [
            "Tab · Shift + Tab",
            "",
            "",
            "Indents or outdents a list item"
          ],
          [
            "Backspace",
            "",
            "",
            "At the start, turns the block back into a paragraph, or merges a paragraph into the previous block"
          ],
          [
            "↑ · ↓",
            "",
            "",
            "From the first or last line, moves to the previous or next block"
          ],
          [
            "Alt + Shift + ↑ · ↓",
            "",
            "",
            "Moves the block up or down, like dragging the handle"
          ],
          [
            "Esc",
            "",
            "",
            "Stops editing"
          ]
        ]
      },
      {
        "type": "api",
        "title": "Supported syntax",
        "rows": [
          [
            "Headings",
            "# … ###### · 제목 + ===/---",
            "",
            "Get an `id` you can link to."
          ],
          [
            "Emphasis",
            "**굵게** *기울임* ~~취소~~ `코드`",
            "",
            ""
          ],
          [
            "Links",
            "[글](url \"제목\") · [글][참조] · <url> · 맨 URL",
            "",
            "Only http(s), mailto, tel and relative URLs; others are blocked."
          ],
          [
            "Images",
            "![설명](url \"제목\")",
            "",
            "On its own line it becomes a captioned figure."
          ],
          [
            "Lists",
            "- 항목 · 1. 항목 · 1) 항목 · - [ ] 할 일",
            "",
            "Nest by indenting."
          ],
          [
            "Quotes and callouts",
            "> 글 · >> 중첩 · > [!NOTE|TIP|WARNING] 제목",
            "",
            ""
          ],
          [
            "Tables",
            "| a | b | + | --- | ---: |",
            "",
            "Right-aligned columns become numeric."
          ],
          [
            "Code",
            "```ts … ``` · 4칸 들여쓰기",
            "",
            "tsx, html, json and sql are highlighted; others are plain."
          ],
          [
            "Footnotes",
            "글[^1] + [^1]: 내용",
            "",
            "Collected at the end in order."
          ],
          [
            "Other",
            "--- · 줄 끝 공백 두 칸 · &amp; · \\*",
            "",
            "Rules, hard breaks, HTML entities, escapes"
          ],
          [
            "UI blocks",
            "```ui { JSON 노드 } ```",
            "",
            "`data`, `formats` and `onAction` come from the Markdown props."
          ],
          [
            "Not rendered",
            "<div>…</div>",
            "",
            "Raw HTML shows as text for safety."
          ]
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The block being edited is a plain text field, and Alt+Shift+↑ ↓ moves blocks without dragging.",
          "In read-only mode list items group as `list` and `listitem`, and headings get an `id` to link to.",
          "Images use their description as alt text."
        ]
      }
    ],
    "wide": true
  },
  {
    "id": "appshell",
    "group": "틀",
    "title": "App shell",
    "lede": "The app shell frames a whole screen: a left menu, a top bar, the body and a right column. On narrow screens the menu becomes a drawer or a bottom tab bar. It scrolls inside the frame like an app (`frame`) or with the whole page like a document (`page`). This docs site is built on it.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "appshell-basic",
        "variants": [
          {
            "label": "Desktop",
            "example": "appshell-basic"
          },
          {
            "label": "Mobile",
            "example": "appshell-mobile"
          }
        ]
      }
    ]
  },
  {
    "id": "desktop-shell",
    "group": "틀",
    "title": "Desktop shell",
    "lede": "The desktop shell lays out one screen of a desktop app: a title bar with the path, search and tools on top, an icon rail and a sidebar on the left, the body in the middle, and an inspector on the right. Dragging a divider resizes the sidebar or the inspector, and `overlay` floats over the window, the middle column or the content.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "desktop-shell-basic"
      },
      {
        "type": "demo",
        "title": "Overlay",
        "example": "desktop-shell-overlay"
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Title bar",
            "Window buttons with `window`, the path (the last part in bold), the search button and tools on the right. In a desktop app it drags the window."
          ],
          [
            "Rail",
            "A column of icon buttons. The current item is highlighted, and `dot` shows a state dot. `railFooter` sits at the bottom."
          ],
          [
            "Sidebar and inspector",
            "The side columns. Drag a divider or use the arrow keys to resize the sidebar within 180–420px and the inspector within 240–480px."
          ],
          [
            "Body",
            "Takes all the remaining width."
          ],
          [
            "Status line",
            "Passing `status` adds a 24px line at the bottom."
          ]
        ]
      },
      {
        "type": "usage",
        "when": [
          "Placing a list, a body and properties side by side on one screen, like a desktop app"
        ],
        "avoid": [
          "The app shell (AppShell) for web pages and docs sites",
          "Screens used mainly at narrow widths"
        ]
      },
      {
        "type": "a11y",
        "items": [
          "The rail is a `nav`; each button is named by `label`, and the current item has `aria-current=\"page\"`.",
          "Dividers are `role=\"separator\"`, take focus and move with the arrow keys (Shift moves 64px).",
          "A window overlay calls `onOverlayClose` when the dark outside is pressed. Trapping focus belongs to the component inside the overlay."
        ]
      },
      {
        "type": "tokens",
        "paths": [
          "color.bg.subtle",
          "color.bg.surface",
          "color.border.default",
          "color.main.subtle",
          "radius.sheet",
          "elevation.overlay"
        ]
      }
    ]
  },
  {
    "id": "slides",
    "group": "틀",
    "title": "Slide frame",
    "lede": "The slide frame is the outer shell of a deck. It draws on a 1920×1080 canvas and scales to fit, so the layout stays the same on any screen, and applies the slide medium tokens inside. It pages by swiping on phones and tablets, by arrow keys, or by the buttons below, and handles presenting, speaker notes and printing. Per-slide arrangements come from the layouts in the Templates tab.",
    "sections": [
      {
        "type": "demo",
        "title": "Try paging",
        "example": "deck-basic"
      },
      {
        "type": "usage",
        "when": [
          "Claude makes decks of the same look again and again",
          "Charts and numbers come from the same data as a web page"
        ],
        "avoid": [
          "A deck people will edit in PowerPoint needs a .pptx template",
          "A single picture belongs on a doc page"
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "`Deck`",
            "Shows one slide at a time and holds the next, present and print buttons and the page number."
          ],
          [
            "`Slide`",
            "One slide. It takes a background tone (`plain`, `dark`, `accent`), a source and speaker notes."
          ],
          [
            "`SlideHeader`",
            "Kicker, title and subtitle, in the same place on every slide."
          ],
          [
            "`SlideFooter`",
            "Source, deck title and page number. `Slide` adds it on its own."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Put a one-line takeaway (`Takeaway`) under the title.",
            "Show only a title and say the conclusion out loud."
          ],
          [
            "Cite a source on number and chart slides.",
            "Show numbers without a source."
          ]
        ]
      },
      {
        "type": "list",
        "title": "Save as PDF",
        "items": [
          "The print button sends only this deck to the print dialog. Choose Save as PDF and each slide becomes one 16:9 page.",
          "On an HTML page that holds only a deck, the browser's Print (⌘P) gives the same result.",
          "The design system ships no PDF tool; it provides the print CSS only."
        ]
      },
      {
        "type": "list",
        "title": "Grid and automatic check",
        "items": [
          "Every slide uses the same lines: the title on the top line (y64), the takeaway or content on the content line (y160), the main line of title, section, statement, quote and closing slides on the hero line (y384), and nothing past the footer line or the 96px side margins.",
          "Press G or the grid button to overlay these lines and 12 columns. Turn it on only while arranging; it stays off for presenting and print.",
          "`npm run check:slides` renders every template and layout in Korean and English, turns the grid on and compares against its lines. It fails, and so does CI, on any drift over 1px or a title or takeaway that wraps to two lines."
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Focus the deck and use the arrow keys, Space, PageUp and PageDown, Home and End.",
          "On touch screens, swipe sideways to page. A vertical swipe still scrolls the page, and the first and last slides resist and spring back.",
          "F turns the presenter view on and off.",
          "Screen readers read the new slide when it changes."
        ]
      }
    ]
  },
  {
    "id": "doc-frame",
    "group": "틀",
    "title": "Doc frame",
    "lede": "The doc frame is the shell of a technical document written in HTML. It draws the header, contents and section numbers on its own, and the doc medium tokens give it a readable text size and line height.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "caption": "Click the contents and the R2 reference. The button at the top right prints only this document on A4",
        "example": "doc-basic",
        "medium": "doc"
      },
      {
        "type": "usage",
        "when": [
          "Writing something that gets reviewed, such as a design doc, RFC or decision record",
          "Tying requirements and design together by number"
        ],
        "avoid": [
          "A one-screen notice belongs on a plain page",
          "A talk belongs in slides"
        ]
      },
      {
        "type": "anatomy",
        "items": [
          [
            "Header",
            "Status (draft, in review, final), title, one-line summary, authors, reviewers, date and version."
          ],
          [
            "Contents",
            "Built from the `DocSection` titles, numbered 1 and 1.1."
          ],
          [
            "Section",
            "Nested `DocSection`s continue the numbering two levels deep."
          ],
          [
            "Reference",
            "`Ref` jumps to a requirement row by its ID and highlights it for a moment."
          ]
        ]
      },
      {
        "type": "guidelines",
        "items": [
          [
            "Write the summary as the conclusion, in one sentence.",
            "Fill the summary with background."
          ],
          [
            "Tie each design decision to the requirement it meets, like `R1`.",
            "Leave requirements and design to be read apart."
          ],
          [
            "Give open questions their own section, phrased as questions.",
            "Write undecided points in the body as if settled."
          ]
        ]
      },
      {
        "type": "list",
        "title": "Save as PDF",
        "items": [
          "The print button sends only this document to the print dialog, split into A4 portrait pages.",
          "Pages never break right after a heading, and figures, tables and code blocks stay whole."
        ]
      },
      {
        "type": "a11y",
        "items": [
          "Contents and references are links, so the keyboard can follow them.",
          "Section titles are h2 and h3, so screen readers can move by heading."
        ]
      }
    ]
  },
  {
    "id": "resume",
    "group": "틀",
    "title": "Resume frame",
    "lede": "The resume frame stacks sections and entries under a header with name, role and contacts. An entry takes a title, organization, period, achievements and skill badges, and printing splits it into A4 portrait pages.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "resume-frame"
      }
    ]
  },
  {
    "id": "portfolio",
    "group": "틀",
    "title": "Portfolio frame",
    "lede": "The portfolio frame lays out projects under an intro header, each with an image, summary, key numbers and skill badges, and prints as A4 portrait.",
    "sections": [
      {
        "type": "demo",
        "title": "Basic",
        "example": "portfolio-frame"
      }
    ]
  },
  {
    "id": "blocks",
    "group": "블록",
    "title": "Desktop dashboard",
    "wide": true,
    "lede": "Finished screens assembled only from components. Drag the widgets in the preview, change the screen width, and copy the full files from the code tab as the starting point of a new dashboard.",
    "sections": [
      {
        "type": "block",
        "id": "dashboard-01",
        "title": "dashboard-01"
      }
    ]
  },
  {
    "id": "blocks-mobile",
    "group": "블록",
    "title": "Mobile dashboard",
    "wide": true,
    "lede": "A phone screen composed directly from components in code (TSX). The SDUI tab's \"Mobile dashboard\" draws the same screen from a JSON template, with the same HTML.",
    "sections": [
      {
        "type": "block",
        "id": "dashboard-mobile"
      }
    ]
  },
  {
    "id": "app-spec",
    "group": "앱 스펙",
    "title": "App spec",
    "wide": true,
    "lede": "An app spec is a JSON description of an app's screens, data, actions and the intent of each part, written with the components. An agent writes it, `ui spec build` turns it into one editable HTML file, and a person reviews that file under `ui serve`: widgets move, resize, hide and take notes, and text edits in place. The saved review goes back to the agent, which rewrites the spec until the person approves.",
    "sections": [
      {
        "type": "spec",
        "title": "Built preview"
      }
    ]
  },
  {
    "id": "slide-templates",
    "group": "슬라이드",
    "title": "Slide templates",
    "wide": true,
    "lede": "Deck templates. Pick a card to page through it below and read its code. Every template uses the same layouts and parts, so they all follow the theme.",
    "sections": [
      {
        "type": "templates",
        "category": "슬라이드"
      }
    ]
  },
  {
    "id": "slide-layouts",
    "group": "슬라이드",
    "title": "Layouts",
    "wide": true,
    "lede": "Layouts are twelve common slide shapes. Fill in the content and the title, takeaway and source fall into place.",
    "sections": [
      {
        "type": "gallery",
        "title": "Openers",
        "items": [
          {
            "title": "Title",
            "example": "slide-title"
          },
          {
            "title": "Agenda",
            "example": "slide-agenda"
          },
          {
            "title": "Section",
            "example": "slide-section"
          },
          {
            "title": "Statement",
            "example": "slide-statement"
          }
        ]
      },
      {
        "type": "gallery",
        "title": "Content",
        "items": [
          {
            "title": "Big numbers",
            "example": "slide-metric"
          },
          {
            "title": "Chart",
            "example": "slide-chart"
          },
          {
            "title": "Split",
            "example": "slide-split"
          }
        ]
      },
      {
        "type": "gallery",
        "title": "Closers and evidence",
        "items": [
          {
            "title": "Compare",
            "example": "slide-compare"
          },
          {
            "title": "Timeline",
            "example": "slide-timeline"
          },
          {
            "title": "Table",
            "example": "slide-table"
          },
          {
            "title": "Quote",
            "example": "slide-quote"
          },
          {
            "title": "Closing",
            "example": "slide-closing"
          }
        ]
      }
    ]
  },
  {
    "id": "doc-templates",
    "group": "기술 문서",
    "title": "Tech doc templates",
    "wide": true,
    "lede": "Design doc and RFC templates. Pick a card to read the whole document and its code below. Printing splits it into A4 pages.",
    "sections": [
      {
        "type": "templates",
        "category": "기술 문서"
      }
    ]
  },
  {
    "id": "resume-templates",
    "group": "이력서",
    "title": "Resume templates",
    "wide": true,
    "lede": "Resume templates, built from three parts: `Resume`, `ResumeSection` and `ResumeEntry`. Printing splits them into A4 portrait pages, and the accent follows the theme.",
    "sections": [
      {
        "type": "templates",
        "category": "이력서"
      }
    ]
  },
  {
    "id": "portfolio-templates",
    "group": "포트폴리오",
    "title": "Portfolio templates",
    "wide": true,
    "lede": "Portfolio templates built from three parts: `Portfolio`, `PortfolioSection` and `Project`, each project with an image, summary, key numbers and tech tags. Printing splits them into A4 portrait pages, and the accent follows the theme.",
    "sections": [
      {
        "type": "templates",
        "category": "포트폴리오"
      }
    ]
  },
  {
    "id": "theme",
    "group": "테마",
    "title": "Token review",
    "wide": true,
    "lede": "Shows the value and references of every token and finds contrast failures and unused colors automatically. Edit a token, run `npm run build` and reload the page to recalculate.",
    "sections": [
      {
        "type": "review",
        "title": ""
      }
    ]
  }
];
