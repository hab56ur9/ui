import { Post, Stories } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("social-feed");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 390 }}>
      <Stories items={["minji.cooks", "seoul.frames", "bada", "jun_runs", "olive"].map((name, i) => ({ id: name, name, seen: i > 2 }))} />
      <Post author="seoul.frames" place={text.hanRiverPark} photo={{ alt: text.hanRiverSunset, seed: 2 }} likes={3891} caption={text.tonightSSunset} comments={112} time={text.n5HoursAgo} />
    </div>
  );
}
