import { ChatMessage, ChatPane, Composer, DayDivider, Mention, MessageLog, SystemNote, TypingIndicator } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("chat-basic");
  const people = { mina: { name: text.mina, tone: 2 }, jun: { name: text.jun, tone: 5 } };
  return (
    <ChatPane
      footer={<TypingIndicator members={[people.jun]}>{text.typing}</TypingIndicator>}
      composer={<Composer placeholder={text.placeholder} mentions={[{ id: "mina", label: text.mina, description: text.minaRole, tone: 2 }, { id: "jun", label: text.jun, description: text.junRole, tone: 5 }]} />}
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
  );
}
