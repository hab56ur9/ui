import { useState } from "react";
import { Segmented, TabBar } from "ui";
import { Row, useText } from "../demo";
import { Mockup } from "../Mockup";

const LABELS = ["show", "active", "hide"] as const;

export default function Example() {
  const text = useText("tabbar-floating");
  const [tab, setTab] = useState("home");
  const [labels, setLabels] = useState<(typeof LABELS)[number]>("active");
  const items = [
    { id: "home", label: text.home, icon: "home" },
    { id: "explore", label: text.explore, icon: "compass" },
    { id: "activity", label: text.activity, icon: "heart", badge: 3 },
    { id: "profile", label: text.profile, icon: "user" },
  ];
  return (
    <>
      <Mockup device="mobile" place="dock">
        <TabBar variant="floating" labels={labels} value={tab} onChange={setTab} items={items} />
      </Mockup>
      <Row>
        <Segmented label={text.labels} value={labels} onChange={setLabels} options={LABELS.map((value) => ({ value, label: value }))} />
      </Row>
    </>
  );
}
