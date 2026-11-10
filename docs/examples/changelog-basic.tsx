import { ChangeLog } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("changelog-basic");
  const team = text.frontendTeam;
  return (
    <ChangeLog
      items={[
        { version: "0.2", date: "2026-11-02", author: team, note: text.addedFailureHandling },
        { version: "0.1", date: "2026-10-28", author: team, note: text.firstDraft },
      ]}
    />
  );
}
