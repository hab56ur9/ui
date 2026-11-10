import { Deck, QuoteSlide } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-quote");
  return (
    <Deck controls={false}>
      <QuoteSlide quote={text.iWaitedFor} by={text.interviewee7} role={text.threeDaysAfter} source={text.source12User} />
    </Deck>
  );
}
