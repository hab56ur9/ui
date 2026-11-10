import { Takeaway } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("takeaway-basic");
  return <Takeaway>{text.halfOfSign}</Takeaway>;
}
