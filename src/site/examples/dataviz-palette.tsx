import { Swatches } from "../demo";

const steps = (name: string, count: number) => Array.from({ length: count }, (_, i) => `color.${name}.${i + 1}`);

export default function Example() {
  return (
    <>
      <Swatches paths={steps("series", 8)} />
      <Swatches paths={steps("sequential", 7)} />
      <Swatches paths={steps("sequential-main", 7)} />
      <Swatches paths={["color.status.good", "color.status.warning", "color.status.serious", "color.status.critical"]} />
    </>
  );
}
