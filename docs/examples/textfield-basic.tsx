import { useState } from "react";
import { TextField } from "ui";
import { useText } from "../demo";

export default function Example() {
  const text = useText("textfield-basic");
  const [query, setQuery] = useState("");
  return (
    <div style={{ display: "grid", gap: "var(--space-4)", maxWidth: 360 }}>
      <TextField label={text.search} hideLabel type="search" icon="search" placeholder={text.search} value={query} onChange={setQuery} />
      <TextField label={text.name} placeholder={text.namePlaceholder} hint={text.nameHint} />
      <TextField label={text.email} type="email" defaultValue="team3@example.com" disabled />
    </div>
  );
}
