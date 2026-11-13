const HIDDEN = /([\u0000-\u0008\u000B-\u001F\u007F-\u009F­؜᠎​-‏‪-‮⁠-⁩﻿])/u;

const codePoint = (char: string) => `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, "0")}`;

export type Revealed = { text: string; hidden: boolean };

export const reveal = (text: string): Revealed[] =>
  text.split(HIDDEN).flatMap<Revealed>((part, index) => {
    if (part === "") return [];
    if (index % 2 === 1) return [{ text: codePoint(part), hidden: true }];
    return [{ text: part, hidden: false }];
  });
