const HIDDEN = /([\u0000-\u0008\u000B-\u001F\u007F-\u009F\u00AD\u061C\u115F\u1160\u180E\u200B-\u200F\u2028-\u2029\u202A-\u202E\u2060-\u2069\u3164\uFE00-\uFE0F\uFEFF\uFFF9-\uFFFB\u{E0000}-\u{E007F}\u{E0100}-\u{E01EF}])/u;

const codePoint = (char: string) => `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;

export type Revealed = { text: string; hidden: boolean };

export const reveal = (text: string): Revealed[] =>
  text.split(HIDDEN).flatMap<Revealed>((part, index) => {
    if (part === "") return [];
    if (index % 2 === 1) return [{ text: codePoint(part), hidden: true }];
    return [{ text: part, hidden: false }];
  });
