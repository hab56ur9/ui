import { Badge, Button, Card } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
      <Card title={t({ ko: "기본 요금제", en: "Basic plan" })} description={t({ ko: "작은 팀이 대시보드 하나를 씁니다.", en: "One dashboard for a small team." })} />
      <Card
        selected
        title={t({ ko: "팀 요금제", en: "Team plan" })}
        aside={
          <Badge tone="main" variant="solid">
            {t({ ko: "사용 중", en: "Current" })}
          </Badge>
        }
        description={t({ ko: "대시보드와 알림을 무제한으로 씁니다.", en: "Unlimited dashboards and alerts." })}
      >
        <Button>{t({ ko: "설정 보기", en: "View settings" })}</Button>
      </Card>
      <Card
        title={t({ ko: "결제 연동", en: "Billing sync" })}
        aside={<Badge tone="warning">{t({ ko: "확인 필요", en: "Needs review" })}</Badge>}
        description={t({ ko: "카드 만료일이 이번 달입니다.", en: "The card expires this month." })}
      />
    </div>
  );
}
