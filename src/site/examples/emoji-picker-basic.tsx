import { useState } from "react";
import { EmojiPicker, Stack } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("emoji-picker-basic");
  const [mine, setMine] = useState(["👍", "🎉"]);
  const toggle = (emoji: string) => setMine((list) => (list.includes(emoji) ? list.filter((item) => item !== emoji) : [...list, emoji]));
  return (
    <Stack>
      <span>
        {text.title} {mine.join(" ")}
      </span>
      <EmojiPicker selected={mine} recent={["👍", "✅", "👀", "🙌", "🎉", "🤔", "🙏", "🔥"]} onSelect={toggle} />
    </Stack>
  );
}
