const NAMES = ["하늘_산책", "minji.cooks", "seoul.frames", "bada", "jun_runs", "noon.studio", "olive", "pine.trail"];
const ALTS = ["가을 숲길", "토마토 파스타", "한강 노을", "바닷가 산책", "새벽 달리기", "작업실 책상", "올리브 화분", "산 능선"];

export const data: Record<string, unknown> = {
  stories: NAMES.map((name, i) => ({ id: `s${i}`, name, seen: i > 4 })),
  explore: Array.from({ length: 15 }, (_, i) => ({ id: `e${i}`, alt: ALTS[i % ALTS.length], seed: i * 3 + 1 })),
  topics: ["자연", "음식", "여행", "카페", "운동", "사진", "반려동물"].map((title, i) => ({ id: `t${i}`, title, meta: `게시물 ${i + 2}.${i}천개`, seed: [7, 1, 2, 4, 5, 3, 6][i] })),
  places: [
    { id: "pl1", title: "서울숲 은행나무길", description: "지금 가장 노란 길", meta: "게시물 2.1천개", seed: 4, badge: "인기" },
    { id: "pl2", title: "망원 한강공원", description: "노을 명소", meta: "게시물 980개", seed: 2 },
    { id: "pl3", title: "북한산 백운대", description: "첫눈 전 마지막 단풍", meta: "게시물 640개", seed: 7 },
    { id: "pl4", title: "성수 카페 거리", description: "주말 브런치", meta: "게시물 3.4천개", seed: 1 },
  ],
  "me.photos": Array.from({ length: 9 }, (_, i) => ({ id: `m${i}`, alt: ALTS[(i + 2) % ALTS.length], seed: i * 5 + 2 })),
  "me.stats": [
    { label: "게시물", value: 128 },
    { label: "팔로워", value: 4820 },
    { label: "팔로잉", value: 312 },
  ],
  activity: [
    { id: "a1", avatar: "minji.cooks", title: "minji.cooks님이 회원님의 사진을 좋아합니다", description: "가을 숲길", meta: "5분" },
    { id: "a2", avatar: "jun_runs", title: "jun_runs님이 댓글을 남겼습니다", description: "여기 어디예요? 다음 주에 가 볼게요", meta: "1시간" },
    { id: "a3", avatar: "bada", title: "bada님이 회원님을 팔로우하기 시작했습니다", meta: "3시간" },
    { id: "a4", avatar: "seoul.frames", title: "seoul.frames님이 회원님을 언급했습니다", description: "@하늘_산책 오늘 노을 같이 봐요", meta: "어제" },
    { id: "a5", avatar: "noon.studio", title: "noon.studio님이 새 게시물을 올렸습니다", meta: "2일" },
  ],
};

export const dataEn: Record<string, unknown> = {
  ...data,
  explore: (data.explore as { alt: string }[]).map((item, i) => ({ ...item, alt: ["Autumn trail", "Tomato pasta", "Han River sunset", "Beach walk", "Dawn run", "Studio desk", "Olive plant", "Mountain ridge"][i % 8] })),
  "me.photos": (data["me.photos"] as { alt: string }[]).map((item, i) => ({ ...item, alt: ["Han River sunset", "Beach walk", "Dawn run", "Studio desk", "Olive plant", "Mountain ridge", "Autumn trail", "Tomato pasta"][i % 8] })),
  topics: ["Nature", "Food", "Travel", "Cafes", "Fitness", "Photo", "Pets"].map((title, i) => ({ id: `t${i}`, title, meta: `${i + 2}.${i}K posts`, seed: [7, 1, 2, 4, 5, 3, 6][i] })),
  places: [
    { id: "pl1", title: "Seoul Forest ginkgo road", description: "The yellowest path right now", meta: "2.1K posts", seed: 4, badge: "Popular" },
    { id: "pl2", title: "Mangwon Han River Park", description: "Sunset spot", meta: "980 posts", seed: 2 },
    { id: "pl3", title: "Baegundae, Bukhansan", description: "Last colors before the snow", meta: "640 posts", seed: 7 },
    { id: "pl4", title: "Seongsu cafe street", description: "Weekend brunch", meta: "3.4K posts", seed: 1 },
  ],
  "me.stats": [
    { label: "Posts", value: 128 },
    { label: "Followers", value: 4820 },
    { label: "Following", value: 312 },
  ],
  activity: [
    { id: "a1", avatar: "minji.cooks", title: "minji.cooks liked your photo", description: "Autumn trail", meta: "5m" },
    { id: "a2", avatar: "jun_runs", title: "jun_runs commented", description: "Where is this? Going next week", meta: "1h" },
    { id: "a3", avatar: "bada", title: "bada started following you", meta: "3h" },
    { id: "a4", avatar: "seoul.frames", title: "seoul.frames mentioned you", description: "@haneul.walks sunset tonight?", meta: "Yesterday" },
    { id: "a5", avatar: "noon.studio", title: "noon.studio shared a new post", meta: "2d" },
  ],
};
