/**
 * Financial Metrics Types
 */

export interface BudgetData {
  totalBudget: number;
  spent: number;
  remaining: number;
  projected: number;
  currency: string;
  period: {
    start: string;
    end: string;
  };
  monthlySpend: {
    month: string;
    planned: number;
    actual: number;
  }[];
}

export interface TeamCost {
  role: string;
  count: number;
  costPerPerson: number;
  totalCost: number;
}

export interface CostMetrics {
  totalCost: number;
  teamCosts: TeamCost[];
  infrastructureCost: number;
  toolingCost: number;
  otherCosts: number;
}

export interface SprintCost {
  sprintName: string;
  storyPointsCompleted: number;
  cost: number;
  costPerPoint: number;
}

export interface FinancialMetrics {
  budget: BudgetData;
  costs: CostMetrics;
  sprintCosts: SprintCost[];
  // Efficiency metrics
  costPerStoryPoint: number;
  budgetBurnRate: number; // per month
  projectedOverUnder: number;
  roi: number; // percentage
}
