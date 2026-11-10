import { Resume, ResumeEntry, ResumeSection, useI18n } from "ui";
import { TEXT } from "./text";

export default function ResumeBasic() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  return (
    <Resume name={t.name} role={t.role} contacts={t.contacts} summary={t.summary}>
      <ResumeSection title={t.experience}>
        {t.jobs.map((job) => (
          <ResumeEntry key={job.period} {...job} />
        ))}
      </ResumeSection>
      <ResumeSection title={t.projects}>
        {t.projectItems.map((project) => (
          <ResumeEntry key={project.title} {...project} />
        ))}
      </ResumeSection>
      <ResumeSection title={t.education}>
        <ResumeEntry {...t.school} />
      </ResumeSection>
      <ResumeSection title={t.skills}>
        <ResumeEntry tags={t.skillTags} />
      </ResumeSection>
    </Resume>
  );
}
