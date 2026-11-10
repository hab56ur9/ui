import { Button, Toast, useToast, type ToastProps } from "ui";
import { Row, useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("toast-status");
  const toast = useToast();
  const undo = text.undo;
  const samples: [string, ToastProps][] = [
    [text.info, { message: text.newDataArrived }],
    [text.done, { message: text.saved, status: "good" }],
    [text.warning, { message: text.responsesAreSlower, status: "warning" }],
    [text.error, { message: text.couldnTSave, status: "critical", action: { label: text.retry } }],
    [
      undo,
      {
        message: text.widgetHidden,
        action: { label: undo, onClick: () => toast({ message: text.restored, status: "good" }) },
      },
    ],
  ];
  return (
    <>
      <Mockup>
        {samples.slice(0, 4).map(([label, props]) => (
          <Toast key={label} {...props} />
        ))}
      </Mockup>
      <Row>
        {samples.map(([label, props]) => (
          <Button key={label} onClick={() => toast(props)}>
            {label}
          </Button>
        ))}
      </Row>
    </>
  );
}
