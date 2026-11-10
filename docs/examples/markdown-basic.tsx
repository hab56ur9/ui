import { Markdown } from "ui";
import { useT } from "../demo";

const KO = `# 알림 센터 개편

흩어진 알림을 **한곳**에 모아, 결제 실패 같은 중요한 알림을 *놓치지 않게* 합니다. 자세한 배경은 [설계 문서](#)에 있습니다.

## 목표

1. 결제 실패 확인을 \`1일 이내\`로 줄입니다
2. 알림 끄기 비율을 10%로 낮춥니다
   - 홍보 알림은 기본값을 끔
   - ~~모든 알림 묶기~~는 이번 범위에서 뺍니다

## 할 일

- [x] 화면 설계
- [ ] 베타 배포
- [ ] 전체 출시

> [!WARNING] 결정 필요
> 홍보 알림 기본값 끄기는 마케팅 팀 합의가 필요합니다.

| 지표 | 지금 | 목표 |
| --- | ---: | ---: |
| 결제 실패 확인 | 2.4일 | 1일 |
| 알림 끄기 | 18% | 10% |

\`\`\`ts
const unread = notifications.filter((n) => !n.read);
\`\`\`

---

> 알림은 적을수록 잘 읽힙니다.`;

const EN = `# Notification center redesign

Gather scattered notifications in **one place** so important ones like failed payments are *never missed*. The background is in the [design doc](#).

## Goals

1. See failed payments \`within a day\`
2. Cut muted notifications to 10%
   - Promotions off by default
   - ~~Bundle every notification~~ is out of scope

## To do

- [x] Screen design
- [ ] Beta
- [ ] Full launch

> [!WARNING] Decision needed
> Turning promotions off by default needs marketing sign-off.

| Metric | Now | Goal |
| --- | ---: | ---: |
| Failed payment seen | 2.4 days | 1 day |
| Muted | 18% | 10% |

\`\`\`ts
const unread = notifications.filter((n) => !n.read);
\`\`\`

---

> Fewer notifications get read more.`;

export default function Example() {
  const t = useT();
  return <Markdown readOnly>{t({ ko: KO, en: EN })}</Markdown>;
}
