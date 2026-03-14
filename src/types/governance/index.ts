/**
 * Governance Dashboard Type Definitions
 * 
 * TODO[GAP-017]: Align with Supabase schema
 *   - Ensure these types match database tables
 *   - Generate types from DB or keep in sync manually
 */

// Enums
export type GovPillar =
  | 'strategic'
  | 'backlog'
  | 'delivery'
  | 'quality'
  | 'customer'
  | 'financial'
  | 'compliance'
  | 'teamHealth';

export type GovernanceAction =
  | 'RELEASE_SIGN_OFF'
  | 'COMPLIANCE_CHECKLIST_COMPLETE'
  | 'RISK_THRESHOLD_BREACHED'
  | 'DASHBOARD_SNAPSHOT_EXPORTED'
  | 'ALERT_RULE_UPDATED';

// Configuration
export interface GovernanceDashboardConfig {
  id: string;
  productId: string;
  enabledPillars: GovPillar[];
  alertRules: AlertRule[];
  refreshIntervals: Record<GovPillar, number>;
  createdAt: Date;
  updatedAt: Date;
}

// Alerting
export interface AlertRule {
  id: string;
  pillar: GovPillar;
  metricKey: string;
  operator: '>' | '<' | '>=' | '<=' | '==' | '!=';
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  cooldownMinutes: number;
  slackChannelId?: string;
  enabled: boolean;
}

// Audit
export interface GovernanceAuditEntry {
  id: string;
  productId: string;
  actorId: string;
  actorRole: string;
  action: GovernanceAction;
  payload: Record<string, unknown>;
  timestamp: Date;
}

// Release Readiness
export interface ReleaseReadinessChecklist {
  id: string;
  productId: string;
  releaseVersion: string;
  items: ChecklistItem[];
  signOffs: SignOff[];
  status: 'pending' | 'in_review' | 'approved' | 'rejected';
  createdAt: Date;
}

export interface ChecklistItem {
  id: string;
  label: string;
  category: 'quality' | 'compliance' | 'security' | 'operations';
  required: boolean;
  completedAt?: Date;
  completedBy?: string;
}

export interface SignOff {
  actorId: string;
  role: string;
  decision: 'approved' | 'rejected';
  comment?: string;
  timestamp: Date;
}

// Metric Data Types (from various sources)
export interface DeliveryMetrics {
  velocityTrend: SprintVelocity[];
  activeBurndown: BurndownPoint[];
  sprintGoalProgress: number;
  leadTimeDays: number;
  cycleTimeDays: number;
}

export interface SprintVelocity {
  sprintName: string;
  committed: number;
  completed: number;
  startDate: Date;
}

export interface BurndownPoint {
  date: Date;
  remaining: number;
  ideal: number;
}

export interface QualityMetrics {
  defectsBySeverity: Record<'critical' | 'high' | 'medium' | 'low', number>;
  testCoveragePercent: number;
  automatedTestPassRate: number;
  securityFindings: number;
  sonarGate: 'passed' | 'failed' | 'warning';
}

export interface CustomerMetrics {
  nps: number;
  csat: number;
  dau: number;
  mau: number;
  featureAdoption: FeatureAdoptionEntry[];
  supportTicketVolume: number;
  sentimentSummary: string;
}

export interface FeatureAdoptionEntry {
  featureName: string;
  adoptionRate: number;
  trend: 'up' | 'down' | 'stable';
}

export interface TeamHealthMetrics {
  capacityUtilization: number;
  impedimentCount: number;
  happinessScore?: number;
  vacationDaysPlanned: number;
}

export interface FinancialMetrics {
  budgetAllocated: number;
  budgetSpent: number;
  forecastedSpend: number;
  costOfDelayItems: CostOfDelayItem[];
}

export interface CostOfDelayItem {
  featureId: string;
  featureName: string;
  weeklyCost: number;
  priority: 'high' | 'medium' | 'low';
}
