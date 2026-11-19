export type Span = { start: number; size: number };

export function reach(view: Span, item: Span, pad: number) {
  const before = item.start - pad;
  const after = item.start + item.size + pad - view.size;
  if (before < view.start) return Math.max(0, before);
  if (after > view.start) return after;
  return undefined;
}
