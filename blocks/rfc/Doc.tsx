import { useI18n } from "ui";
import { RfcEn } from "./en";
import { RfcKo } from "./ko";

export default function Rfc() {
  const { lang } = useI18n();
  return lang === "en" ? <RfcEn /> : <RfcKo />;
}
