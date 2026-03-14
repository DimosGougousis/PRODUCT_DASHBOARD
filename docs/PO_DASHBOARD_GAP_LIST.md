push to git# PO Governance Dashboard - Gap List & TODO Registry

This document tracks all identified gaps and TODOs from the skeleton implementation.
Use this as a roadmap for filling in functionality.

---

## 🔴 P0 - Critical Gaps (Block Stage 1)

| ID | Gap | Description | Location |
|----|-----|-------------|----------|
| GAP-001 | ExecutiveDashboard relationship | Define relationship between ExecutiveDashboard and GovernanceDashboard | GovernanceDashboard.tsx |
| GAP-002 | Route registration | Add /governance route to App.tsx + navigation | App.tsx |
| GAP-005 | JIRA Sprint API Contract | Define JQL queries and response mapping for sprint velocity | VelocityTrendChart.tsx |
| GAP-006 | JIRA Burndown Data | Define daily remaining story points query | SprintBurndownChart.tsx |
| GAP-018 | SonarQube API Setup | Implement SonarQube client with auth | sonarqube/client.ts |

---

## 🟡 P1 - High Priority (Block Stage 2-4)

| ID | Gap | Description | Location |
|----|-----|-------------|----------|
| GAP-003 | Responsive breakpoints | Define 3-col → 2-col → 1-col responsive behavior | GovernanceDashboardLayout.tsx |
| GAP-004 | Product selector data | Connect product selector to actual data source | TopBar.tsx |
| GAP-007 | Sprint Goal Data | Fetch sprint goal from JIRA API | SprintGoalStatus.tsx |
| GAP-008 | SonarQube Issues API | Implement defects by severity query | DefectDensityChart.tsx |
| GAP-009 | SonarQube Coverage API | Implement coverage metrics query | TestCoverageGauge.tsx |
| GAP-010 | Security Findings API | Implement vulnerabilities query | SecurityFindingsBadge.tsx |
| GAP-011 | Pillar color scheme | Finalize pillar color definitions | PillarCard.tsx |
| GAP-012 | Threshold defaults | Define default alert thresholds | MetricThresholdBadge.tsx |
| GAP-013 | Alert Rule Data Model | Finalize Supabase schema for alerts | AlertRulesDrawer.tsx |
| GAP-014 | Export Implementation | Choose client vs server-side PDF generation | SnapshotExportButton.tsx |
| GAP-015 | JIRA API Integration | Extend existing JIRA client | useDeliveryMetrics.ts |
| GAP-016 | SonarQube Integration | New integration client | useQualityMetrics.ts |
| GAP-019 | Supabase Migration | Run migration to create tables | supabase/migrations/ |

---

## 🟢 P2 - Medium Priority (Enhancements)

| ID | Gap | Description | Location |
|----|-----|-------------|----------|
| GAP-017 | Type alignment | Ensure TypeScript types match Supabase schema | types/governance/index.ts |
| GAP-020 | React Query caching | Configure staleTime and refetchInterval | All hooks |
| GAP-021 | Error handling | Add error boundaries and retry logic | All components |
| GAP-022 | Loading states | Standardize skeleton loaders | All components |
| GAP-023 | Empty states | Design empty state for no data | All components |
| GAP-024 | RBAC implementation | Role-based access control | Compliance widgets |
| GAP-025 | Slack webhook | Implement alert delivery | AlertRulesDrawer.tsx |

---

## 🗓️ Stage-by-Stage TODOs

### Stage 1 — Delivery & Quality Foundation
**Goal:** Dashboard loads with JIRA and SonarQube data

- [ ] GAP-002: Add governance route to App.tsx
- [ ] GAP-005: Implement JIRA sprint velocity API
- [ ] GAP-006: Implement JIRA burndown API
- [ ] GAP-007: Fetch sprint goal from JIRA
- [ ] GAP-008: SonarQube defects API
- [ ] GAP-009: SonarQube coverage API
- [ ] GAP-010: SonarQube security API
- [ ] GAP-018: Complete SonarQube client
- [ ] Implement VelocityTrendChart with real data
- [ ] Implement SprintBurndownChart with real data
- [ ] Implement DefectDensityChart with real data
- [ ] Implement TestCoverageGauge with real data

### Stage 2 — Backlog Health + Strategic Alignment
**Goal:** Backlog metrics and OKR tracking

- [ ] GAP-004: Connect product selector to API
- [ ] Implement useBacklogMetrics hook
- [ ] Implement BacklogHealthCard with real data
- [ ] Implement OKRProgressPanel with editable OKRs
- [ ] Implement RoadmapTimeline from PRD data
- [ ] Add OKR management UI

### Stage 3 — Customer, Team Health + Alerting
**Goal:** NPS trends and Slack alerts

- [ ] GAP-016: Mixpanel/Amplitude integration
- [ ] GAP-025: Zendesk integration
- [ ] GAP-013: Alert rules Supabase schema
- [ ] Implement NPSCsatTrendChart
- [ ] Implement FeatureAdoptionHeatmap
- [ ] Implement SupportSentimentCard with AI summary
- [ ] Implement AlertRulesDrawer with save
- [ ] Implement server-side alert engine
- [ ] Connect Slack webhook for alerts

### Stage 4 — Compliance, Financial + Export
**Goal:** Release sign-off and audit trail

- [ ] GAP-019: Run Supabase migration
- [ ] GAP-014: Implement PDF/PPTX export
- [ ] Implement ReleaseReadinessChecklist
- [ ] Implement digital sign-off workflow
- [ ] Implement AuditLogPanel
- [ ] Implement ComplianceStatusWidget
- [ ] Add RBAC to compliance views
- [ ] Implement BudgetBurnChart
- [ ] Implement CostOfDelayTable

---

## 📁 File Inventory (24 files created)

### Pages (1)
- `src/pages/po-dashboard/GovernanceDashboard.tsx`

### Components - Layout (2)
- `src/components/governance/GovernanceDashboardLayout.tsx`
- `src/components/governance/TopBar.tsx`

### Components - Delivery (3)
- `src/components/governance/delivery/VelocityTrendChart.tsx`
- `src/components/governance/delivery/SprintBurndownChart.tsx`
- `src/components/governance/delivery/SprintGoalStatus.tsx`

### Components - Quality (3)
- `src/components/governance/quality/DefectDensityChart.tsx`
- `src/components/governance/quality/TestCoverageGauge.tsx`
- `src/components/governance/quality/SecurityFindingsBadge.tsx`

### Components - Strategic (1)
- `src/components/governance/strategic/OKRProgressPanel.tsx`

### Components - Backlog (1)
- `src/components/governance/backlog/BacklogHealthCard.tsx`

### Components - Customer (1)
- `src/components/governance/customer/NPSCsatTrendChart.tsx`

### Components - Compliance (1)
- `src/components/governance/compliance/ComplianceStatusWidget.tsx`

### Components - Shared (4)
- `src/components/governance/shared/PillarCard.tsx`
- `src/components/governance/shared/MetricThresholdBadge.tsx`
- `src/components/governance/shared/AlertRulesDrawer.tsx`
- `src/components/governance/shared/SnapshotExportButton.tsx`

### Hooks - Governance (4)
- `src/hooks/governance/useDeliveryMetrics.ts`
- `src/hooks/governance/useQualityMetrics.ts`
- `src/hooks/governance/useBacklogMetrics.ts`
- `src/hooks/governance/useComplianceMetrics.ts`

### Types (1)
- `src/types/governance/index.ts`

### Integrations (3)
- `src/integrations/sonarqube/client.ts`
- `src/integrations/sonarqube/types.ts`
- `src/integrations/mixpanel/client.ts`
- `src/integrations/zendesk/client.ts`

### Database (1)
- `supabase/migrations/20260314_governance_dashboard.sql`

---

## 🚀 Quick Start Commands

```bash
# 1. Apply database migration
supabase db push

# 2. Add environment variables
cp .env.example .env.local
# Add: VITE_SONARQUBE_URL, VITE_SONARQUBE_TOKEN, etc.

# 3. Run dev server
npm run dev

# 4. Navigate to dashboard
open http://localhost:5173/#/governance
```

---

## 📝 Notes

- All components have TODO comments marking implementation points
- GAP items are cross-referenced between this list and code comments
- Stage 1 is the MVP - focus on GAP-001 through GAP-018 first
- The skeleton is designed to compile but show placeholder UI
