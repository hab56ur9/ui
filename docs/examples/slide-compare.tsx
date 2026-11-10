import { CompareSlide, Deck } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("slide-compare");
  return (
    <Deck controls={false}>
      <CompareSlide
        title={text.signUpSteps}
        takeaway={text.twoFewerSteps}
        before={{
          label: text.now5Steps,
          body: text.emailPasswordIdentity,
        }}
        after={{
          label: text.after3Steps,
          body: text.anEmailLink,
        }}
      />
    </Deck>
  );
}
