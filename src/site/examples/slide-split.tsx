import { BarChart, Bullets, Deck, SplitSlide } from "ui";
import { series, useFmt, useText } from "../demo";

export default function Example() {
  const text = useText("slide-split");
  const fmt = useFmt();
  return (
    <Deck controls={false}>
      <SplitSlide
        title={text.signUps}
        takeaway={text.weekendSignUps}
        ratio="2:3"
        left={<Bullets items={text.items} />}
        right={<BarChart name={text.signUps} points={series(21, 12, 4000, 60, 900)} format={{ axis: fmt.count }} />}
      />
    </Deck>
  );
}
