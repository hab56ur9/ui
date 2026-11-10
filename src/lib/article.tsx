import { Component, useState, type CSSProperties, type ErrorInfo, type ReactNode } from "react";
import { Callout } from "./Callout";
import { CodeBlock, type CodeLang } from "./Code";
import { Button, Segmented } from "./controls";
import { DataTable } from "./DataTable";
import { useI18n } from "./i18n";
import { useToast } from "./overlay/Provider";
import { Tabs } from "./Tabs";

export function RichText({ text }: { text: string }) {
  return (
    <>
      {String(text)
        .split(/`([^`]+)`/)
        .map((part, i) => (i % 2 ? <code key={i}>{part}</code> : part))}
    </>
  );
}

export function useCopy() {
  const toast = useToast();
  const { text } = useI18n();
  return async (value: string, label: string) => {
    const copied = await (navigator.clipboard?.writeText(value).then(
      () => true,
      () => false,
    ) ?? false);
    toast({ message: copied ? text("copied", { label }) : text("copyFailed"), status: copied ? "good" : "warning", duration: 1800 });
  };
}

export type ArticleProps = { eyebrow?: ReactNode; title: ReactNode; lede?: ReactNode; wide?: boolean; pager?: ReactNode; children?: ReactNode };

export function Article({ eyebrow, title, lede, wide, pager, children }: ArticleProps) {
  return (
    <main className="article-main">
      <article className={`article${wide ? " is-wide" : ""}`} data-medium="doc">
        {eyebrow && <div className="article-eyebrow">{eyebrow}</div>}
        <h1 className="article-title">{title}</h1>
        {lede && <p className="article-lede">{lede}</p>}
        {children}
        {pager && <div className="article-pager">{pager}</div>}
      </article>
    </main>
  );
}

export type ArticleSectionProps = { id?: string; title?: ReactNode; children?: ReactNode };

export function ArticleSection({ id, title, children }: ArticleSectionProps) {
  return (
    <section className="article-section" id={id}>
      {title && <h2>{title}</h2>}
      {children}
    </section>
  );
}

export function Paragraphs({ items }: { items: string[] }) {
  return (
    <>
      {items.map((item) => (
        <p key={item}>
          <RichText text={item} />
        </p>
      ))}
    </>
  );
}

export function TextList({ items, ordered = false }: { items: string[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag>
      {items.map((item) => (
        <li key={item}>
          <RichText text={item} />
        </li>
      ))}
    </Tag>
  );
}

export function CardGrid({ children }: { children: ReactNode }) {
  return <div className="card-grid">{children}</div>;
}

export function Anatomy({ items }: { items: [string, string][] }) {
  return (
    <ol className="anatomy">
      {items.map(([name, description]) => (
        <li key={name}>
          <strong>
            <RichText text={name} />
          </strong>
          <span>
            <RichText text={description} />
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Row({ children }: { children: ReactNode }) {
  return <div className="demo-row">{children}</div>;
}

export function Brand({ name, version, href }: { name: string; version?: string; href?: string }) {
  return (
    <a className="brand" href={href}>
      {name} {version && <span>{version}</span>}
    </a>
  );
}

export function CopyCode({ code, title }: { code: string; title?: string }) {
  const copy = useCopy();
  const { text } = useI18n();
  return (
    <CodeBlock
      code={code}
      title={title}
      actions={
        <Button className="copy-button" onClick={() => copy(code, text("theCode"))}>
          {text("copy")}
        </Button>
      }
    />
  );
}

export type PropsTableProps = { description?: string; rows: [string, string, string, string][] };

export function PropsTable({ description, rows }: PropsTableProps) {
  const { text } = useI18n();
  const head = [text("props.name"), text("props.type"), text("props.default"), text("props.description")];
  return (
    <>
      {description && (
        <p>
          <RichText text={description} />
        </p>
      )}
      <div className="props-table">
        <DataTable
          fit
          columns={head.map((label, column) => ({ label, wrap: true, width: ["24%", "30%", "14%", "32%"][column] }))}
          rows={rows.map(([name, type, fallback, description]) => [
            { text: name, className: "props-name" },
            { className: "props-type", content: type.split(" · ").map((part, i) => <span key={i}>{part}</span>) },
            { text: fallback, className: "props-default" },
            { content: <RichText text={description} /> },
          ])}
        />
      </div>
    </>
  );
}

export type TokenRow = { name: string; color?: boolean; values: { mode?: string; value: string }[]; use?: string };

export function TokenTable({ rows }: { rows: TokenRow[] }) {
  const copy = useCopy();
  const { text } = useI18n();
  return (
    <DataTable
      fit
      columns={[text("token.name"), text("token.value"), text("token.use")].map((label, column) => ({ label, wrap: column === 2 }))}
      rows={rows.map((row) => [
        {
          content: (
            <button type="button" className="copy-name" onClick={() => copy(`var(${row.name})`, row.name)}>
              {row.name}
            </button>
          ),
        },
        {
          content: row.values.map(({ mode, value }) => (
            <span className="token-entry" key={`${mode}-${value}`}>
              {mode && <em>{mode}</em>}
              {row.color && <i style={{ "--sw": value } as CSSProperties} />}
              <span>{value}</span>
            </span>
          )),
        },
        { content: <RichText text={row.use ?? ""} /> },
      ])}
    />
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  state = { error: null as Error | null };
  static getDerivedStateFromError(error: Error) {
    return { error };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(error, info.componentStack);
  }
  render() {
    if (this.state.error) return <pre className="example-error">{String(this.state.error)}</pre>;
    return this.props.children;
  }
}

export type ExampleFile = { name: string; code: string; lang?: CodeLang };
export type ExampleVariant = { value: string; label: string; preview: ReactNode; files: ExampleFile[] };
export type ExampleProps = {
  caption?: string;
  layout?: "padded" | "centered" | "fullscreen";
  medium?: string;
  lang?: string;
  files?: ExampleFile[];
  variants?: ExampleVariant[];
  children?: ReactNode;
};

export function Example({ caption, layout = "padded", medium, lang, files = [], variants, children }: ExampleProps) {
  const copy = useCopy();
  const { text } = useI18n();
  const [tab, setTab] = useState("preview");
  const [variant, setVariant] = useState(variants?.[0]?.value ?? "");
  const [file, setFile] = useState(0);
  const current = variants?.find((item) => item.value === variant);
  const shownFiles = current?.files ?? files;
  const shown = shownFiles[file] ?? shownFiles[0];
  const source = shownFiles[0]?.code ?? "";
  return (
    <>
      {caption && (
        <p className="example-caption">
          <RichText text={caption} />
        </p>
      )}
      <div className="example">
        <div className="example-bar">
          <Tabs
            value={tab}
            onChange={setTab}
            items={[
              { id: "preview", label: text("preview") },
              { id: "code", label: text("code") },
            ]}
          />
          <span className="toolbar-spacer" />
          {variants && <Segmented label={text("device")} value={variant} onChange={setVariant} options={variants.map((item) => ({ value: item.value, label: item.label }))} />}
          <Button className="copy-button" onClick={() => copy(tab === "code" ? (shown?.code ?? source) : source, text("theCode"))}>
            {text("copy")}
          </Button>
        </div>
        <div className={`example-preview is-${layout}`} data-medium={medium ?? "app"} lang={lang} hidden={tab !== "preview"}>
          <div className="example-stage">
            <ErrorBoundary key={variant}>{current?.preview ?? children}</ErrorBoundary>
          </div>
        </div>
        {tab === "code" && shown && (
          <div className="example-code">
            {shownFiles.length > 1 && (
              <div className="example-files">
                <Tabs label={text("code")} variant="pill" value={String(file)} onChange={(id) => setFile(Number(id))} items={shownFiles.map((item, i) => ({ id: String(i), label: item.name }))} />
              </div>
            )}
            <CodeBlock code={shown.code} lang={shown.lang ?? "tsx"} />
          </div>
        )}
      </div>
    </>
  );
}

export function Guidelines({ items }: { items: [string, string][] }) {
  return (
    <>
      {items.map(([good, bad]) => (
        <div style={{ marginBottom: "var(--space-4)" }} key={good}>
          <CardGrid>
            <Callout tone="do" accent="top">
              <RichText text={good} />
            </Callout>
            <Callout tone="dont" accent="top">
              <RichText text={bad} />
            </Callout>
          </CardGrid>
        </div>
      ))}
    </>
  );
}
