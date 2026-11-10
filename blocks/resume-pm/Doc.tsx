import { Resume, ResumeEntry, ResumeSection, useI18n } from "ui";
import { TEXT } from "./text";

export default function ResumePm() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  return (
    <Resume name={t.name} role={t.role} contacts={t.contacts} summary={t.summary}>
      <ResumeSection title={t.experience}>
        {t.jobs.map((job) => (
          <ResumeEntry key={job.period} {...job} />
        ))}
      </ResumeSection>
      <ResumeSection title={t.products}>
        {t.productItems.map((product) => (
          <ResumeEntry key={product.title} {...product} />
        ))}
      </ResumeSection>
      <ResumeSection title={t.education}>
        <ResumeEntry {...t.school} />
      </ResumeSection>
      <ResumeSection title={t.methods}>
        <ResumeEntry tags={t.methodTags} />
      </ResumeSection>
      <ResumeSection title={t.tools}>
        <ResumeEntry tags={t.toolTags} />
      </ResumeSection>
    </Resume>
  );
}
