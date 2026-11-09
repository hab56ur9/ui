import { useState } from "react";
import { Button, Sheet, useToast } from "ui";
import { Row, Stage, useT } from "../demo";

export default function Example() {
  const t = useT();
  const toast = useToast();
  const [open, setOpen] = useState<"list" | "action" | null>(null);
  const ranges = t({ ko: ["최근 7일", "최근 30일", "최근 90일"], en: ["Last 7 days", "Last 30 days", "Last 90 days"] });
  const pick = (range: string) => {
    setOpen(null);
    toast({ message: range });
  };
  const list = (
    <ul className="sheet-list">
      {ranges.map((range) => (
        <li key={range}>
          <Button onClick={() => pick(range)}>{range}</Button>
        </li>
      ))}
    </ul>
  );
  const listTitle = t({ ko: "기간 선택", en: "Choose a range" });
  return (
    <>
      <Stage kind="sheet">
        <Sheet inline open title={listTitle} onClose={() => undefined}>
          {list}
        </Sheet>
      </Stage>
      <Row>
        <Button onClick={() => setOpen("list")}>{t({ ko: "목록 시트 열기", en: "Open list sheet" })}</Button>
        <Button onClick={() => setOpen("action")}>{t({ ko: "액션 시트 열기", en: "Open action sheet" })}</Button>
      </Row>
      <Sheet open={open === "list"} title={listTitle} onClose={() => setOpen(null)}>
        {list}
      </Sheet>
      <Sheet
        open={open === "action"}
        title={t({ ko: "변경 사항을 저장할까요?", en: "Save your changes?" })}
        actions={[{ label: t({ ko: "버리기", en: "Discard" }) }, { label: t({ ko: "저장", en: "Save" }), variant: "primary" }]}
        onClose={() => setOpen(null)}
      >
        {t({ ko: "저장하지 않으면 이번 수정 내용이 사라집니다.", en: "Unsaved edits will be lost." })}
      </Sheet>
    </>
  );
}
