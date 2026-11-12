---
name: infographic
description: Draws architecture diagrams, system flows and infographics with the ui Diagram component, then builds them into animated and still SVG files for documents. Invoke on "인포그래픽", "아키텍처 도면", "구조도", "흐름도", "시스템 설계 그림", "다이어그램 그려", "ByteByteGo처럼", "infographic", or "diagram".
user-invocable: true
---

# ui Infographic

This skill draws diagrams that show how parts of a system connect and how data moves between them, and builds them into SVG files that documents embed as images.

## When to use

A diagram shows structure and flow; a chart shows numbers.

- Use a diagram for request paths, data pipelines, service architecture, deployment flows and event fan-out.
- Use a chart from the design-system skill when the point is a value, a trend or a comparison.
- Use numbered steps when order matters, and leave them out for a static structure.

## Rules

Every diagram follows these rules.

- Give the diagram a title and a one-line message; the message states what the reader should take away.
- Keep one reading direction. The default runs left to right; use `direction: "down"` for tall flows.
- Group parts that belong together, such as services, data stores or providers. A group becomes one column with its own color.
- Use icons that name the part: server, database, queue, cloud, phone, user, lock, shield, mail, file, code, box and the rest of the icon set.
- Animate only what moves in reality. A packet travels along an arrow for each numbered step; marching dots show continuous flow.
- Make the still frame complete. Step numbers and labels tell the story without motion.

## Composing for one screen

The agent places every node; the component only draws what it is told and checks the result. Automatic placement exists for quick drafts and is never the final layout.

- Aim for a box, not a line: about 4 columns by 3 to 4 rows, roughly 16:9. More than 5 columns means the story should fold or split.
- Sketch the grid before writing tags: put the entry point at the top left, the main path in one row or one column, and the rest around it.
- Fold a long chain: run the first steps down the first column, then continue to the right, as in Client above API Gateway.
- Put a side system next to the node that talks to it: the payment provider right of Payment, the retry queue under the event bus.
- Place a group's members in one column and consecutive rows; pin one member with `col` and `row`, and the others follow.
- Give every node a `col` and `row`. Nodes keep their natural size and sit centered in their cell, so cells need not line up exactly; what matters is that the whole diagram reads as one rectangle without stray gaps.
- Leave empty cells only where they separate two stories; otherwise move a node into them.
- Keep labels to one or two words, and leave short hops unlabeled when the step number says enough.
- Run `ui diagram check` after every change and look at the result before building.

## Writing a diagram

A diagram is written with tags in an HTML page that loads the design system. Nodes may hold any ui component.

```html
<div id="app"></div>
<script type="module">
  import { render, h, themes, Diagram, Badge, Stat } from "https://hab56ur9.github.io/ui/dist/ui.js";

  render("#app",
    h(Diagram, { id: "payment-flow", title: "결제 처리 흐름", flow: "packets" },
      h(Diagram.Node, { id: "client", label: "Client", caption: "웹·앱", icon: "phone" }),
      h(Diagram.Group, { id: "payment", label: "Payment" },
        h(Diagram.Node, { id: "api", label: "Payment API", icon: "server" },
          h(Stat, { label: "초당 요청", value: "1,240", size: "sm" }),
        ),
      ),
      h(Diagram.Node, { id: "ledger", label: "Ledger DB", icon: "database" }, h(Badge, { tone: "good" }, "정상")),
      h(Diagram.Arrow, { from: "client", to: "api", step: 1, label: "POST /pay", packet: "link" }),
      h(Diagram.Arrow, { from: "api", to: "ledger", step: 2, packet: "file" }),
    ),
    { theme: themes.sky.minimal, lang: "ko" },
  );
</script>
```

| Tag | Props |
| --- | --- |
| Diagram | title*, id (the output file name), direction ("right", "down"), flow ("packets", "dots", "pulses", "both"), children* |
| Diagram.Group | id*, label*, children* (Diagram.Node tags) |
| Diagram.Node | id*, label*, caption, icon, lane (a band name such as "client", "app" or "data"), col and row (grid cell, from 0), children (any ui component) |
| Diagram.Arrow | from*, to*, label, step (number), dashed, packet (icon that travels on this step), motion ("packet", "dots", "pulse", "dots-pulse", "still") |

- `flow: "packets"` moves an icon along each arrow that has a `packet`, one step at a time.
- `flow: "dots"` turns every arrow into marching dots for continuous flow.
- `flow: "pulses"` glides one glowing dot along every arrow at a steady speed, staggered so arrows do not fire together; it reads as live traffic with less noise than dots.
- `flow: "both"` combines them; `motion` on one arrow overrides the diagram's flow.
- Arrows with the same step move together, and each step number is drawn once.

## Posters

An infographic is one tall figure of panels. Each panel has a title, an icon and a one-line message beside its content, and one color that its border, icon and diagram share.

```html
h(Infographic, { id: "system-design", title: "시스템 설계 단골 구조 4가지", lede: "한 장으로 보는 네 가지 흐름" },
  h(Infographic.Panel, { title: "로그 분석", icon: "file", message: "흩어진 로그를 한곳에서 검색합니다." },
    h(Diagram, { title: "로그 분석" }, …),
  ),
)
```

| Tag | Props |
| --- | --- |
| Infographic | title*, id (the output file name), lede, children* (Infographic.Panel tags) |
| Infographic.Panel | title*, icon, message, children* (a Diagram or any component) |

- Write the message as the takeaway of the panel, in one sentence.
- Keep panels to a handful; split a long story into two posters.
- A panel's color comes from its position; text stays in the default colors.

## Building SVG files

Documents embed built SVG files, not the page. The build renders the page in headless Chrome and writes two files per poster, and per diagram that sits outside a poster. A poster is built 1280 px wide.

```bash
npx --yes github:hab56ur9/ui diagram build flow.html --out diagrams/
```

| File | Use |
| --- | --- |
| `<id>.svg` | Web documents such as Confluence, Notion and GitHub. It plays three loops after loading, then rests on the still frame. |
| `<id>.still.svg` | PDF, print and anything that cannot animate |

- Embed the file as an image, such as `<img src="diagrams/payment-flow.svg" alt="결제 처리 흐름">`, with the title as the alt text.
- The default theme is light; `--theme dark` builds for dark pages.
- The build embeds the font files that cover the characters in the diagram, so the SVG looks the same everywhere. A Korean diagram is about 400 KB.
- A node's icon, label, caption and badges become plain SVG. Other components inside a node are kept as HTML inside the SVG; browsers show them, but some converters, such as PDF tools and design-file importers, drop them, so use `<id>.still.svg` with plain nodes for those destinations.

## PNG and GIF

The design system builds SVG only. Other formats come from the still or animated SVG with general tools.

- PNG: open `<id>.still.svg` in a browser and save a screenshot, or convert it with any SVG-to-PNG tool.
- GIF: record the animated SVG in a browser at 25 frames per second for one loop.

## Layout check

The build refuses a diagram whose text is unreadable. Run the check while drawing; it renders the page and fails when a label overlaps another label or a node, another arrow crosses a label, an arrow runs through a node, or text inside a node is cut off.

```bash
npx --yes github:hab56ur9/ui diagram check flow.html
```

- The layout is a grid: each node takes its predecessor's row, so the main flow runs in one straight row and branches take the rows next to it; nodes share a width per column and a height per row.
- Give nodes a `lane` when the reader should see horizontal bands, such as client, application and data; lanes stack in the order they first appear.
- Back arrows (to a node the flow already passed) are found automatically and route on a rail above or below the columns they span.
- Parallel arrows between the same two nodes bow apart, and labels slide along their own arrow to a free spot; when none is free, the layout widens and tries again.
- When the check still fails, shorten labels, split the diagram, or move a node into a group.

## Check

Open the built SVG through an `<img>` tag in a browser before sharing it. Confirm that the packets move, the still file shows every step number, and no label is cut off.
