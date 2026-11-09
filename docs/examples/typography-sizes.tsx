import { useState } from "react";
import { Segmented } from "ui";
import { Row, useT } from "../demo";

const SIZES = ["caption", "label", "body", "title", "heading", "stat", "display"];
const MEDIA = ["app", "doc", "slide"] as const;

export default function Example() {
  const t = useT();
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
            <span style={{ fontSize: `var(--font-size-${size})` }}>{t({ ko: "다람쥐 헌 쳇바퀴 47.1만", en: "Quick brown fox 48.2K" })}</span>
          </div>
        ))}
      </div>
    </>
  );
}
