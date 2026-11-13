import { useState } from "react";
import { Select } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("select-basic");
  const [project, setProject] = useState("design");
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", width: "100%", maxWidth: 360 }}>
      <Select
        label={text.project}
        options={[
          { value: "", label: text.none },
          { value: "design", label: text.design },
          { value: "app", label: text.app },
        ]}
        value={project}
        onChange={setProject}
      />
      <Select label={text.builder} hideLabel options={[{ value: "", label: text.unassigned }]} />
      <Select label={text.status} options={[{ value: "todo", label: text.todo }]} disabled />
    </div>
  );
}
