import { useLayoutEffect, useRef, useState } from "react";
import { Badge, ImageCompare, Row, Stack } from "ui";
import { useText } from "../demo";

const screen = (probe: HTMLElement, width: number, height: number, shift: number) => {
  const token = (name: string) => getComputedStyle(probe).getPropertyValue(name).trim();
  const bar = `<rect width="${width}" height="${height * 0.12}" fill="${token("--color-bg-subtle")}"/>`;
  const side = `<rect y="${height * 0.12}" width="${width * 0.22}" height="${height * 0.88}" fill="${token("--color-bg-surface")}"/>`;
  const lines = Array.from({ length: 7 }, (_, i) => {
    const y = height * 0.2 + i * height * 0.1;
    const share = 0.35 + (((i + shift) * 29) % 45) / 100;
    const fill = token(i === shift ? "--color-main-default" : "--color-border-strong");
    return `<rect x="${width * 0.27}" y="${y}" width="${width * 0.68 * share}" height="${height * 0.03}" rx="4" fill="${fill}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${token("--color-bg-raised")}"/>${bar}${side}${lines}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export default function Example() {
  const text = useText("image-compare-basic");
  const probe = useRef<HTMLSpanElement>(null);
  const [shots, setShots] = useState<string[]>([]);
  const [at, setAt] = useState(40);
  useLayoutEffect(() => {
    if (!probe.current) return;
    setShots([screen(probe.current, 1200, 750, 1), screen(probe.current, 1200, 800, 3)]);
  }, []);
  return (
    <Stack>
      <span ref={probe} hidden />
      {shots.length > 0 && (
        <ImageCompare
          before={{ src: shots[0], alt: text.beforeAlt, label: text.before }}
          after={{ src: shots[1], alt: text.afterAlt, label: text.after }}
          value={at}
          onChange={setAt}
        />
      )}
      <Row>
        <Badge>{`${text.at} ${Math.round(at)}%`}</Badge>
      </Row>
    </Stack>
  );
}
