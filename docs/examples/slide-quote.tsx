import { Deck, QuoteSlide } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <QuoteSlide
        quote={t({ ko: "인증 문자를 기다리다가 그냥 앱을 닫았어요.", en: "I waited for the verification text and just closed the app." })}
        by={t({ ko: "인터뷰 참가자 7", en: "Interviewee 7" })}
        role={t({ ko: "가입 3일 차 사용자", en: "Three days after sign-up" })}
        source={t({ ko: "출처: 사용자 인터뷰 12건", en: "Source: 12 user interviews" })}
      />
    </Deck>
  );
}
