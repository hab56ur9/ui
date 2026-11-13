import { useState } from "react";
import { Badge, Tree } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tree-basic");
  const [value, setValue] = useState("design");
  return (
    <div style={{ width: 280 }}>
      <Tree
        label={text.label}
        value={value}
        onSelect={setValue}
        items={[
          { id: "mine", label: text.mine, icon: "user" },
          { id: "activity", label: text.activity, icon: "bell", unread: true, aside: <Badge tone="critical" variant="solid">3</Badge> },
          {
            id: "channels",
            label: text.channels,
            children: [
              { id: "design", label: "# design-system", description: text.designPurpose },
              { id: "app", label: "# app", description: text.appPurpose, unread: true, aside: <Badge tone="critical" variant="solid">1</Badge> },
            ],
          },
          {
            id: "agents",
            label: text.agents,
            children: [
              { id: "builder", label: text.builder, state: "active", description: text.working },
              { id: "qa", label: text.qa, state: "idle", description: text.waiting },
            ],
          },
        ]}
      />
    </div>
  );
}
