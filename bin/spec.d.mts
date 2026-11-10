export declare const SPEC_VERSION: number;
export declare const BUILTIN_ACTIONS: Record<string, string[]>;
export type ComponentSchema = { name: string; props: { name: string; optional: boolean; kind: string }[] };
export declare function checkSpec(spec: unknown, components: ComponentSchema[]): string[];
export declare function specSchema(components: ComponentSchema[]): Record<string, unknown>;
export declare function buildHtml(spec: unknown, options: { module: string; lang?: "en" | "ko" }): string;
