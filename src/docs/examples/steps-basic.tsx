import { Steps } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("steps-basic");
  return <Steps items={text.items} />;
}
