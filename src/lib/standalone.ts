import { createElement, type ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { UIProvider } from "./overlay/Provider";
import type { Theme } from "./theme";

export * from "./index";
export { createElement as h, Fragment, useEffect, useMemo, useRef, useState } from "react";

for (const file of ["tokens.css", "ui.css", "presets.css", "styles.css"]) {
  const href = new URL(file, import.meta.url).href;
  if (!document.querySelector(`link[href="${href}"]`)) document.head.append(Object.assign(document.createElement("link"), { rel: "stylesheet", href }));
}

export function render(target: string | Element, node: ReactNode, options: { theme: Theme; lang?: string }) {
  const element = typeof target === "string" ? document.querySelector(target) : target;
  if (!element) throw new Error(`render target "${target}" not found`);
  const root = createRoot(element);
  root.render(createElement(UIProvider, { theme: options.theme, lang: options.lang, children: node }));
  return root;
}
