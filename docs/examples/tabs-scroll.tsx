import { Tabs } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  const names = t({
    ko: ["전체", "디스플레이", "동영상", "검색", "쇼핑", "앱 설치", "리타기팅", "브랜드", "이벤트"],
    en: ["All", "Display", "Video", "Search", "Shopping", "App installs", "Retargeting", "Brand", "Events"],
  });
  return (
    <div style={{ maxWidth: 360, margin: "0 auto" }}>
      <Tabs label={t({ ko: "캠페인 유형", en: "Campaign type" })} items={names.map((name, i) => ({ id: String(i), label: name }))} />
    </div>
  );
}
