import { useState } from "react";
import { ApprovalCard, type ApprovalScope, type ApprovalState } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("approval-card");
  const [state, setState] = useState<ApprovalState>("pending");
  const [scope, setScope] = useState<ApprovalScope>("once");
  return (
    <div style={{ display: "grid", gap: 12, width: "100%", maxWidth: 520 }}>
      <ApprovalCard
        title={text.title}
        description={text.description}
        command={text.command}
        state={state}
        scope={scope}
        meta={text.decided}
        onDecide={(next, nextScope) => {
          setState(next);
          setScope(nextScope);
        }}
      />
      <ApprovalCard title={text.doneTitle} command={text.doneCommand} state="allowed" scope="always" meta={text.doneMeta} />
      <ApprovalCard title={text.deniedTitle} command={text.deniedCommand} state="denied" meta={text.deniedMeta} />
    </div>
  );
}
