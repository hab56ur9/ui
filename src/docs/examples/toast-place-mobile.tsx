import { Toast } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("toast-place-mobile");
  return (
    <Mockup device="mobile">
      <Toast status="good" message={text.saved} action={{ label: text.undo }} />
    </Mockup>
  );
}
