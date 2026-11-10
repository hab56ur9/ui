import { Bullets, Deck, Slide, SlideHeader, Steps, Takeaway } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("deck-basic");
  return (
    <Deck title={text.signUpFixes}>
      <Slide tone="accent" footer={false}>
        <SlideHeader kicker={text.productReviewNovember} title={text.signUpFix} subtitle={text.swipeUseThe} />
      </Slide>
      <Slide source={text.source12User} notes={text.leadWithThe}>
        <SlideHeader title={text.whyPeopleQuit} />
        <Takeaway>{text.halfOfThem}</Takeaway>
        <Bullets items={text.items} />
      </Slide>
      <Slide>
        <SlideHeader title={text.nextSteps} />
        <Steps items={text.items2} />
      </Slide>
    </Deck>
  );
}
