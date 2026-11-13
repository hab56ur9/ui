import { useState, type DragEvent, type ReactNode } from "react";

export type DropZoneProps = {
  label: string;
  onFiles: (files: File[]) => void;
  children: ReactNode;
};

const carriesFiles = (event: DragEvent) => event.dataTransfer.types.includes("Files");

export function DropZone({ label, onFiles, children }: DropZoneProps) {
  const [depth, setDepth] = useState(0);
  const over = depth > 0;
  return (
    <div
      className={over ? "drop-zone is-over" : "drop-zone"}
      onDragEnter={(event) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
        setDepth((count) => count + 1);
      }}
      onDragOver={(event) => {
        if (!carriesFiles(event)) return;
        event.preventDefault();
      }}
      onDragLeave={(event) => {
        if (!carriesFiles(event)) return;
        setDepth((count) => Math.max(0, count - 1));
      }}
      onDrop={(event) => {
        setDepth(0);
        if (event.dataTransfer.files.length === 0) return;
        event.preventDefault();
        onFiles([...event.dataTransfer.files]);
      }}
    >
      {children}
      {over && (
        <div className="drop-zone-overlay" aria-hidden="true">
          {label}
        </div>
      )}
    </div>
  );
}
