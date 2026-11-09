import { Callout, ChangeLog, CodeBlock, Doc, DocSection } from "ui";

const QUERY = `.board-frame {
  container-type: inline-size;
}

@container (max-width: 600px) {
  .board {
    grid-template-columns: minmax(0, 1fr);
  }
}`;

export function RfcEn() {
  return (
    <Doc
      title="RFC: Drawing blocks inside the docs page"
      summary="Show the dashboard examples inside the design system docs instead of on pages of their own."
      meta={{ status: "final", authors: ["Design system owner"], reviewers: ["Frontend team"], date: "2026-11-09", version: "1.0" }}
    >
      <DocSection title="Q1. Where do blocks appear?">
        <p>
          <strong>Problem.</strong> Each block had its own HTML page, so reading the docs meant jumping to another page. People took those pages for a site separate from the design system.
        </p>
        <p>
          <strong>Solution.</strong> The repository keeps one page, the root <code>index.html</code>, and the Blocks tab of the docs app draws each block as a component. A block folder keeps only its screen, data and copy files.
        </p>
      </DocSection>
      <DocSection title="Q2. How do we show device widths without an iframe?">
        <p>
          <strong>Problem.</strong> Without an iframe, the width buttons can't change media queries, and the board chose its columns from the viewport width.
        </p>
        <p>
          <strong>Solution.</strong> The board and the app shell switch to container queries and read their own width. Changing the width of the preview frame alone brings up the phone layout.
        </p>
        <CodeBlock lang="plain" title="base.css" code={QUERY} />
      </DocSection>
      <DocSection title="Q3. How do the docs theme and the block theme agree?">
        <p>
          <strong>Problem.</strong> Blocks had their own theme switch, so one page showed two switches that could disagree.
        </p>
        <p>
          <strong>Solution.</strong> Only the docs header switches the theme. Blocks follow the docs theme and language and draw no switches of their own.
        </p>
      </DocSection>
      <DocSection title="Decision">
        <Callout tone="good" title="Accepted">
          All three solutions are in. The Blocks tab shows each block in a viewer that moves between preview and code, like shadcn/ui blocks.
        </Callout>
      </DocSection>
      <DocSection title="Change history">
        <ChangeLog items={[{ version: "1.0", date: "2026-11-09", author: "Design system owner", note: "Accepted after review." }]} />
      </DocSection>
    </Doc>
  );
}
