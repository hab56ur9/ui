import { useState } from "react";
import { AppShell, Card, Page, Stat } from "ui";
import { useText } from "../demo";
import { Phone } from "../Phone";

export default function Example() {
  const text = useText("appshell-basic");
  const [current, setCurrent] = useState("home");
  const [open, setOpen] = useState<string>();
  const stat = text.stats.find(([label]) => label === open);
  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Phone>
        <AppShell
          mobileNav="tabs"
          tabBar={{ variant: "floating", labels: "active" }}
          brand={text.brand}
          nav={[{ items: text.items.map((item) => ({ ...item, icon: item.icon as "home", current: item.id === current, onSelect: () => setCurrent(item.id) })) }]}
          title={stat ? stat[0] : text.items.find((item) => item.id === current)?.label}
          onBack={stat ? () => setOpen(undefined) : undefined}
        >
          {stat ? (
            <Page title={stat[0]}>
              <Stat value={stat[1]} />
            </Page>
          ) : (
            <Page title={text.title}>
              {text.stats.map(([label, value]) => (
                <Card key={label} title={label} onClick={() => setOpen(label)}>
                  <Stat value={value} />
                </Card>
              ))}
            </Page>
          )}
        </AppShell>
      </Phone>
    </div>
  );
}
