import { Swatches } from "../demo";

export default function Example() {
  return (
    <Swatches
      paths={[
        "color.bg.page",
        "color.bg.surface",
        "color.bg.raised",
        "color.bg.subtle",
        "color.fg.default",
        "color.fg.secondary",
        "color.fg.muted",
        "color.border.default",
        "color.border.strong",
        "color.main.default",
        "color.main.fill",
        "color.main.subtle",
        "color.danger.default",
      ]}
    />
  );
}
