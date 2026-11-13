import { ApprovalCard, Sheet } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("approval-card");
  return (
    <div style={{ width: "100%", maxWidth: 390 }}>
      <Sheet inline open onClose={() => undefined} title={text.sheet}>
        <ApprovalCard title={text.title} description={text.description} command={text.command} onDecide={() => undefined} />
      </Sheet>
    </div>
  );
}
