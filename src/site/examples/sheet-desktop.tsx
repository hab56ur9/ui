import { Sheet } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("sheet-desktop");
  return (
    <Mockup place="bottom">
      <Sheet inline open title={text.saveYourChanges} actions={[{ label: text.discard }, { label: text.save, variant: "primary" }]} onClose={() => undefined}>
        {text.unsavedEditsWill}
      </Sheet>
    </Mockup>
  );
}
