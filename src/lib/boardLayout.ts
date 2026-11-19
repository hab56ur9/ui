export type LayoutItem = { id: string; w: number; h: number; hidden: boolean };
export type LayoutDefault = { id: string; w: number; h: number };

const isItem = (value: unknown): value is LayoutItem =>
  typeof value === "object" && value !== null && typeof (value as LayoutItem).id === "string" && Number.isFinite((value as LayoutItem).w) && Number.isFinite((value as LayoutItem).h);

export function mergeLayout(saved: unknown, widgets: LayoutDefault[]): LayoutItem[] {
  const ids = new Set(widgets.map(({ id }) => id));
  const kept = (Array.isArray(saved) ? saved : []).filter(isItem).filter((item) => ids.has(item.id)).map(({ id, w, h, hidden }) => ({ id, w, h, hidden: Boolean(hidden) }));
  const known = new Set(kept.map(({ id }) => id));
  const added = widgets.filter(({ id }) => !known.has(id)).map(({ id, w, h }) => ({ id, w, h, hidden: false }));
  return [...kept, ...added];
}
