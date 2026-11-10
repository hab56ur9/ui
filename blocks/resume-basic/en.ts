import type { Text } from "./ko";

export const en: Text = {
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
