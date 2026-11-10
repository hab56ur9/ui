import { Image, ImageCard } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("image-basic");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "var(--space-4)", alignItems: "start" }}>
      <Image alt={text.squarePhoto} seed={1} ratio="1:1" rounded />
      <Image alt={text.portraitPhoto} seed={2} ratio="3:4" rounded />
      <Image alt={text.landscapePhoto} seed={5} ratio="16:9" rounded />
      <ImageCard
        image={{ alt: text.seoulForestGinkgo, seed: 4 }}
        title={text.seoulForestGinkgo}
        description={text.theYellowestPath}
        meta={text.n21kPosts}
        badge={text.popular}
        onSelect={() => undefined}
      />
    </div>
  );
}
