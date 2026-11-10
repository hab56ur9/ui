import { Board, LineChart, Stat, Widget } from "ui";
import { series, useFmt, usePlatforms, useText } from "../demo";

export default function Example() {
  const text = useText("board-basic");
  const fmt = useFmt();
  const platforms = usePlatforms();
  const label = text.vsPrevious30;
  return (
    <Board>
      <Widget id="users" w={4} h={2} title={text.activeUsers} subtitle={text.dailyAverage}>
        <Stat value={fmt.count(471000)} delta={{ change: 0.063, label }} trend={series(5, 24, 100, 1, 6)} />
      </Widget>
      <Widget id="revenue" w={4} h={2} title={text.revenue} subtitle={text.total}>
        <Stat value={fmt.won(3810000000)} delta={{ change: 0.046, label }} trend={series(6, 24, 100, 1, 9)} />
      </Widget>
      <Widget id="errors" w={4} h={2} title={text.errorRate} subtitle={text.average}>
        <Stat value={fmt.percent(0.0035)} delta={{ change: -0.11, goodWhenUp: false, label }} trend={series(8, 24, 40, -0.3, 5)} />
      </Widget>
      <Widget id="platforms" w={12} h={4} title={text.usersByPlatform} subtitle={text.last60Days}>
        <LineChart series={platforms} format={{ axis: fmt.count }} />
      </Widget>
    </Board>
  );
}
