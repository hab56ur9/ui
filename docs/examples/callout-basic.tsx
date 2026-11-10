import { Callout } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "grid", gap: "var(--space-3)" }}>
      <Callout title={t({ ko: "알아 두기", en: "Note" })}>{t({ ko: "새 데이터는 매시 정각에 들어옵니다.", en: "New data arrives on the hour." })}</Callout>
      <Callout tone="good" title={t({ ko: "팁", en: "Tip" })}>
        {t({ ko: "위젯을 끌어 순서를 바꿀 수 있습니다.", en: "Drag widgets to reorder them." })}
      </Callout>
      <Callout tone="warning" title={t({ ko: "결정 필요", en: "Decision needed" })}>
        {t({ ko: "홍보 알림 기본값 끄기는 마케팅 팀 합의가 필요합니다.", en: "Turning promo alerts off by default needs marketing sign-off." })}
      </Callout>
    </div>
  );
}
