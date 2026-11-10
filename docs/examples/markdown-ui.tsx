import { Markdown, useI18n, useToast } from "ui";
import { useT } from "../demo";

const data = { "visits.today": 12480, "visits.change": 0.12 };

export default function Example() {
  const t = useT();
  const toast = useToast();
  const { locale } = useI18n();
  const number = new Intl.NumberFormat(locale);
  const source = t({
    ko: `## 오늘의 방문

아래 카드는 마크다운 안의 \`ui\` 코드 블록에 적은 JSON으로 그렸습니다.

\`\`\`ui
{ "type": "Widget", "props": { "id": "visits", "title": "방문자", "w": 6, "h": 2 },
  "children": { "type": "Stat", "props": { "value": { "$data": "visits.today", "$format": "count" }, "delta": { "change": { "$data": "visits.change" }, "label": "어제 대비" } } } }
\`\`\`

\`\`\`ui
{ "type": "Button", "props": { "variant": "primary", "onClick": { "$action": { "name": "open-report" } } }, "children": "리포트 열기" }
\`\`\``,
    en: `## Today's visits

The card below is drawn from JSON written in a \`ui\` code block inside the markdown.

\`\`\`ui
{ "type": "Widget", "props": { "id": "visits", "title": "Visitors", "w": 6, "h": 2 },
  "children": { "type": "Stat", "props": { "value": { "$data": "visits.today", "$format": "count" }, "delta": { "change": { "$data": "visits.change" }, "label": "vs yesterday" } } } }
\`\`\`

\`\`\`ui
{ "type": "Button", "props": { "variant": "primary", "onClick": { "$action": { "name": "open-report" } } }, "children": "Open report" }
\`\`\``,
  });
  return (
    <Markdown data={data} formats={{ count: (v) => number.format(v) }} onAction={({ name }) => toast({ message: name, status: "info" })}>
      {source}
    </Markdown>
  );
}
