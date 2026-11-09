import { Board, LineChart, Stat, Widget } from "ui";
import { series, useFmt, usePlatforms, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  const platforms = usePlatforms();
  const label = t({ ko: "이전 30일 대비", en: "vs previous 30 days" });
  return (
    <Board>
      <Widget id="users" w={4} h={2} title={t({ ko: "활성 사용자", en: "Active users" })} subtitle={t({ ko: "일 평균", en: "Daily average" })}>
        <Stat value={fmt.count(471000)} delta={{ change: 0.063, label }} trend={series(5, 24, 100, 1, 6)} />
      </Widget>
      <Widget id="revenue" w={4} h={2} title={t({ ko: "매출", en: "Revenue" })} subtitle={t({ ko: "합계", en: "Total" })}>
        <Stat value={fmt.won(3810000000)} delta={{ change: 0.046, label }} trend={series(6, 24, 100, 1, 9)} />
      </Widget>
      <Widget id="errors" w={4} h={2} title={t({ ko: "오류율", en: "Error rate" })} subtitle={t({ ko: "평균", en: "Average" })}>
        <Stat value={fmt.percent(0.0035)} delta={{ change: -0.11, goodWhenUp: false, label }} trend={series(8, 24, 40, -0.3, 5)} />
      </Widget>
      <Widget id="platforms" w={12} h={4} title={t({ ko: "플랫폼별 사용자", en: "Users by platform" })} subtitle={t({ ko: "최근 60일", en: "Last 60 days" })}>
        <LineChart series={platforms} format={{ axis: fmt.count }} />
      </Widget>
    </Board>
  );
}
