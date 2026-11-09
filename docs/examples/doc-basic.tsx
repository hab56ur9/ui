import { Doc, DocSection, Ref, RequirementTable } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Doc
      title={t({ ko: "알림 묶어 보내기", en: "Batching notifications" })}
      summary={t({ ko: "같은 사용자에게 가는 알림을 5분 단위로 묶어 한 번에 보냅니다.", en: "Send a user's notifications together in five-minute batches." })}
      meta={{ status: "draft", authors: [t({ ko: "알림 팀", en: "Notifications team" })], date: "2026-11-09", version: "0.1" }}
    >
      <DocSection title={t({ ko: "배경", en: "Background" })}>
        <p>{t({ ko: "바쁜 시간대에는 한 사용자가 1분에 알림을 열 개 넘게 받습니다.", en: "At peak hours a user gets more than ten notifications a minute." })}</p>
      </DocSection>
      <DocSection title={t({ ko: "요구사항", en: "Requirements" })}>
        <RequirementTable
          items={[
            { text: t({ ko: "같은 사용자의 알림은 5분 안에 한 번만 보냅니다.", en: "A user gets at most one send every five minutes." }), priority: "must" },
            { text: t({ ko: "보안 알림은 묶지 않고 바로 보냅니다.", en: "Security alerts skip batching." }), priority: "must" },
          ]}
        />
      </DocSection>
      <DocSection title={t({ ko: "설계", en: "Design" })}>
        <p>
          {t({ ko: "보안 알림은 큐를 건너뜁니다. 이렇게 ", en: "Security alerts bypass the queue. That meets " })}
          <Ref to="R2" />
          {t({ ko: "를 만족합니다.", en: "." })}
        </p>
      </DocSection>
    </Doc>
  );
}
