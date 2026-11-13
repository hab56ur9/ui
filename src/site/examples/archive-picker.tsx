import { useState } from "react";
import { ArchivePicker, type ArchiveRow } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("archive-picker");
  const done = { tone: "good" as const, label: text.done };
  const rows: ArchiveRow[] = [
    { id: "t1", title: text.r1, progress: text.r1p, discussion: text.r1d, status: done },
    { id: "t2", title: text.r2, progress: text.r2p, status: done },
    { id: "t3", title: text.r3, progress: text.r3p, discussion: text.r3d, status: done },
    { id: "t4", title: text.r4, progress: text.r4p, status: done },
    { id: "t5", title: text.r7, progress: text.r7p, status: done },
    { id: "t6", title: text.r5, progress: text.r5p, discussion: text.r5d, status: { tone: "warning", label: text.doing }, excluded: true },
    { id: "t7", title: text.r6, progress: text.r6p, discussion: text.r6d, status: { tone: "warning", label: text.question }, excluded: true },
  ];
  const [picked, setPicked] = useState(rows.filter((row) => !row.excluded).map((row) => row.id));
  return (
    <div style={{ width: "100%", maxWidth: 720 }}>
      <ArchivePicker
        title={text.title}
        count={text.count}
        columns={[text.thread, text.progress, text.discussion, text.status]}
        rows={rows}
        limit={3}
        value={picked}
        onChange={setPicked}
        actions={[
          { id: "archive", label: text.archive.replace("{n}", String(picked.length)), variant: "primary" },
          { id: "cancel", label: text.cancel },
        ]}
        note={text.note}
      />
    </div>
  );
}
