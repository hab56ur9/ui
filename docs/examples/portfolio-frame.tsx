import { Portfolio, PortfolioSection, Project } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("portfolio-frame");
  return (
    <Portfolio name={text.haneulKim} role={text.backendEngineerPortfolio} intro={text.projectsWhereSmall}>
      <PortfolioSection title={text.keyProjects}>
        <Project
          title={text.rewardPayoutRedesign}
          period="2025"
          role={text.designAndBuild}
          image={{ alt: text.payoutFlow }}
          summary={text.aDedupKey}
          metrics={[
            { label: text.doublePayouts, value: text.n0 },
            { label: text.throughput, value: "3×" },
          ]}
          tags={["Go", "DynamoDB"]}
        />
      </PortfolioSection>
    </Portfolio>
  );
}
