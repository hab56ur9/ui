import { Badge, type BadgeTone } from "./Badge";
import { PresenceAvatar } from "./chat";
import { Icon, type IconName } from "./Icon";
import { useI18n } from "./i18n";
import type { Reviewer } from "./review";

const cx = (...names: (string | false | undefined)[]) => names.filter(Boolean).join(" ");

export type ActivityKind = "mention" | "approval" | "reply" | "failure" | "file";
export type ActivityItem = { id: string; kind: ActivityKind; author: string; tone?: number; avatar?: string; title: string; where?: string; time?: string; text: string; unread?: boolean };
export type ActivityListProps = { items: ActivityItem[]; value?: string; onSelect?: (id: string) => void; empty?: string };

const ACTIVITY_ICON: Record<ActivityKind, string> = { mention: "message", approval: "shield", reply: "message", failure: "error", file: "file" };

export function ActivityList({ items, value, onSelect, empty }: ActivityListProps) {
  const { text: t } = useI18n();
  if (items.length === 0) return <div className="activity-empty">{empty ?? t("none")}</div>;
  return (
    <ul className="activity">
      {items.map((item) => (
        <li key={item.id}>
          <button type="button" className={cx("activity-row", item.unread && "is-unread")} aria-current={item.id === value ? "true" : undefined} onClick={() => onSelect?.(item.id)}>
            <span className="activity-face">
              <PresenceAvatar name={item.author} tone={item.tone} avatar={item.avatar} />
              <span className={`activity-kind is-${item.kind}`}>
                <Icon name={ACTIVITY_ICON[item.kind]} size="sm" />
              </span>
            </span>
            <span className="activity-body">
              <span className="activity-head">
                <strong>{item.title}</strong>
                {item.where && <span>{item.where}</span>}
                {item.time && <time>{item.time}</time>}
              </span>
              <span className="activity-text">{item.text}</span>
            </span>
            {item.unread && <span className="activity-dot" aria-label={t("activity.unread")} />}
          </button>
        </li>
      ))}
    </ul>
  );
}

export type QueueItem = { id: string; from: string; tone?: number; avatar?: string; where?: string; text: string; active?: boolean; waiting?: boolean };
export type QueueListProps = { items: QueueItem[]; title?: string; empty?: string };

export function QueueList({ items, title, empty }: QueueListProps) {
  const { text: t } = useI18n();
  return (
    <section className="queue">
      {title && <header>{title}</header>}
      {items.length === 0 ? (
        <div className="queue-empty">{empty ?? t("none")}</div>
      ) : (
        <ol>
          {items.map((item, i) => (
            <li key={item.id} className={cx(item.active && "is-active")}>
              <span className="queue-index">{item.active ? <Icon name="play" size="sm" /> : i}</span>
              <span className="queue-body">
                <span className="queue-head">
                  <PresenceAvatar name={item.from} tone={item.tone} avatar={item.avatar} size="xs" />
                  <strong>{item.from}</strong>
                  {item.where && <span>{item.where}</span>}
                  {item.waiting && <Icon name="clock" size="sm" label={t("queue.waiting")} />}
                </span>
                <span className="queue-text">{item.text}</span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}

export type DocItem = { id: string; title: string; meta?: string; badge?: { tone?: BadgeTone; label: string }; reviewers?: Reviewer[]; aside?: string };
export type DocListProps = { items: DocItem[]; onSelect?: (id: string) => void; empty?: string };

export function DocList({ items, onSelect, empty }: DocListProps) {
  const { text: t } = useI18n();
  if (items.length === 0) return <div className="doc-list-empty">{empty ?? t("none")}</div>;
  return (
    <div className="doc-list">
      {items.map((item) => (
        <button key={item.id} type="button" className="doc-row" onClick={() => onSelect?.(item.id)}>
          <span className="doc-row-key">{item.id}</span>
          <span className="doc-row-title">
            <strong>{item.title}</strong>
            {item.meta && <span>{item.meta}</span>}
          </span>
          {item.badge ? <Badge tone={item.badge.tone}>{item.badge.label}</Badge> : <span />}
          <span className="doc-row-reviewers">
            {(item.reviewers ?? []).map((reviewer) => (
              <span key={reviewer.name} title={`${reviewer.name} · ${reviewer.label}`} className={cx("doc-reviewer", reviewer.badge && `is-${reviewer.badge}`)}>
                <PresenceAvatar name={reviewer.name} tone={reviewer.tone} avatar={reviewer.avatar} size="xs" />
              </span>
            ))}
          </span>
          <span className="doc-row-aside">{item.aside}</span>
        </button>
      ))}
    </div>
  );
}

export type EntryItem = { id: string; icon?: IconName; title?: string; meta?: string; text?: string; removable?: boolean };
export type EntryListProps = { items: EntryItem[]; title?: string; empty?: string; onRemove?: (id: string) => void };

export function EntryList({ items, title, empty, onRemove }: EntryListProps) {
  const { text: t } = useI18n();
  return (
    <section className="entries">
      {title && (
        <header>
          <strong>{title}</strong>
          <span>{items.length}</span>
        </header>
      )}
      {items.length === 0 ? (
        <div className="entries-empty">{empty ?? t("none")}</div>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id} className={cx(item.icon && "has-icon")}>
              {item.icon && <Icon name={item.icon} size="sm" />}
              <span className="entries-body">
                {(item.title || item.meta) && (
                  <span className="entries-head">
                    {item.title && <strong>{item.title}</strong>}
                    {item.meta && <span>{item.meta}</span>}
                  </span>
                )}
                {item.text && <span className="entries-text">{item.text}</span>}
              </span>
              {onRemove && item.removable !== false && (
                <button type="button" className="entries-remove" aria-label={t("entries.remove", { label: item.title ?? item.text ?? item.id })} onClick={() => onRemove(item.id)}>
                  <Icon name="trash" size="sm" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
