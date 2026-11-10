import { useState } from "react";
import { TabBar } from "ui";
import { useT } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const t = useT();
  const [tab, setTab] = useState("today");
  return (
    <Mockup device="mobile" place="dock">
      <TabBar
        value={tab}
        onChange={setTab}
        items={[
          { id: "today", label: t({ ko: "오늘", en: "Today" }), icon: "home" },
          { id: "workouts", label: t({ ko: "운동", en: "Workouts" }), icon: "calendar", badge: 2 },
          { id: "trends", label: t({ ko: "추세", en: "Trends" }), icon: "chart-line" },
          { id: "profile", label: t({ ko: "내 정보", en: "Profile" }), icon: "user" },
        ]}
      />
    </Mockup>
  );
}
