import { Portfolio, PortfolioSection, Project, useI18n } from "ui";
import { TEXT } from "./text";

export default function PortfolioPm() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  return (
    <Portfolio name={t.name} role={t.role} intro={t.intro} contacts={t.contacts}>
      <PortfolioSection title={t.featured}>
        {t.projects.map(({ seed, alt, ...project }) => (
          <Project key={project.title} {...project} image={{ alt, seed }} />
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
