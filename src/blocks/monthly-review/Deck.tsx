import { AgendaSlide, Callout, ChartSlide, ClosingSlide, Deck, LineChart, MetricSlide, SectionSlide, Slide, SlideHeader, SplitSlide, StatementSlide, Steps, Bullets, TitleSlide, useI18n } from "ui";
import { campaignMarks, errors, latency, mean, platforms, releaseMarks, revenue, sum, total, windowOf } from "../dashboard-01/data";
import { TEXT } from "./text";

const SLO = 250;

export default function MonthlyReview() {
  const { lang, locale } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const whole = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const w = windowOf(30);
  const change = (values: number[], aggregate: (xs: number[]) => number) => aggregate(w.current(values)) / aggregate(w.previous(values)) - 1;
  const ranked = platforms.map((p) => ({ name: t.platformName[p.id], change: change(p.values, mean) })).sort((a, b) => b.change - a.change);
  const growth = ranked[0];
  const breaches = w.current(latency).filter((v) => v > SLO).length;
  const forecast = w.forecast();
  const ahead = forecast.mean.slice(1);

  return (
    <Deck title={t.deck}>
      <TitleSlide kicker={t.kicker} title={t.deck} subtitle={t.subtitle} meta={t.meta} />
      <AgendaSlide title={t.agenda} items={t.agendaItems} current={0} />
      <MetricSlide
        title={t.summary}
        takeaway={t.summaryTakeaway(change(total, mean), change(revenue, sum))}
        source={t.source}
        notes={t.notesSummary}
        metrics={[
          { label: `${t.users} · ${t.dailyAverage}`, value: compact.format(mean(w.current(total))), delta: { change: change(total, mean), label: t.vsPrevious } },
          { label: t.revenue, value: `₩${compact.format(sum(w.current(revenue)))}`, delta: { change: change(revenue, sum), label: t.vsPrevious } },
          { label: t.latency, value: `${whole.format(mean(w.current(latency)))}ms`, delta: { change: change(latency, mean), goodWhenUp: false, label: t.vsPrevious } },
          { label: t.errors, value: `${(mean(w.current(errors)) * 100).toFixed(2)}%`, delta: { change: change(errors, mean), goodWhenUp: false, label: t.vsPrevious } },
        ]}
      />
      <SectionSlide number={1} title={t.usersSection} subtitle={t.usersSectionNote} />
      <ChartSlide
        title={t.platformTitle}
        takeaway={t.platformTakeaway(growth.name, growth.change)}
        source={t.source}
        aside={
          <Callout title={t.campaign}>{t.campaignNote}</Callout>
        }
      >
        <LineChart
          title={t.platformTitle}
          series={platforms.map((p) => ({ name: t.platformName[p.id], color: p.slot, points: w.pairs(p.values) }))}
          annotations={[...releaseMarks, ...campaignMarks.map(({ t: day }) => ({ t: day, label: t.campaign }))]}
          format={{ axis: (v) => compact.format(v) }}
        />
      </ChartSlide>
      <ChartSlide title={t.latencyTitle} takeaway={t.latencyTakeaway(breaches)} source={t.source} notes={t.notesLatency(breaches)}>
        <LineChart
          title={t.latencyTitle}
          series={[{ name: "p95", color: 1, points: w.pairs(latency), area: true, flagBreaches: true }]}
          threshold={{ value: SLO, label: `SLO ${SLO}ms`, breach: t.breach }}
          format={{ axis: (v) => `${whole.format(v)}ms` }}
        />
      </ChartSlide>
      <SplitSlide
        title={t.forecastTitle}
        takeaway={t.forecastTakeaway(compact.format(mean(ahead.map(({ v }) => v))), ahead.length)}
        ratio="2:3"
        source={t.source}
        left={<Bullets items={t.forecastPoints} />}
        right={
          <LineChart
            title={t.forecastTitle}
            series={[
              { name: t.actual, color: 1, points: w.pairs(total) },
              { name: t.predicted, color: 1, dashed: true, points: forecast.mean },
            ]}
            band={{ name: t.band, color: 1, lower: forecast.lower, upper: forecast.upper }}
            format={{ axis: (v) => compact.format(v) }}
            endLabels={false}
          />
        }
      />
      <StatementSlide tone="accent" statement={t.statement(ranked[ranked.length - 1].name)} detail={t.statementDetail} />
      <Slide source={t.source}>
        <SlideHeader title={t.nextTitle} />
        <Steps items={t.steps} />
        <Callout>{t.nextNote}</Callout>
      </Slide>
      <ClosingSlide title={t.closing} items={t.closingItems(ranked[ranked.length - 1].name)} contact={t.contact} />
    </Deck>
  );
}
