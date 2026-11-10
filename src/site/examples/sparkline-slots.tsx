import { Sparkline } from "ui";
import { Row, series } from "../demo";

const SLOTS = [1, 2, 3];

export default function Example() {
  return (
    <Row>
      {SLOTS.map((slot) => (
        <span className="data-table-figure" key={slot}>
          <Sparkline points={series(slot * 7, 24, 100, 0.8, 10)} color={slot} />
        </span>
      ))}
    </Row>
  );
}
