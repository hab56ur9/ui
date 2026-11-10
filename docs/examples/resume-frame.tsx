import { Resume, ResumeEntry, ResumeSection } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("resume-frame");
  return (
    <Resume
      name={text.haneulKim}
      role={text.backendEngineer}
      contacts={[{ label: "haneul@example.com", href: "mailto:haneul@example.com" }, { label: "github.com/haneul" }]}
      summary={text.eightYearsBuilding}
    >
      <ResumeSection title={text.experience}>
        <ResumeEntry title={text.seniorEngineer} org={text.examplepay} period="2022 – 2026" items={[text.cutSettlementDelay]} tags={["Go", "Kafka"]} />
      </ResumeSection>
    </Resume>
  );
}
