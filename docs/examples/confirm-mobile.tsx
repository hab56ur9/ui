import { Modal } from "ui";
import { useT } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const t = useT();
  return (
    <Mockup device="mobile" place="center">
      <Modal
        inline
        open
        size="sm"
        dismissible={false}
        onClose={() => undefined}
        title={t({ ko: "위젯을 삭제할까요?", en: "Delete this widget?" })}
        description={t({ ko: "삭제한 위젯과 설정은 되돌릴 수 없습니다.", en: "The widget and its settings can't be restored." })}
        actions={[{ label: t({ ko: "취소", en: "Cancel" }) }, { label: t({ ko: "삭제", en: "Delete" }), variant: "danger" }]}
      />
    </Mockup>
  );
}
