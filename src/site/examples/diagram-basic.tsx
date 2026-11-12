import { Diagram } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("diagram-basic");
  return (
    <Diagram id="url-shortener" title={text.title}>
      <Diagram.Node id="client" label="Client" caption={text.client} icon="phone" />
      <Diagram.Node id="api" label="API Server" caption={text.api} icon="server" />
      <Diagram.Group id="data" label="Data">
        <Diagram.Node id="cache" label="Cache" caption="Redis" icon="database" />
        <Diagram.Node id="db" label="Database" caption={text.db} icon="database" />
      </Diagram.Group>
      <Diagram.Arrow from="client" to="api" step={1} label="GET /abc" packet="link" />
      <Diagram.Arrow from="api" to="cache" step={2} label={text.lookup} packet="search" />
      <Diagram.Arrow from="api" to="db" step={3} label={text.miss} dashed packet="search" />
    </Diagram>
  );
}
