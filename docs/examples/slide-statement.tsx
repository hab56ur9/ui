import { Deck, StatementSlide } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-statement");
  return (
    <Deck controls={false}>
      <StatementSlide kicker={text.bottomLine} statement={text.nextMonthWe} detail={text.usersKeepGrowing} />
    </Deck>
  );
}
