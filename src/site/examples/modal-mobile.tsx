import { Modal } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("modal-mobile");
  return (
    <Mockup device="mobile" place="center">
      <Modal
        inline
        open
        size="sm"
        onClose={() => undefined}
        title={text.exportReport}
        description={text.downloadTheSelected}
        actions={[{ label: text.cancel }, { label: text.export, variant: "primary" }]}
      />
    </Mockup>
  );
}
