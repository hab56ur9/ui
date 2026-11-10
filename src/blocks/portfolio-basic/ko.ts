export const ko = {
  name: "김하늘",
  role: "백엔드 엔지니어 포트폴리오",
  intro: "트래픽이 많은 광고·결제 시스템을 측정으로 고칩니다. 작은 변경으로 큰 지표를 움직인 프로젝트 세 가지를 소개합니다.",
  contacts: [
    { label: "haneul@example.com", href: "mailto:haneul@example.com" },
    { label: "github.com/haneul-example", href: "https://github.com/" },
  ],
  featured: "주요 프로젝트",
  projects: [
    {
      title: "보상 지급 시스템 재설계",
      period: "2025",
      role: "설계·구현 리드 · 3명",
      summary: "요청마다 계산하던 보상 지급을 이벤트 기반으로 바꿔, 재시도에도 두 번 지급되지 않게 했습니다.",
      metrics: [
        { label: "중복 지급", value: "0건" },
        { label: "처리량", value: "3배" },
        { label: "장애 대응 시간", value: "−60%" },
      ],
      tags: ["Go", "Kafka", "DynamoDB"],
      seed: 3,
      alt: "이벤트 흐름 다이어그램",
    },
    {
      title: "요청 단위 캐시 도입",
      period: "2024",
      role: "단독 진행",
      summary: "같은 사용자의 같은 조회가 1초에 열두 번 반복되는 것을 측정으로 찾아, 1초짜리 짧은 캐시로 해결했습니다.",
      metrics: [
        { label: "p95 응답", value: "240 → 118ms" },
        { label: "적중률", value: "79%" },
      ],
      tags: ["Go", "Redis"],
      seed: 6,
      alt: "응답 시간 그래프",
    },
    {
      title: "개인 디자인 시스템",
      period: "2026",
      role: "사이드 프로젝트",
      summary: "토큰, React 컴포넌트, 슬라이드·문서·이력서 템플릿, JSON UI를 하나로 관리합니다. AI가 만든 페이지도 같은 모양을 냅니다.",
      metrics: [
        { label: "컴포넌트", value: "70+" },
        { label: "템플릿", value: "9" },
      ],
      tags: ["React", "TypeScript", "DTCG"],
      seed: 1,
      alt: "디자인 시스템 문서 화면",
    },
  ],
  more: "그 밖의 작업",
  others: [
    { title: "결제 정산 스트리밍 전환", period: "2022", summary: "하루 걸리던 정산 지연을 10분으로 줄였습니다." },
    { title: "온콜 알림 정비", period: "2021", summary: "중복 알림을 70% 줄이고 대응 절차를 문서화했습니다." },
  ],
};

export type Text = typeof ko;
