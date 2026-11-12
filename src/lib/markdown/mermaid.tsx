import { BarChart } from "../charts/BarChart";
import { LineChart } from "../charts/LineChart";

export type MermaidChart = { kind: "bar" | "line"; title?: string; unit?: string; labels: string[]; series: { name: string; values: number[] }[] };

const unquote = (text: string) => text.trim().replace(/^"(.*)"$/, "$1");
const listOf = (text: string) => {
  const inner = text.trim().match(/^\[(.*)\]$/)?.[1];
  return inner === undefined ? null : inner.split(",").map(unquote).filter((item) => item !== "");
};
const numbersOf = (text: string) => {
  const items = listOf(text);
  const values = items?.map(Number);
  return values && values.every(Number.isFinite) ? values : null;
};

function xychart(lines: string[]): MermaidChart | null {
  const chart: MermaidChart = { kind: "bar", labels: [], series: [] };
  const bars: number[][] = [];
  const lineSeries: number[][] = [];
  for (const line of lines) {
    const [, keyword = "", rest = ""] = line.match(/^(\S+)\s*(.*)$/) ?? [];
    if (keyword === "title") chart.title = unquote(rest);
    else if (keyword === "x-axis") {
      const labels = listOf(rest.replace(/^"[^"]*"\s*/, ""));
      if (!labels) return null;
      chart.labels = labels;
    } else if (keyword === "y-axis") chart.unit = rest.match(/^"([^"]*)"/)?.[1];
    else if (keyword === "bar" || keyword === "line") {
      const values = numbersOf(rest.replace(/^"[^"]*"\s*/, ""));
      if (!values) return null;
      (keyword === "bar" ? bars : lineSeries).push(values);
    } else return null;
  }
  const same = (a: number[], b: number[]) => a.length === b.length && a.every((value, i) => value === b[i]);
  const extraLines = lineSeries.filter((values) => !bars.some((bar) => same(bar, values)));
  const series = [...bars, ...extraLines];
  if (!series.length) return null;
  const count = Math.max(...series.map((values) => values.length));
  const labels = chart.labels.length ? chart.labels : Array.from({ length: count }, (_, i) => String(i + 1));
  const single = series.length === 1;
  return {
    ...chart,
    kind: single && bars.length ? "bar" : "line",
    labels,
    series: series.map((values, i) => ({ name: chart.title && single ? chart.title : `${i + 1}`, values })),
  };
}

function pie(first: string, lines: string[]): MermaidChart | null {
  const heading = first.match(/\btitle\s+(.+)$/)?.[1];
  const chart: MermaidChart = { kind: "bar", title: heading ? unquote(heading) : undefined, labels: [], series: [{ name: "", values: [] }] };
  for (const line of lines) {
    const title = line.match(/^title\s+(.+)$/);
    if (title) {
      chart.title = unquote(title[1]);
      continue;
    }
    const slice = line.match(/^"([^"]+)"\s*:\s*(-?[\d.]+)$/);
    if (!slice) return null;
    chart.labels.push(slice[1]);
    chart.series[0].values.push(Number(slice[2]));
  }
  chart.series[0].name = chart.title ?? "";
  return chart.labels.length ? chart : null;
}

export function parseMermaid(source: string): MermaidChart | null {
  const lines = source
    .split("\n")
    .map((line) => line.replace(/%%.*$/, "").trim())
    .filter(Boolean);
  const [first = "", ...rest] = lines;
  if (/^xychart-beta$/.test(first)) return xychart(rest);
  if (/^pie(\s+showData)?(\s+title\s+.+)?$/.test(first)) return pie(first, rest);
  return null;
}

export function MermaidView({ chart }: { chart: MermaidChart }) {
  const unit = chart.unit ? ` ${chart.unit}` : "";
  const format = { axis: (v: number) => `${v.toLocaleString()}${unit}`, value: (v: number) => `${v.toLocaleString()}${unit}` };
  const points = (values: number[]) => values.map((v, t) => ({ t, v }));
  return (
    <figure className="md-chart">
      {chart.title && <figcaption className="md-chart-title">{chart.title}</figcaption>}
      <div className="md-chart-plot">
        {chart.kind === "bar" ? (
          <BarChart name={chart.series[0].name} points={points(chart.series[0].values)} format={format} title={chart.title} categories={chart.labels} />
        ) : (
          <LineChart series={chart.series.map((series, i) => ({ name: series.name, color: i + 1, points: points(series.values) }))} format={format} categories={chart.labels} />
        )}
      </div>
    </figure>
  );
}
