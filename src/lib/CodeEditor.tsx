import { useState, type KeyboardEvent } from "react";
import { Highlight, type CodeLang } from "./Code";
import { useI18n } from "./i18n";

export type CodeEditorProps = {
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  lang?: CodeLang;
  start?: number;
  focus?: number[];
  label?: string;
  readOnly?: boolean;
};

export function CodeEditor({ value, defaultValue = "", onChange, lang = "tsx", start = 1, focus = [], label, readOnly = false }: CodeEditorProps) {
  const [draft, setDraft] = useState(defaultValue);
  const { text } = useI18n();
  const code = value ?? draft;
  const count = code.split("\n").length;

  const change = (next: string) => {
    setDraft(next);
    onChange?.(next);
  };

  const key = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Tab" || readOnly) return;
    event.preventDefault();
    const area = event.currentTarget;
    const at = area.selectionStart;
    change(code.slice(0, at) + "  " + code.slice(area.selectionEnd));
    requestAnimationFrame(() => area.setSelectionRange(at + 2, at + 2));
  };

  return (
    <div className="editor">
      <div className="editor-gutter" aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span key={i} className={focus.includes(start + i) ? "is-focus" : undefined}>
            {start + i}
          </span>
        ))}
      </div>
      <div className="editor-area">
        <div className="editor-layer">
          <pre aria-hidden="true">
            <Highlight code={code + "\n"} lang={lang} />
          </pre>
          <textarea
            value={code}
            onChange={(event) => change(event.target.value)}
            onKeyDown={key}
            readOnly={readOnly}
            spellCheck={false}
            autoCapitalize="off"
            autoComplete="off"
            aria-label={label ?? text("editor.label")}
          />
        </div>
      </div>
    </div>
  );
}
