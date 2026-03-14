/**
 * Team Health Metrics Types
 */

export interface TeamSatisfaction {
  overall: number; // 1-10
  categories: {
    workload: number;
    autonomy: number;
    growth: number;
    recognition: number;
    collaboration: number;
    purpose: number;
  };
  trend: number[]; // Last 6 surveys
  responseRate: number; // percentage
  totalResponses: number;
}

export interface BurnoutIndicators {
  // Based on team surveys/feedback
  exhaustionScore: number; // 0-100
  cynicismScore: number; // 0-100
  efficacyScore: number; // 0-100 (inverse of burnout)
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  atRiskMembers: number;
  trend: number[]; // Last 6 surveys
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  startDate: string;
  satisfaction?: number;
  lastOneOnOne?: string;
  goalsDefined: boolean;
  growthPlanActive: boolean;
}

export interface RetentionMetrics {
  totalMembers: number;
  newHires: number; // Last 90 days
  departures: number; // Last 90 days
  retentionRate: number; // percentage
  avgTenure: number; // months
  turnoverRate: number; // percentage (annualized)
  flightRisk: number; // Number of members flagged as flight risk
}

export interface SprintRetrospective {
  sprintName: string;
  date: string;
  whatWentWell: string[];
  whatToImprove: string[];
  actionItems: {
    description: string;
    owner: string;
    status: 'open' | 'in_progress' | 'done';
  }[];
  teamMood: 'great' | 'good' | 'neutral' | 'challenging' | 'difficult';
  participation: number; // percentage
}

export interface TeamHealthMetrics {
  satisfaction: TeamSatisfaction;
  burnout: BurnoutIndicators;
  retention: RetentionMetrics;
  members: TeamMember[];
  recentRetrospectives: SprintRetrospective[];
  oneOnOneCompliance: number; // percentage of scheduled 1:1s completed
  goalsDefined: number; // percentage of members with defined goals
  lastSurveyDate?: string;
  nextSurveyDate?: string;
}
