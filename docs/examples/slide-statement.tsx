import { Deck, StatementSlide } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <StatementSlide
        kicker={t({ ko: "결론", en: "Bottom line" })}
        statement={t({ ko: "다음 달에는 응답 시간을 안정시키는 데 집중합니다.", en: "Next month we focus on steady latency." })}
        detail={t({ ko: "사용자는 늘고 있어서, 느려지는 날이 줄면 성장이 그대로 이어집니다.", en: "Users keep growing, so fewer slow days keep that growth intact." })}
      />
    </Deck>
  );
}
