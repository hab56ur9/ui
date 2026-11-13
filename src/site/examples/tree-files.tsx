import { useState } from "react";
import { Tree } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tree-files");
  const [value, setValue] = useState("tree");
  return (
    <div style={{ width: 280 }}>
      <Tree
        label={text.label}
        mono
        value={value}
        onSelect={setValue}
        defaultExpanded={["src", "lib"]}
        items={[
          {
            id: "src",
            label: "src",
            children: [
              {
                id: "lib",
                label: "lib",
                children: [
                  { id: "tree", label: "Tree.tsx", icon: "file", mark: { text: "A", tone: "good" } },
                  { id: "index", label: "index.ts", icon: "file", mark: { text: "M", tone: "warning" } },
                  { id: "old", label: "Old.tsx", icon: "file", mark: { text: "D", tone: "critical" } },
                ],
              },
              { id: "site", label: "site", children: [{ id: "pages", label: "pages.ts", icon: "file" }] },
            ],
          },
          { id: "readme", label: "README.md", icon: "file", aside: "2.1 KB" },
        ]}
      />
    </div>
  );
}
