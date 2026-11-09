import { Deck, TitleSlide } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <TitleSlide
        kicker={t({ ko: "Acme 분석 · 2026년 11월", en: "Acme Analytics · November 2026" })}
        title={t({ ko: "서비스 지표 월간 리뷰", en: "Monthly service review" })}
        subtitle={t({ ko: "최근 30일과 그 이전 30일을 비교합니다", en: "The last 30 days compared with the 30 days before" })}
        meta={t({ ko: "데이터 팀 · 2026년 11월 9일", en: "Data team · November 9, 2026" })}
      />
    </Deck>
  );
}
