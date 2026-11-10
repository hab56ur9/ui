const ko = {
  name: "김하늘",
  role: "백엔드 엔지니어 · 7년 차",
  contacts: [{ label: "haneul@example.com", href: "mailto:haneul@example.com" }, { label: "github.com/haneul-example", href: "https://github.com/" }, { label: "서울" }],
  summary: "트래픽이 많은 광고·결제 시스템을 설계하고 운영해 왔습니다. 측정으로 문제를 찾고, 작은 변경으로 큰 지표를 움직이는 일을 좋아합니다.",
  experience: "경력",
  jobs: [
    {
      title: "시니어 백엔드 엔지니어",
      org: "예시컴퍼니",
      place: "서울",
      period: "2023.03 – 현재",
      items: ["보상 지급 시스템을 이벤트 기반으로 다시 설계해 중복 지급을 0건으로 줄였습니다", "캐시 계층을 도입해 프로필 API p95 응답 시간을 240ms에서 118ms로 줄였습니다", "주니어 엔지니어 3명의 온보딩과 코드 리뷰를 맡았습니다"],
      tags: ["Go", "Kafka", "DynamoDB", "Kubernetes"],
    },
    {
      title: "백엔드 엔지니어",
      org: "샘플랩스",
      place: "서울",
      period: "2019.07 – 2023.02",
      items: ["결제 정산 배치를 스트리밍으로 바꿔 정산 지연을 하루에서 10분으로 줄였습니다", "장애 대응 절차를 문서화하고 온콜 알림을 정비했습니다"],
      tags: ["Python", "PostgreSQL", "Airflow"],
    },
  ],
  projects: "프로젝트",
  projectItems: [{ title: "오픈소스 디자인 시스템", period: "2026", items: ["토큰, React 컴포넌트, 슬라이드·문서 템플릿을 하나로 관리합니다"] }],
  education: "학력",
  school: { title: "컴퓨터공학 학사", org: "예시대학교", period: "2012 – 2019" },
  skills: "기술",
  skillTags: ["Go", "Python", "TypeScript", "Kafka", "PostgreSQL", "DynamoDB", "Kubernetes", "Terraform"],
};

const en: typeof ko = {
  name: "Haneul Kim",
  role: "Backend engineer · 7 years",
  contacts: [{ label: "haneul@example.com", href: "mailto:haneul@example.com" }, { label: "github.com/haneul-example", href: "https://github.com/" }, { label: "Seoul" }],
  summary: "I design and run high-traffic ad and payment systems. I like finding problems by measuring and moving big metrics with small changes.",
  experience: "Experience",
  jobs: [
    {
      title: "Senior backend engineer",
      org: "Example Company",
      place: "Seoul",
      period: "Mar 2023 – now",
      items: ["Redesigned the reward payout system around events and brought duplicate payouts to zero", "Added a cache layer that cut profile API p95 latency from 240ms to 118ms", "Onboarded and reviewed code for three junior engineers"],
      tags: ["Go", "Kafka", "DynamoDB", "Kubernetes"],
    },
    {
      title: "Backend engineer",
      org: "Sample Labs",
      place: "Seoul",
      period: "Jul 2019 – Feb 2023",
      items: ["Moved payment settlement from batch to streaming, cutting settlement delay from a day to ten minutes", "Wrote the incident runbook and cleaned up on-call alerts"],
      tags: ["Python", "PostgreSQL", "Airflow"],
    },
  ],
  projects: "Projects",
  projectItems: [{ title: "Open-source design system", period: "2026", items: ["Tokens, React components, and slide and document templates in one place"] }],
  education: "Education",
  school: { title: "B.S. in Computer Science", org: "Example University", period: "2012 – 2019" },
  skills: "Skills",
  skillTags: ["Go", "Python", "TypeScript", "Kafka", "PostgreSQL", "DynamoDB", "Kubernetes", "Terraform"],
};

export const TEXT = { ko, en };
