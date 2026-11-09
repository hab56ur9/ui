import { Deck, TimelineSlide } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Deck controls={false}>
      <TimelineSlide
        title={t({ ko: "출시 일정", en: "Release plan" })}
        takeaway={t({ ko: "두 단계가 끝났고, 공개 출시는 12월입니다.", en: "Two stages are done; the public launch is in December." })}
        items={t({
          ko: [
            { date: "9월", title: "설계", body: "요구사항과 화면 확정", done: true },
            { date: "10월", title: "개발", body: "API와 화면 구현", done: true },
            { date: "11월", title: "베타", body: "사용자 200명" },
            { date: "12월", title: "공개 출시", body: "전체 사용자" },
          ],
          en: [
            { date: "Sep", title: "Design", body: "Requirements and screens set", done: true },
            { date: "Oct", title: "Build", body: "API and screens built", done: true },
            { date: "Nov", title: "Beta", body: "200 users" },
            { date: "Dec", title: "Launch", body: "Everyone" },
          ],
        })}
      />
    </Deck>
  );
}
