import { Deck, TableSlide } from "ui";
import { useFmt, useT } from "../demo";

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  return (
    <Deck controls={false}>
      <TableSlide
        title={t({ ko: "플랫폼 요약", en: "Platform summary" })}
        takeaway={t({ ko: "Android가 가장 크고, iOS가 가장 빠르게 늘었습니다.", en: "Android is the largest; iOS grew fastest." })}
        source={t({ ko: "출처: Acme 분석", en: "Source: Acme Analytics" })}
        table={{
          columns: [{ label: t({ ko: "플랫폼", en: "Platform" }) }, { label: t({ ko: "일 평균", en: "Daily average" }), numeric: true }, { label: t({ ko: "비중", en: "Share" }), numeric: true }, { label: t({ ko: "변화", en: "Change" }), numeric: true }],
          rows: [
            [{ text: t({ ko: "웹", en: "Web" }), color: 1 }, fmt.full(122315), "27.6%", { delta: { change: 0.021 } }],
            [{ text: "iOS", color: 2 }, fmt.full(135693), "30.6%", { delta: { change: 0.076 } }],
            [{ text: "Android", color: 3 }, fmt.full(185486), "41.8%", { delta: { change: 0.054 } }],
          ],
        }}
      />
    </Deck>
  );
}
