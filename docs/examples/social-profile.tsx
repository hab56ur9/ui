import { Button, List, PhotoGrid, ProfileHeader } from "ui";
import { useT } from "../demo";

export default function Example() {
  const t = useT();
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 390 }}>
      <ProfileHeader
        name="haneul.walks"
        handle="@haneul.walks"
        bio={t({ ko: "걷고, 찍고, 기록합니다.", en: "Walking, shooting, writing it down." })}
        stats={[
          { label: t({ ko: "게시물", en: "Posts" }), value: 128 },
          { label: t({ ko: "팔로워", en: "Followers" }), value: 4820 },
          { label: t({ ko: "팔로잉", en: "Following" }), value: 312 },
        ]}
      >
        <Button>{t({ ko: "프로필 편집", en: "Edit profile" })}</Button>
        <Button>{t({ ko: "프로필 공유", en: "Share profile" })}</Button>
      </ProfileHeader>
      <PhotoGrid items={Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, alt: t({ ko: `사진 ${i + 1}`, en: `Photo ${i + 1}` }), seed: i * 5 + 2 }))} />
      <List
        items={[
          { id: "a1", avatar: "minji.cooks", title: t({ ko: "minji.cooks님이 사진을 좋아합니다", en: "minji.cooks liked your photo" }), meta: t({ ko: "5분", en: "5m" }) },
          { id: "a2", avatar: "bada", title: t({ ko: "bada님이 팔로우하기 시작했습니다", en: "bada started following you" }), meta: t({ ko: "3시간", en: "3h" }) },
        ]}
      />
    </div>
  );
}
