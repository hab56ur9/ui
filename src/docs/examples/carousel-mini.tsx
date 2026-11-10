import { Carousel, MiniCard } from "ui";
import { fill, useText } from "../demo";

export default function Example() {
  const text = useText("carousel-mini");
  const topics = [
    [text.nature, 7],
    [text.food, 1],
    [text.travel, 2],
    [text.cafes, 4],
    [text.fitness, 5],
    [text.photo, 3],
    [text.pets, 6],
  ] as const;
  return (
    <div style={{ maxWidth: 420 }}>
      <Carousel size="mini" label={text.topics}>
        {topics.map(([title, seed], i) => (
          <MiniCard key={title} image={{ alt: title, seed }} title={title} meta={fill(text.posts, { count: `${i + 2}.${i}` })} onSelect={() => undefined} />
        ))}
      </Carousel>
    </div>
  );
}
