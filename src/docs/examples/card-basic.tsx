import { Badge, Button, Card } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("card-basic");
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "var(--space-3)" }}>
      <Card title={text.basicPlan} description={text.oneDashboardFor} />
      <Card
        selected
        title={text.teamPlan}
        aside={
          <Badge tone="main" variant="solid">
            {text.current}
          </Badge>
        }
        description={text.unlimitedDashboardsAnd}
      >
        <Button>{text.viewSettings}</Button>
      </Card>
      <Card title={text.billingSync} aside={<Badge tone="warning">{text.needsReview}</Badge>} description={text.theCardExpires} />
    </div>
  );
}
