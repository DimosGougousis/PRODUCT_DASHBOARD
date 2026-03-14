# Governance Dashboard Configuration Mapping

This document provides a comprehensive mapping of configuration parameters to data sources and explains the value each metric provides to the product team.

## Table of Contents

1. [Overview](#overview)
2. [Configuration Parameters](#configuration-parameters)
3. [Data Source Mapping](#data-source-mapping)
4. [Product Team Value](#product-team-value)
5. [Project-Specific Profiles](#project-specific-profiles)

---

## Overview

The Governance Dashboard provides 7 pillars of product health metrics, each requiring specific configuration to fetch data from various sources. This mapping helps product teams understand what data is available and how it drives decision-making.

---

## Configuration Parameters

### Core Configuration

| Parameter | Type | Description | Used In |
|-----------|------|-------------|---------|
| `productId` | `string` | Unique identifier for the product/project | All hooks |
| `boardId` | `string` | Jira board identifier for sprint/velocity data | Delivery, Backlog |
| `projectKey` | `string` | Jira project key (e.g., "PROJ", "PAY") | Delivery, Quality, Backlog |
| `useMock` | `boolean` | Enable mock data for development/testing | All hooks |

### Integration-Specific Configuration

| Parameter | Type | Description | Data Source |
|-----------|------|-------------|-------------|
| `jiraBaseUrl` | `string` | Jira instance URL | Jira API |
| `confluenceBaseUrl` | `string` | Confluence instance URL | Confluence API |
| `githubOrg` | `string` | GitHub organization name | GitHub API |
| `githubRepo` | `string` | GitHub repository name | GitHub API |
| `stripeAccountId` | `string` | Stripe account identifier | Stripe API |
| `zendeskSubdomain` | `string` | Zendesk subdomain | Zendesk API |
| `salesforceOrgId` | `string` | Salesforce organization ID | Salesforce API |

---

## Data Source Mapping

### 1. Delivery Performance (`useDeliveryMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `boardId` + `projectKey` | Jira Sprint Reports | Velocity, sprint goals, completion rates |
| `boardId` | Jira Issue Search | Lead time, cycle time distributions |
| `githubOrg` + `githubRepo` | GitHub Commits/PRs | Deployment frequency, MTTR |

**Mock Data Profiles:**
- `default`: Velocity 42 SP, 85% goal completion, 4.2 day lead time
- `payment`: Velocity 38 SP, 92% goal completion, 3.8 day lead time (stable, high completion)
- `auth`: Velocity 52 SP, 78% goal completion, 5.1 day lead time (fast but inconsistent)
- `dashboard`: Velocity 45 SP, 88% goal completion, 4.0 day lead time (balanced)

### 2. Customer Metrics (`useCustomerMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `zendeskSubdomain` | Zendesk Tickets | Ticket volume, resolution times, CSAT |
| `productId` | NPS Platform (Delighted, SatisMeter) | NPS scores, response rates |
| `salesforceOrgId` | Salesforce Cases | Customer health scores, churn risk |

**Mock Data Profiles:**
- `default`: NPS 42, CSAT 4.2, 12 tickets/week
- `payment`: NPS 38, CSAT 3.9, 18 tickets/week (lower satisfaction, high volume)
- `auth`: NPS 48, CSAT 4.5, 6 tickets/week (high satisfaction, low volume)
- `dashboard`: NPS 62, CSAT 4.7, 8 tickets/week (excellent satisfaction)

### 3. Financial Metrics (`useFinancialMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `stripeAccountId` | Stripe API | MRR, revenue trends, churn |
| `projectKey` + `boardId` | Jira + Cost Allocation | Cost per story point, budget burn |
| `productId` | Financial System | Budget allocation, forecasts |

**Mock Data Profiles:**
- `default`: $520K budget, $720 cost/point, 15% margin
- `payment`: $850K budget, $892 cost/point, 22% margin (high revenue, high cost)
- `auth`: $380K budget, $580 cost/point, 18% margin (efficient, lower revenue)
- `dashboard`: $620K budget, $650 cost/point, 25% margin (best margin)

### 4. Backlog Health (`useBacklogMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `boardId` | Jira Backlog | Story count, refinement status |
| `projectKey` | Jira Issues | INVEST criteria scoring |
| `confluenceBaseUrl` | Confluence Pages | Documentation coverage |

**Mock Data Profiles:**
- `default`: 78 health score, 65% ready stories, 8.2 avg story size
- `payment`: 88 health score, 82% ready stories, 6.5 avg story size (well-maintained)
- `auth`: 62 health score, 48% ready stories, 11.2 avg story size (needs attention)
- `dashboard`: 75 health score, 72% ready stories, 7.8 avg story size (good balance)

### 5. Quality Metrics (`useQualityMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `githubOrg` + `githubRepo` | GitHub + SonarQube | Code coverage, tech debt ratio |
| `projectKey` | Jira Bugs | Bug counts, severity distribution |
| `boardId` | Jira Sprint Quality | Escaped defects, test automation |

**Mock Data Profiles:**
- `default`: 78% coverage, 12 bugs, 8.5% tech debt
- `payment`: 92% coverage, 2 bugs, 4.2% tech debt (high quality, PCI requirements)
- `auth`: 85% coverage, 8 bugs, 6.8% tech debt (security-focused)
- `dashboard`: 62% coverage, 24 bugs, 15.2% tech debt (needs investment)

### 6. Team Health (`useTeamHealthMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `productId` | HR Platform (Lattice, 15Five) | Satisfaction scores, eNPS |
| `projectKey` | Jira + Calendar | Workload distribution, overtime |
| `githubOrg` | GitHub Activity | Contribution patterns, burnout signals |

**Mock Data Profiles:**
- `default`: 7.8 satisfaction, 94% retention, low burnout risk
- `payment`: 8.2 satisfaction, 96% retention, low burnout risk (stable team)
- `auth`: 7.2 satisfaction, 88% retention, medium burnout risk (needs attention)
- `dashboard`: 8.5 satisfaction, 98% retention, low burnout risk (high performing)

### 7. Compliance & Security (`useComplianceMetrics`)

| Configuration | Fetches From | Returns |
|--------------|--------------|---------|
| `productId` | Compliance Platform (Vanta, Drata) | Framework scores, control status |
| `githubOrg` + `githubRepo` | Security Scanners (Snyk, CodeQL) | Vulnerability counts, severity |
| `stripeAccountId` | Stripe | PCI compliance status |

**Mock Data Profiles:**
- `default`: 85 score, 8 findings (1 critical), GDPR/SOC2/ISO27001
- `payment`: 94 score, 3 findings (0 critical), +PCI DSS (financial grade)
- `auth`: 88 score, 6 findings (0 critical), +NIST CSF (security-focused)
- `dashboard`: 78 score, 12 findings (2 critical), basic frameworks only

---

## Product Team Value

### Strategic Decision Making

| Metric | Product Team Value |
|--------|-------------------|
| **Velocity Trends** | Forecast release dates, plan roadmap commitments |
| **Sprint Goal Completion** | Assess team reliability for stakeholder communication |
| **Lead Time** | Set customer expectations, identify process bottlenecks |
| **NPS/CSAT** | Prioritize features that improve customer satisfaction |
| **Cost Per Point** | Evaluate development efficiency, justify team size |
| **Backlog Health** | Ensure ready work for consistent delivery |
| **Code Coverage** | Balance quality investment vs. delivery speed |
| **Team Satisfaction** | Predict retention risk, plan hiring |
| **Compliance Score** | Assess release readiness for regulated features |

### Operational Insights

#### Delivery Performance
- **What it tells you**: How predictable and efficient the team is
- **Actionable insights**: 
  - Declining velocity → Investigate blockers or scope creep
  - High lead time variation → Standardize processes
  - Low completion rate → Improve sprint planning

#### Customer Metrics
- **What it tells you**: How customers perceive product value
- **Actionable insights**:
  - Low NPS → Prioritize customer pain points
  - High ticket volume → Address usability issues
  - Declining CSAT → Review recent releases

#### Financial Metrics
- **What it tells you**: Product profitability and efficiency
- **Actionable insights**:
  - High cost/point → Optimize processes or team structure
  - Low margin → Evaluate pricing or reduce scope
  - Budget overrun → Reassess priorities

#### Backlog Health
- **What it tells you**: Readiness for future sprints
- **Actionable insights**:
  - Low ready percentage → Schedule refinement sessions
  - Large story sizes → Break down epics
  - Stale stories → Groom or remove

#### Quality Metrics
- **What it tells you**: Technical debt and risk level
- **Actionable insights**:
  - Low coverage → Allocate testing sprints
  - High bug count → Implement bug bashes
  - Rising tech debt → Plan refactoring

#### Team Health
- **What it tells you**: Sustainability of current pace
- **Actionable insights**:
  - Low satisfaction → Address team concerns
  - Burnout risk → Reduce workload, add resources
  - High turnover → Review compensation/culture

#### Compliance
- **What it tells you**: Risk of regulatory issues
- **Actionable insights**:
  - Non-compliant frameworks → Pause releases, remediate
  - Critical findings → Emergency security sprints
  - Audit approaching → Prepare documentation

---

## Project-Specific Profiles

### Default Profile
Used when no specific project is selected. Represents an average product team with balanced metrics across all dimensions.

### Payment (PAY) Profile
**Characteristics**: Financial services, high compliance requirements, stable delivery
- Higher compliance standards (PCI DSS)
- Lower customer satisfaction (complex domain)
- Higher costs but strong margins
- Excellent quality (regulatory requirements)
- Stable team with high retention

### Auth (AUTH) Profile
**Characteristics**: Security-critical, complex domain, challenging delivery
- Security-focused compliance (NIST CSF)
- High customer satisfaction (critical service)
- Lower costs, efficient delivery
- Good quality with security focus
- Team showing burnout risk (complex work)

### Dashboard (DASH) Profile
**Characteristics**: User-facing, high satisfaction, needs quality investment
- Basic compliance only
- Excellent customer satisfaction
- Best margins, efficient operations
- Lower quality metrics (needs investment)
- High-performing, satisfied team

---

## Implementation Notes

### Adding Real Data Sources

To connect to real data sources instead of mock data:

1. **Jira**: Set `VITE_JIRA_BASE_URL`, `VITE_JIRA_API_TOKEN` environment variables
2. **GitHub**: Set `VITE_GITHUB_TOKEN` environment variable
3. **Stripe**: Set `VITE_STripe_SECRET_KEY` environment variable
4. **Zendesk**: Set `VITE_ZENDESK_SUBDOMAIN`, `VITE_ZENDESK_TOKEN` environment variables

### Extending Project Profiles

To add new project-specific configurations:

1. Add entry to `projectConfigs` object in each hook
2. Define unique characteristics for the project type
3. Update this documentation with the new profile

---

*Last updated: March 2026*
