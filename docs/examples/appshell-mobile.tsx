import { useState } from "react";
import { AppShell, Page, Stat, Widget, WidgetGrid } from "ui";
import { useText } from "../demo";
import { Phone } from "../Phone";

export default function Example() {
  const text = useText("appshell-basic");
  const [current, setCurrent] = useState("home");
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Phone>
        <AppShell
          mobileNav="tabs"
          tabBar={{ variant: "floating", labels: "active" }}
          brand={text.brand}
          nav={[{ items: text.items.map((item) => ({ ...item, icon: item.icon as "home", current: item.id === current, onSelect: () => setCurrent(item.id) })) }]}
          title={text.items.find((item) => item.id === current)?.label}
        >
          <Page title={text.title}>
            <WidgetGrid>
              {text.stats.map(([label, value]) => (
                <Widget key={label} id={label} title={label} w={12} h={2}>
                  <Stat value={value} />
                </Widget>
              ))}
            </WidgetGrid>
          </Page>
        </AppShell>
      </Phone>
    </div>
  );
}
