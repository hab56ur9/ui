import { useI18n } from "ui";
import { PrdEn } from "./en";
import { PrdKo } from "./ko";

export default function Prd() {
  const { lang } = useI18n();
  return lang === "en" ? <PrdEn /> : <PrdKo />;
}
