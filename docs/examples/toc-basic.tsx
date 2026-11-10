import { Toc } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("toc-basic");
  return <Toc current="usage" onSelect={() => undefined} items={text.items} />;
}
