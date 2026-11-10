import { Bullets } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("bullets-basic");
  return <Bullets items={text.items} />;
}
