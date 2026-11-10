import { useState } from "react";
import { TabBar } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const [tab, setTab] = useState("home");
  const items = [
    { id: "home", label: t({ ko: "홈", en: "Home" }), icon: "home" },
    { id: "explore", label: t({ ko: "탐색", en: "Explore" }), icon: "compass" },
    { id: "activity", label: t({ ko: "알림", en: "Activity" }), icon: "heart", badge: 3 },
    { id: "profile", label: t({ ko: "프로필", en: "Profile" }), icon: "user" },
  ];
  return (
    <div style={{ display: "grid", gap: "var(--space-6)", maxWidth: 390, margin: "0 auto" }}>
      <TabBar variant="floating" value={tab} onChange={setTab} items={items} />
      <TabBar variant="floating" labels="active" value={tab} onChange={setTab} items={items} />
      <TabBar variant="floating" labels="hide" value={tab} onChange={setTab} items={items} />
    </div>
  );
}
