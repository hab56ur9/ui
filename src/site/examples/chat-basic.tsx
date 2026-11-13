import { useLayoutEffect, useRef, useState } from "react";
import { ChatMessage, ChatPane, Composer, DayDivider, Mention, MessageLog, SystemNote, TypingIndicator, type ComposerChip } from "ui";
import { useText } from "../demo";

const chart = (probe: HTMLElement) => {
  const token = (name: string) => getComputedStyle(probe).getPropertyValue(name).trim();
  const bars = [[3, 8, 5], [7, 5, 8], [11, 3, 10]].map(([x, y, h]) => `<rect x="${x}" y="${y}" width="2" height="${h}" fill="${token("--color-main-default")}"/>`).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><rect width="16" height="16" fill="${token("--color-bg-subtle")}"/>${bars}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export default function Example() {
  const text = useText("chat-basic");
  const probe = useRef<HTMLSpanElement>(null);
  const [files, setFiles] = useState<ComposerChip[]>([
    { id: "chart", label: text.chart, size: 248_000 },
    { id: "query", label: text.query, icon: "code", size: 3_200 },
    { id: "video", label: text.video, icon: "file", error: text.tooBig },
  ]);
  useLayoutEffect(() => {
    const image = probe.current && chart(probe.current);
    if (image) setFiles((current) => current.map((file) => (file.id === "chart" ? { ...file, image } : file)));
  }, []);
  const people = { mina: { name: text.mina, tone: 2 }, jun: { name: text.jun, tone: 5 } };
  return (
    <>
      <span ref={probe} hidden />
      <ChatPane
        footer={<TypingIndicator members={[people.jun]}>{text.typing}</TypingIndicator>}
        composer={<Composer placeholder={text.placeholder} mentions={[{ id: "mina", label: text.mina, description: text.minaRole, tone: 2 }, { id: "jun", label: text.jun, description: text.junRole, tone: 5 }]} chips={files} onRemoveChip={(id) => setFiles((current) => current.filter((file) => file.id !== id))} />}
      >
        <MessageLog>
          <DayDivider>{text.today}</DayDivider>
          <ChatMessage author={text.mina} tone={2} badge={{ label: text.minaRole }} time="09:12" reactions={[{ emoji: "👍", count: 2, mine: true }]}>
            <p><Mention>{text.jun}</Mention> {text.ask}</p>
          </ChatMessage>
          <SystemNote icon="check" time="09:13">{text.note}</SystemNote>
          <ChatMessage author={text.jun} tone={5} badge={{ label: text.junRole }} time="09:15" replies={{ label: text.replies, last: text.last, members: [people.mina, people.jun] }}>
            {text.answer}
          </ChatMessage>
          <ChatMessage author={text.jun} tone={5} time="09:15" continued>{text.follow}</ChatMessage>
        </MessageLog>
      </ChatPane>
    </>
  );
}
