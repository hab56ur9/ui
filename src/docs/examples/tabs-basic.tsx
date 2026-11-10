import { List, Stat, Tabs, Widget, WidgetGrid } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tabs-basic");
  return (
    <Tabs
      label={text.campaign}
      items={[
        {
          id: "overview",
          label: text.overview,
          content: (
            <WidgetGrid>
              <Widget id="reach" title={text.reach} w={4} h={2}>
                <Stat value="12.4만" delta={{ change: 0.08 }} />
              </Widget>
              <Widget id="clicks" title={text.clicks} w={4} h={2}>
                <Stat value="3,180" delta={{ change: 0.12 }} />
              </Widget>
              <Widget id="cost" title={text.cost} w={4} h={2}>
                <Stat value="₩1,920만" delta={{ change: -0.03, goodWhenUp: false }} />
              </Widget>
            </WidgetGrid>
          ),
        },
        {
          id: "activity",
          label: text.activity,
          badge: 3,
          content: (
            <List
              items={[
                {
                  id: "1",
                  title: text.budgetRaised,
                  description: text.dailyBudget600k,
                  meta: text.n10MinAgo,
                },
                { id: "2", title: text.twoCreativesAdded, meta: text.n1HrAgo },
                { id: "3", title: text.reviewPassed, meta: text.yesterday },
              ]}
            />
          ),
        },
        { id: "settings", label: text.settings, content: text.changeThePeriod },
        { id: "billing", label: text.billing, disabled: true },
      ]}
    />
  );
}
