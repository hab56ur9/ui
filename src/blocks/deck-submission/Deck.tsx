import { AgendaSlide, Bullets, ChartSlide, ClosingSlide, Deck, Image, LineChart, MetricSlide, Slide, SlideHeader, SplitSlide, Steps, TableSlide, Takeaway, TitleSlide, useI18n } from "ui";
import { TEXT } from "./text";

const START = new Date(2026, 8, 1).getTime();
const WEEK = 7 * 86400000;
const ACCURACY = [61, 64, 66, 70, 73, 75, 79, 82, 84, 86, 88, 91];
const BASELINE = [61, 61, 62, 62, 63, 63, 63, 64, 64, 64, 65, 65];

export default function Submission() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const points = (values: number[]) => values.map((v, i) => ({ t: START + i * WEEK, v }));
  return (
    <Deck title={t.deck}>
      <TitleSlide kicker={t.kicker} title={t.deck} subtitle={t.subtitle} meta={t.meta} />
      <AgendaSlide title={t.agenda} items={t.agendaItems} />
      <Slide source={t.backgroundSource}>
        <SlideHeader title={t.background} />
        <Takeaway>{t.backgroundTakeaway}</Takeaway>
        <Bullets items={t.backgroundItems} />
      </Slide>
      <SplitSlide title={t.architecture} takeaway={t.architectureTakeaway} ratio="3:2" left={<Image alt={t.architectureAlt} seed={7} ratio="16:9" />} right={<Bullets items={t.architectureItems} />} />
      <Slide>
        <SlideHeader title={t.build} />
        <Takeaway>{t.buildTakeaway}</Takeaway>
        <Steps items={t.buildSteps} />
      </Slide>
      <MetricSlide title={t.results} takeaway={t.resultsTakeaway} metrics={t.metrics.map(([label, value, note]) => ({ label, value, note }))} source={t.resultsSource} />
      <ChartSlide title={t.trend} takeaway={t.trendTakeaway} source={t.resultsSource}>
        <LineChart
          series={[
            { name: t.ours, color: 1, points: points(ACCURACY) },
            { name: t.baseline, color: 3, points: points(BASELINE) },
          ]}
          format={{ value: (v) => `${v}%`, axis: (v) => `${v}%` }}
        />
      </ChartSlide>
      <TableSlide title={t.roles} takeaway={t.rolesTakeaway} table={{ columns: t.roleColumns.map((label) => ({ label })), rows: t.roleRows }} />
      <SplitSlide title={t.limits} ratio="1:1" left={<Bullets items={t.limitItems} />} right={<Bullets items={t.nextItems} />} />
      <ClosingSlide title={t.closing} items={t.closingItems} contact={t.contact} />
    </Deck>
  );
}
