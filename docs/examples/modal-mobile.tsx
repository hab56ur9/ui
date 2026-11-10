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
        onClose={() => undefined}
        title={t({ ko: "보고서 내보내기", en: "Export report" })}
        description={t({ ko: "선택한 기간의 데이터를 CSV로 내려받습니다.", en: "Download the selected period as CSV." })}
        actions={[{ label: t({ ko: "취소", en: "Cancel" }) }, { label: t({ ko: "내보내기", en: "Export" }), variant: "primary" }]}
      />
    </Mockup>
  );
}
