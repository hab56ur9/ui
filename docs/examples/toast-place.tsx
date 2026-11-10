import { useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { AppShell, Icon, Page, Stat, Toast, Widget, WidgetGrid } from "ui";
import { Browser } from "../Browser";
import { useT } from "../demo";

export function GhostApp({ mobile, toast }: { mobile?: boolean; toast: ReactNode }) {
  const t = useT();
  const nav = [
    { id: "home", label: t({ ko: "홈", en: "Home" }), icon: "home", current: true },
    { id: "charts", label: t({ ko: "차트", en: "Charts" }), icon: "chart-line" },
    { id: "alerts", label: t({ ko: "알림", en: "Alerts" }), icon: "bell" },
    { id: "settings", label: t({ ko: "설정", en: "Settings" }), icon: "sliders" },
  ];
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = box.current;
    if (mobile || !el) return;
    const observer = new ResizeObserver(() => setScale(el.clientWidth / 1024));
    observer.observe(el);
    return () => observer.disconnect();
  }, [mobile]);
  const canvas = mobile ? undefined : ({ width: 1024, height: 640, transform: `scale(${scale})`, transformOrigin: "0 0" } as CSSProperties);
  const place = (
    <div ref={box} className={`docs-place${mobile ? " is-mobile" : ""}`} style={mobile ? undefined : { height: 640 * scale }}>
      <div className="docs-place-canvas" style={canvas}>
        <div className="docs-ghost" aria-hidden="true" inert>
          <AppShell
            mobileNav={mobile ? "tabs" : "drawer"}
            tabBar={{ variant: "floating", labels: "active" }}
            brand={
              <>
                <Icon name="chart-line" />
                {t({ ko: "서비스 지표", en: "Service metrics" })}
              </>
            }
            nav={[{ items: nav }]}
            title={nav[0].label}
          >
            <Page title={t({ ko: "오늘의 지표", en: "Today's metrics" })}>
              <WidgetGrid>
                {[
                  [t({ ko: "활성 사용자", en: "Active users" }), "47.1만", 0.063],
                  [t({ ko: "매출", en: "Revenue" }), "₩38.1억", 0.046],
                  [t({ ko: "p95 응답", en: "p95 latency" }), "176ms", -0.04],
                  [t({ ko: "오류율", en: "Error rate" }), "0.35%", -0.11],
                ].map(([title, value, change]) => (
                  <Widget key={title as string} id={title as string} title={title as string} w={mobile ? 12 : 3} h={2}>
                    <Stat value={value as string} delta={{ change: change as number, goodWhenUp: title !== "p95 응답" && title !== "p95 latency" }} />
                  </Widget>
                ))}
              </WidgetGrid>
            </Page>
          </AppShell>
        </div>
        <div className="docs-place-toast">{toast}</div>
      </div>
    </div>
  );
  return mobile ? place : <Browser address="metrics.app/home">{place}</Browser>;
}

export default function Example() {
  const t = useT();
  return <GhostApp toast={<Toast status="good" message={t({ ko: "저장했습니다", en: "Saved" })} action={{ label: t({ ko: "되돌리기", en: "Undo" }) }} />} />;
}
