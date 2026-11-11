import { flushSync } from "react-dom";
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
    const print = matchMedia("print");
    const remeasure = () => flushSync(() => measure(node.clientWidth, node.clientHeight));
    print.addEventListener("change", remeasure);
    addEventListener("beforeprint", remeasure);
    addEventListener("afterprint", remeasure);
    return () => {
      observer.disconnect();
      print.removeEventListener("change", remeasure);
      removeEventListener("beforeprint", remeasure);
      removeEventListener("afterprint", remeasure);
    };
  }, []);
  return [ref, size] as const;
}

export const tokenPx = (node: Element | null, name: string, fallback: number) => {
  if (!node) return fallback;
  return parseFloat(getComputedStyle(node).getPropertyValue(name)) || fallback;
};

export const reducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;

export const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
