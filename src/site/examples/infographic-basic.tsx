import { Diagram, Infographic } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("infographic-basic");
  return (
    <Infographic id="queue-patterns" title={text.title} lede={text.lede}>
      <Infographic.Panel title={text.logTitle} icon="file" message={text.logMessage}>
        <Diagram title={text.logTitle}>
          <Diagram.Group id="svc" label="Services">
            <Diagram.Node id="cart" label="Cart" icon="server" />
            <Diagram.Node id="order" label="Order" icon="server" />
          </Diagram.Group>
          <Diagram.Node id="kafka" label="Kafka" icon="queue" />
          <Diagram.Node id="es" label="Elasticsearch" icon="search" />
          <Diagram.Arrow from="cart" to="kafka" step={1} packet="file" />
          <Diagram.Arrow from="order" to="kafka" step={1} packet="file" />
          <Diagram.Arrow from="kafka" to="es" step={2} packet="file" />
        </Diagram>
      </Infographic.Panel>
      <Infographic.Panel title={text.cdcTitle} icon="database" message={text.cdcMessage}>
        <Diagram title={text.cdcTitle}>
          <Diagram.Node id="src" label="Source DB" icon="database" />
          <Diagram.Node id="kafka" label="Kafka" icon="queue" />
          <Diagram.Node id="cache" label="Redis" icon="database" />
          <Diagram.Arrow from="src" to="kafka" motion="dots-pulse" />
          <Diagram.Arrow from="kafka" to="cache" motion="dots-pulse" />
        </Diagram>
      </Infographic.Panel>
    </Infographic>
  );
}
