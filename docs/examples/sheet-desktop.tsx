import { Sheet } from "ui";
import { useT } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const t = useT();
  return (
    <Mockup place="bottom">
      <Sheet
        inline
        open
        title={t({ ko: "변경 사항을 저장할까요?", en: "Save your changes?" })}
        actions={[{ label: t({ ko: "버리기", en: "Discard" }) }, { label: t({ ko: "저장", en: "Save" }), variant: "primary" }]}
        onClose={() => undefined}
      >
        {t({ ko: "저장하지 않으면 이번 수정 내용이 사라집니다.", en: "Unsaved edits will be lost." })}
      </Sheet>
    </Mockup>
  );
}
