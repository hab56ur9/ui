import { ActionBar, Button, useToast } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("actionbar-basic");
  const toast = useToast();
  return (
    <Mockup device="mobile" place="dock">
      <ActionBar label={text.label}>
        <Button onClick={() => toast({ message: text.saved })}>{text.save}</Button>
        <Button variant="primary" onClick={() => toast({ message: text.failed, status: "critical" })}>
          {text.pay}
        </Button>
      </ActionBar>
    </Mockup>
  );
}
