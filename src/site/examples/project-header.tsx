import { Badge, Button, ProjectHeader } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("project-header");
  return (
    <div style={{ width: "100%" }}>
      <ProjectHeader
        name={text.extract}
        goal={text.goal}
        value={5}
        max={8}
        owner={{ name: text.planner, tone: 3 }}
        meta={text.meta}
        badge={<Badge tone="main">{text.active}</Badge>}
        actions={<Button icon="message">{text.thread}</Button>}
      />
    </div>
  );
}
