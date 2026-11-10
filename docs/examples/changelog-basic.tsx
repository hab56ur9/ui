import { ChangeLog } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const team = t({ ko: "프론트엔드 팀", en: "Frontend team" });
  return (
    <ChangeLog
      items={[
        { version: "0.2", date: "2026-11-02", author: team, note: t({ ko: "실패 처리를 추가했습니다.", en: "Added failure handling." }) },
        { version: "0.1", date: "2026-10-28", author: team, note: t({ ko: "초안", en: "First draft" }) },
      ]}
    />
  );
}
