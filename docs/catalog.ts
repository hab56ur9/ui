import data from "../dist/catalog.json";

export type Token = {
  path: string;
  name: string;
  type: string;
  layer: "primitive" | "foundation" | "theme" | "medium" | "lang";
  values: Record<string, string>;
  chains: Record<string, string[]>;
  description?: string;
};

type Catalog = {
  version: string;
  homepage: string;
  modes: { theme: string[]; medium: string[]; lang: string[] };
  media: Record<string, string>;
  groups: Record<string, string>;
  catalog: Token[];
};

export const { version, homepage, modes, media, groups, catalog } = data as unknown as Catalog;

export const byPath = new Map(catalog.map((t) => [t.path, t]));
export const varOf = (path: string) => `var(--${path.replaceAll(".", "-")})`;
export const tokensUnder = (prefix: string) => catalog.filter((t) => t.path.startsWith(`${prefix}.`));

export const tokensFor = (patterns: string[]) =>
  patterns.flatMap((pattern) => {
    const prefix = pattern.endsWith(".*") ? pattern.slice(0, -2) : undefined;
    return catalog.filter((t) => (prefix ? t.path.startsWith(`${prefix}.`) : t.path === pattern));
  });

export const MODE_LABEL: Record<string, string> = { light: "라이트", dark: "다크", app: "앱", doc: "문서", slide: "슬라이드", ko: "한국어", en: "English" };
