import { MultiSelect } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("multi-select-plain");
  return (
    <div style={{ width: "100%", maxWidth: 400 }}>
      <MultiSelect
        label={text.label}
        defaultValue={["mention"]}
        items={[
          { id: "mention", label: text.mention, description: text.mentionNote },
          { id: "reply", label: text.reply },
          { id: "approval", label: text.approval, description: text.approvalNote },
        ]}
      />
    </div>
  );
}
