import { Modal } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("confirm-mobile");
  return (
    <Mockup device="mobile" place="center">
      <Modal
        inline
        open
        size="sm"
        dismissible={false}
        onClose={() => undefined}
        title={text.deleteThisWidget}
        description={text.theWidgetAnd}
        actions={[{ label: text.cancel }, { label: text.delete, variant: "danger" }]}
      />
    </Mockup>
  );
}
