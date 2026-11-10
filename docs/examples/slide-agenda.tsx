import { AgendaSlide, Deck } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-agenda");
  return (
    <Deck controls={false}>
      <AgendaSlide title={text.agenda} current={1} items={text.items} />
    </Deck>
  );
}
