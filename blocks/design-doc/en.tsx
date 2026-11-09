import { ChangeLog, CodeBlock, DataTable, Doc, DocSection, Figure, LineChart, Options, Ref, RequirementTable } from "ui";
import { resets } from "./trend";

const LAYOUT = `[
  { "id": "kpi-users", "w": 3, "h": 2 },
  { "id": "users", "w": 8, "h": 5 },
  { "id": "growth", "w": 6, "h": 4, "hidden": true }
]`;

const USAGE = `<Board
  initialLayout={read("ts.layout.v2")}
  onLayoutChange={(layout) => write("ts.layout.v2", layout)}
>
  <Widget id="users" title="Active users" w={8} h={5}>
    <LineChart series={series} />
  </Widget>
</Board>`;

export function DesignDocEn() {
  return (
    <Doc
      title="Saving the widget board layout"
      summary="Save the order, size and hidden state that a user gives the widgets in the browser, and restore them on the next visit."
      meta={{ status: "review", authors: ["Frontend team"], reviewers: ["Design system owner"], date: "2026-11-09", version: "0.3" }}
    >
      <DocSection title="Background">
        <p>On the widget board, people drag, resize and hide widgets. Today a refresh puts the whole layout back to the start.</p>
        <p>In beta interviews, seven of twelve users said they rebuild the same layout every day.</p>
      </DocSection>
      <DocSection title="Goals and non-goals">
        <DocSection title="Goals">
          <ul>
            <li>Keep the layout across refreshes and visits.</li>
            <li>Keep the board working when the widget list changes.</li>
          </ul>
        </DocSection>
        <DocSection title="Non-goals">
          <ul>
            <li>No syncing of layouts between devices.</li>
            <li>No sharing of layouts with other people.</li>
          </ul>
        </DocSection>
      </DocSection>
      <DocSection title="Requirements">
        <RequirementTable
          items={[
            { text: "Order, size and hidden state survive a refresh.", priority: "must", status: "done" },
            { text: "When the widget list changes, the saved value is dropped and the default layout returns.", priority: "must", status: "done" },
            { text: "The board works where storage is unavailable.", priority: "must", status: "done", note: "Private mode, full storage" },
            { text: "Resetting the layout asks first and can be undone.", priority: "should", status: "done" },
            { text: "Layouts are saved on the server.", priority: "could", status: "dropped", note: "Syncing between devices is a non-goal." },
          ]}
        />
      </DocSection>
      <DocSection title="Design">
        <DocSection title="Format">
          <p>
            A layout is an array with each widget's <code>id</code>, width <code>w</code>, height <code>h</code> and hidden flag. The array order is the screen order, so a single write meets <Ref to="R1" />.
          </p>
          <CodeBlock title="localStorage · ts.layout.v2" lang="json" code={LAYOUT} />
          <Figure kind="table" caption="Saved size by widget count">
            <DataTable
              columns={[{ label: "Widgets" }, { label: "Saved size", numeric: true }]}
              rows={[
                ["4", "about 180 B"],
                ["8", "about 360 B"],
                ["12", "about 540 B"],
              ]}
            />
          </Figure>
        </DocSection>
        <DocSection title="Key and version">
          <p>
            The storage key carries a format version. When the saved widget set differs from the current widget list, the saved value is dropped for the default layout. That meets <Ref to="R2" />.
          </p>
          <CodeBlock lang="tsx" code={USAGE} />
        </DocSection>
        <DocSection title="Failures">
          <p>
            Reads and writes both sit in a <code>try</code>. When a write fails, only the screen state changes, with no message. That meets <Ref to="R3" />.
          </p>
          <Figure caption="Daily layout resets over four beta weeks. They dropped once saving was on." height={200}>
            <LineChart series={[{ name: "Resets", color: 1, points: resets }]} format={{ axis: (v) => `${v}` }} />
          </Figure>
        </DocSection>
      </DocSection>
      <DocSection title="Alternatives">
        <Options
          items={[
            { name: "localStorage", summary: "Save in the browser.", pros: ["No server work", "Instant reads and writes"], cons: ["Saved per device"], chosen: true },
            { name: "Server", summary: "Save through a user-settings API.", pros: ["Follows the user across devices"], cons: ["Needs an API and auth", "Goes beyond the goals"] },
            { name: "URL parameter", summary: "Put the layout in the URL.", pros: ["Shareable as a link"], cons: ["Long URLs", "Lost on a fresh visit"] },
          ]}
        />
      </DocSection>
      <DocSection title="Rollout">
        <ol>
          <li>Bump the key to <code>v2</code> and stop reading the old one.</li>
          <li>Turn it on in the docs site first, then on the dashboard a week later.</li>
        </ol>
      </DocSection>
      <DocSection title="Open questions">
        <ul>
          <li>If several dashboards use the same widget ids, should the key be split per dashboard?</li>
        </ul>
      </DocSection>
      <DocSection title="Change history">
        <ChangeLog
          items={[
            { version: "0.3", date: "2026-11-09", author: "Frontend team", note: "Dropped the server alternative." },
            { version: "0.2", date: "2026-11-02", author: "Frontend team", note: "Added failure handling." },
            { version: "0.1", date: "2026-10-28", author: "Frontend team", note: "First draft" },
          ]}
        />
      </DocSection>
    </Doc>
  );
}
