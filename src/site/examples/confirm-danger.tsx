import { Button, Modal, useConfirm, useToast } from "ui";
import { Row, useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("confirm-danger");
  const confirm = useConfirm();
  const toast = useToast();
  const question = {
    title: text.deleteThisWidget,
    description: text.theWidgetAnd,
  };
  const cancel = text.cancel;
  const remove = text.delete;
  const open = async () => {
    const ok = await confirm({ ...question, confirmLabel: remove, danger: true });
    toast({ message: ok ? text.deleted : text.canceled, status: ok ? "good" : "info" });
  };
  return (
    <>
      <Mockup place="center">
        <Modal inline open size="sm" dismissible={false} onClose={() => undefined} {...question} actions={[{ label: cancel }, { label: remove, variant: "danger" }]} />
      </Mockup>
      <Row>
        <Button variant="danger" onClick={open}>
          {text.deleteWidget}
        </Button>
      </Row>
    </>
  );
}
