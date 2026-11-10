import { Toast } from "ui";
import { useT } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const t = useT();
  return (
    <Mockup device="mobile">
      <Toast status="good" message={t({ ko: "저장했습니다", en: "Saved" })} action={{ label: t({ ko: "되돌리기", en: "Undo" }) }} />
    </Mockup>
  );
}
