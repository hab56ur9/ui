import { Badge, CodeBlock, Cons, Option, Options, Pros, Stat } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Options>
      <Option name="localStorage" chosen>
        <p>{t({ ko: "브라우저에 저장합니다.", en: "Save in the browser." })}</p>
        <Pros>{t({ ko: "서버 작업이 없습니다", en: "No server work" })}</Pros>
        <Cons>{t({ ko: "기기마다 따로 저장됩니다", en: "Saved per device" })}</Cons>
        <Stat size="sm" label={t({ ko: "예상 작업", en: "Estimated work" })} value={t({ ko: "2일", en: "2 days" })} />
        <CodeBlock lang="tsx" code={'localStorage.setItem("layout", JSON.stringify(items));'} />
      </Option>
      <Option name={t({ ko: "서버 저장", en: "Server" })}>
        <p>{t({ ko: "설정 API에 저장합니다.", en: "Save through a settings API." })}</p>
        <Pros>{t({ ko: "기기 사이에 이어집니다", en: "Follows the user" })}</Pros>
        <Cons>
          {t({ ko: "API와 인증이 필요합니다", en: "Needs an API and auth" })}
          <Badge tone="warning">{t({ ko: "보안 검토 필요", en: "Needs a security review" })}</Badge>
        </Cons>
        <Stat size="sm" label={t({ ko: "예상 작업", en: "Estimated work" })} value={t({ ko: "2주", en: "2 weeks" })} />
      </Option>
    </Options>
  );
}
