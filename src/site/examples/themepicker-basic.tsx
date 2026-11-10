import { ThemePicker } from "ui";

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "var(--space-6)" }}>
      <ThemePicker />
      <ThemePicker inline />
    </div>
  );
}
