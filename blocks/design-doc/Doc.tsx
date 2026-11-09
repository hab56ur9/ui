import { useI18n } from "ui";
import { DesignDocEn } from "./en";
import { DesignDocKo } from "./ko";

export default function DesignDoc() {
  const { lang } = useI18n();
  return lang === "en" ? <DesignDocEn /> : <DesignDocKo />;
}
