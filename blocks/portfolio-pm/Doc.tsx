import { Portfolio, PortfolioSection, Project, useI18n } from "ui";
import { TEXT } from "./text";

export default function PortfolioPm() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  return (
    <Portfolio name={t.name} role={t.role} intro={t.intro} contacts={t.contacts} density="compact">
      <PortfolioSection title={t.featured}>
        {t.projects.map(({ seed, alt, points, ...project }) => (
          <Project key={project.title} {...project} image={{ alt, seed }}>
            <ul>
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </Project>
        ))}
      </PortfolioSection>
      <PortfolioSection title={t.more}>
        {t.others.map((project) => (
          <Project key={project.title} {...project} />
        ))}
      </PortfolioSection>
    </Portfolio>
  );
}
