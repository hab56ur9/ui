import { Deck, MetricSlide } from "ui";
import { useFmt, useText } from "../demo";

export default function Example() {
  const text = useText("slide-metric");
  const fmt = useFmt();
  const since = text.vsPrevious30;
  return (
    <Deck controls={false}>
      <MetricSlide
        title={text.monthInBrief}
        takeaway={text.usersAndRevenue}
        source={text.sourceAcmeAnalytics}
        metrics={[
          { label: text.activeUsers, value: fmt.count(471000), delta: { change: 0.063, label: since } },
          { label: text.revenue, value: fmt.won(3810000000), delta: { change: 0.046, label: since } },
          { label: text.p95Latency, value: fmt.ms(176), delta: { change: -0.04, goodWhenUp: false, label: since } },
        ]}
      />
    </Deck>
  );
}
