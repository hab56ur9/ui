import { Segmented, useToast } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("segmented-basic");
  const toast = useToast();
  return (
    <Segmented
      label={text.range}
      defaultValue="90"
      options={[
        { value: "7", label: text.n7d },
        { value: "30", label: text.n30d },
        { value: "90", label: text.n90d },
        { value: "365", label: text.n1y },
      ]}
      onChange={(value) => toast({ message: value })}
    />
  );
}
