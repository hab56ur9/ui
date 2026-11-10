import { Options } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <Options
      items={[
        {
          name: "localStorage",
          summary: t({ ko: "브라우저에 저장합니다.", en: "Save in the browser." }),
          pros: [t({ ko: "서버 작업이 없습니다", en: "No server work" })],
          cons: [t({ ko: "기기마다 따로 저장됩니다", en: "Saved per device" })],
          chosen: true,
        },
        {
          name: t({ ko: "서버 저장", en: "Server" }),
          summary: t({ ko: "설정 API에 저장합니다.", en: "Save through a settings API." }),
          pros: [t({ ko: "기기 사이에 이어집니다", en: "Follows the user" })],
          cons: [t({ ko: "API와 인증이 필요합니다", en: "Needs an API and auth" })],
        },
      ]}
    />
  );
}
