import { useState } from "react";
import { Calendar, DAY } from "ui";

const TODAY = new Date(2026, 10, 9).getTime();

export default function Example() {
  const [day, setDay] = useState<number | null>(TODAY);
  return <Calendar value={day} onChange={setDay} today={TODAY} marks={[TODAY - 2 * DAY, TODAY - 5 * DAY, TODAY - 6 * DAY, TODAY + 3 * DAY]} />;
}
