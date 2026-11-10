import { Bullets, Deck, Slide, SlideHeader, Steps, Takeaway } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck title={t({ ko: "가입 개선", en: "Sign-up fixes" })}>
      <Slide tone="accent" footer={false}>
        <SlideHeader
          kicker={t({ ko: "제품 리뷰 · 11월", en: "Product review · November" })}
          title={t({ ko: "가입 개선 계획", en: "Sign-up fix plan" })}
          subtitle={t({ ko: "넘겨 보세요: 스와이프, 방향키, 버튼", en: "Swipe, use the arrow keys or the buttons" })}
        />
      </Slide>
      <Slide source={t({ ko: "출처: 사용자 인터뷰 12건", en: "Source: 12 user interviews" })} notes={t({ ko: "인증 단계 이탈을 먼저 말합니다.", en: "Lead with the verification drop-off." })}>
        <SlideHeader title={t({ ko: "가입을 그만둔 이유", en: "Why people quit sign-up" })} />
        <Takeaway>{t({ ko: "본인 인증 단계에서 절반이 떠납니다.", en: "Half of them leave at identity verification." })}</Takeaway>
        <Bullets items={t({ ko: ["인증 문자가 늦게 옵니다", "필요한 서류를 미리 알 수 없습니다"], en: ["The verification text arrives late", "People can't tell which documents they need"] })} />
      </Slide>
      <Slide>
        <SlideHeader title={t({ ko: "다음 할 일", en: "Next steps" })} />
        <Steps
          items={t({
            ko: [{ title: "문자 대기 줄이기" }, { title: "서류 미리 안내" }, { title: "실패 지점 저장" }],
            en: [{ title: "Shorten the text wait" }, { title: "List documents up front" }, { title: "Resume from the failure" }],
          })}
        />
      </Slide>
    </Deck>
  );
}
