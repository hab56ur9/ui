import type { Text } from "./ko";

export const en: Text = {
  name: "Haneul Kim",
  role: "Backend engineer portfolio",
  intro: "I fix high-traffic ad and payment systems by measuring them. Here are three projects where small changes moved big metrics.",
  contacts: [
    { label: "haneul@example.com", href: "mailto:haneul@example.com" },
    { label: "github.com/haneul-example", href: "https://github.com/" },
  ],
  featured: "Featured projects",
  projects: [
    {
      title: "Reward payout redesign",
      period: "2025",
      role: "Design and build lead · team of 3",
      summary: "Moved reward payouts from per-request computation to events, so retries never pay twice.",
      metrics: [
        { label: "Duplicate payouts", value: "0" },
        { label: "Throughput", value: "3×" },
        { label: "Incident time", value: "−60%" },
      ],
      tags: ["Go", "Kafka", "DynamoDB"],
      seed: 3,
      alt: "Event flow diagram",
    },
    {
      title: "Request-scoped cache",
      period: "2024",
      role: "Solo",
      summary: "Measured that the same lookup for the same user repeated twelve times a second, and fixed it with a one-second cache.",
      metrics: [
        { label: "p95 latency", value: "240 → 118ms" },
        { label: "Hit rate", value: "79%" },
      ],
      tags: ["Go", "Redis"],
      seed: 6,
      alt: "Latency chart",
    },
    {
      title: "Personal design system",
      period: "2026",
      role: "Side project",
      summary: "Tokens, React components, slide, doc and resume templates, and JSON UI in one place, so AI-made pages share the same look.",
      metrics: [
        { label: "Components", value: "70+" },
        { label: "Templates", value: "9" },
      ],
      tags: ["React", "TypeScript", "DTCG"],
      seed: 1,
      alt: "Design system docs",
    },
  ],
  more: "Other work",
  others: [
    { title: "Streaming settlement", period: "2022", summary: "Cut settlement delay from a day to ten minutes." },
    { title: "On-call cleanup", period: "2021", summary: "Cut duplicate alerts by 70% and wrote the runbook." },
  ],
};
