# Product Owner Governance Dashboard

> **Single-pane-of-glass control centre for Senior Product Owners governing the full SDLC.**

A real-time, actionable governance dashboard that consolidates the eight SDLC pillars into one unified view — eliminating manual report assembly, enabling threshold-based alerting, and supporting digital release sign-off with a full audit trail.

---

## The 8 Governance Pillars

| # | Pillar | Key Metrics |
|---|--------|-------------|
| 1 | **Strategic Alignment** | OKRs, roadmap health, market insights |
| 2 | **Backlog Health** | Backlog size, readiness %, technical debt tags |
| 3 | **Delivery Performance** | Sprint velocity, lead time, cycle time, burndown |
| 4 | **Quality & Risk** | Defect density, test coverage, security findings |
| 5 | **Customer / Market Feedback** | NPS/CSAT, DAU/MAU, feature adoption, churn |
| 6 | **Financial & Cost Metrics** | Budget burn-rate, ROI per feature, cost of delay |
| 7 | **Regulatory / Compliance** | GDPR/PCI status, audit log, release sign-off |
| 8 | **Team Health & Capacity** | Happiness score, capacity plan, impediment count |

---

## Implementation Stages

| Stage | Pillars | Milestone |
|-------|---------|-----------|
| **1 — MVP** | Delivery + Quality | Live JIRA velocity & SonarQube defect charts |
| **2 — Backlog + Strategy** | Backlog + Strategic | Backlog health card, OKR progress bars |
| **3 — Customer + Alerts** | Customer + Team Health | NPS/adoption heatmap, Slack alert engine |
| **4 — Compliance + Finance** | Compliance + Financial | Release sign-off workflow, audit log, PDF export |
| **5 — Polish + Digest** | All | PPTX export, exec Slack digest, perf hardening |

---

## Integration Stack

| Layer | Tools |
|-------|-------|
| **Issue Tracking** | JIRA Cloud (sprint velocity, backlog, burndown) |
| **Code Quality** | SonarQube, Snyk, GitHub Actions |
| **Usage Analytics** | Mixpanel / Amplitude |
| **Support** | Zendesk / Intercom |
| **Persistence** | Supabase (PostgreSQL) |
| **Notifications** | Slack webhooks |
| **File Storage** | Google Drive (snapshot exports) |

---

## Project Structure

```
src/
├── pages/                        # Route-level pages
├── components/
│   ├── governance/               # 8 pillar component folders
│   │   ├── strategic/
│   │   ├── delivery/
│   │   ├── backlog/
│   │   ├── quality/
│   │   ├── customer/
│   │   ├── financial/
│   │   ├── compliance/
│   │   ├── teamHealth/
│   │   └── shared/               # Shared pillar primitives
│   ├── dashboard/                # MetricCard, PRDChart
│   ├── layout/                   # Header, Sidebar, TopBar
│   └── ui/                       # shadcn/ui primitives
├── integrations/
│   ├── jira/                     # Sprint queries, backlog JQL
│   ├── slack/                    # Alert webhooks
│   ├── sonarqube/                # Quality metrics
│   ├── mixpanel/                 # Feature adoption
│   ├── zendesk/                  # Support sentiment
│   ├── google-drive/             # Snapshot export
│   └── supabase/                 # Persistence layer
├── hooks/governance/             # React Query data hooks
├── context/                      # GovernanceDashboardContext
└── lib/                          # Utils, constants, types
```

---

## Documentation

- 📋 [Full PRD & Technical Design](docs/plans/2026-03-14-po-governance-dashboard.md)
- 🔬 [Feature Catalogue & Research](docs/research/feature-catalogue.md)

---

## Tech Stack

- **Frontend:** React + TypeScript + Vite
- **UI:** shadcn/ui + Tailwind CSS
- **Charts:** Recharts
- **Data Fetching:** TanStack Query (React Query)
- **Persistence:** Supabase (PostgreSQL)
- **Auth / RBAC:** Supabase Auth + governance role claims
