import { Carousel, MiniCard } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const topics = [
    [t({ ko: "자연", en: "Nature" }), 7],
    [t({ ko: "음식", en: "Food" }), 1],
    [t({ ko: "여행", en: "Travel" }), 2],
    [t({ ko: "카페", en: "Cafes" }), 4],
    [t({ ko: "운동", en: "Fitness" }), 5],
    [t({ ko: "사진", en: "Photo" }), 3],
    [t({ ko: "반려동물", en: "Pets" }), 6],
  ] as const;
  return (
    <div style={{ maxWidth: 420 }}>
      <Carousel size="mini" label={t({ ko: "주제", en: "Topics" })}>
        {topics.map(([title, seed], i) => (
          <MiniCard key={title} image={{ alt: title, seed }} title={title} meta={t({ ko: `게시물 ${i + 2}.${i}천개`, en: `${i + 2}.${i}K posts` })} onSelect={() => undefined} />
        ))}
      </Carousel>
    </div>
  );
}
