import { useRef, useState } from "react";
import { Card, Chip, DropZone, Row } from "ui";
import { useText } from "../demo";

type Attached = { id: number; name: string };

export default function Example() {
  const text = useText("drop-zone-basic");
  const next = useRef(0);
  const [files, setFiles] = useState<Attached[]>([]);
  const attach = (dropped: File[]) => setFiles((attached) => [...attached, ...dropped.map((file) => ({ id: next.current++, name: file.name }))]);
  return (
    <div style={{ display: "grid", gap: "var(--space-3)", width: "100%", maxWidth: 420 }}>
      <DropZone label={text.label} onFiles={attach}>
        <Card description={text.box} />
      </DropZone>
      <Row>{files.length === 0 ? text.none : files.map((file) => <Chip key={file.id} label={file.name} icon="file" onRemove={() => setFiles((attached) => attached.filter((other) => other.id !== file.id))} />)}</Row>
    </div>
  );
}
