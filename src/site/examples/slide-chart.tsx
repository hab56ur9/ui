import { ChartSlide, Deck, LineChart } from "ui";
import { useFmt, usePlatforms, useText } from "../demo";

export default function Example() {
  const text = useText("slide-chart");
  const fmt = useFmt();
  const platforms = usePlatforms();
  return (
    <Deck controls={false}>
      <ChartSlide title={text.activeUsersBy} takeaway={text.androidIsThe} source={text.sourceAcmeAnalytics}>
        <LineChart series={platforms.map((p) => ({ name: p.name, color: p.color, points: p.points }))} format={{ axis: fmt.count }} />
      </ChartSlide>
    </Deck>
  );
}
