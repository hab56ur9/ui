import { ChartSlide, Deck, LineChart } from "ui";
import { useFmt, usePlatforms, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  const platforms = usePlatforms();
  return (
    <Deck controls={false}>
      <ChartSlide
        title={t({ ko: "플랫폼별 활성 사용자", en: "Active users by platform" })}
        takeaway={t({ ko: "Android가 가장 많고, iOS가 가장 빠르게 늘었습니다.", en: "Android is the largest; iOS grew fastest." })}
        source={t({ ko: "출처: Acme 분석, 일간 집계", en: "Source: Acme Analytics, daily totals" })}
      >
        <LineChart series={platforms.map((p) => ({ name: p.name, color: p.color, points: p.points }))} format={{ axis: fmt.count }} />
      </ChartSlide>
    </Deck>
  );
}
