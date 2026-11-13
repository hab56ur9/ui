import { useLayoutEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from "react";
import { flushSync } from "react-dom";
import { PresenceAvatar, type Presence } from "./chat";
import { Icon, type IconName } from "./Icon";
import { fold, motion, settle, unfold } from "./motion";

export type TreeMark = { text: ReactNode; tone?: "good" | "warning" | "critical" };

export type TreeItem = {
  id: string;
  label: string;
  icon?: IconName;
  avatar?: string;
  tone?: number;
  state?: Presence;
  unread?: boolean;
  aside?: ReactNode;
  mark?: TreeMark;
  description?: string;
  children?: TreeItem[];
};

export type TreeProps = {
  items: TreeItem[];
  label: string;
  value?: string | null;
  onSelect?: (id: string) => void;
  expanded?: string[];
  defaultExpanded?: string[];
  onToggle?: (id: string, open: boolean) => void;
  mono?: boolean;
};

const branchIds = (items: TreeItem[]): string[] => items.flatMap((item) => (item.children?.length ? [item.id, ...branchIds(item.children)] : []));

const levelOf = (row: HTMLButtonElement) => Number(row.getAttribute("aria-level"));

const parentOf = (rows: HTMLButtonElement[], index: number) => rows.slice(0, index).findLast((row) => levelOf(row) < levelOf(rows[index]));

const branchRows = (row: HTMLButtonElement) => {
  const rows = [...(row.closest(".tree")?.querySelectorAll<HTMLButtonElement>(".tree-row") ?? [])];
  const after = rows.slice(rows.indexOf(row) + 1);
  const end = after.findIndex((next) => levelOf(next) <= levelOf(row));
  return end < 0 ? after : after.slice(0, end);
};

const focusRow = (event: KeyboardEvent<HTMLButtonElement>, pick: (rows: HTMLButtonElement[], index: number) => HTMLButtonElement | undefined) => {
  const rows = [...(event.currentTarget.closest(".tree")?.querySelectorAll<HTMLButtonElement>(".tree-row") ?? [])];
  pick(rows, rows.indexOf(event.currentTarget))?.focus();
  event.preventDefault();
};

export function Tree({ items, label, value, onSelect, expanded, defaultExpanded, onToggle, mono = false }: TreeProps) {
  const [open, setOpen] = useState(() => new Set(defaultExpanded ?? branchIds(items)));
  const [active, setActive] = useState<string | null>(null);
  const shown = expanded ? new Set(expanded) : open;
  const visible = (list: TreeItem[]): string[] => list.flatMap((item) => (item.children?.length && shown.has(item.id) ? [item.id, ...visible(item.children)] : [item.id]));
  const ids = visible(items);
  const stop = [active, value].find((id) => id && ids.includes(id)) ?? ids[0];
  const opening = useRef<HTMLButtonElement | null>(null);
  const closing = useRef(new Set<string>());
  useLayoutEffect(() => {
    const row = opening.current;
    opening.current = null;
    if (row?.isConnected) branchRows(row).forEach((node) => motion(node, fold, "enter", { fill: "none" }));
  });
  const toggle = (id: string, row: HTMLButtonElement) => {
    const next = !shown.has(id);
    const commit = () => {
      onToggle?.(id, next);
      if (expanded) return;
      setOpen((set) => {
        const copy = new Set(set);
        if (next) copy.add(id);
        if (!next) copy.delete(id);
        return copy;
      });
    };
    if (next) {
      opening.current = row;
      return commit();
    }
    if (closing.current.has(id)) return;
    closing.current.add(id);
    const rows = branchRows(row);
    Promise.all(rows.map((node) => motion(node, unfold, "exit"))).then(() => {
      closing.current.delete(id);
      flushSync(commit);
      settle(...rows);
    });
  };
  const keys = (event: KeyboardEvent<HTMLButtonElement>, item: TreeItem) => {
    const branch = Boolean(item.children?.length);
    const opened = branch && shown.has(item.id);
    if (event.key === "ArrowDown") return focusRow(event, (rows, index) => rows[index + 1]);
    if (event.key === "ArrowUp") return focusRow(event, (rows, index) => rows[index - 1]);
    if (event.key === "Home") return focusRow(event, (rows) => rows[0]);
    if (event.key === "End") return focusRow(event, (rows) => rows.at(-1));
    if (event.key === "ArrowRight" && opened) return focusRow(event, (rows, index) => rows[index + 1]);
    if (event.key === "ArrowRight" && branch) return toggle(item.id, event.currentTarget);
    if (event.key === "ArrowLeft" && opened) return toggle(item.id, event.currentTarget);
    if (event.key === "ArrowLeft") return focusRow(event, parentOf);
  };
  const rows = (list: TreeItem[], depth: number): ReactNode[] =>
    list.flatMap((item) => {
      const branch = Boolean(item.children?.length);
      const opened = branch && shown.has(item.id);
      const dot = !branch && item.state && !item.avatar;
      const row = (
        <li key={item.id} role="none">
          <button
            type="button"
            role="treeitem"
            className={item.unread ? "tree-row is-unread" : "tree-row"}
            style={{ "--depth": depth } as CSSProperties}
            aria-level={depth + 1}
            aria-selected={item.id === value}
            aria-expanded={branch ? opened : undefined}
            tabIndex={item.id === stop ? 0 : -1}
            onFocus={() => setActive(item.id)}
            onClick={(event) => (branch ? toggle(item.id, event.currentTarget) : onSelect?.(item.id))}
            onKeyDown={(event) => keys(event, item)}
          >
            <span className="tree-lead">
              {branch && <Icon name={opened ? "chevron-down" : "chevron-right"} size="sm" />}
              {dot && <span className={`presence-dot is-${item.state}`} aria-hidden />}
            </span>
            <span className="tree-icon">
              {item.avatar ? <PresenceAvatar name={item.label} tone={item.tone} avatar={item.avatar} state={item.state} size="sm" /> : item.icon && <Icon name={item.icon} size="sm" />}
            </span>
            <span className="tree-label" title={item.label}>
              {item.label}
            </span>
            {item.mark ? <span className={item.mark.tone ? `tree-mark is-${item.mark.tone}` : "tree-mark"}>{item.mark.text}</span> : <span className="tree-aside">{item.aside}</span>}
            {item.description && (
              <span className="tree-description" title={item.description}>
                {item.description}
              </span>
            )}
          </button>
        </li>
      );
      return opened ? [row, ...rows(item.children ?? [], depth + 1)] : [row];
    });
  return (
    <ul className={mono ? "tree is-mono" : "tree"} role="tree" aria-label={label}>
      {rows(items, 0)}
    </ul>
  );
}
