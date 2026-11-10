export const ko = {
  brand: "서비스 지표",
  nav: { home: "홈", charts: "차트", alerts: "알림", settings: "설정" },
  title: "오늘의 지표",
  lede: "최근 30일 · 이전 30일 대비",
  users: "활성 사용자",
  dailyAverage: "일 평균",
  revenue: "매출",
  latency: "p95 응답",
  vsPrevious: "이전 대비",
  daily: "일별 활성 사용자",
  platforms: "플랫폼",
  platform: "플랫폼",
  average: "일 평균",
  change: "변화",
  platformName: { web: "웹", ios: "iOS", android: "Android" } as Record<string, string>,
};

export type Text = typeof ko;
