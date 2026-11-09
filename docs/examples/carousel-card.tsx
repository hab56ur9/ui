import { Carousel, ImageCard } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const places = [
    [t({ ko: "망원 한강공원", en: "Mangwon Han River Park" }), t({ ko: "노을 명소", en: "Sunset spot" }), 2],
    [t({ ko: "북한산 백운대", en: "Baegundae, Bukhansan" }), t({ ko: "첫눈 전 마지막 단풍", en: "Last colors before the snow" }), 7],
    [t({ ko: "성수 카페 거리", en: "Seongsu cafe street" }), t({ ko: "주말 브런치", en: "Weekend brunch" }), 1],
    [t({ ko: "서울숲 은행나무길", en: "Seoul Forest ginkgo road" }), t({ ko: "지금 가장 노란 길", en: "The yellowest path right now" }), 4],
    [t({ ko: "익선동 골목", en: "Ikseon-dong alleys" }), t({ ko: "한옥 사이 산책", en: "A walk between hanoks" }), 5],
  ] as const;
  return (
    <div style={{ maxWidth: 420 }}>
      <Carousel size="card" label={t({ ko: "추천 장소", en: "Places to go" })}>
        {places.map(([title, description, seed]) => (
          <ImageCard key={title} image={{ alt: title, seed, ratio: "3:4" }} title={title} description={description} onSelect={() => undefined} />
        ))}
      </Carousel>
    </div>
  );
}
