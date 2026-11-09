import { Post, Stories } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 390 }}>
      <Stories items={["minji.cooks", "seoul.frames", "bada", "jun_runs", "olive"].map((name, i) => ({ id: name, name, seen: i > 2 }))} />
      <Post
        author="seoul.frames"
        place={t({ ko: "한강공원", en: "Han River Park" })}
        photo={{ alt: t({ ko: "한강 노을", en: "Han River sunset" }), seed: 2 }}
        likes={3891}
        caption={t({ ko: "오늘 노을은 10분 만에 지나갔다.", en: "Tonight's sunset lasted ten minutes." })}
        comments={112}
        time={t({ ko: "5시간 전", en: "5 hours ago" })}
      />
    </div>
  );
}
