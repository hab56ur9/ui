import { Deck, TitleSlide } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-title");
  return (
    <Deck controls={false}>
      <TitleSlide kicker={text.acmeAnalyticsNovember} title={text.monthlyServiceReview} subtitle={text.theLast30} meta={text.dataTeamNovember} />
    </Deck>
  );
}
