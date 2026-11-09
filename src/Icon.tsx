import { createElement } from "react";
import data from "../dist/icons.json";

type Shape = [string, Record<string, string>];
const icons = data as unknown as Record<string, Shape[]>;

export type IconName = string;
export const iconNames = Object.keys(icons);

export type IconProps = { name: IconName; size?: "sm" | "md" | "lg"; label?: string };

export function Icon({ name, size = "md", label }: IconProps) {
  const shapes = icons[name];
  if (!shapes) throw new Error(`unknown icon "${name}"`);
  return (
    <svg className={`icon icon-${size}`} viewBox="0 0 24 24" data-icon={name} role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true}>
      {shapes.map(([tag, attrs], i) => createElement(tag, { key: i, ...attrs }))}
    </svg>
  );
}
