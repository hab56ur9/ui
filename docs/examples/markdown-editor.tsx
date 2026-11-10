import { useState } from "react";
import { CodeBlock, MarkdownEditor } from "ui";
import { useT } from "../demo";

const KO = `# 주간 회고

이번 주에 **잘 된 것**과 아쉬운 것을 블록 단위로 적습니다. 블록을 누르면 마크다운 원문이 보이고, 빈 블록에서 \`/\`를 치면 블록 종류를 고를 수 있습니다.

## 잘 된 것

- 알림 센터 베타 배포
- 결제 실패 확인 시간 2.4일 → 1.2일

## 다음 주

- [x] 회고 정리
- [ ] 단계 출시 준비

> [!NOTE] 메모
> 표준 마크다운 표는 디자인 시스템의 표로 그려집니다.

| 지표 | 지난주 | 이번 주 |
| --- | ---: | ---: |
| 결제 실패 확인 | 2.4일 | 1.2일 |
| 알림 끄기 | 18% | 15% |`;

const EN = `# Weekly retro

Write what **went well** and what didn't, block by block. Click a block to see its markdown, and type \`/\` in an empty block to pick a block type.

## Went well

- Notification center beta shipped
- Failed payments seen in 1.2 days instead of 2.4

## Next week

- [x] Write up the retro
- [ ] Prepare the staged rollout

> [!NOTE] Note
> Standard markdown tables are drawn as the design system's table.

| Metric | Last week | This week |
| --- | ---: | ---: |
| Failed payment seen | 2.4 days | 1.2 days |
| Muted | 18% | 15% |`;

export default function Example() {
  const t = useT();
  const initial = t({ ko: KO, en: EN });
  const [markdown, setMarkdown] = useState(initial);
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "var(--space-8)", alignItems: "start" }}>
      <div style={{ paddingLeft: "var(--space-6)" }}>
        <MarkdownEditor key={initial} defaultValue={initial} onChange={setMarkdown} />
      </div>
      <CodeBlock code={markdown} lang="plain" title="markdown" />
    </div>
  );
}
