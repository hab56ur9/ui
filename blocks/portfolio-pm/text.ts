const ko = {
  name: "이서윤",
  role: "프로덕트 매니저 포트폴리오",
  intro: "사용자가 멈추는 지점을 찾아, 작은 실험으로 확인한 뒤 크게 만듭니다. 문제를 어떻게 좁혔고 무엇을 결정했는지, 그래서 어떤 숫자가 움직였는지를 세 가지 프로젝트로 소개합니다.",
  contacts: [
    { label: "seoyun@example.com", href: "mailto:seoyun@example.com" },
    { label: "linkedin.com/in/seoyun-example", href: "https://www.linkedin.com/" },
  ],
  featured: "주요 프로젝트",
  projects: [
    {
      title: "결제 단계 줄이기",
      period: "2024",
      role: "PM · 엔지니어 4명, 디자이너 1명",
      summary: "퍼널을 보니 카드 정보 입력에서 31%가 떠났습니다. 인터뷰 12건으로 '정보를 두 번 묻는다'는 불만을 확인하고, 다섯 단계를 세 단계로 합치는 안을 A/B 테스트로 검증한 뒤 전체에 적용했습니다.",
      metrics: [
        { label: "결제 완료율", value: "61 → 74%" },
        { label: "결제 시간", value: "−42%" },
        { label: "문의", value: "−35%" },
      ],
      tags: ["퍼널 분석", "사용자 인터뷰", "A/B 테스트"],
      seed: 4,
      alt: "결제 흐름 전후 비교",
    },
    {
      title: "출석 체크 미션",
      period: "2021",
      role: "PM · 기획부터 출시까지",
      summary: "가입 후 일주일 안에 떠나는 사용자가 많았습니다. 매일 작은 보상을 주는 출석 미션을 만들고, 보상 단가를 세 가지로 나눠 실험해 같은 예산에서 효과가 가장 큰 구간을 골랐습니다.",
      metrics: [
        { label: "7일 재방문율", value: "18 → 27%" },
        { label: "참여자", value: "1.4배" },
      ],
      tags: ["리텐션", "가격 실험", "코호트 분석"],
      seed: 2,
      alt: "출석 체크 화면",
    },
    {
      title: "실시간 정산 로드맵",
      period: "2023",
      role: "PM · 재무팀과 협업",
      summary: "가장 많은 문의가 '정산이 언제 되나요'였습니다. 문의 1,200건을 분류해 지연 원인 세 가지를 찾고, 하루 걸리던 정산을 10분으로 줄이는 단계별 로드맵을 세워 두 분기에 걸쳐 실행했습니다.",
      metrics: [
        { label: "정산 지연", value: "1일 → 10분" },
        { label: "월 문의", value: "1,200 → 300" },
      ],
      tags: ["문의 분석", "로드맵", "이해관계자 조율"],
      seed: 5,
      alt: "정산 단계 다이어그램",
    },
  ],
  more: "그 밖의 작업",
  others: [
    { title: "주간 지표 리뷰 도입", period: "2023", summary: "팀이 매주 같은 대시보드로 목표와 지표를 확인하게 했습니다." },
    { title: "PRD 템플릿 정리", period: "2022", summary: "문제, 목표 지표, 범위 밖 항목을 먼저 쓰는 양식으로 리뷰 시간을 줄였습니다." },
  ],
};

const en: typeof ko = {
  name: "Seoyun Lee",
  role: "Product manager portfolio",
  intro: "I find where users stall, confirm it with a small test, then build it big. These three projects show how I narrowed the problem, what I decided, and which numbers moved.",
  contacts: [
    { label: "seoyun@example.com", href: "mailto:seoyun@example.com" },
    { label: "linkedin.com/in/seoyun-example", href: "https://www.linkedin.com/" },
  ],
  featured: "Featured projects",
  projects: [
    {
      title: "Shorter checkout",
      period: "2024",
      role: "PM · 4 engineers, 1 designer",
      summary: "The funnel showed 31% leaving at card entry. Twelve interviews confirmed people felt asked for the same details twice, so I merged five steps into three, proved it in an A/B test and rolled it out.",
      metrics: [
        { label: "Checkout completion", value: "61 → 74%" },
        { label: "Checkout time", value: "−42%" },
        { label: "Tickets", value: "−35%" },
      ],
      tags: ["Funnel analysis", "User interviews", "A/B tests"],
      seed: 4,
      alt: "Checkout flow before and after",
    },
    {
      title: "Daily check-in mission",
      period: "2021",
      role: "PM · from idea to launch",
      summary: "Many people left within a week of signing up. I built a daily check-in with a small reward and tested three reward prices to pick the one with the most effect for the same budget.",
      metrics: [
        { label: "7-day return", value: "18 → 27%" },
        { label: "Participants", value: "1.4×" },
      ],
      tags: ["Retention", "Pricing tests", "Cohort analysis"],
      seed: 2,
      alt: "Check-in screen",
    },
    {
      title: "Real-time settlement roadmap",
      period: "2023",
      role: "PM · with the finance team",
      summary: "The top ticket was 'when do I get paid?'. Sorting 1,200 tickets showed three causes of delay, and a staged roadmap over two quarters cut settlement from a day to ten minutes.",
      metrics: [
        { label: "Settlement delay", value: "1 day → 10 min" },
        { label: "Monthly tickets", value: "1,200 → 300" },
      ],
      tags: ["Ticket analysis", "Roadmap", "Stakeholder alignment"],
      seed: 5,
      alt: "Settlement stage diagram",
    },
  ],
  more: "Other work",
  others: [
    { title: "Weekly metrics review", period: "2023", summary: "Got the team checking goals and metrics on one dashboard every week." },
    { title: "PRD template cleanup", period: "2022", summary: "A template that starts with the problem, target metric and out-of-scope items, which shortened reviews." },
  ],
};

export const TEXT = { ko, en };
