import { useState } from "react";
import { Board, Button, Callout, DataTable, List, Stack, Widget } from "ui";
import { Row, useFmt, useText } from "../demo";

export default function Example() {
  const text = useText("motion-enter");
  const fmt = useFmt();
  const [round, setRound] = useState(0);
  return (
    <Stack>
      <Board key={round}>
        <Widget id="regions" w={7} h={3} title={text.regions}>
          <DataTable
            columns={[{ label: text.region }, { label: text.users, numeric: true }]}
            rows={[
              [text.seoul, fmt.count(182000)],
              [text.busan, fmt.count(64000)],
              [text.daegu, fmt.count(41000)],
              [text.incheon, fmt.count(38000)],
            ]}
          />
        </Widget>
        <Widget id="people" w={5} h={3} title={text.people}>
          <List
            items={[
              { id: "a", title: text.design, avatar: "A", meta: "3" },
              { id: "b", title: text.backend, avatar: "B", meta: "5" },
              { id: "c", title: text.qa, avatar: "C", meta: "2" },
            ]}
          />
        </Widget>
        <Widget id="note" w={12} h={2} title={text.note}>
          <Callout tone="info">{text.noteBody}</Callout>
        </Widget>
      </Board>
      <Row>
        <Button variant="primary" onClick={() => setRound((n) => n + 1)}>
          {text.replay}
        </Button>
      </Row>
    </Stack>
  );
}
