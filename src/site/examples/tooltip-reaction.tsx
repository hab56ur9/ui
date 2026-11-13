import { ChatMessage, MessageLog } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("tooltip-reaction");
  return (
    <div style={{ width: "100%", maxWidth: 520 }}>
      <MessageLog>
        <ChatMessage
          author={text.author}
          tone={3}
          time="14:05"
          reactions={[
            { emoji: "👍", count: 7, mine: true, title: text.many },
            { emoji: "👀", count: 2, title: text.two },
            { emoji: "🎉", count: 1 },
          ]}
        >
          {text.body}
        </ChatMessage>
      </MessageLog>
    </div>
  );
}
