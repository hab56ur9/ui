import { useState } from "react";
import { Segmented, TabBar } from "ui";
import { Row, useT } from "../demo";
import { Mockup } from "../Mockup";

const LABELS = ["show", "active", "hide"] as const;

export default function Example() {
  const t = useT();
  const [tab, setTab] = useState("home");
  const [labels, setLabels] = useState<(typeof LABELS)[number]>("active");
  const items = [
    { id: "home", label: t({ ko: "홈", en: "Home" }), icon: "home" },
    { id: "explore", label: t({ ko: "탐색", en: "Explore" }), icon: "compass" },
    { id: "activity", label: t({ ko: "알림", en: "Activity" }), icon: "heart", badge: 3 },
    { id: "profile", label: t({ ko: "프로필", en: "Profile" }), icon: "user" },
  ];
  return (
    <>
      <Mockup device="mobile" place="dock">
        <TabBar variant="floating" labels={labels} value={tab} onChange={setTab} items={items} />
      </Mockup>
      <Row>
        <Segmented label={t({ ko: "이름 표시", en: "Labels" })} value={labels} onChange={setLabels} options={LABELS.map((value) => ({ value, label: value }))} />
      </Row>
    </>
  );
}
