import { useState } from "react";
import { TabBar } from "ui";
import { useText } from "../demo";
import { Mockup } from "../Mockup";

export default function Example() {
  const text = useText("tabbar-basic");
  const [tab, setTab] = useState("today");
  return (
    <Mockup device="mobile" place="dock">
      <TabBar
        value={tab}
        onChange={setTab}
        items={[
          { id: "today", label: text.today, icon: "home" },
          { id: "workouts", label: text.workouts, icon: "calendar", badge: 2 },
          { id: "trends", label: text.trends, icon: "chart-line" },
          { id: "profile", label: text.profile, icon: "user" },
        ]}
      />
    </Mockup>
  );
}
