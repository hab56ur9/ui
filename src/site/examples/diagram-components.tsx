import { Badge, Diagram, Meter, Stat } from "ui";
import { series, useText } from "../demo";

export default function Example() {
  const text = useText("diagram-components");
  return (
    <Diagram id="payment-flow" title={text.title}>
      <Diagram.Node id="gateway" label="API Gateway" icon="shield">
        <Stat label={text.requests} value="1,240" delta={{ change: 0.08 }} trend={series(3, 24, 1100, 6, 60)} size="sm" />
      </Diagram.Node>
      <Diagram.Group id="payment" label="Payment">
        <Diagram.Node id="api" label="Payment API" icon="server">
          <Meter label={text.approval} value={98.6} max={100} target={99} format={(v) => `${v}%`} status="warning" />
        </Diagram.Node>
      </Diagram.Group>
      <Diagram.Node id="ledger" label="Ledger DB" icon="database">
        <Badge tone="good">{text.healthy}</Badge>
      </Diagram.Node>
      <Diagram.Node id="events" label="Payment Events" caption="Kafka" icon="queue">
        <Badge tone="warning">{text.lag}</Badge>
      </Diagram.Node>
      <Diagram.Arrow from="gateway" to="api" step={1} packet="link" />
      <Diagram.Arrow from="api" to="ledger" step={2} label={text.write} packet="file" />
      <Diagram.Arrow from="api" to="events" label={text.event} motion="dots" />
    </Diagram>
  );
}
