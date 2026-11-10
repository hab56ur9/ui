import { RequirementTable } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("requirements-basic");
  return (
    <RequirementTable
      items={[
        { text: text.theLayoutSurvives, priority: "must", status: "done" },
        { text: text.itWorksWithout, priority: "must", note: text.privateMode },
        { text: text.aLayoutReset, priority: "should" },
        { text: text.layoutsAreSaved, priority: "could", status: "dropped" },
      ]}
    />
  );
}
