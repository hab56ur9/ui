import { Markdown } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("markdown-editor");
  const initial = text.source;
  return <Markdown key={initial} defaultValue={initial} />;
}
