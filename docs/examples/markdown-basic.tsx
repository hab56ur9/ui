import { Markdown } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("markdown-basic");
  return <Markdown readOnly>{text.source}</Markdown>;
}
