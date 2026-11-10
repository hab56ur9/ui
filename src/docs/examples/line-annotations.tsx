import { LineChart } from "ui";
import { Canvas, DAY, END, useFmt, usePlatforms } from "../demo";

export default function Example() {
  const fmt = useFmt();
  return (
    <Canvas height={280}>
      <LineChart series={usePlatforms()} annotations={[{ t: END - 20 * DAY, label: "v2.5" }]} format={{ axis: fmt.count }} />
    </Canvas>
  );
}
