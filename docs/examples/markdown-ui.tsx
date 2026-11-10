import { Markdown, useI18n, useToast } from "ui";
import { useText } from "../demo";

const data = { "visits.today": 12480, "visits.change": 0.12 };

export default function Example() {
  const text = useText("markdown-ui");
  const toast = useToast();
  const { locale } = useI18n();
  const number = new Intl.NumberFormat(locale);
  const source = text.todaySVisits;
  return (
    <Markdown readOnly data={data} formats={{ count: (v) => number.format(v) }} onAction={({ name }) => toast({ message: name, status: "info" })}>
      {source}
    </Markdown>
  );
}
