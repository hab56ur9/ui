import { useLayoutEffect, useRef, useState } from "react";
import { ImagePreview, Row } from "ui";
import { useText } from "../demo";

const screen = (probe: HTMLElement, width: number, height: number, rows: number) => {
  const token = (name: string) => getComputedStyle(probe).getPropertyValue(name).trim();
  const bar = `<rect width="${width}" height="${height * 0.12}" fill="${token("--color-bg-subtle")}"/>`;
  const lines = Array.from({ length: rows }, (_, i) => {
    const y = height * 0.2 + i * ((height * 0.75) / rows);
    const share = 0.4 + ((i * 37) % 50) / 100;
    const fill = token(i % 4 === 1 ? "--color-main-default" : "--color-border-strong");
    return `<rect x="${width * 0.06}" y="${y}" width="${width * 0.88 * share}" height="${height * 0.025}" rx="4" fill="${fill}"/>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><rect width="${width}" height="${height}" fill="${token("--color-bg-raised")}"/>${bar}${lines}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export default function Example() {
  const text = useText("image-preview-basic");
  const light = useRef<HTMLSpanElement>(null);
  const dark = useRef<HTMLSpanElement>(null);
  const [shots, setShots] = useState<string[]>([]);
  useLayoutEffect(() => {
    if (!light.current || !dark.current) return;
    setShots([screen(light.current, 1200, 750, 8), screen(dark.current, 390, 844, 12)]);
  }, []);
  return (
    <Row>
      <span ref={light} data-theme="light" hidden />
      <span ref={dark} data-theme="dark" hidden />
      {shots.length > 0 && <ImagePreview src={shots[0]} alt={text.wide} onOpen={() => undefined} />}
      {shots.length > 0 && <ImagePreview src={shots[1]} alt={text.tall} onOpen={() => undefined} />}
    </Row>
  );
}
