import type { ReactNode } from "react";
import { Stat, type DeltaProps } from "../controls";
import { DataTable, type DataTableProps } from "../DataTable";
import { Icon } from "../Icon";
import { Slide, SlideHeader, type SlideTone } from "./Deck";
import { Bullets, Takeaway } from "../content";

type Common = { notes?: string; source?: ReactNode };

export type TitleSlideProps = Common & { kicker?: ReactNode; title: ReactNode; subtitle?: ReactNode; meta?: ReactNode; tone?: SlideTone };

export function TitleSlide({ kicker, title, subtitle, meta, tone = "plain" }: TitleSlideProps) {
  return (
    <Slide tone={tone} footer={false} className="title-slide">
      {kicker && <div className="slide-kicker">{kicker}</div>}
      <h1 className="title-slide-title">{title}</h1>
      {subtitle && <p className="title-slide-subtitle">{subtitle}</p>}
      {meta && <div className="title-slide-meta">{meta}</div>}
    </Slide>
  );
}

export type AgendaSlideProps = Common & { title: ReactNode; items: string[]; current?: number };

export function AgendaSlide({ title, items, current, source }: AgendaSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      <ol className="agenda">
        {items.map((item, i) => (
          <li key={item} aria-current={i === current ? "step" : undefined}>
            <span className="agenda-number">{String(i + 1).padStart(2, "0")}</span>
            {item}
          </li>
        ))}
      </ol>
    </Slide>
  );
}

export type SectionSlideProps = Common & { number?: number; title: ReactNode; subtitle?: ReactNode; tone?: SlideTone };

export function SectionSlide({ number, title, subtitle, tone = "dark" }: SectionSlideProps) {
  return (
    <Slide tone={tone} className="section-slide">
      {number !== undefined && <div className="section-slide-number">{String(number).padStart(2, "0")}</div>}
      <h2 className="section-slide-title">{title}</h2>
      {subtitle && <p className="slide-subtitle">{subtitle}</p>}
    </Slide>
  );
}

export type StatementSlideProps = Common & { kicker?: ReactNode; statement: ReactNode; detail?: ReactNode; tone?: SlideTone };

export function StatementSlide({ kicker, statement, detail, tone = "plain", source }: StatementSlideProps) {
  return (
    <Slide tone={tone} source={source} className="statement-slide">
      {kicker && <div className="slide-kicker">{kicker}</div>}
      <p className="statement">{statement}</p>
      {detail && <p className="slide-subtitle">{detail}</p>}
    </Slide>
  );
}

export type Metric = { label: string; value: ReactNode; delta?: DeltaProps & { label?: string }; note?: string };
export type MetricSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; metrics: Metric[] };

export function MetricSlide({ title, takeaway, metrics, source }: MetricSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <div className="metrics" data-count={metrics.length} style={{ gridTemplateColumns: `repeat(${metrics.length}, minmax(0, 1fr))` }}>
        {metrics.map((metric) => (
          <div className="metric" key={metric.label}>
            <Stat label={metric.label} value={metric.value} delta={metric.delta} note={metric.note} />
          </div>
        ))}
      </div>
    </Slide>
  );
}

export type ChartSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; aside?: ReactNode; children: ReactNode };

export function ChartSlide({ title, takeaway, aside, source, children }: ChartSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <div className={`chart-slide${aside ? " has-aside" : ""}`}>
        <div className="chart-slide-figure">{children}</div>
        {aside && <div className="chart-slide-aside">{aside}</div>}
      </div>
    </Slide>
  );
}

export type SplitSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; left: ReactNode; right: ReactNode; ratio?: "1:1" | "2:3" | "3:2" };

export function SplitSlide({ title, takeaway, left, right, ratio = "1:1", source }: SplitSlideProps) {
  const [a, b] = ratio.split(":");
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <div className="split" style={{ gridTemplateColumns: `${a}fr ${b}fr` }}>
        <div className="split-pane">{left}</div>
        <div className="split-pane">{right}</div>
      </div>
    </Slide>
  );
}

export type ComparePane = { label: string; body: ReactNode };
export type CompareSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; before: ComparePane; after: ComparePane };

export function CompareSlide({ title, takeaway, before, after, source }: CompareSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <div className="compare">
        <div className="compare-pane">
          <div className="compare-label">{before.label}</div>
          <div className="compare-body">{before.body}</div>
        </div>
        <span className="compare-arrow" aria-hidden="true">
          <Icon name="chevron-right" />
        </span>
        <div className="compare-pane is-after">
          <div className="compare-label">{after.label}</div>
          <div className="compare-body">{after.body}</div>
        </div>
      </div>
    </Slide>
  );
}

export type Milestone = { date: string; title: string; body?: string; done?: boolean };
export type TimelineSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; items: Milestone[] };

export function TimelineSlide({ title, takeaway, items, source }: TimelineSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <ol className="timeline" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map((item) => (
          <li key={`${item.date}-${item.title}`} className={item.done ? "is-done" : undefined}>
            <span className="timeline-dot" aria-hidden="true" />
            <span className="timeline-date">{item.date}</span>
            <strong>{item.title}</strong>
            {item.body && <p>{item.body}</p>}
          </li>
        ))}
      </ol>
    </Slide>
  );
}

export type TableSlideProps = Common & { title: ReactNode; takeaway?: ReactNode; table: DataTableProps };

export function TableSlide({ title, takeaway, table, source }: TableSlideProps) {
  return (
    <Slide source={source}>
      <SlideHeader title={title} />
      {takeaway && <Takeaway>{takeaway}</Takeaway>}
      <div className="table-slide">
        <DataTable {...table} />
      </div>
    </Slide>
  );
}

export type QuoteSlideProps = Common & { quote: ReactNode; by?: ReactNode; role?: ReactNode; tone?: SlideTone };

export function QuoteSlide({ quote, by, role, tone = "plain", source }: QuoteSlideProps) {
  return (
    <Slide tone={tone} source={source} className="quote-slide">
      <blockquote className="quote">
        <p>{quote}</p>
        {by && (
          <footer>
            <strong>{by}</strong>
            {role && <span>{role}</span>}
          </footer>
        )}
      </blockquote>
    </Slide>
  );
}

export type ClosingSlideProps = Common & { title: ReactNode; items?: string[]; contact?: ReactNode; tone?: SlideTone };

export function ClosingSlide({ title, items, contact, tone = "dark" }: ClosingSlideProps) {
  return (
    <Slide tone={tone} footer={false} className="closing-slide">
      <h2 className="closing-title">{title}</h2>
      {items && <Bullets items={items} />}
      {contact && <div className="closing-contact">{contact}</div>}
    </Slide>
  );
}
