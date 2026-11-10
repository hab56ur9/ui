import { useState } from "react";
import { Button, Sheet, useToast } from "ui";
import { Row, useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("sheet-list");
  const toast = useToast();
  const [open, setOpen] = useState<"list" | "action" | null>(null);
  const ranges = text.items;
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
  const listTitle = text.chooseARange;
  return (
    <>
      <Mockup device="mobile" place="bottom">
        <Sheet inline open title={listTitle} onClose={() => undefined}>
          {list}
        </Sheet>
      </Mockup>
      <Row>
        <Button onClick={() => setOpen("list")}>{text.openListSheet}</Button>
        <Button onClick={() => setOpen("action")}>{text.openActionSheet}</Button>
      </Row>
      <Sheet open={open === "list"} title={listTitle} onClose={() => setOpen(null)}>
        {list}
      </Sheet>
      <Sheet open={open === "action"} title={text.saveYourChanges} actions={[{ label: text.discard }, { label: text.save, variant: "primary" }]} onClose={() => setOpen(null)}>
        {text.unsavedEditsWill}
      </Sheet>
    </>
  );
}
