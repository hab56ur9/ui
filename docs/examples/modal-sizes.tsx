import { useState } from "react";
import { Button, Modal } from "ui";
import { Row, Stage, useT } from "../demo";

const SIZES = ["sm", "md", "lg"] as const;

export default function Example() {
  const t = useT();
  const [size, setSize] = useState<(typeof SIZES)[number] | null>(null);
  const props = {
    title: t({ ko: "보고서 내보내기", en: "Export report" }),
    description: t({ ko: "선택한 기간의 데이터를 CSV로 내려받습니다.", en: "Download the selected period as CSV." }),
    actions: [
      { label: t({ ko: "취소", en: "Cancel" }), value: "cancel" },
      { label: t({ ko: "내보내기", en: "Export" }), value: "export", variant: "primary" as const, autoFocus: true },
    ],
    children: t({ ko: "파일에는 위젯별 일간 값이 들어갑니다.", en: "The file holds daily values per widget." }),
  };
  return (
    <>
      <Stage kind="modal">
        <Modal inline open size="sm" onClose={() => undefined} {...props} />
      </Stage>
      <Row>
        {SIZES.map((option) => (
          <Button key={option} onClick={() => setSize(option)}>
            {t({ ko: `${option} 열기`, en: `Open ${option}` })}
          </Button>
        ))}
      </Row>
      <Modal open={size !== null} size={size ?? "md"} onClose={() => setSize(null)} {...props} />
    </>
  );
}
