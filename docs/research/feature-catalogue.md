# Senior PO Dashboard — Feature Catalogue & Research Summary

> Source research compiled 2026-03-14. Full PRD in `docs/plans/`.

---

## 1. Core Dashboard Pillars

| Pillar | What it Tracks | SDLC Governance Value |
|--------|----------------|----------------------|
| **Strategic Alignment** | OKRs, product vision, roadmap health, market/competitor insights | Every sprint delivers business value; long-term goals stay on track |
| **Backlog Health** | Backlog size, % ready, technical debt tags, refinement rate, priority distribution | Prevents scope creep; keeps backlog transparent & actionable |
| **Delivery Performance** | Sprint velocity, lead time, cycle time, burndown/burn-up, release frequency | Shows how quickly value ships; surfaces bottlenecks |
| **Quality & Risk** | Defect density, escaped bugs, test coverage, security findings, risk matrix | Ensures quality, compliance, early issue detection |
| **Customer / Market Feedback** | NPS/CSAT, DAU/MAU, feature adoption, churn, support tickets | Aligns development with real user needs |
| **Financial & Cost Metrics** | Budget burn-rate, ROI per feature, cost of delay, licensing/hosting | Financial guardrails for PO decision-making |
| **Regulatory / Compliance** | GDPR/PCI compliance, audit logs, release approvals, change-control sign-offs | Legal constraints satisfied; governance bodies informed |
| **Team Health & Capacity** | Happiness score, capacity planning, skill-matrix gaps, impediment count | Sustainable pace; resource needs identified early |

---

## 2. Widget Inventory

| Widget | Data Source(s) | Refresh Cadence |
|--------|---------------|-----------------|
| Interactive roadmap (Gantt) | JIRA Portfolio, Azure DevOps | Real-time |
| Backlog list (filterable, debt bar) | JIRA, Azure Boards | Live |
| Sprint burndown + goal progress | JIRA Sprint board | Per-sprint |
| Velocity trend (rolling 5 sprints) | JIRA / VersionOne | Daily |
| Feature adoption heatmap | Mixpanel, Amplitude, GA | Daily |
| NPS/CSAT trend + sentiment summary | Zendesk, Intercom, SurveyMonkey | Weekly |
| Quality metrics (defect × severity, coverage %, security) | SonarQube, Snyk, GitHub Actions | Continuous |
| Risk matrix (probability × impact) + compliance checklist | JIRA risk register, Confluence | Weekly / on-demand |
| Budget vs actual + cost of delay | Finance ERP, AWS/GCP cost APIs | Monthly |
| Capacity utilisation + impediment count + team satisfaction | TeamPulse, OfficeVibe | Weekly |
| Release readiness checklist + sign-off matrix | GitHub Actions, Jenkins, LaunchDarkly | Per release |
| Regulatory alerts (GDPR requests, PCI expiry) | ServiceNow, internal compliance tools | Real-time |

---

## 3. Governance Loop — Core PO Activities

| Activity | Frequency | Deliverable |
|----------|-----------|-------------|
| Backlog grooming & prioritisation | 2–3× week + sprint planning | Updated, ranked backlog |
| Roadmap planning & review | Quarterly / on market shifts | Roadmap doc + stakeholder sign-off |
| Sprint goal definition | Every sprint (2 weeks) | Sprint goal statement |
| Stakeholder reporting | Weekly / bi-weekly | PDF or PPTX snapshot |
| Feature acceptance & release sign-off | Per release | Signed release checklist |
| Metrics review & insight generation | Daily standup + weekly deep dive | Action items |
| Risk management | Continuous; formal monthly review | Updated risk register |
| Regulatory compliance audits | Quarterly or as required | Audit readiness report |
| Financial oversight | Monthly | Budget variance analysis |
| Team enablement & health checks | Every 2 weeks + retrospectives | Capacity plan |

---

## 4. Recommended Tool Stack

| Layer | Recommended Tools |
|-------|------------------|
| **Issue / backlog** | JIRA Cloud, Azure DevOps |
| **Code quality** | SonarQube, Snyk, GitHub Actions |
| **Usage analytics** | Mixpanel, Amplitude, Google Analytics |
| **Customer support** | Zendesk, Intercom |
| **ETL (v2)** | Coupler.io, Fivetran, Airbyte |
| **Data warehouse (v2)** | BigQuery, Snowflake, Redshift |
| **Visualisation** | Recharts (v1 built-in), Looker / PowerBI (v2 export) |
| **Alerting** | Slack webhooks, PagerDuty / Opsgenie |
| **Compliance / governance** | ServiceNow (risk), OneTrust (privacy) |
| **Persistence** | Supabase (PostgreSQL) — already in project |

---

## 5. Dashboard Layout Reference

```
┌────────────────────────────────────────────────────────────────┐
│  Product Name  │  Release v2.4.1  │  2026-03-14  │  ↻ Live    │
├────────────────────┬───────────────────────┬───────────────────┤
│  STRATEGIC         │  KPI OVERVIEW         │  OPERATIONS       │
│                    │                       │                   │
│  OKR progress bars │  Velocity trend       │  Backlog health   │
│  Roadmap timeline  │  Defect density       │  Sprint goal      │
│  Market signals    │  Feature adoption     │  Release ready    │
│                    │                       │  Risk matrix      │
├────────────────────┴───────────────────────┴───────────────────┤
│  [Export Snapshot]    [Configure Alerts]    [Compliance Audit] │
└────────────────────────────────────────────────────────────────┘
```

---

## 6. Sources

1. Dashboard for Product Owners and Scrum Masters – Easy Redmine
2. Product Management Dashboard: Types, Features & Benefits – Meegle
3. PO's KPI Dashboard: What Should You Really Measure? – TargetAgility
4. Product Owner Roles and Responsibilities – Lucid Blog
5. What Is a Product Management Dashboard? – Wrike
