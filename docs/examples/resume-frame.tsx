import { Resume, ResumeEntry, ResumeSection } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Resume
      name={t({ ko: "김하늘", en: "Haneul Kim" })}
      role={t({ ko: "백엔드 엔지니어", en: "Backend engineer" })}
      contacts={[{ label: "haneul@example.com", href: "mailto:haneul@example.com" }, { label: "github.com/haneul" }]}
      summary={t({ ko: "결제와 정산 시스템을 8년 동안 만들었습니다.", en: "Eight years building payment and settlement systems." })}
    >
      <ResumeSection title={t({ ko: "경력", en: "Experience" })}>
        <ResumeEntry
          title={t({ ko: "시니어 엔지니어", en: "Senior engineer" })}
          org={t({ ko: "예시페이", en: "ExamplePay" })}
          period="2022 – 2026"
          items={[t({ ko: "정산 지연을 하루에서 10분으로 줄였습니다.", en: "Cut settlement delay from a day to ten minutes." })]}
          tags={["Go", "Kafka"]}
        />
      </ResumeSection>
    </Resume>
  );
}
