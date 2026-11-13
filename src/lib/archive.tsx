import { useState, type ReactNode } from "react";
import { Badge, type BadgeTone } from "./Badge";
import { ButtonBase } from "./controls";
import { Icon } from "./Icon";
import { useI18n } from "./i18n";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

export type ArchiveBadge = { tone?: BadgeTone; label: string };
export type ArchiveEntry = { text: ReactNode; meta?: string; badge?: ArchiveBadge };
export type ArchiveSection = { label: string; entries: ArchiveEntry[] };
export type ArchiveAction = { id: string; label: string; variant?: "primary" | "secondary" };

export type ArchiveCardProps = {
  title: string;
  count?: string;
  sections: ArchiveSection[];
  evidence?: ReactNode;
  note?: string;
  actions?: ArchiveAction[];
  onAction?: (id: string) => void;
  draft?: boolean;
};

function ArchiveHead({ title, count, draft }: { title: string; count?: string; draft: boolean }) {
  return (
    <header className="archive-head">
      {draft && <Icon name="box" size="sm" />}
      <strong>{title}</strong>
      {count && <span className="archive-count">{count}</span>}
    </header>
  );
}

function ArchiveFoot({ actions, note, onAction }: { actions: ArchiveAction[]; note?: string; onAction: (id: string) => void }) {
  return (
    <footer className="archive-foot">
      {actions.map((action) => (
        <ButtonBase key={action.id} variant={action.variant ?? "secondary"} onClick={() => onAction(action.id)}>
          {action.label}
        </ButtonBase>
      ))}
      {note && <span className="archive-note">{note}</span>}
    </footer>
  );
}

const hasFoot = (actions: ArchiveAction[], note?: string) => actions.length > 0 || Boolean(note);

export function ArchiveCard({ title, count, sections, evidence, note, actions = [], onAction, draft = false }: ArchiveCardProps) {
  return (
    <article className={cx("archive", draft && "is-draft")}>
      <ArchiveHead title={title} count={count} draft={draft} />
      <div className="archive-body">
        {sections.map((section) => (
          <section key={section.label} className="archive-section">
            <h4>{section.label}</h4>
            <ul>
              {section.entries.map((entry, i) => (
                <li key={i}>
                  <span>{entry.text}</span>
                  {entry.meta && <span className="archive-meta">{entry.meta}</span>}
                  {entry.badge && <Badge tone={entry.badge.tone}>{entry.badge.label}</Badge>}
                </li>
              ))}
            </ul>
          </section>
        ))}
        {evidence && <p className="archive-evidence">{evidence}</p>}
      </div>
      {hasFoot(actions, note) && <ArchiveFoot actions={actions} note={note} onAction={(id) => onAction?.(id)} />}
    </article>
  );
}

export type ArchiveRow = { id: string; title: string; progress?: string; discussion?: string; status?: ArchiveBadge; excluded?: boolean };

export type ArchivePickerProps = {
  title: string;
  count?: string;
  columns: [string, string, string, string];
  rows: ArchiveRow[];
  limit?: number;
  value?: string[];
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  actions?: ArchiveAction[];
  onAction?: (id: string, value: string[]) => void;
  note?: string;
};

const included = (row: ArchiveRow) => !row.excluded;

export function ArchivePicker({ title, count, columns, rows, limit = Infinity, value, defaultValue, onChange, actions = [], onAction, note }: ArchivePickerProps) {
  const { text: t } = useI18n();
  const [own, setOwn] = useState(defaultValue ?? rows.filter(included).map((row) => row.id));
  const [open, setOpen] = useState<string[]>([]);
  const picked = value ?? own;
  const change = (next: string[]) => {
    setOwn(next);
    onChange?.(next);
  };
  const toggle = (ids: string[], on: boolean) => change(on ? [...new Set([...picked, ...ids])] : picked.filter((id) => !ids.includes(id)));
  const groups = [
    { key: "included", rows: rows.filter(included) },
    { key: "excluded", rows: rows.filter((row) => row.excluded) },
  ];
  return (
    <article className="archive is-draft">
      <ArchiveHead title={title} count={count} draft />
      <div className="archive-table-wrap">
        <table className="archive-table">
          <thead>
            <tr>
              <th aria-hidden />
              {columns.map((label) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {groups.map((group) => {
              const expanded = open.includes(group.key);
              const folds = group.rows.length > limit;
              const shown = expanded ? group.rows : group.rows.slice(0, limit);
              const rest = group.rows.slice(limit);
              const restIds = rest.filter(included).map((row) => row.id);
              const restPicked = restIds.filter((id) => picked.includes(id)).length;
              const restAll = restIds.length > 0 && restPicked === restIds.length;
              return [
                ...shown.map((row) => (
                  <tr key={row.id} className={cx(row.excluded && "is-excluded")}>
                    <td>
                      <input type="checkbox" aria-label={row.title} checked={picked.includes(row.id)} disabled={row.excluded} onChange={(e) => toggle([row.id], e.target.checked)} />
                    </td>
                    <th scope="row">{row.title}</th>
                    <td>{row.progress ?? "—"}</td>
                    <td>{row.discussion ?? "—"}</td>
                    <td>{row.status && <Badge tone={row.status.tone}>{row.status.label}</Badge>}</td>
                  </tr>
                )),
                folds && (
                  <tr key={`${group.key}-more`} className={cx("archive-more", group.key === "excluded" && "is-excluded")}>
                    <td>
                      {!expanded && (
                        <input
                          type="checkbox"
                          ref={(input) => {
                            if (input) input.indeterminate = restPicked > 0 && !restAll;
                          }}
                          aria-label={t("archive.more", { n: rest.length })}
                          checked={restAll}
                          disabled={restIds.length === 0}
                          onChange={(e) => toggle(restIds, e.target.checked)}
                        />
                      )}
                    </td>
                    <td colSpan={3}>{!expanded && t("archive.more", { n: rest.length })}</td>
                    <td>
                      <ButtonBase onClick={() => setOpen(expanded ? open.filter((key) => key !== group.key) : [...open, group.key])}>{t(expanded ? "archive.collapse" : "archive.expand")}</ButtonBase>
                    </td>
                  </tr>
                ),
              ];
            })}
          </tbody>
        </table>
      </div>
      {hasFoot(actions, note) && <ArchiveFoot actions={actions} note={note} onAction={(id) => onAction?.(id, picked)} />}
    </article>
  );
}

export type ArchivedLineProps = { title: string; summary?: string; meta?: string; onOpen?: () => void; onRestore?: () => void };

export function ArchivedLine({ title, summary, meta, onOpen, onRestore }: ArchivedLineProps) {
  const { text: t } = useI18n();
  return (
    <div className="archived-line">
      <Icon name="box" size="sm" />
      <span className="archived-line-text">
        <strong>{title}</strong>
        {summary && <span>{summary}</span>}
      </span>
      {meta && <span className="archived-line-meta">{meta}</span>}
      {onOpen && (
        <button type="button" className="archived-line-action" onClick={onOpen}>
          {t("archive.open")}
        </button>
      )}
      {onRestore && (
        <button type="button" className="archived-line-action" onClick={onRestore}>
          {t("archive.restore")}
        </button>
      )}
    </div>
  );
}
