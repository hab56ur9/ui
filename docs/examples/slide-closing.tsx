import { ClosingSlide, Deck } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-closing");
  return (
    <Deck controls={false}>
      <ClosingSlide title={text.summary} items={text.items} contact={text.dataTeamQuestions} />
    </Deck>
  );
}
