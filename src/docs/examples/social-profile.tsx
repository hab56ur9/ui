import { Button, List, PhotoGrid, ProfileHeader } from "ui";
import { fill, useText } from "../demo";

export default function Example() {
  const text = useText("social-profile");
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)", maxWidth: 390 }}>
      <ProfileHeader
        name="haneul.walks"
        handle="@haneul.walks"
        bio={text.walkingShootingWriting}
        stats={[
          { label: text.posts, value: 128 },
          { label: text.followers, value: 4820 },
          { label: text.following, value: 312 },
        ]}
      >
        <Button>{text.editProfile}</Button>
        <Button>{text.shareProfile}</Button>
      </ProfileHeader>
      <PhotoGrid items={Array.from({ length: 6 }, (_, i) => ({ id: `p${i}`, alt: fill(text.photo, { n: i + 1 }), seed: i * 5 + 2 }))} />
      <List
        items={[
          { id: "a1", avatar: "minji.cooks", title: text.minjiCooksLiked, meta: text.n5m },
          { id: "a2", avatar: "bada", title: text.badaStartedFollowing, meta: text.n3h },
        ]}
      />
    </div>
  );
}
