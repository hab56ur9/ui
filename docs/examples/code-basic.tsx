import { CodeBlock } from "ui";

const QUERY = `select date, count(*) as resets
from layout_events
where kind = 'reset'
group by date
order by date;`;

export default function Example() {
  return <CodeBlock title="resets.sql" lang="sql" code={QUERY} />;
}
