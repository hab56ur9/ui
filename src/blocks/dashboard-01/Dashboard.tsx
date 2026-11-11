import { useState } from "react";
import { AppShell, BarChart, Board, DataTable, type DataTableProps, DAY, Heatmap, Icon, type LayoutItem, LineChart, Page, Segmented, type ShellGroup, Sparkline, Stat, useI18n, Widget } from "ui";
import { campaignMarks, errors, HOURS, latency, mean, platforms, RANGES, releaseMarks, revenue, sum, total, WEEKDAYS, windowOf, type Range, type Window } from "./data";
import { TEXT, type Text } from "./text";

const formatters = (locale: string) => {
  const compact = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
  const whole = new Intl.NumberFormat(locale, { maximumFractionDigits: 0 });
  const fullDate = new Intl.DateTimeFormat(locale, { year: "numeric", month: "numeric", day: "numeric", weekday: "short" });
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "short" });
  return {
    count: (v: number) => compact.format(v),
    countFull: (v: number) => whole.format(v),
    won: (v: number) => `₩${compact.format(v)}`,
    ms: (v: number) => `${whole.format(v)}ms`,
    pct: (v: number) => `${(v * 100).toFixed(2)}%`,
    index: (v: number) => whole.format(v),
    monthDay: (t: number) => `${new Date(t).getMonth() + 1}/${new Date(t).getDate()}`,
    date: (t: number) => fullDate.format(t),
    weekday: (day: number) => weekday.format(new Date(2026, 0, 4 + day)),
  };
};

type Context = { w: Window; t: Text; fmt: ReturnType<typeof formatters>; label: string };
type Column = { label: string; values: number[]; format: (v: number) => string };

const dailyTable =
  ({ w, t, fmt }: Context, columns: Column[]) =>
  (): DataTableProps => ({
    columns: [{ label: t.date }, ...columns.map(({ label }) => ({ label, numeric: true }))],
    rows: w.days.map((day, i) => [fmt.date(day), ...columns.map(({ values, format }) => format(w.current(values)[i]))]).reverse(),
  });

type Kpi = { id: string; title: string; subtitle: string; values: number[]; aggregate: (xs: number[]) => number; format: (v: number) => string; goodWhenUp: boolean };

const kpi = ({ w, t, label }: Context, { id, title, subtitle, values, aggregate, format, goodWhenUp }: Kpi) => {
  const now = aggregate(w.current(values));
  return (
    <Widget key={id} id={id} title={title} subtitle={`${label} · ${subtitle}`} w={3} h={2} minW={2} minH={2}>
      <Stat value={format(now)} delta={{ change: now / aggregate(w.previous(values)) - 1, goodWhenUp, label: t.vsPrevious(t.range[w.range]) }} trend={w.trend(values)} />
    </Widget>
  );
};

function widgetsFor(ctx: Context) {
  const { w, t, fmt, label } = ctx;
  const signupDate = (day: number) => (w.weekly ? t.weekOf(`${fmt.monthDay(day - 6 * DAY)} – ${fmt.monthDay(day)}`) : fmt.date(day));
  const weekdayNames = WEEKDAYS.map(fmt.weekday);
  const name = (id: string) => t.platformName[id];
  const forecast = w.forecast();
  const heat = w.heat();
  const all = mean(w.current(total));
  return [
    kpi(ctx, { id: "kpi-users", title: t.users, subtitle: t.dailyAverage, values: total, aggregate: mean, format: fmt.count, goodWhenUp: true }),
    kpi(ctx, { id: "kpi-revenue", title: t.revenue, subtitle: t.total, values: revenue, aggregate: sum, format: fmt.won, goodWhenUp: true }),
    kpi(ctx, { id: "kpi-latency", title: t.latency, subtitle: t.average, values: latency, aggregate: mean, format: fmt.ms, goodWhenUp: false }),
    kpi(ctx, { id: "kpi-errors", title: t.errors, subtitle: t.average, values: errors, aggregate: mean, format: fmt.pct, goodWhenUp: false }),
    <Widget
      key="users"
      id="users"
      title={t.platformUsers}
      subtitle={`${label} · ${t.platformUsersNote}`}
      w={8}
      h={5}
      minW={4}
      minH={3}
      table={dailyTable(
        ctx,
        platforms.map((p) => ({ label: name(p.id), values: p.values, format: fmt.countFull })),
      )}
    >
      <LineChart
        title={t.platformUsersChart}
        series={platforms.map((p) => ({ name: name(p.id), color: p.slot, points: w.pairs(p.values) }))}
        annotations={[...releaseMarks, ...campaignMarks.map(({ t: day, id }) => ({ t: day, label: t.campaign[id] }))]}
        format={{ axis: fmt.count }}
      />
    </Widget>,
    <Widget
      key="signups"
      id="signups"
      title={t.signups}
      subtitle={`${label} · ${w.weekly ? t.weeklyTotal : t.daily}`}
      w={4}
      h={5}
      minW={3}
      minH={3}
      table={() => ({
        columns: [{ label: w.weekly ? t.week : t.date }, { label: t.signups, numeric: true }],
        rows: w
          .signups()
          .map(({ t: day, v }) => [signupDate(day), fmt.countFull(v)])
          .reverse(),
      })}
    >
      <BarChart title={t.signups} name={t.signups} points={w.signups()} format={{ axis: fmt.count, value: fmt.countFull, date: signupDate }} />
    </Widget>,
    <Widget
      key="growth"
      id="growth"
      title={t.growth}
      subtitle={`${label} · ${t.growthNote}`}
      w={6}
      h={4}
      minW={4}
      minH={3}
      table={() => {
        const users = w.indexed(total);
        return {
          columns: [{ label: t.date }, { label: t.revenueIndex, numeric: true }, { label: t.usersIndex, numeric: true }],
          rows: w
            .indexed(revenue)
            .map(({ t: day, v }, i) => [fmt.date(day), v.toFixed(1), users[i].v.toFixed(1)])
            .reverse(),
        };
      }}
    >
      <LineChart
        title={t.growthChart}
        series={[
          { name: t.revenue, color: 1, points: w.indexed(revenue) },
          { name: t.users, color: 2, points: w.indexed(total) },
        ]}
        baseline={100}
        format={{ axis: fmt.index }}
      />
    </Widget>,
    <Widget key="latency" id="latency" title={t.latency} subtitle={`${label} · ${t.daily} · SLO 250ms`} w={6} h={4} minW={4} minH={3} table={dailyTable(ctx, [{ label: "p95", values: latency, format: fmt.ms }])}>
      <LineChart
        title={t.latencyChart}
        series={[{ name: "p95", color: 1, points: w.pairs(latency), area: true, flagBreaches: true }]}
        threshold={{ value: 250, label: "SLO 250ms", breach: t.breach }}
        format={{ axis: fmt.ms }}
      />
    </Widget>,
    <Widget
      key="forecast"
      id="forecast"
      title={t.forecast}
      subtitle={`${label} · ${t.forecastNote(w.horizon)}`}
      w={8}
      h={4}
      minW={4}
      minH={3}
      table={() => ({
        columns: [{ label: t.date }, { label: t.predicted, numeric: true }, { label: t.lower, numeric: true }, { label: t.upper, numeric: true }],
        rows: forecast.mean.slice(1).map(({ t: day, v }, i) => [fmt.date(day), fmt.countFull(v), fmt.countFull(forecast.lower[i + 1].v), fmt.countFull(forecast.upper[i + 1].v)]),
      })}
    >
      <LineChart
        title={t.forecastChart}
        series={[
          { name: t.actual, color: 1, points: w.pairs(total) },
          { name: t.predicted, color: 1, dashed: true, points: forecast.mean },
        ]}
        band={{ name: t.band, color: 1, lower: forecast.lower, upper: forecast.upper }}
        format={{ axis: fmt.count, value: fmt.countFull }}
        endLabels={false}
      />
    </Widget>,
    <Widget
      key="heatmap"
      id="heatmap"
      title={t.heatmap}
      subtitle={`${label} · ${t.heatmapNote}`}
      w={4}
      h={4}
      minW={3}
      minH={3}
      table={() => ({
        columns: [{ label: t.hour }, ...weekdayNames.map((day) => ({ label: day, numeric: true }))],
        rows: HOURS.map((h) => [t.hourOf(h), ...weekdayNames.map((_, r) => fmt.countFull(heat[r][h]))]),
      })}
    >
      <Heatmap title={t.heatmapChart} rows={weekdayNames} columns={HOURS} values={heat} format={{ value: fmt.count, column: t.hourOf }} />
    </Widget>,
    <Widget key="platforms" id="platforms" title={t.summary} subtitle={`${label} · ${t.summaryNote}`} w={12} h={3} minW={6} minH={2}>
      <DataTable
        columns={[{ label: t.platform }, { label: t.dailyAverage, numeric: true }, { label: t.share, numeric: true }, { label: t.change, numeric: true }, { label: t.trend }]}
        rows={platforms.map((p) => {
          const now = mean(w.current(p.values));
          return [
            { text: name(p.id), color: p.slot },
            fmt.countFull(now),
            `${((now / all) * 100).toFixed(1)}%`,
            { delta: { change: now / mean(w.previous(p.values)) - 1 } },
            { render: () => <Sparkline points={w.trend(p.values)} color={p.slot} /> },
          ];
        })}
      />
    </Widget>,
  ];
}

type Section = keyof Text["nav"];

const navOf = (t: Text, current: Section, select: (id: Section) => void): ShellGroup[] => {
  const item = (id: Section, icon: string) => ({ id, label: t.nav[id], icon, current: id === current, onSelect: () => select(id) });
  return [
    { items: [item("overview", "home")] },
    { title: t.navGroups.analytics, items: [item("traffic", "chart-line"), item("revenue", "chart-bar"), item("performance", "clock")] },
    { title: t.navGroups.operations, items: [item("alerts", "bell"), item("reports", "table"), item("settings", "sliders")] },
  ];
};

const setting = (name: string) => {
  try {
    return new URLSearchParams(location.search).get(name) ?? localStorage.getItem(`ts.${name}`);
  } catch {
    return null;
  }
};
const remember = (name: string, value: string) => {
  try {
    localStorage.setItem(`ts.${name}`, value);
  } catch {
    return;
  }
};
const savedLayout = (): LayoutItem[] | undefined => {
  try {
    return JSON.parse(setting("layout.v2") ?? "null") ?? undefined;
  } catch {
    return undefined;
  }
};
const rangeOf = (value: string | null): Range => RANGES.find((range) => String(range) === value) ?? 90;

export default function Dashboard() {
  const { lang, locale } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const [range, setRange] = useState(() => rangeOf(setting("range")));
  const [section, setSection] = useState<Section>("overview");
  const [layout] = useState(savedLayout);

  return (
    <AppShell
      brand={
        <>
          <Icon name="chart-line" />
          {t.brand}
        </>
      }
      nav={navOf(t, section, setSection)}
      title={t.nav[section]}
    >
      <Page title={t.title} lede={t.lede}>
        <Board
          initialLayout={layout}
          onLayoutCommit={(next) => remember("layout.v2", JSON.stringify(next))}
          toolbar={
            <Segmented
              label={t.period}
              value={String(range)}
              onChange={(value) => {
                remember("range", value);
                setRange(rangeOf(value));
              }}
              options={RANGES.map((value) => ({ value: String(value), label: t.range[value] }))}
            />
          }
        >
          {widgetsFor({ w: windowOf(range), t, fmt: formatters(locale), label: t.recent(t.range[range]) })}
        </Board>
      </Page>
    </AppShell>
  );
}
