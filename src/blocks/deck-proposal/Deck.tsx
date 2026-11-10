import { AgendaSlide, Bullets, ClosingSlide, CompareSlide, Deck, MetricSlide, Slide, SlideHeader, Steps, Takeaway, TimelineSlide, TitleSlide, useI18n } from "ui";
import { TEXT } from "./text";

export default function Proposal() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  return (
    <Deck title={t.deck}>
      <TitleSlide tone="accent" kicker={t.kicker} title={t.deck} subtitle={t.subtitle} meta={t.meta} />
      <AgendaSlide title={t.agenda} items={t.agendaItems} current={0} />
      <Slide>
        <SlideHeader title={t.problem} />
        <Takeaway>{t.problemTakeaway}</Takeaway>
        <Bullets items={t.problemItems} />
      </Slide>
      <CompareSlide title={t.compare} before={{ label: t.before, body: t.beforeBody }} after={{ label: t.after, body: t.afterBody }} />
      <MetricSlide title={t.impact} takeaway={t.impactTakeaway} metrics={t.metrics.map(([label, value, note]) => ({ label, value, note }))} />
      <TimelineSlide title={t.timeline} items={t.milestones} />
      <Slide>
        <SlideHeader title={t.ask} />
        <Steps items={t.askItems} />
      </Slide>
      <ClosingSlide title={t.closing} items={t.closingItems} contact={t.contact} />
    </Deck>
  );
}
