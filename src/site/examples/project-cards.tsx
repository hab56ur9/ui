import { useState } from "react";
import { Badge, ProjectCards } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("project-cards");
  const [value, setValue] = useState("all");
  return (
    <div style={{ width: "100%" }}>
      <ProjectCards
        value={value}
        onSelect={setValue}
        onNew={() => undefined}
        items={[
          { id: "all", name: text.all, value: 7, max: 12, meta: text.allDone, aside: text.projects },
          { id: "extract", name: text.extract, value: 5, max: 8, badge: <Badge tone="main">{text.active}</Badge>, owner: { name: text.planner, tone: 3 }, meta: text.extractDone, aside: text.due },
          { id: "docs", name: text.docs, value: 2, max: 4, badge: <Badge tone="warning">{text.late}</Badge>, owner: { name: text.builder, tone: 2 }, meta: text.docsDone, aside: text.overdue },
        ]}
      />
    </div>
  );
}
