import { List, Stat, Tabs, Widget, WidgetGrid } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Tabs
      label={t({ ko: "캠페인", en: "Campaign" })}
      items={[
        {
          id: "overview",
          label: t({ ko: "개요", en: "Overview" }),
          content: (
            <WidgetGrid>
              <Widget id="reach" title={t({ ko: "도달", en: "Reach" })} w={4} h={2}>
                <Stat value="12.4만" delta={{ change: 0.08 }} />
              </Widget>
              <Widget id="clicks" title={t({ ko: "클릭", en: "Clicks" })} w={4} h={2}>
                <Stat value="3,180" delta={{ change: 0.12 }} />
              </Widget>
              <Widget id="cost" title={t({ ko: "비용", en: "Cost" })} w={4} h={2}>
                <Stat value="₩1,920만" delta={{ change: -0.03, goodWhenUp: false }} />
              </Widget>
            </WidgetGrid>
          ),
        },
        {
          id: "activity",
          label: t({ ko: "활동", en: "Activity" }),
          badge: 3,
          content: (
            <List
              items={[
                {
                  id: "1",
                  title: t({ ko: "예산을 늘렸습니다", en: "Budget raised" }),
                  description: t({ ko: "일 예산 ₩60만 → ₩80만", en: "Daily budget ₩600k → ₩800k" }),
                  meta: t({ ko: "10분 전", en: "10 min ago" }),
                },
                { id: "2", title: t({ ko: "소재 2개를 추가했습니다", en: "Two creatives added" }), meta: t({ ko: "1시간 전", en: "1 hr ago" }) },
                { id: "3", title: t({ ko: "검수를 통과했습니다", en: "Review passed" }), meta: t({ ko: "어제", en: "Yesterday" }) },
              ]}
            />
          ),
        },
        { id: "settings", label: t({ ko: "설정", en: "Settings" }), content: t({ ko: "기간, 예산, 타기팅을 바꿉니다.", en: "Change the period, budget and targeting." }) },
        { id: "billing", label: t({ ko: "정산", en: "Billing" }), disabled: true },
      ]}
    />
  );
}
