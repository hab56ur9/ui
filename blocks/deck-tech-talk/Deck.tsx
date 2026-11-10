import { AgendaSlide, BarChart, Bullets, ChartSlide, ClosingSlide, CodeBlock, Deck, QuoteSlide, Slide, SlideHeader, SplitSlide, StatementSlide, Steps, Takeaway, TitleSlide, useI18n } from "ui";
import { TEXT } from "./text";

const CODE = `export function cached<A, R>(fn: (arg: A) => Promise<R>, ttl = 1000) {
  const hits = new Map<A, { at: number; value: Promise<R> }>();
  return (arg: A) => {
    const hit = hits.get(arg);
    if (hit && Date.now() - hit.at < ttl) return hit.value;
    const value = fn(arg);
    hits.set(arg, { at: Date.now(), value });
    return value;
  };
}`;

const P95 = [240, 236, 171, 124, 118];

export default function TechTalk() {
  const { lang } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const start = new Date(2026, 9, 12).getTime();
  return (
    <Deck title={t.deck}>
      <TitleSlide tone="dark" kicker={t.kicker} title={t.deck} subtitle={t.subtitle} meta={t.meta} />
      <AgendaSlide title={t.agenda} items={t.agendaItems} current={0} />
      <StatementSlide kicker={t.why} statement={t.whyStatement} detail={t.whyDetail} />
      <SplitSlide title={t.approach} ratio="3:2" left={<Bullets items={t.approachLeft} />} right={<p>{t.approachRight}</p>} />
      <Slide>
        <SlideHeader title={t.codeTitle} />
        <CodeBlock code={CODE} lang="tsx" title="cached.ts" />
        <Takeaway>{t.codeTakeaway}</Takeaway>
      </Slide>
      <ChartSlide title={t.resultTitle} takeaway={t.resultTakeaway}>
        <BarChart name={t.chartName} title={t.chartName} points={P95.map((v, i) => ({ t: start + i * 7 * 86400000, v }))} format={{ axis: (v) => `${v}ms`, value: (v) => `${v}ms` }} />
      </ChartSlide>
      <QuoteSlide quote={t.quote} by={t.quoteBy} tone="accent" />
      <Slide>
        <SlideHeader title={t.lessons} />
        <Steps items={t.lessonsItems} />
      </Slide>
      <ClosingSlide title={t.closing} items={t.closingItems} contact={t.contact} />
    </Deck>
  );
}
