import type { Text } from "./ko";

export const en: Text = {
  name: "Seoyun Lee",
  role: "Product manager · 6 years",
  contacts: [{ label: "seoyun@example.com", href: "mailto:seoyun@example.com" }, { label: "linkedin.com/in/seoyun-example", href: "https://www.linkedin.com/" }, { label: "Seoul" }],
  summary: "I narrow problems down with user interviews and data, test small, and only build big once the evidence is in. I've raised conversion and return visits together in payment and reward products.",
  experience: "Experience",
  jobs: [
    {
      title: "Senior product manager · Payments",
      org: "Example Company",
      place: "Seoul",
      period: "Jan 2023 – now",
      items: ["Designed the test that cut checkout from five steps to three, lifting completion from 61% to 74%", "Turned settlement-delay tickets into a real-time settlement roadmap, cutting tickets from 1,200 to 300 a month", "Set quarterly OKRs with seven engineers and two designers and ran the weekly metrics review"],
      tags: ["Payments", "Experiment design", "OKR"],
    },
    {
      title: "Product manager · Rewards",
      org: "Sample Labs",
      place: "Seoul",
      period: "Mar 2020 – Dec 2022",
      items: ["Launched a daily check-in mission that raised 7-day return rate from 18% to 27%", "Ran reward-price tests that reached 1.4× the participants on the same budget"],
      tags: ["Rewards", "Retention", "Pricing tests"],
    },
  ],
  products: "Key products",
  productItems: [
    { title: "Three-step checkout", period: "2024", items: ["Rebuilt the path from adding a card to paying as one flow"] },
    { title: "Daily check-in mission", period: "2021", items: ["A small reward loop that gives people a reason to come back every day"] },
  ],
  education: "Education",
  school: { title: "B.B.A.", org: "Example University", period: "2012 – 2018" },
  methods: "Ways of working",
  methodTags: ["User interviews", "A/B tests", "Funnel analysis", "Roadmaps", "OKR", "PRD writing"],
  tools: "Tools",
  toolTags: ["SQL", "Amplitude", "Figma", "Jira", "Notion"],
};
