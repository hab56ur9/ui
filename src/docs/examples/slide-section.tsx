import { Deck, SectionSlide } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-section");
  return (
    <Deck controls={false}>
      <SectionSlide number={2} title={text.performance} subtitle={text.latencyAndError} />
    </Deck>
  );
}
