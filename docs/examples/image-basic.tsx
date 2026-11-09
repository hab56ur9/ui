import { Image, ImageCard } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--space-4)", alignItems: "start" }}>
      <Image alt={t({ ko: "정사각형 사진", en: "Square photo" })} seed={1} ratio="1:1" rounded />
      <Image alt={t({ ko: "세로 사진", en: "Portrait photo" })} seed={2} ratio="3:4" rounded />
      <Image alt={t({ ko: "가로 사진", en: "Landscape photo" })} seed={5} ratio="16:9" rounded />
      <ImageCard
        image={{ alt: t({ ko: "서울숲 은행나무길", en: "Seoul Forest ginkgo road" }), seed: 4 }}
        title={t({ ko: "서울숲 은행나무길", en: "Seoul Forest ginkgo road" })}
        description={t({ ko: "지금 가장 노란 길", en: "The yellowest path right now" })}
        meta={t({ ko: "게시물 2.1천개", en: "2.1K posts" })}
        badge={t({ ko: "인기", en: "Popular" })}
        onSelect={() => undefined}
      />
    </div>
  );
}
