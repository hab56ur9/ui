import {
  createContext,
  useContext,
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

const MotionContext = createContext({ on: false, settled: false });

export const useMotion = () => useContext(MotionContext).on;

const ROWS = 12;
const CONTENT = '[data-motion~="content"]';

const entering = () =>
  (document.getAnimations?.() ?? []).filter((animation) => {
    const target = (animation.effect as KeyframeEffect | null)?.target;
    return target instanceof Element && target.matches(CONTENT);
  });

export function useEnter() {
  const scope = useContext(MotionContext);
  const on = scope.on && !scope.settled;
  return {
    enter: on ? "enter content" : undefined,
    row: (index: number) => (on ? ({ "--motion-row": Math.min(index, ROWS) } as CSSProperties) : undefined),
  };
}

export function MotionScope({
  on,
  children,
}: {
  on: boolean;
  children: ReactNode;
}) {
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    if (!on) return;
    let live = true;
    const frame = requestAnimationFrame(() =>
      Promise.allSettled(entering().map((animation) => animation.finished)).then(() => live && setSettled(true)),
    );
    return () => {
      live = false;
      cancelAnimationFrame(frame);
    };
  }, [on]);
  return <MotionContext.Provider value={{ on, settled }}>{children}</MotionContext.Provider>;
}

const DIGITS = [..."0123456789"];
const isDigit = (char: string) => DIGITS.includes(char);

export function Count({ value }: { value: string }) {
  const chars = [...value];
  return (
    <span className="motion-count">
      <span className="sr-only">{value}</span>
      <span aria-hidden="true" data-motion="count">
        {chars.map((char, i) =>
          isDigit(char) ? (
            <span
              key={chars.length - i}
              data-digit=""
              style={{ "--digit": Number(char) } as CSSProperties}
            >
              <span>
                {DIGITS.map((digit) => (
                  <span key={digit}>{digit}</span>
                ))}
              </span>
            </span>
          ) : (
            <span key={chars.length - i}>{char}</span>
          ),
        )}
      </span>
    </span>
  );
}
