import { Timeline, type TimelineLane } from "ui";
import { Canvas, useText } from "../demo";

const day = new Date(2026, 10, 14, 9).getTime();
const at = (minutes: number) => day + minutes * 6e4;
const plan: [number, number | undefined, number, number][][] = [
  [[0, 42, 1, 0], [50, 95, 1, 1], [110, undefined, 1, 2]],
  [[20, 48, 2, 3], [96, 130, 2, 3]],
  [[45, 70, 3, 4], [132, 150, 3, 4]],
  [[5, 80, 1, 5], [85, 120, 4, 6]],
];

export default function Example() {
  const text = useText("timeline-agents");
  const lanes: TimelineLane[] = plan.map((segments, lane) => ({
    label: text.lanes[lane],
    segments: segments.map(([start, end, tone, label]) => ({ start: at(start), end: end === undefined ? undefined : at(end), tone, label: text.tasks[label] })),
  }));
  return (
    <Canvas height={220}>
      <Timeline lanes={lanes} from={at(0)} to={at(180)} now={at(160)} title={text.title} />
    </Canvas>
  );
}
