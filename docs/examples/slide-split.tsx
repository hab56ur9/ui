import { BarChart, Bullets, Deck, SplitSlide } from "ui";
import { series, useFmt, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Deck controls={false}>
      <SplitSlide
        title={t({ ko: "신규 가입", en: "Sign-ups" })}
        takeaway={t({ ko: "주말 가입이 평일보다 25% 많습니다.", en: "Weekend sign-ups run 25% above weekdays." })}
        ratio="2:3"
        left={
          <Bullets
            items={t({
              ko: ["캠페인 주에 가장 많았습니다", "주말 광고 비중을 늘립니다", "가입 단계 축소는 다음 달에 반영됩니다"],
              en: ["Campaign weeks were the highest", "We shift more ad spend to weekends", "The shorter sign-up lands next month"],
            })}
          />
        }
        right={<BarChart name={t({ ko: "신규 가입", en: "Sign-ups" })} points={series(21, 12, 4000, 60, 900)} format={{ axis: fmt.count }} />}
      />
    </Deck>
  );
}
