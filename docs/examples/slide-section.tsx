import { Deck, SectionSlide } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <SectionSlide number={2} title={t({ ko: "성능", en: "Performance" })} subtitle={t({ ko: "응답 시간과 오류율", en: "Latency and error rate" })} />
    </Deck>
  );
}
