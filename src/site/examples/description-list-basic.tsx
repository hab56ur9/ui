import { CardGrid, DescriptionList } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("description-list-basic");
  const items = [
    { label: text.tickets, value: text.ticketsValue },
    { label: text.time, value: text.timeValue },
    { label: text.tokens, value: text.tokensValue },
    { label: text.model, value: text.modelValue },
  ];
  return (
    <CardGrid>
      <DescriptionList items={items} />
      <DescriptionList items={items} align="end" />
    </CardGrid>
  );
}
