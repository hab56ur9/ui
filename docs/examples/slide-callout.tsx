import { Callout, Deck, Slide, SlideHeader } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <Slide>
        <SlideHeader title={t({ ko: "강조 상자", en: "Callouts" })} />
        <Callout title={t({ ko: "참고", en: "Note" })}>{t({ ko: "예측에는 다음 출시 효과를 넣지 않았습니다.", en: "The forecast leaves out the next release." })}</Callout>
        <Callout tone="warning" title={t({ ko: "주의", en: "Watch out" })}>
          {t({ ko: "출시 주간에는 응답 시간이 SLO를 넘기 쉽습니다.", en: "Latency tends to pass the SLO in release weeks." })}
        </Callout>
        <Callout tone="good" title={t({ ko: "완료", en: "Done" })}>
          {t({ ko: "오류율 알림을 새 기준으로 바꿨습니다.", en: "Error-rate alerts now use the new threshold." })}
        </Callout>
      </Slide>
    </Deck>
  );
}
