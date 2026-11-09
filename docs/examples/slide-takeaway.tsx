import { Bullets, Deck, Slide, SlideHeader, Takeaway } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <Slide source={t({ ko: "출처: 사용자 인터뷰 12건", en: "Source: 12 user interviews" })}>
        <SlideHeader title={t({ ko: "가입을 그만둔 이유", en: "Why people quit sign-up" })} />
        <Takeaway>{t({ ko: "본인 인증 단계에서 절반이 떠납니다.", en: "Half of them leave at identity verification." })}</Takeaway>
        <Bullets
          items={t({
            ko: ["인증 문자가 늦게 옵니다", "어떤 서류가 필요한지 미리 알 수 없습니다", "실패하면 처음부터 다시 해야 합니다"],
            en: ["The verification text arrives late", "People can't tell which documents they need", "A failure sends them back to the start"],
          })}
        />
      </Slide>
    </Deck>
  );
}
