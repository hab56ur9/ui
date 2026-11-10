import { JsonUI, useI18n, type JsonUINode } from "ui";
import { data, formatsFor } from "../dashboard-mobile/data";
import en from "./en.json";
import ko from "./ko.json";

export default function SduiDashboard() {
  const { lang, locale } = useI18n();
  return <JsonUI node={(lang === "en" ? en : ko) as JsonUINode} data={data} formats={formatsFor(locale)} />;
}
