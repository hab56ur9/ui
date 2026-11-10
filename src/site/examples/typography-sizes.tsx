import { useState } from "react";
import { Segmented } from "ui";
import { Row, useText } from "../demo";

const SIZES = ["caption", "label", "body", "title", "heading", "stat", "display"];
const MEDIA = ["app", "doc", "slide"] as const;

export default function Example() {
  const text = useText("typography-sizes");
  const [medium, setMedium] = useState<(typeof MEDIA)[number]>("app");
  return (
    <>
      <Row>
        <Segmented label="medium" value={medium} options={MEDIA.map((value) => ({ value, label: value }))} onChange={setMedium} />
      </Row>
      <div data-medium={medium}>
        {SIZES.map((size) => (
          <div className="docs-specimen" key={size}>
            <code>{`font.size.${size}`}</code>
            <span style={{ fontSize: `var(--font-size-${size})` }}>{text.quickBrownFox}</span>
          </div>
        ))}
      </div>
    </>
  );
}
