import { Deck, MetricSlide } from "ui";
import { useFmt, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  const since = t({ ko: "이전 30일 대비", en: "vs previous 30 days" });
  return (
    <Deck controls={false}>
      <MetricSlide
        title={t({ ko: "한 달 요약", en: "Month in brief" })}
        takeaway={t({ ko: "사용자와 매출이 함께 늘었습니다.", en: "Users and revenue rose together." })}
        source={t({ ko: "출처: Acme 분석", en: "Source: Acme Analytics" })}
        metrics={[
          { label: t({ ko: "활성 사용자", en: "Active users" }), value: fmt.count(471000), delta: { change: 0.063, label: since } },
          { label: t({ ko: "매출", en: "Revenue" }), value: fmt.won(3810000000), delta: { change: 0.046, label: since } },
          { label: t({ ko: "p95 응답 시간", en: "p95 latency" }), value: fmt.ms(176), delta: { change: -0.04, goodWhenUp: false, label: since } },
        ]}
      />
    </Deck>
  );
}
