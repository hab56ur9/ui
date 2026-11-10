export const ko = {
  name: "이서윤",
  role: "프로덕트 매니저 · 6년 차",
  contacts: [{ label: "seoyun@example.com", href: "mailto:seoyun@example.com" }, { label: "linkedin.com/in/seoyun-example", href: "https://www.linkedin.com/" }, { label: "서울" }],
  summary: "사용자 인터뷰와 데이터로 문제를 좁히고, 작게 실험해 확신이 생긴 것만 크게 만듭니다. 결제·리워드 제품에서 전환율과 재방문을 함께 올린 경험이 있습니다.",
  experience: "경력",
  jobs: [
    {
      title: "시니어 프로덕트 매니저 · 결제",
      org: "예시컴퍼니",
      place: "서울",
      period: "2023.01 – 현재",
      items: ["결제 단계를 5단계에서 3단계로 줄이는 실험을 설계해 결제 완료율을 61%에서 74%로 올렸습니다", "정산 지연 문의를 분석해 실시간 정산 로드맵을 세우고, 문의를 월 1,200건에서 300건으로 줄였습니다", "엔지니어 7명, 디자이너 2명과 분기 목표(OKR)를 함께 정하고 주간 지표 리뷰를 운영했습니다"],
      tags: ["결제", "실험 설계", "OKR"],
    },
    {
      title: "프로덕트 매니저 · 리워드",
      org: "샘플랩스",
      place: "서울",
      period: "2020.03 – 2022.12",
      items: ["출석 체크 미션을 기획해 7일 재방문율을 18%에서 27%로 올렸습니다", "보상 단가 실험으로 같은 예산에서 참여자를 1.4배로 늘렸습니다"],
      tags: ["리워드", "리텐션", "가격 실험"],
    },
  ],
  products: "주요 제품",
  productItems: [
    { title: "간편 결제 3단계", period: "2024", items: ["카드 등록부터 결제 완료까지를 한 화면 흐름으로 다시 짰습니다"] },
    { title: "출석 체크 미션", period: "2021", items: ["매일 들어올 이유를 주는 작은 보상 구조를 만들었습니다"] },
  ],
  education: "학력",
  school: { title: "경영학 학사", org: "예시대학교", period: "2012 – 2018" },
  methods: "일하는 방식",
  methodTags: ["사용자 인터뷰", "A/B 테스트", "퍼널 분석", "로드맵", "OKR", "PRD 작성"],
  tools: "도구",
  toolTags: ["SQL", "Amplitude", "Figma", "Jira", "Notion"],
};

export type Text = typeof ko;
