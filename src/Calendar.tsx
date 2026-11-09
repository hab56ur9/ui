import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

export type CalendarProps = { value?: number | null; onChange?: (day: number) => void; marks?: number[]; month?: number; today?: number; label?: string };

const startOf = (t: number) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
};
const monthStart = (t: number) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
};
const shiftMonth = (t: number, n: number) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth() + n, 1).getTime();
};
const addDays = (t: number, n: number) => {
  const d = new Date(t);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + n).getTime();
};

const MOVES: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

export function Calendar({ value, onChange, marks = [], month, today = Date.now(), label }: CalendarProps) {
  const { locale, text } = useI18n();
  const now = startOf(today);
  const [shown, setShown] = useState(() => monthStart(month ?? value ?? now));
  const [focus, setFocus] = useState(() => startOf(value ?? (monthStart(now) === shown ? now : shown)));
  const grid = useRef<HTMLTableElement>(null);
  const focused = useRef(false);
  const marked = new Set(marks.map(startOf));
  const first = new Date(shown).getDay();
  const days = Array.from({ length: 42 }, (_, i) => addDays(shown, i - first));
  const weeks = Array.from({ length: days.at(35) && new Date(days[35]).getMonth() === new Date(shown).getMonth() ? 6 : 5 }, (_, w) => days.slice(w * 7, w * 7 + 7));
  const title = new Intl.DateTimeFormat(locale, { year: "numeric", month: "long" }).format(shown);
  const weekday = new Intl.DateTimeFormat(locale, { weekday: "narrow" });
  const full = new Intl.DateTimeFormat(locale, { dateStyle: "full" });

  useEffect(() => {
    if (focused.current) grid.current?.querySelector<HTMLButtonElement>(`[data-day="${focus}"]`)?.focus();
  }, [focus, shown]);

  const move = (to: number) => {
    setFocus(to);
    if (monthStart(to) !== shown) setShown(monthStart(to));
  };
  const onKey = (e: KeyboardEvent) => {
    focused.current = true;
    if (e.key in MOVES) move(addDays(focus, MOVES[e.key]));
    if (e.key === "PageUp") move(addDays(focus, -new Date(addDays(shown, -1)).getDate()));
    if (e.key === "PageDown") move(addDays(focus, new Date(addDays(shiftMonth(shown, 1), -1)).getDate()));
    if (e.key === "Home") move(addDays(focus, -new Date(focus).getDay()));
    if (e.key === "End") move(addDays(focus, 6 - new Date(focus).getDay()));
    if (e.key in MOVES || ["PageUp", "PageDown", "Home", "End"].includes(e.key)) e.preventDefault();
  };

  return (
    <div className="calendar">
      <div className="calendar-head">
        <button type="button" className="calendar-nav" aria-label={text("previousMonth")} title={text("previousMonth")} onClick={() => setShown(shiftMonth(shown, -1))}>
          <Icon name="chevron-left" />
        </button>
        <strong className="calendar-title" aria-live="polite">
          {title}
        </strong>
        <button type="button" className="calendar-nav" aria-label={text("nextMonth")} title={text("nextMonth")} onClick={() => setShown(shiftMonth(shown, 1))}>
          <Icon name="chevron-right" />
        </button>
      </div>
      <table ref={grid} className="calendar-grid" role="grid" aria-label={label ?? title} onKeyDown={onKey}>
        <thead>
          <tr>
            {days.slice(0, 7).map((day) => (
              <th key={day} scope="col" abbr={new Intl.DateTimeFormat(locale, { weekday: "long" }).format(day)}>
                {weekday.format(day)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week) => (
            <tr key={week[0]}>
              {week.map((day) => {
                const outside = monthStart(day) !== shown;
                const classes = ["calendar-day", outside ? "is-outside" : "", day === now ? "is-today" : "", marked.has(day) ? "is-marked" : ""].filter(Boolean).join(" ");
                return (
                  <td key={day} role="gridcell" aria-selected={value != null && startOf(value) === day}>
                    <button
                      type="button"
                      className={classes}
                      data-day={day}
                      tabIndex={day === focus ? 0 : -1}
                      aria-label={full.format(day)}
                      aria-current={day === now ? "date" : undefined}
                      onClick={() => {
                        setFocus(day);
                        onChange?.(day);
                      }}
                    >
                      {new Date(day).getDate()}
                    </button>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

