import { Doc, DocSection, Ref, RequirementTable } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("doc-basic");
  return (
    <Doc title={text.batchingNotifications} summary={text.sendAUser} meta={{ status: "draft", authors: [text.notificationsTeam], date: "2026-11-09", version: "0.1" }}>
      <DocSection title={text.background}>
        <p>{text.atPeakHours}</p>
      </DocSection>
      <DocSection title={text.requirements}>
        <RequirementTable
          items={[
            { text: text.aUserGets, priority: "must" },
            { text: text.securityAlertsSkip, priority: "must" },
          ]}
        />
      </DocSection>
      <DocSection title={text.design}>
        <p>
          {text.securityAlertsBypass}
          <Ref to="R2" />
          {text.text}
        </p>
      </DocSection>
    </Doc>
  );
}
