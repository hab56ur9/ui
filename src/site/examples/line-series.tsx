import { LineChart } from "ui";
import { Canvas, useFmt, usePlatforms } from "../demo";

export default function Example() {
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <LineChart series={usePlatforms()} format={{ axis: fmt.count }} />
    </Canvas>
  );
}
