import { CompareSlide, Deck } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <CompareSlide
        title={t({ ko: "가입 단계", en: "Sign-up steps" })}
        takeaway={t({ ko: "단계를 둘 줄이면 완료율이 오릅니다.", en: "Two fewer steps lift the completion rate." })}
        before={{
          label: t({ ko: "지금 · 5단계", en: "Now · 5 steps" }),
          body: t({ ko: "이메일, 비밀번호, 본인 인증, 약관, 프로필을 차례로 받습니다.", en: "Email, password, identity check, terms and profile, one after another." }),
        }}
        after={{
          label: t({ ko: "바꾼 뒤 · 3단계", en: "After · 3 steps" }),
          body: t({ ko: "이메일 링크로 들어오고, 인증과 약관을 한 화면에 모읍니다.", en: "An email link signs people in, and the identity check and terms share one screen." }),
        }}
      />
    </Deck>
  );
}
