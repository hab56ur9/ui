import { useLayoutEffect, useRef, useState, type MouseEvent } from "react";
import { milliseconds } from "./format";
import { reducedMotion } from "./hooks";

const TIMING = {
  enter: { duration: "--motion-duration-base", easing: "--motion-easing-enter" },
  slow: { duration: "--motion-duration-slow", easing: "--motion-easing-enter" },
  exit: { duration: "--motion-duration-fast", easing: "--motion-easing-exit" },
};

export type MotionKind = keyof typeof TIMING;

export function motion(node: Element, frames: Keyframe[], kind: MotionKind, extra: KeyframeAnimationOptions = {}) {
  const style = getComputedStyle(node);
  const token = (name: string) => style.getPropertyValue(name).trim();
  if (reducedMotion() || token(TIMING.enter.easing) === "") return Promise.resolve();
  const { duration, easing } = TIMING[kind];
  return node
    .animate(frames, { duration: milliseconds(token(duration)) * parseFloat(token("--motion-intensity")), easing: token(easing), fill: "forwards", ...extra })
    .finished.then(
      () => undefined,
      () => undefined,
    );
}

export const fadeBackdrop = (dialog: Element, kind: MotionKind, from: number, to: number) => motion(dialog, [{ opacity: from }, { opacity: to }], kind, { pseudoElement: "::backdrop" });

export const fold: Keyframe[] = [{ opacity: 0, transform: "translateY(-4px)" }, { opacity: 1, transform: "none" }];

export const unfold = [...fold].reverse();

export const settle = (...nodes: Element[]) => nodes.forEach((node) => node.getAnimations().forEach((animation) => animation.cancel()));

export function usePresence<T extends HTMLElement>(open: boolean) {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(open);
  if (open && !mounted) setMounted(true);
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) {
      motion(node, fold, "enter", { fill: "none" });
      return;
    }
    let live = true;
    motion(node, unfold, "exit").then(() => live && setMounted(false));
    return () => {
      live = false;
      settle(node);
    };
  }, [open, mounted]);
  return [mounted, ref] as const;
}

export function foldDetails(event: MouseEvent<HTMLElement>) {
  const summary = event.currentTarget;
  const details = summary.parentElement;
  if (!(details instanceof HTMLDetailsElement)) return;
  event.preventDefault();
  const body = [...details.children].filter((child) => child !== summary);
  if (!details.open) {
    details.open = true;
    body.forEach((node) => motion(node, fold, "enter", { fill: "none" }));
    return;
  }
  Promise.all(body.map((node) => motion(node, unfold, "exit"))).then(() => {
    details.open = false;
    settle(...body);
  });
}
