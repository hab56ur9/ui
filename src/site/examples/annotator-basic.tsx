import { useState } from "react";
import { Annotator, CommentCard, DiffView, Markdown, ReviewBar, Stack } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("annotator-basic");
  const [active, setActive] = useState<string | null>("c1");
  const [resolved, setResolved] = useState<string[]>(["c2"]);
  const comments = [
    { id: "c1", quote: text.quote1, name: text.jun, tone: 5, time: "12:33", text: text.comment1 },
    { id: "c2", quote: text.quote2, name: text.mina, tone: 2, time: "12:35", text: text.comment2 },
  ];
  return (
    <Stack>
      <ReviewBar label={text.review} reviewers={[{ name: text.jun, tone: 5, label: text.changes, badge: "warning" }, { name: text.mina, tone: 2, label: text.approved, badge: "good" }]} aside={text.open} />
      <Annotator anchors={comments.map((comment) => ({ id: comment.id, quote: comment.quote, resolved: resolved.includes(comment.id) }))} active={active} onPick={setActive} onQuote={() => undefined}>
        <Markdown readOnly>{text.body}</Markdown>
      </Annotator>
      {comments.map((comment) => (
        <CommentCard key={comment.id} {...comment} active={active === comment.id} resolved={resolved.includes(comment.id)} onPick={() => setActive(comment.id)} onResolve={() => setResolved((list) => [...list, comment.id])} />
      ))}
      <DiffView lines={[{ kind: "same", text: text.diffSame }, { kind: "del", text: text.quote2 }, { kind: "add", text: text.diffAdd }]} />
    </Stack>
  );
}
