import { Portfolio, PortfolioSection, Project } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Portfolio
      name={t({ ko: "김하늘", en: "Haneul Kim" })}
      role={t({ ko: "백엔드 엔지니어 포트폴리오", en: "Backend engineer portfolio" })}
      intro={t({ ko: "작은 변경으로 큰 지표를 움직인 프로젝트입니다.", en: "Projects where small changes moved big numbers." })}
    >
      <PortfolioSection title={t({ ko: "주요 프로젝트", en: "Key projects" })}>
        <Project
          title={t({ ko: "보상 지급 시스템 재설계", en: "Reward payout redesign" })}
          period="2025"
          role={t({ ko: "설계·구현 리드", en: "Design and build lead" })}
          image={{ alt: t({ ko: "지급 흐름도", en: "Payout flow" }) }}
          summary={t({ ko: "중복 지급을 막는 키를 설계해 사고를 없앴습니다.", en: "A dedup key design ended double payouts." })}
          metrics={[
            { label: t({ ko: "중복 지급", en: "Double payouts" }), value: t({ ko: "0건", en: "0" }) },
            { label: t({ ko: "처리량", en: "Throughput" }), value: "3×" },
          ]}
          tags={["Go", "DynamoDB"]}
        />
      </PortfolioSection>
    </Portfolio>
  );
}
