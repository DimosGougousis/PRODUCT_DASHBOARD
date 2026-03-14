# Product Owner Governance Dashboard — PRD & Initial Design

**Date:** 2026-03-14
**Author:** Product Team
**Status:** Draft
**Version:** 0.1

---

## Table of Contents

1. [Problem Statement](#1-problem-statement)
2. [Goals & Non-Goals](#2-goals--non-goals)
3. [User Personas](#3-user-personas)
4. [User Stories](#4-user-stories)
5. [Success Metrics](#5-success-metrics)
6. [Out of Scope](#6-out-of-scope)
7. [Risks](#7-risks)
8. [Technical Architecture](#8-technical-architecture)
9. [Data Model](#9-data-model)
10. [Component Breakdown](#10-component-breakdown)
11. [API Design](#11-api-design)
12. [Implementation Stages](#12-implementation-stages)

---

## 1. Problem Statement

Senior Product Owners governing complex Software Development Lifecycles today are forced to context-switch across a fragmented toolchain — JIRA for backlog and sprints, SonarQube for quality, Mixpanel for adoption, Zendesk for support sentiment, finance ERPs for cost tracking, and compliance tools for regulatory status. This fragmentation means critical signals are missed, decisions are delayed, and governance reports are assembled manually from stale snapshots.

The result: sprint velocity drops go undetected until retrospectives, compliance gaps surface only during audits, and financial overruns are discovered after the fact. POs spend more time assembling dashboards than acting on them.

**The product owner governance dashboard solves this** by providing a single, real-time, actionable control plane that consolidates the eight SDLC governance pillars — strategic alignment, backlog health, delivery performance, quality & risk, customer feedback, financial oversight, regulatory compliance, and team health — into one unified view that drives daily PO decisions.

This feature extends the existing `prd-partner` platform, which already integrates with JIRA, Slack, and Google Drive, making it the natural home for this governance layer.

---

## 2. Goals & Non-Goals

### Goals

| # | Goal | Measure |
|---|------|---------|
| G1 | Provide a unified, real-time view of all 8 SDLC governance pillars | All 8 pillars rendered on the dashboard within 1 session |
| G2 | Eliminate manual report assembly for stakeholder updates | Automated snapshot export (PDF/PPTX) in < 30 seconds |
| G3 | Enable threshold-based alerting so POs are pushed critical signals | Alerts fire to Slack within 60 seconds of threshold breach |
| G4 | Extend existing JIRA integration to surface sprint health and backlog metrics | Sprint burndown and velocity trend pulled from JIRA live |
| G5 | Support release sign-off governance workflow within the platform | Release readiness checklist with digital sign-off captured in audit log |
| G6 | Give compliance officers a read-only view with audit trail completeness | Compliance view with exportable audit log |

### Non-Goals

- Building a standalone BI tool — the dashboard surfaces key PO KPIs, not ad-hoc analytics
- Replacing JIRA, SonarQube, or any source tool
- Building a finance ERP — cost data is read-only ingested, not entered here
- Native mobile app — responsive web is sufficient for v1
- Multi-product/multi-team rollup view (portfolio level) — single product scope for v1

---

## 3. User Personas

### Persona 1: Senior Product Owner — "Alex"
- **Role:** Owns product backlog, sprint goals, roadmap, stakeholder reporting
- **Goals:** See the full SDLC health at a glance each morning; quickly identify blockers; produce weekly stakeholder report without manual effort
- **Pain points:** Context-switching between 6+ tools; velocity drops discovered late; compliance status unknown until audit
- **Usage pattern:** Daily — opens dashboard at standup, drills into anomalies, exports weekly summary Friday afternoon

### Persona 2: Engineering Manager — "Sam"
- **Role:** Manages delivery team capacity, quality standards, CI/CD health
- **Goals:** Monitor sprint burndown, defect density, CI pipeline health; flag capacity issues early
- **Pain points:** Sprint over-commitment not visible until mid-sprint; test coverage drift not caught before release
- **Usage pattern:** Daily for delivery and quality panels; weekly for team health

### Persona 3: Compliance Officer — "Jordan"
- **Role:** Ensures GDPR/PCI regulatory compliance; signs off releases
- **Goals:** Audit log completeness, compliance checklist status, GDPR request counts
- **Pain points:** Audit evidence gathered manually; release sign-offs tracked in spreadsheets
- **Usage pattern:** Weekly compliance widget review; pre-release sign-off workflow; quarterly audit export

### Persona 4: Product Stakeholder / Executive — "Morgan"
- **Role:** VP Product, C-suite sponsor — receives governance reports
- **Goals:** OKR progress, budget burn, feature adoption, strategic alignment health
- **Pain points:** Reports are stale by the time they arrive; hard to tie sprint output to business outcomes
- **Usage pattern:** Weekly digest email + on-demand read-only dashboard access

---

## 4. User Stories

### Strategic Alignment
- **US-01:** As a Senior PO, I want to see OKR progress bars linked to the current sprint, so I can confirm every sprint contributes to strategic goals.
- **US-02:** As a Senior PO, I want an interactive roadmap timeline with milestone status, so I can detect drift before stakeholder reviews.

### Backlog Health
- **US-03:** As a Senior PO, I want a filterable backlog list with "Ready for Development" tags and a technical debt indicator bar, so I can prioritize grooming sessions efficiently.
- **US-04:** As an Engineering Manager, I want to see the backlog refinement rate trending over time, so I can flag when the team is under-preparing for future sprints.

### Delivery Performance
- **US-05:** As a Senior PO, I want a rolling 5-sprint velocity trend with a next-sprint capacity forecast, so I can set realistic sprint goals.
- **US-06:** As an Engineering Manager, I want a burndown chart for the active sprint, so I can identify mid-sprint risk before it becomes end-of-sprint failure.

### Quality & Risk
- **US-07:** As a Senior PO, I want to see defect count by severity alongside test coverage percentage, so I can make informed release go/no-go decisions.
- **US-08:** As a Senior PO, I want a risk matrix (probability × impact) that triggers a Slack alert when any item crosses the high-risk threshold.

### Customer & Market Feedback
- **US-09:** As a Senior PO, I want an NPS/CSAT trend chart with AI-summarized support ticket themes, so I can spot deteriorating user sentiment before it becomes churn.
- **US-10:** As a Senior PO, I want a feature adoption heatmap, so I can identify underperforming releases early and decide whether to invest in enablement or pivot.

### Financial & Cost
- **US-11:** As a Senior PO, I want a budget vs. actual spend chart with cost-of-delay calculations per feature, so I can justify prioritisation decisions to finance stakeholders.

### Regulatory / Compliance
- **US-12:** As a Compliance Officer, I want to see GDPR data-subject request counts and PCI compliance expiry dates in real time, so I am never caught unprepared.
- **US-13:** As a Compliance Officer, I want to perform a digital release sign-off that is captured in the audit log, so paper-based sign-offs are eliminated.

### Team Health
- **US-14:** As a Senior PO, I want a capacity utilisation chart with impediment count, so I can proactively address burnout and unblock the team.

### Stakeholder Reporting
- **US-15:** As a Senior PO, I want a one-click export that generates a governance snapshot (PDF or PPTX) from the current dashboard state, so stakeholder reports take minutes, not hours.
- **US-16:** As an Executive, I want a read-only digest view with the top 6 KPIs, so I can stay informed without needing full platform access.

---

## 5. Success Metrics

| Metric | Baseline (pre-launch) | Target (90 days post-launch) | Measurement |
|--------|----------------------|------------------------------|-------------|
| Time to produce weekly stakeholder report | ~2 hours (manual) | < 5 minutes (automated export) | User survey + event tracking |
| Dashboard sessions per PO per week | 0 (no unified view) | ≥ 5 sessions/week | Session analytics |
| Mean time to detect velocity anomaly | End of sprint retrospective | Within 24 hours of occurrence | Alert fire-time vs. sprint data |
| Release sign-off cycle time | ~2 days (email chain) | < 4 hours (in-platform workflow) | Workflow completion timestamps |
| Compliance audit prep time | ~1 week | < 1 day (auto-export) | User survey |
| Alert false-positive rate | N/A | < 10% | Alert feedback tagging |
| NPS of the governance dashboard itself | N/A | ≥ 40 at 90-day survey | In-app NPS widget |

---

## 6. Out of Scope

- **Portfolio / multi-product rollup** — v1 is scoped to a single product context; cross-product aggregation is a v2 initiative.
- **Write-back to source systems** — the dashboard reads from JIRA, SonarQube, etc. It does not create/update tickets (except via the existing JIRA link-creation already in prd-partner).
- **Custom ETL pipeline** — v1 uses direct API polling with client-side caching. A BigQuery/Snowflake warehouse layer is a v2 infrastructure decision.
- **Native mobile application** — responsive web covers the v1 use case.
- **AI-generated roadmap suggestions** — AI summarisation of support tickets is in scope; AI-generated strategic recommendations are v2.
- **Financial ERP write-back** — cost data is read-only; no purchase-order or invoice creation.

---

## 7. Risks

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| **API rate limiting** from JIRA/SonarQube/Mixpanel during real-time polling | Medium | High | Implement staggered polling intervals + exponential backoff; cache aggressively in React Query |
| **Data quality** — source tools have incomplete/inconsistent data (e.g., stories without story points) | High | Medium | Graceful empty-state handling per widget; data quality indicator badge on each card |
| **Integration credential management** — storing OAuth tokens for 10+ services securely | Medium | High | Use existing prd-partner integration credential store; never persist tokens client-side |
| **Compliance data sensitivity** — GDPR request counts and audit logs are sensitive PII-adjacent data | Medium | High | Role-based access control (RBAC) gate on compliance panel; audit log access restricted to Compliance Officer persona |
| **Scope creep** — 8 pillars × many widgets is a large surface area | High | Medium | Phase gating: deliver 3 core pillars in Stage 1 (Delivery, Backlog, Quality); add remaining in Stages 2–4 |
| **Alert fatigue** — too many threshold alerts desensitise POs | Medium | Medium | Configurable alert thresholds per metric; alert deduplication with 30-min cool-down window |
| **Stakeholder adoption** — POs default back to existing tools | Medium | High | Embed governance dashboard as default landing page for prd-partner; push weekly digest to Slack |

---

## 8. Technical Architecture

### 8.1 High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        Browser (React SPA)                       │
│                                                                  │
│  ┌─────────────┐  ┌──────────────────┐  ┌────────────────────┐  │
│  │  Strategic  │  │  KPI Overview    │  │  Operations Panel  │  │
│  │  Panel      │  │  (Center)        │  │  (Right Column)    │  │
│  └──────┬──────┘  └────────┬─────────┘  └─────────┬──────────┘  │
│         │                  │                       │             │
│         └──────────────────┴───────────────────────┘            │
│                            │                                     │
│               ┌────────────▼──────────────┐                      │
│               │  GovernanceDashboard      │                      │
│               │  Context + React Query    │                      │
│               └────────────┬──────────────┘                      │
└────────────────────────────┼─────────────────────────────────────┘
                             │ HTTPS
┌────────────────────────────▼─────────────────────────────────────┐
│                    prd-partner API Layer (existing)               │
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │ /governance  │  │ /integrations│  │ /alerts                │  │
│  │ endpoints    │  │ (JIRA/Slack/ │  │ (threshold engine)     │  │
│  │              │  │  SonarQube/  │  │                        │  │
│  │              │  │  Mixpanel)   │  │                        │  │
│  └──────┬───────┘  └──────┬───────┘  └───────────┬────────────┘  │
└─────────┼─────────────────┼──────────────────────┼───────────────┘
          │                 │                       │
          ▼                 ▼                       ▼
    ┌──────────┐   ┌─────────────────┐     ┌──────────────┐
    │  JIRA    │   │  SonarQube /    │     │  Slack       │
    │  Cloud   │   │  Snyk / GitHub  │     │  Webhooks    │
    │  API     │   │  Actions        │     └──────────────┘
    └──────────┘   └─────────────────┘
          │
    ┌──────────┐   ┌──────────────┐   ┌──────────────────┐
    │ Mixpanel │   │  Zendesk /   │   │  Finance ERP API │
    │ Amplitude│   │  Intercom    │   │  (read-only)     │
    └──────────┘   └──────────────┘   └──────────────────┘
```

### 8.2 Data Flow

1. **Polling** — React Query fetches governance metrics on configurable intervals (default: 5-minute stagger per integration to avoid thundering-herd).
2. **Caching** — React Query caches responses with staleTime tuned per widget cadence (e.g., velocity: 1 hour; compliance alerts: 30 seconds).
3. **Alerting** — A lightweight server-side threshold engine evaluates configured rules on each data refresh and emits Slack webhook payloads when breached.
4. **Export** — On-demand snapshot serialises current React state to a structured JSON payload sent to the server, which renders a PDF/PPTX via a headless template renderer.
5. **Audit log** — All sign-off events and compliance actions write to an append-only audit log table in the existing database.

### 8.3 Technology Stack

| Concern | Choice | Rationale |
|---------|--------|-----------|
| Frontend framework | React + TypeScript (existing) | No change; aligns with codebase |
| State / data fetching | React Query (TanStack Query) | Caching, polling, stale-time — already used in project |
| Charts | Recharts (already in project via `PRDChart.tsx`) | Consistent library; avoid adding Chart.js/D3 |
| Layout | shadcn/ui + Tailwind (existing) | All UI primitives already available |
| Export (PDF) | `@react-pdf/renderer` or server-side Puppeteer | Server-side preferred to avoid large client bundle |
| Alerting engine | Server-side Node.js cron + Slack existing integration | Extend `src/integrations/slack/client.ts` |
| Auth / RBAC | Existing prd-partner auth; add `governance_role` claim | Minimal change; add role check in route guards |

---

## 9. Data Model

### 9.1 New Entities

```typescript
// Governance Dashboard configuration per product
interface GovernanceDashboardConfig {
  id: string;
  productId: string;
  enabledPillars: GovPillar[];         // which of the 8 pillars are active
  alertRules: AlertRule[];
  refreshIntervals: Record<GovPillar, number>; // seconds
  createdAt: Date;
  updatedAt: Date;
}

type GovPillar =
  | 'strategic'
  | 'backlog'
  | 'delivery'
  | 'quality'
  | 'customer'
  | 'financial'
  | 'compliance'
  | 'teamHealth';

// Per-metric threshold alert rule
interface AlertRule {
  id: string;
  pillar: GovPillar;
  metricKey: string;          // e.g. "velocity.rollingAverage", "defect.critical"
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  cooldownMinutes: number;    // deduplication window
  slackChannelId?: string;
  enabled: boolean;
}

// Immutable audit log for governance actions
interface GovernanceAuditEntry {
  id: string;
  productId: string;
  actorId: string;
  actorRole: string;
  action: GovernanceAction;
  payload: Record<string, unknown>; // serialised action context
  timestamp: Date;
}

type GovernanceAction =
  | 'RELEASE_SIGN_OFF'
  | 'COMPLIANCE_CHECKLIST_COMPLETE'
  | 'RISK_THRESHOLD_BREACHED'
  | 'DASHBOARD_SNAPSHOT_EXPORTED'
  | 'ALERT_RULE_UPDATED';

// Release readiness checklist instance
interface ReleaseReadinessChecklist {
  id: string;
  productId: string;
  releaseVersion: string;
  items: ChecklistItem[];
  signOffs: SignOff[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: Date;
}

interface ChecklistItem {
  id: string;
  label: string;
  category: 'quality' | 'compliance' | 'security' | 'operations';
  required: boolean;
  completedAt?: Date;
  completedBy?: string;
}

interface SignOff {
  actorId: string;
  role: string;
  decision: 'approved' | 'rejected';
  comment?: string;
  timestamp: Date;
}
```

### 9.2 Integration Metric Shapes (read-only, normalised)

```typescript
// Delivery metrics (sourced from JIRA)
interface DeliveryMetrics {
  velocityTrend: SprintVelocity[];       // last 5 sprints
  activeBurndown: BurndownPoint[];
  sprintGoalProgress: number;            // 0-100
  leadTimeDays: number;
  cycleTimeDays: number;
}

interface SprintVelocity {
  sprintName: string;
  committed: number;
  completed: number;
  startDate: Date;
}

// Quality metrics (SonarQube + GitHub Actions)
interface QualityMetrics {
  defectsBySeverity: Record<'critical' | 'high' | 'medium' | 'low', number>;
  testCoveragePercent: number;
  automatedTestPassRate: number;
  securityFindings: number;
  sonarGate: 'passed' | 'failed' | 'warning';
}

// Customer metrics (Mixpanel / Zendesk)
interface CustomerMetrics {
  nps: number;
  csat: number;
  dau: number;
  mau: number;
  featureAdoption: FeatureAdoptionEntry[];
  supportTicketVolume: number;
  sentimentSummary: string;              // AI-generated
}

// Compliance metrics
interface ComplianceMetrics {
  gdprRequestCount: number;
  pciExpiryDate: Date | null;
  complianceChecklistStatus: 'green' | 'amber' | 'red';
  auditLogComplete: boolean;
  pendingSignOffs: number;
}
```

---

## 10. Component Breakdown

### New Page
```
src/pages/GovernanceDashboard.tsx
```

### New Components

```
src/components/governance/
├── GovernanceDashboardLayout.tsx       # 3-column responsive layout shell
├── TopBar.tsx                          # Product name, release, date, refresh toggle
│
├── strategic/
│   ├── OKRProgressPanel.tsx            # OKR progress bars linked to sprints
│   └── RoadmapTimeline.tsx             # Interactive Gantt / milestone view
│
├── delivery/
│   ├── VelocityTrendChart.tsx          # Rolling 5-sprint velocity + forecast
│   ├── SprintBurndownChart.tsx         # Active sprint burndown
│   └── SprintGoalStatus.tsx           # Goal progress indicator
│
├── backlog/
│   ├── BacklogHealthCard.tsx           # Size, readiness %, debt indicator
│   └── BacklogList.tsx                 # Filterable backlog table
│
├── quality/
│   ├── DefectDensityChart.tsx          # Defects by severity, trend
│   ├── TestCoverageGauge.tsx           # Coverage % ring gauge
│   └── SecurityFindingsBadge.tsx       # Critical/high finding counts
│
├── customer/
│   ├── NPSCsatTrendChart.tsx           # NPS/CSAT over time
│   ├── FeatureAdoptionHeatmap.tsx      # Feature usage heatmap grid
│   └── SupportSentimentCard.tsx        # Ticket volume + AI summary
│
├── financial/
│   ├── BudgetBurnChart.tsx             # Budget vs actual area chart
│   └── CostOfDelayTable.tsx            # Per-feature CoD calculation
│
├── compliance/
│   ├── ComplianceStatusWidget.tsx      # GDPR/PCI status with expiry
│   ├── ReleaseReadinessChecklist.tsx   # Checklist + sign-off UI
│   └── AuditLogPanel.tsx              # Read-only audit trail
│
├── teamHealth/
│   ├── CapacityUtilizationChart.tsx    # Capacity bar chart
│   └── TeamHealthSummary.tsx          # Happiness score + impediment count
│
└── shared/
    ├── PillarCard.tsx                  # Common card wrapper with pillar header
    ├── MetricThresholdBadge.tsx        # Green/amber/red status badge
    ├── AlertRulesDrawer.tsx            # Configure threshold alerts
    └── SnapshotExportButton.tsx        # PDF/PPTX export trigger
```

### Extended Integration Clients

```
src/integrations/sonarqube/client.ts    # New
src/integrations/sonarqube/types.ts     # New
src/integrations/mixpanel/client.ts     # New (or Amplitude)
src/integrations/zendesk/client.ts      # New
```

### New Hooks

```
src/hooks/governance/
├── useDeliveryMetrics.ts
├── useBacklogMetrics.ts
├── useQualityMetrics.ts
├── useCustomerMetrics.ts
├── useComplianceMetrics.ts
├── useTeamHealthMetrics.ts
└── useFinancialMetrics.ts
```

---

## 11. API Design

All new endpoints live under the existing prd-partner API base URL, namespaced under `/governance`.

### 11.1 Dashboard Config

```
GET    /governance/config/:productId
PUT    /governance/config/:productId
```

### 11.2 Metrics Endpoints (aggregation proxies)

```
GET /governance/metrics/delivery/:productId
    Query: ?sprintCount=5
    Returns: DeliveryMetrics

GET /governance/metrics/backlog/:productId
    Returns: BacklogMetrics

GET /governance/metrics/quality/:productId
    Returns: QualityMetrics

GET /governance/metrics/customer/:productId
    Returns: CustomerMetrics

GET /governance/metrics/compliance/:productId
    Returns: ComplianceMetrics

GET /governance/metrics/teamHealth/:productId
    Returns: TeamHealthMetrics

GET /governance/metrics/financial/:productId
    Returns: FinancialMetrics
```

Each endpoint is a thin aggregation proxy: it calls the relevant source integration(s), normalises the response, applies caching at the API layer (Redis or in-memory TTL), and returns typed JSON.

### 11.3 Alert Rules

```
GET    /governance/alerts/:productId
POST   /governance/alerts/:productId
PATCH  /governance/alerts/:productId/:ruleId
DELETE /governance/alerts/:productId/:ruleId
```

### 11.4 Release Readiness

```
GET    /governance/release-checklist/:productId
POST   /governance/release-checklist/:productId
PATCH  /governance/release-checklist/:productId/:checklistId/item/:itemId
POST   /governance/release-checklist/:productId/:checklistId/sign-off
```

### 11.5 Audit Log

```
GET  /governance/audit-log/:productId
     Query: ?startDate=&endDate=&action=&limit=&offset=
     Auth: compliance_officer role required
GET  /governance/audit-log/:productId/export
     Returns: application/pdf or text/csv
```

### 11.6 Snapshot Export

```
POST /governance/snapshot/:productId/export
     Body: { format: 'pdf' | 'pptx', pillars: GovPillar[] }
     Returns: { downloadUrl: string, expiresAt: Date }
```

---

## 12. Implementation Stages

### Stage 1 — Delivery & Quality Foundation (MVP)
**Pillars:** Delivery Performance + Quality & Risk
**Scope:**
- `GovernanceDashboard.tsx` page with 3-column shell + `TopBar`
- `VelocityTrendChart`, `SprintBurndownChart`, `SprintGoalStatus` — powered by existing JIRA integration
- `DefectDensityChart`, `TestCoverageGauge` — new SonarQube integration client
- `PillarCard`, `MetricThresholdBadge` shared primitives
- React Query hooks: `useDeliveryMetrics`, `useQualityMetrics`
- `/governance/metrics/delivery` and `/governance/metrics/quality` API endpoints
- Route added to prd-partner navigation as "Governance" tab

**Acceptance criteria:**
- Dashboard loads in < 2 seconds with JIRA data
- Velocity trend renders 5 sprints; burndown updates when sprint advances
- SonarQube defect count matches direct SonarQube portal
- RBAC: only users with `po` or `engineering_manager` role can access

---

### Stage 2 — Backlog Health + Strategic Alignment
**Pillars:** Backlog Health + Strategic Alignment
**Scope:**
- `BacklogHealthCard`, `BacklogList` — JIRA backlog queries
- `OKRProgressPanel` — manual OKR data entry with % progress (no external OKR tool integration yet)
- `RoadmapTimeline` — read from existing prd-partner PRD roadmap data
- `useBacklogMetrics` hook
- `/governance/metrics/backlog` API endpoint
- OKR data stored in `GovernanceDashboardConfig` (simple JSON, no new table needed)

**Acceptance criteria:**
- Backlog readiness % matches JIRA "Ready" label filter
- Technical debt indicator correctly sums story points tagged `tech-debt`
- OKR progress bar editable in-place by PO role

---

### Stage 3 — Customer, Team Health + Alerting Engine
**Pillars:** Customer / Market Feedback + Team Health
**Scope:**
- `NPSCsatTrendChart`, `FeatureAdoptionHeatmap`, `SupportSentimentCard`
- Mixpanel or Amplitude integration client (configurable)
- Zendesk integration client for ticket volume + sentiment
- AI summarisation of support themes via existing Claude API integration in prd-partner
- `CapacityUtilizationChart`, `TeamHealthSummary` — manual input or OfficeVibe API
- Server-side alert threshold engine — cron job evaluating `AlertRule[]` on each metric refresh, firing Slack webhook via existing `src/integrations/slack/client.ts`
- `AlertRulesDrawer` component for threshold configuration
- `/governance/alerts` endpoints

**Acceptance criteria:**
- NPS trend chart renders last 12 weeks of data
- Alert fires to configured Slack channel within 60 seconds of threshold breach
- Alert respects cooldown window (no duplicate fires within 30 minutes)
- AI sentiment summary updates weekly (not on every page load)

---

### Stage 4 — Compliance, Financial + Release Sign-Off
**Pillars:** Regulatory / Compliance + Financial & Cost Metrics
**Scope:**
- `ComplianceStatusWidget`, `ReleaseReadinessChecklist`, `AuditLogPanel`
- RBAC gate: compliance panel restricted to `compliance_officer` role
- Digital release sign-off workflow with audit log write
- `BudgetBurnChart`, `CostOfDelayTable` — manual finance data input (ERP API integration deferred)
- `SnapshotExportButton` — PDF snapshot export via server-side renderer
- `/governance/release-checklist`, `/governance/audit-log`, `/governance/snapshot/export` endpoints

**Acceptance criteria:**
- Compliance officer can complete checklist items and sign off on a release
- Sign-off is immutably recorded in audit log with actor, timestamp, decision
- Audit log export produces a valid PDF within 10 seconds
- Budget burn chart accepts manual monthly actuals input
- Non-compliance-officer roles cannot see GDPR request counts or audit log

---

### Stage 5 — Polish, Stakeholder Digest + Observability
**Scope:**
- `SnapshotExportButton` — add PPTX format
- Weekly stakeholder digest email/Slack push (scheduled job)
- Read-only "Executive Digest" view (top 6 KPIs only) — extend existing `ExecutiveDashboard.tsx`
- Dashboard-level NPS widget (in-app)
- Performance hardening: audit all React Query staleTime values; add API-layer Redis caching
- E2E tests for release sign-off flow and alert rule CRUD

**Acceptance criteria:**
- PPTX export renders all enabled pillar charts as slides
- Executive digest Slack message sent by 08:00 Monday
- Dashboard Lighthouse performance score ≥ 80 on 4G throttle
- All Stage 1–4 acceptance criteria remain passing

---

## Appendix A: Dashboard Wireframe

```
┌─────────────────────────────────────────────────────────────────────┐
│ prd-partner  │  [Product Name]  │  v2.4.1  │  2026-03-14  │  ↻ Live │
├─────────────────────────────────────────────────────────────────────┤
│ LEFT – STRATEGIC       │ CENTER – KPI OVERVIEW   │ RIGHT – OPS       │
│                        │                         │                   │
│ OKR Progress           │ Velocity Trend ▓▓▓░░    │ Backlog Health    │
│ ██████░░ 72%           │ [5-sprint chart]        │ 142 items | 61%↑  │
│                        │                         │ Debt: ████░ 18%   │
│ Roadmap Timeline       │ Defect Density          │                   │
│ ───●─────●──●──        │ Crit:2 High:8 Med:14    │ Sprint Goal       │
│  Q1   Q2   Q3          │ Coverage: 78% ✓         │ ██████░░ 74%      │
│                        │                         │                   │
│ Market Signals         │ Feature Adoption        │ Release Ready     │
│ • NPS: 42 (+3)         │ [heatmap grid]          │ ✓ QA Sign-off     │
│ • Churn: 2.1%          │                         │ ✓ Security Scan   │
│ • CSAT: 4.3/5          │ Support Sentiment       │ ⏳ Compliance     │
│                        │ "Users struggling with  │ ✗ PO Sign-off     │
│                        │  onboarding flow..."    │                   │
│                        │                         │ Risk Matrix       │
│                        │                         │ ● High (1)        │
│                        │                         │ ● Med  (3)        │
│                        │                         │ ● Low  (7)        │
├─────────────────────────────────────────────────────────────────────┤
│  [Export Snapshot ↓]  [Configure Alerts ⚙]  [Compliance Audit ⚖]   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Appendix B: Alert Rule Examples

| Metric | Condition | Severity | Slack Message |
|--------|-----------|----------|---------------|
| `velocity.rollingAvg` | drops > 20% week-on-week | warning | "Sprint velocity dropped 23% — review capacity and blockers" |
| `defect.critical` | > 0 | critical | "Critical defect detected — release readiness at risk" |
| `compliance.pciExpiry` | < 30 days | warning | "PCI compliance expires in 28 days — initiate renewal" |
| `backlog.readinessPct` | < 40% | warning | "Backlog readiness at 35% — sprint planning at risk" |
| `budget.burnRate` | > 110% of plan | critical | "Budget burn at 115% of plan — financial review required" |
