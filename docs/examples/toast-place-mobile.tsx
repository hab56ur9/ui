import { Toast } from "ui";
import { useT } from "../demo";
import { Phone } from "../Phone";
import { Wireframe } from "../Wireframe";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Phone>
        <Wireframe mobile>
          <Toast status="good" message={t({ ko: "저장했습니다", en: "Saved" })} action={{ label: t({ ko: "되돌리기", en: "Undo" }) }} />
        </Wireframe>
      </Phone>
    </div>
  );
}
