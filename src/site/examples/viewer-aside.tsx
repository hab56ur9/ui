import { DescriptionList, Markdown, Viewer } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("viewer-aside");
  return (
    <div style={{ height: 420 }}>
      <Viewer
        inline
        icon="code"
        title={text.title}
        meta={text.meta}
        onClose={() => undefined}
        aside={
          <div style={{ padding: "var(--space-4)" }}>
            <DescriptionList
              items={[
                { label: text.status, value: text.review },
                { label: text.base, value: "master" },
                { label: text.files, value: "3" },
              ]}
            />
          </div>
        }
      >
        <div style={{ padding: "var(--space-6)" }}>
          <Markdown readOnly defaultValue={text.body} />
        </div>
      </Viewer>
    </div>
  );
}
