import { useState } from "react";
import { Board, Button, Callout, DataTable, List, Stack, Widget } from "ui";
import { Row, useFmt, useText } from "../demo";

export default function Example() {
  const text = useText("motion-enter");
  const fmt = useFmt();
  const [round, setRound] = useState(0);
  const [added, setAdded] = useState(0);
  const later = [
    [text.gwangju, fmt.count(29000)],
    [text.daejeon, fmt.count(27000)],
    [text.ulsan, fmt.count(21000)],
  ];
  const replay = () => {
    setAdded(0);
    setRound((n) => n + 1);
  };
  return (
    <Stack>
      <Board key={round}>
        <Widget id="regions" w={7} h={4} title={text.regions}>
          <DataTable
            columns={[{ label: text.region }, { label: text.users, numeric: true }]}
            rows={[
              [text.seoul, fmt.count(182000)],
              [text.busan, fmt.count(64000)],
              [text.daegu, fmt.count(41000)],
              [text.incheon, fmt.count(38000)],
              ...later.slice(0, added),
            ]}
          />
        </Widget>
        <Widget id="people" w={5} h={4} title={text.people}>
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
        <Button variant="primary" onClick={replay}>
          {text.replay}
        </Button>
        <Button disabled={added === later.length} onClick={() => setAdded((n) => n + 1)}>
          {text.addRow}
        </Button>
      </Row>
    </Stack>
  );
}
