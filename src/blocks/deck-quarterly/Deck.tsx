import { AgendaSlide, BarChart, ChartSlide, ClosingSlide, CompareSlide, Deck, MetricSlide, SectionSlide, Slide, SlideHeader, Steps, TableSlide, TitleSlide, useI18n } from "ui";
import { TEXT } from "./text";

const WEEK = 7 * 86400000;
const START = new Date(2026, 5, 29).getTime();
const SIGNUPS = [3050, 3150, 3200, 3300, 3280, 3400, 3480, 3350, 3950, 4250, 4420, 4580, 4790];

export default function Quarterly() {
  const { lang, locale } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const day = new Intl.DateTimeFormat(locale, { month: "numeric", day: "numeric" });
  const whole = new Intl.NumberFormat(locale);
  return (
    <Deck title={t.deck}>
      <TitleSlide kicker={t.kicker} title={t.deck} subtitle={t.subtitle} meta={t.meta} />
      <AgendaSlide title={t.agenda} items={t.agendaItems} current={0} />
      <MetricSlide title={t.summary} takeaway={t.summaryTakeaway} metrics={t.metrics.map(({ label, value, change, note }) => ({ label, value, note, delta: { change, label: t.vsLast } }))} />
      <SectionSlide number={1} title={t.section} subtitle={t.sectionNote} />
      <TableSlide title={t.tableTitle} takeaway={t.tableTakeaway} table={{ columns: t.columns.map((label, i) => ({ label, numeric: i > 0 })), rows: t.rows }} />
      <ChartSlide title={t.chartTitle} takeaway={t.chartTakeaway}>
        <BarChart name={t.chartName} title={t.chartName} points={SIGNUPS.map((v, i) => ({ t: START + i * WEEK, v }))} format={{ axis: (v) => whole.format(v), value: (v) => whole.format(v), date: (d) => day.format(d) }} />
      </ChartSlide>
      <CompareSlide title={t.compareTitle} before={{ label: t.good, body: t.goodBody }} after={{ label: t.bad, body: t.badBody }} />
      <Slide>
        <SlideHeader title={t.next} />
        <Steps items={t.nextItems} />
      </Slide>
      <ClosingSlide title={t.closing} items={t.closingItems} contact={t.contact} />
    </Deck>
  );
}
