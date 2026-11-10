import { Pager } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("pager-basic");
  return <Pager previous={{ label: text.previous, onSelect: () => undefined }} next={{ label: text.next, onSelect: () => undefined }} />;
}
