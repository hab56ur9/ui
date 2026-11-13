import { CommandPalette } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("palette-commands");
  return (
    <CommandPalette
      inline
      placeholder={text.placeholder}
      empty={text.empty}
      footer={[text.move, text.run]}
      groups={[
        {
          title: text.actions,
          items: [
            { id: "new", label: text.new, icon: "plus", hint: "⌘N" },
            { id: "theme", label: text.theme, icon: "moon", hint: "⌘⇧L" },
            { id: "settings", label: text.settings, icon: "sliders", hint: "⌘," },
            { id: "help", label: text.help, icon: "info", always: true },
          ],
        },
      ]}
    />
  );
}
