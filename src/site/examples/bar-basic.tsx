import { BarChart } from "ui";
import { Canvas, series, useFmt, useText } from "../demo";

const points = series(31, 14, 5000, 80, 1600);

export default function Example() {
  const text = useText("bar-basic");
  const fmt = useFmt();
  return (
    <Canvas height={220}>
      <BarChart name={text.signUps} points={points} format={{ axis: fmt.count, value: fmt.full }} />
    </Canvas>
  );
}
