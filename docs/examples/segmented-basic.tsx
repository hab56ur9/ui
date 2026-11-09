import { Segmented, useToast } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const toast = useToast();
  return (
    <Segmented
      label={t({ ko: "기간", en: "Range" })}
      defaultValue="90"
      options={[
        { value: "7", label: t({ ko: "7일", en: "7D" }) },
        { value: "30", label: t({ ko: "30일", en: "30D" }) },
        { value: "90", label: t({ ko: "90일", en: "90D" }) },
        { value: "365", label: t({ ko: "1년", en: "1Y" }) },
      ]}
      onChange={(value) => toast({ message: value })}
    />
  );
}
