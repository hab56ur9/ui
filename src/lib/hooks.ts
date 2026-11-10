import { useLayoutEffect, useRef, useState } from "react";

export function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    const measure = (width: number, height: number) => setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
    measure(node.clientWidth, node.clientHeight);
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect.width, entry.contentRect.height));
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return [ref, size] as const;
}

export const tokenPx = (node: Element | null, name: string, fallback: number) => {
  if (!node) return fallback;
  return parseFloat(getComputedStyle(node).getPropertyValue(name)) || fallback;
};

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
