import { AgendaSlide, Deck } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <AgendaSlide
        title={t({ ko: "순서", en: "Agenda" })}
        current={1}
        items={t({ ko: ["한 달 요약", "사용자", "성능", "다음 할 일"], en: ["Month in brief", "Users", "Performance", "Next steps"] })}
      />
    </Deck>
  );
}
