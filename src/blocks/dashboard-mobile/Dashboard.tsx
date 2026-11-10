import { AppShell, DataTable, Icon, LineChart, Page, Stat, useI18n, Widget, WidgetGrid, type Point } from "ui";
import { data, formatsFor } from "./data";
import { TEXT } from "./text";

type Platform = { id: string; slot: number; average: number; change: number };

const NAV = [
  ["home", "home"],
  ["charts", "chart-line"],
  ["alerts", "bell"],
  ["settings", "sliders"],
] as const;

export default function MobileDashboard() {
  const { lang, locale } = useI18n();
  const t = TEXT[lang === "en" ? "en" : "ko"];
  const fmt = formatsFor(locale);
  const go = () => undefined;
  return (
    <AppShell
      mobileNav="tabs"
      tabBar={{ variant: "floating", labels: "active" }}
      brand={
        <>
          <Icon name="chart-line" />
          {t.brand}
        </>
      }
      nav={[{ items: NAV.map(([id, icon]) => ({ id, label: t.nav[id], icon, current: id === "home", onSelect: go })) }]}
      title={t.nav.home}
    >
      <Page title={t.title} lede={t.lede}>
        <WidgetGrid>
          <Widget id="users" title={t.users} subtitle={t.dailyAverage} w={12} h={2}>
            <Stat value={fmt.compact(data["users.average"] as number)} delta={{ change: data["users.change"] as number, label: t.vsPrevious }} trend={data["users.trend"] as Point[]} />
          </Widget>
          <Widget id="revenue" title={t.revenue} w={6} h={2}>
            <Stat value={fmt.won(data["revenue.total"] as number)} delta={{ change: data["revenue.change"] as number, label: t.vsPrevious }} />
          </Widget>
          <Widget id="latency" title={t.latency} w={6} h={2}>
            <Stat value={fmt.ms(data["latency.p95"] as number)} delta={{ change: data["latency.change"] as number, goodWhenUp: false, label: t.vsPrevious }} />
          </Widget>
          <Widget id="daily" title={t.daily} w={12} h={4}>
            <LineChart series={[{ name: t.users, color: 1, points: data["users.daily"] as Point[] }]} format={{ axis: fmt.compact }} />
          </Widget>
          <Widget id="platforms" title={t.platforms} w={12} h={3}>
            <DataTable
              columns={[{ label: t.platform }, { label: t.average, numeric: true }, { label: t.change, numeric: true }]}
              rows={(data.platforms as Platform[]).map((p) => [{ text: t.platformName[p.id], color: p.slot }, fmt.compact(p.average), { delta: { change: p.change } }])}
            />
          </Widget>
        </WidgetGrid>
      </Page>
    </AppShell>
  );
}
