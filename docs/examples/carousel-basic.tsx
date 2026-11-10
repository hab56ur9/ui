import { Carousel, ImageCard } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("carousel-basic");
  const places = [
    [text.mangwonHanRiver, text.sunsetSpot, 2],
    [text.baegundaeBukhansan, text.lastColorsBefore, 7],
    [text.seongsuCafeStreet, text.weekendBrunch, 1],
    [text.seoulForestGinkgo, text.theYellowestPath, 4],
  ] as const;
  return (
    <div style={{ maxWidth: 420 }}>
      <Carousel label={text.placesToGo}>
        {places.map(([title, description, seed]) => (
          <ImageCard key={title} image={{ alt: title, seed }} title={title} description={description} onSelect={() => undefined} />
        ))}
      </Carousel>
    </div>
  );
}
