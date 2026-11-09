import { useRef } from "react";
import { Button } from "ui";
import { Row, useT } from "../demo";

const PAIRS = [
  { duration: "fast", easing: "exit" },
  { duration: "base", easing: "standard" },
  { duration: "slow", easing: "enter" },
];

const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

export default function Example() {
  const t = useT();
  const tracks = useRef<HTMLDivElement[]>([]);
  const forward = useRef(true);
  const play = () => {
    PAIRS.forEach(({ duration, easing }, i) => {
      const track = tracks.current[i];
      const frames = [{ transform: "translateX(0)" }, { transform: `translateX(${track.clientWidth - 28}px)` }];
      track.firstElementChild?.animate(forward.current ? frames : frames.reverse(), {
        duration: parseFloat(token(`--motion-duration-${duration}`)),
        easing: token(`--motion-easing-${easing}`),
        fill: "forwards",
      });
    });
    forward.current = !forward.current;
  };
  return (
    <>
      {PAIRS.map(({ duration, easing }, i) => (
        <div className="docs-bar" key={duration}>
          <span>{`${duration} · ${easing}`}</span>
          <div className="docs-motion" ref={(node) => void (node && (tracks.current[i] = node))}>
            <i />
          </div>
        </div>
      ))}
      <Row>
        <Button variant="primary" onClick={play}>
          {t({ ko: "재생", en: "Play" })}
        </Button>
      </Row>
    </>
  );
}
