import { useLayoutEffect, type KeyboardEvent, type RefObject } from "react";

const FOCUSABLE = 'a[href], area[href], button, input:not([type="hidden"]), select, textarea, iframe, summary, audio[controls], video[controls], [contenteditable]:not([contenteditable="false"]), [tabindex]';

const tabbable = (root: HTMLElement) =>
  [...root.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.tabIndex >= 0 && !el.matches(":disabled") && !el.closest("[inert]") && el.getClientRects().length > 0);

export function useModalFocus(ref: RefObject<HTMLDialogElement | null>, active: boolean) {
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!active || !dialog) return;
    const opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    return () => {
      if (dialog.open) dialog.close();
      if (opener?.isConnected) opener.focus();
    };
  }, [active]);

  return (event: KeyboardEvent<HTMLDialogElement>) => {
    const dialog = ref.current;
    if (event.key !== "Tab" || event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || !dialog) return;
    const items = tabbable(dialog);
    const current = document.activeElement;
    const edge = event.shiftKey ? items[0] : items[items.length - 1];
    const target = event.shiftKey ? items[items.length - 1] : items[0];
    const inside = current instanceof Node && dialog.contains(current);
    if (inside && edge && current !== edge) return;
    event.preventDefault();
    target?.focus();
  };
}
