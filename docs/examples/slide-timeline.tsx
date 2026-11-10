import { Deck, TimelineSlide } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-timeline");
  return (
    <Deck controls={false}>
      <TimelineSlide title={text.releasePlan} takeaway={text.twoStagesAre} items={text.items} />
    </Deck>
  );
}
