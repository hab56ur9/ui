import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import presets from "../../dist/presets.json";
import styles from "../../dist/styles.json";
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

type Preset = { name: string; label: Record<string, string> };
const PRESETS = presets as Preset[];
const NAMES = PRESETS.map((preset) => preset.name);
const STYLES = (styles as Preset[]).map((style) => style.name);
const STYLE_LABELS = styles as Preset[];
const SWATCHES = ["main-default", "main-fill", "main-subtle", "sub-default", "sub-fill", "sub-subtle"];

export type ThemePickerValue = { preset: string; theme: Theme; style: string };
export type ThemePickerProps = { preset?: string | null; theme?: string | null; style?: string | null; onChange?: (value: ThemePickerValue) => void; floating?: boolean; inline?: boolean };

const applyToRoot = ({ preset, theme, style }: ThemePickerValue) => {
  const root = document.documentElement;
  root.dataset.preset = preset;
  if (style === STYLES[0]) delete root.dataset.style;
  if (style !== STYLES[0]) root.dataset.style = style;
  if (theme === THEMES[0]) delete root.dataset.theme;
  if (theme !== THEMES[0]) root.dataset.theme = theme;
};

const fromRoot = (): Partial<Record<"preset" | "theme" | "style", string>> => (typeof document === "undefined" ? {} : document.documentElement.dataset);

export function ThemePicker({ preset: initialPreset, theme: initialTheme, style: initialStyle, onChange, floating, inline }: ThemePickerProps) {
  const { lang, text } = useI18n();
  const [value, setValue] = useState<ThemePickerValue>(() => ({ preset: pick(initialPreset ?? fromRoot().preset, NAMES), theme: pick(initialTheme ?? fromRoot().theme, THEMES), style: pick(initialStyle ?? fromRoot().style, STYLES) }));
  const [open, setOpen] = useState(false);
  const wrap = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (initialPreset != null || initialTheme != null || initialStyle != null) applyToRoot(value);
  }, []);

  useEffect(() => {
    const sync = () => {
      const root = fromRoot();
      setValue((current) => {
        const next = { preset: pick(root.preset, NAMES), theme: pick(root.theme, THEMES), style: pick(root.style, STYLES) };
        return next.preset === current.preset && next.theme === current.theme && next.style === current.style ? current : next;
      });
    };
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-preset", "data-theme", "data-style"] });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => wrap.current?.contains(e.target as Node) || setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const update = (patch: Partial<ThemePickerValue>) => {
    const next = { ...value, ...patch };
    setValue(next);
    applyToRoot(next);
    onChange?.(next);
  };

  const panel = (
    <div className="theme-picker-panel" role={inline ? "group" : "dialog"} aria-label={text("theme")}>
      <span className="theme-picker-title">{text("colorPreset")}</span>
      <div className="theme-picker-presets" role="radiogroup" aria-label={text("colorPreset")}>
        {PRESETS.map((preset) => (
          <button key={preset.name} type="button" role="radio" aria-checked={preset.name === value.preset} className="theme-preset" data-preset={preset.name} onClick={() => update({ preset: preset.name })}>
            <span className="theme-preset-palette" aria-hidden="true">
              {SWATCHES.map((swatch) => (
                <span key={swatch} style={{ "--swatch": `var(--color-${swatch})` } as CSSProperties} />
              ))}
            </span>
            <span className="theme-preset-name">{preset.label[lang] ?? preset.label.en}</span>
          </button>
        ))}
      </div>
      <span className="theme-picker-title">{text("mode")}</span>
      <Segmented label={text("mode")} value={value.theme} onChange={(theme) => update({ theme: pick(theme, THEMES) })} options={THEMES.map((theme) => ({ value: theme, label: text(`theme.${theme}`) }))} />
      <span className="theme-picker-title">{text("style")}</span>
      <Segmented label={text("style")} value={value.style} onChange={(style) => update({ style: pick(style, STYLES) })} options={STYLE_LABELS.map((style) => ({ value: style.name, label: style.label[lang] ?? style.label.en }))} />
    </div>
  );

  if (inline) return <div className="theme-picker is-inline">{panel}</div>;
  return (
    <div ref={wrap} className={`theme-picker${floating ? " is-floating" : ""}`}>
      <button type="button" className="button" aria-expanded={open} aria-haspopup="dialog" onClick={() => setOpen(!open)}>
        <span className="theme-picker-dot" aria-hidden="true" />
        {text("theme")}
      </button>
      {open && panel}
    </div>
  );
}
