import { useState } from "react";
import { MultiSelect } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("multi-select-members");
  const [picked, setPicked] = useState(["lead", "planner"]);
  return (
    <div style={{ display: "grid", gap: "var(--space-2)", width: "100%", maxWidth: 400 }}>
      <MultiSelect
        label={text.label}
        selectAllLabel={text.all}
        value={picked}
        onChange={setPicked}
        items={[
          { id: "lead", label: text.lead, description: text.leadRole, tone: 1, locked: true },
          { id: "planner", label: text.planner, description: text.plannerRole, tone: 2 },
          { id: "builder", label: text.builder, description: text.builderRole, tone: 3 },
          { id: "qa", label: text.qa, description: text.qaRole, tone: 4 },
        ]}
      />
      <small style={{ color: "var(--color-fg-muted)" }}>{picked.join(" · ")}</small>
    </div>
  );
}
