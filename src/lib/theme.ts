declare const brand: unique symbol;

export type Theme = { readonly [brand]: true };

type Preset = "lime" | "sky" | "blue" | "mono";
type Style = "minimal" | "expressive" | "brutal";
type Look = { preset: Preset; style: Style };

const looks = new WeakMap<Theme, Look>();

const theme = (preset: Preset, style: Style) => {
  const value = Object.freeze({}) as Theme;
  looks.set(value, { preset, style });
  return value;
};

const family = (preset: Preset) =>
  Object.freeze({
    minimal: theme(preset, "minimal"),
    expressive: theme(preset, "expressive"),
    brutal: theme(preset, "brutal"),
  });

export const themes = Object.freeze({
  lime: family("lime"),
  sky: family("sky"),
  blue: family("blue"),
  mono: family("mono"),
});

export const lookOf = (value: Theme): Look => looks.get(value) ?? { preset: "lime", style: "minimal" };
