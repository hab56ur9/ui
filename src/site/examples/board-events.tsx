import { useState } from "react";
import { Board, Stat, useToast, Widget, type LayoutItem } from "ui";
import { fill, useFmt, useText } from "../demo";

const server = { saveLayout: (layout: LayoutItem[]) => new Promise((resolve) => setTimeout(() => resolve(layout), 300)) };

export default function Example() {
  const text = useText("board-events");
  const fmt = useFmt();
  const toast = useToast();
  const [changes, setChanges] = useState(0);
  const [commits, setCommits] = useState(0);
  const commit = async (layout: LayoutItem[]) => {
    setCommits((n) => n + 1);
    await server.saveLayout(layout);
    toast({ message: text.layoutSavedTo, status: "good", duration: 1800 });
  };
  return (
    <Board onLayoutChange={() => setChanges((n) => n + 1)} onLayoutCommit={commit} toolbar={fill(text.counts, { changes, commits })}>
      <Widget id="users" w={4} h={2} title={text.activeUsers}>
        <Stat value={fmt.count(471000)} />
      </Widget>
      <Widget id="revenue" w={4} h={2} title={text.revenue}>
        <Stat value={fmt.won(3810000000)} />
      </Widget>
      <Widget id="errors" w={4} h={2} title={text.errorRate}>
        <Stat value={fmt.percent(0.0035)} />
      </Widget>
    </Board>
  );
}
