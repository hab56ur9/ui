import { useState } from "react";
import { AppShell, Page, Stat, Toc, Widget, WidgetGrid } from "ui";
import { Browser } from "../Browser";
import { useText } from "../demo";

export default function Example() {
  const text = useText("appshell-basic");
  const [current, setCurrent] = useState("home");
  return (
    <Browser address="app.example.com" width={1280} height={720}>
      <AppShell
        brand={text.brand}
        nav={[{ title: text.menu, items: text.items.map((item) => ({ ...item, icon: item.icon as "home", current: item.id === current, onSelect: () => setCurrent(item.id) })) }]}
        title={text.items.find((item) => item.id === current)?.label}
        aside={<Toc current="today" onSelect={() => undefined} items={text.outline} />}
      >
        <Page title={text.title}>
          <WidgetGrid>
            {text.stats.map(([label, value]) => (
              <Widget key={label} id={label} title={label} w={6} h={2}>
                <Stat value={value} />
              </Widget>
            ))}
          </WidgetGrid>
        </Page>
      </AppShell>
    </Browser>
  );
}
