import { Button, Modal, useConfirm, useToast } from "ui";
import { Row, Stage, useT } from "../demo";

export default function Example() {
  const t = useT();
  const confirm = useConfirm();
  const toast = useToast();
  const question = {
    title: t({ ko: "위젯을 삭제할까요?", en: "Delete this widget?" }),
    description: t({ ko: "삭제한 위젯과 설정은 되돌릴 수 없습니다.", en: "The widget and its settings can't be restored." }),
  };
  const cancel = t({ ko: "취소", en: "Cancel" });
  const remove = t({ ko: "삭제", en: "Delete" });
  const open = async () => {
    const ok = await confirm({ ...question, confirmLabel: remove, danger: true });
    toast({ message: ok ? t({ ko: "삭제했습니다", en: "Deleted" }) : t({ ko: "취소했습니다", en: "Canceled" }), status: ok ? "good" : "info" });
  };
  return (
    <>
      <Stage kind="modal">
        <Modal inline open size="sm" dismissible={false} onClose={() => undefined} {...question} actions={[{ label: cancel }, { label: remove, variant: "danger" }]} />
      </Stage>
      <Row>
        <Button variant="danger" onClick={open}>
          {t({ ko: "위젯 삭제", en: "Delete widget" })}
        </Button>
      </Row>
    </>
  );
}
