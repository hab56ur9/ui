import { ClosingSlide, Deck } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <ClosingSlide
        title={t({ ko: "정리", en: "Summary" })}
        items={t({
          ko: ["사용자와 매출이 함께 늘었습니다", "응답 시간과 오류율은 안정적입니다", "다음 달에는 웹 성장에 집중합니다"],
          en: ["Users and revenue rose together", "Latency and errors are steady", "Next month we focus on web growth"],
        })}
        contact={t({ ko: "데이터 팀 · 질문은 #data 채널로", en: "Data team · questions in #data" })}
      />
    </Deck>
  );
}
