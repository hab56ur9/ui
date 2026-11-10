import { Deck, TableSlide } from "ui";
import { useFmt, useText } from "../demo";

export default function Example() {
  const text = useText("slide-table");
  const fmt = useFmt();
  return (
    <Deck controls={false}>
      <TableSlide
        title={text.platformSummary}
        takeaway={text.androidIsThe}
        source={text.sourceAcmeAnalytics}
        table={{
          columns: [{ label: text.platform }, { label: text.dailyAverage, numeric: true }, { label: text.share, numeric: true }, { label: text.change, numeric: true }],
          rows: [
            [{ text: text.web, color: 1 }, fmt.full(122315), "27.6%", { delta: { change: 0.021 } }],
            [{ text: "iOS", color: 2 }, fmt.full(135693), "30.6%", { delta: { change: 0.076 } }],
            [{ text: "Android", color: 3 }, fmt.full(185486), "41.8%", { delta: { change: 0.054 } }],
          ],
        }}
      />
    </Deck>
  );
}
