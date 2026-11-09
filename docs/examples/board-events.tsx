import { useState } from "react";
import { Board, Stat, useToast, Widget, type LayoutItem } from "ui";
import { useFmt, useT } from "../demo";

const server = { saveLayout: (layout: LayoutItem[]) => new Promise((resolve) => setTimeout(() => resolve(layout), 300)) };

export default function Example() {
  const t = useT();
  const fmt = useFmt();
  const toast = useToast();
  const [changes, setChanges] = useState(0);
  const [commits, setCommits] = useState(0);
  const commit = async (layout: LayoutItem[]) => {
    setCommits((n) => n + 1);
    await server.saveLayout(layout);
    toast({ message: t({ ko: "배치를 서버에 저장했습니다", en: "Layout saved to the server" }), status: "good", duration: 1800 });
  };
  return (
    <Board
      onLayoutChange={() => setChanges((n) => n + 1)}
      onLayoutCommit={commit}
      toolbar={<span className="toolbar-label">{t({ ko: `변경 ${changes} · 커밋 ${commits}`, en: `Changes ${changes} · Commits ${commits}` })}</span>}
    >
      <Widget id="users" w={4} h={2} title={t({ ko: "활성 사용자", en: "Active users" })}>
        <Stat value={fmt.count(471000)} />
      </Widget>
      <Widget id="revenue" w={4} h={2} title={t({ ko: "매출", en: "Revenue" })}>
        <Stat value={fmt.won(3810000000)} />
      </Widget>
      <Widget id="errors" w={4} h={2} title={t({ ko: "오류율", en: "Error rate" })}>
        <Stat value={fmt.percent(0.0035)} />
      </Widget>
    </Board>
  );
}
