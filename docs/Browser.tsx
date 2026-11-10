import { useLayoutEffect, useRef, useState, type ReactNode } from "react";

export function Browser({ address, width, height = 720, children }: { address: string; width?: number; height?: number; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (!width || !el) return;
    const observer = new ResizeObserver(() => setScale(Math.min(1, el.clientWidth / width)));
    observer.observe(el);
    return () => observer.disconnect();
  }, [width]);
  return (
    <div className="browser">
      <div className="browser-bar" aria-hidden="true">
        <span className="browser-dots" />
        <span className="browser-address">{address}</span>
      </div>
      {width ? (
        <div ref={box} className="browser-screen is-scaled" style={{ height: height * scale }}>
          <div className="browser-canvas" style={{ width, height, transform: `scale(${scale})` }}>
            {children}
          </div>
        </div>
      ) : (
        <div className="browser-screen">{children}</div>
      )}
    </div>
  );
}
