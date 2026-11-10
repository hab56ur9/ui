import { Bullets } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Bullets
      items={t({
        ko: [
          "인증 문자가 늦게 옵니다",
          { text: "필요한 서류를 미리 알 수 없습니다", items: ["신분증 종류가 안내되지 않습니다", "사진 조건이 마지막에 나옵니다"] },
          "실패하면 처음부터 다시 해야 합니다",
        ],
        en: [
          "The verification text arrives late",
          { text: "People can't tell which documents they need", items: ["ID types aren't listed", "Photo rules appear at the end"] },
          "A failure sends them back to the start",
        ],
      })}
    />
  );
}
