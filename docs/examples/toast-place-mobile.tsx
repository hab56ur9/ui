import { Toast } from "ui";
import { useT } from "../demo";
import { Phone } from "../Phone";
import { GhostApp } from "./toast-place";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Phone>
        <GhostApp mobile toast={<Toast status="good" message={t({ ko: "저장했습니다", en: "Saved" })} action={{ label: t({ ko: "되돌리기", en: "Undo" }) }} />} />
      </Phone>
    </div>
  );
}
