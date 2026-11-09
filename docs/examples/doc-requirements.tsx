import { RequirementTable } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <RequirementTable
      items={[
        { text: t({ ko: "새로고침 뒤에도 배치가 유지됩니다.", en: "The layout survives a refresh." }), priority: "must", status: "done" },
        { text: t({ ko: "저장소가 없어도 동작합니다.", en: "It works without storage." }), priority: "must", note: t({ ko: "사생활 보호 모드", en: "Private mode" }) },
        { text: t({ ko: "배치 초기화를 되돌릴 수 있습니다.", en: "A layout reset can be undone." }), priority: "should" },
        { text: t({ ko: "서버에 저장합니다.", en: "Layouts are saved on the server." }), priority: "could", status: "dropped" },
      ]}
    />
  );
}
