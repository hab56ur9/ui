import {
  createContext,
  useContext,
  type CSSProperties,
  type ReactNode,
} from "react";

const MotionContext = createContext(false);

export const useMotion = () => useContext(MotionContext);

const ROWS = 12;

export function useEnter() {
  const on = useMotion();
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
  return <MotionContext.Provider value={on}>{children}</MotionContext.Provider>;
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
