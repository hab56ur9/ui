import { useLayoutEffect, useState } from "react";
import { Segmented } from "./controls";
import { useI18n } from "./i18n";

export type Theme = "system" | "light" | "dark";
export type Medium = "app" | "doc" | "slide";

const THEMES: Theme[] = ["system", "light", "dark"];
const MEDIA: Medium[] = ["app", "doc", "slide"];

const pick = <T extends string>(value: string | null | undefined, options: T[]) => options.find((option) => option === value) ?? options[0];

function useRootAttribute(name: "theme" | "medium", value: string, fallback: string) {
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (value === fallback) delete root.dataset[name];
    if (value !== fallback) root.dataset[name] = value;
  }, [name, value, fallback]);
}

export type DisplayValue = { theme: Theme; medium: Medium };
export type DisplayOptions = { theme?: string | null; medium?: string | null; mediumSwitch?: boolean; onChange?: (value: DisplayValue) => void };

export function useDisplay({ theme: initialTheme, medium: initialMedium, mediumSwitch = true, onChange }: DisplayOptions = {}) {
  const [value, setValue] = useState<DisplayValue>(() => ({ theme: pick(initialTheme, THEMES), medium: mediumSwitch ? pick(initialMedium, MEDIA) : MEDIA[0] }));
  useRootAttribute("theme", value.theme, THEMES[0]);
  useRootAttribute("medium", value.medium, MEDIA[0]);
  const update = (patch: Partial<DisplayValue>) => {
    const next = { ...value, ...patch };
    setValue(next);
    onChange?.(next);
  };
  return {
    theme: value.theme,
    medium: value.medium,
    setTheme: (theme: Theme) => update({ theme }),
    setMedium: (medium: Medium) => update({ medium }),
    switchable: mediumSwitch,
  };
}

export type Display = ReturnType<typeof useDisplay>;
export type DisplaySwitchProps = { display: Display };

export function DisplaySwitch({ display }: DisplaySwitchProps) {
  const { text } = useI18n();
  return (
    <div className="toolbar display-switch">
      <span className="toolbar-label">{text("theme")}</span>
      <Segmented label={text("theme")} value={display.theme} onChange={(value) => display.setTheme(pick(value, THEMES))} options={THEMES.map((value) => ({ value, label: text(`theme.${value}`) }))} />
      {display.switchable && (
        <>
          <span className="toolbar-label">{text("medium")}</span>
          <Segmented label={text("medium")} value={display.medium} onChange={(value) => display.setMedium(pick(value, MEDIA))} options={MEDIA.map((value) => ({ value, label: text(`medium.${value}`) }))} />
        </>
      )}
    </div>
  );
}
