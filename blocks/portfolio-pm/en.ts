import type { Text } from "./ko";

export const en: Text = {
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
      points: ["Found the drop at card entry in the funnel data first", "Nine of twelve interviews complained about being asked for the same details twice", "Ran the three-step flow 50:50 for two weeks before rolling it out"],
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
      points: ["Split users who left within seven days of sign-up into cohorts", "Tested three reward prices to pick the one with the most effect per budget", "Set a rule to send just one reminder the day after a streak breaks"],
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
      points: ["Sorted 1,200 settlement tickets by cause by hand", "Ranked the three causes of delay with the finance team", "Ran a staged roadmap that removed one cause at a time over two quarters"],
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
