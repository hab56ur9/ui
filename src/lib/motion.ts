import { reducedMotion, token } from "./hooks";

const TIMING = {
  enter: { duration: "--motion-duration-base", easing: "--motion-easing-enter" },
  slow: { duration: "--motion-duration-slow", easing: "--motion-easing-enter" },
  exit: { duration: "--motion-duration-fast", easing: "--motion-easing-exit" },
};

export type MotionKind = keyof typeof TIMING;

export function motion(node: Element, frames: Keyframe[], kind: MotionKind, extra: KeyframeAnimationOptions = {}) {
  if (reducedMotion()) return Promise.resolve();
  const { duration, easing } = TIMING[kind];
  return node
    .animate(frames, { duration: parseFloat(token(duration)), easing: token(easing), fill: "forwards", ...extra })
    .finished.then(
      () => undefined,
      () => undefined,
    );
}

export const fadeBackdrop = (dialog: Element, kind: MotionKind, from: number, to: number) => motion(dialog, [{ opacity: from }, { opacity: to }], kind, { pseudoElement: "::backdrop" });

export const stagger = (index: number) => index * parseFloat(token("--motion-stagger"));

export const intensity = () => parseFloat(token("--motion-intensity")) || 0;
