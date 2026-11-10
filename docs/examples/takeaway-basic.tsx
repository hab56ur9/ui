import { Takeaway } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return <Takeaway>{t({ ko: "본인 인증 단계에서 가입자 절반이 떠납니다.", en: "Half of sign-ups leave at identity verification." })}</Takeaway>;
}
