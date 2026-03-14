/**
 * useFinancialMetrics Hook - Fetch budget and cost metrics
 */

import { useQuery } from '@tanstack/react-query';

export interface BudgetData {
  totalBudget: number;
  actualSpend: number;
  plannedSpend: number;
  forecastEac: number;
  monthlySpend: {
    month: string;
    planned: number;
    actual: number;
  }[];
  breakdown: {
    personnel: number;
    infrastructure: number;
    tools: number;
  };
}

export interface CostPerPointData {
  current: number;
  trend: 'up' | 'down' | 'stable';
  history: {
    sprintName: string;
    costPerPoint: number;
  }[];
}

export interface FinancialMetrics {
  budget: BudgetData;
  costPerPoint: CostPerPointData;
}

interface UseFinancialMetricsOptions {
  productId?: string | null;
  useMock?: boolean;
}

// Generate project-specific mock financial data
function generateMockFinancialData(productId: string = 'default'): FinancialMetrics {
  // Project-specific budget profiles
  const projectConfigs: Record<string, { budget: number; personnel: number; infra: number; tools: number; cpp: number }> = {
    'default': { budget: 600000, personnel: 543000, infra: 18000, tools: 12000, cpp: 715 },
    'payment': { budget: 850000, personnel: 780000, infra: 45000, tools: 25000, cpp: 892 },
    'auth': { budget: 420000, personnel: 380000, infra: 25000, tools: 15000, cpp: 625 },
    'dashboard': { budget: 380000, personnel: 350000, infra: 18000, tools: 12000, cpp: 580 },
  };
  
  const config = projectConfigs[productId] || projectConfigs['default'];
  
  const monthlySpend = [
    { month: 'Jan', planned: Math.round(config.budget / 12), actual: Math.round(config.budget / 12 * 0.95) },
    { month: 'Feb', planned: Math.round(config.budget / 12), actual: Math.round(config.budget / 12 * 1.02) },
    { month: 'Mar', planned: Math.round(config.budget / 12 * 1.05), actual: Math.round(config.budget / 12 * 1.03) },
    { month: 'Apr', planned: Math.round(config.budget / 12 * 1.05), actual: Math.round(config.budget / 12 * 1.08) },
    { month: 'May', planned: Math.round(config.budget / 12 * 1.1), actual: Math.round(config.budget / 12 * 1.05) },
    { month: 'Jun', planned: Math.round(config.budget / 12 * 1.1), actual: Math.round(config.budget / 12 * 1.12) },
  ];

  const totalSpent = monthlySpend.reduce((sum, m) => sum + m.actual, 0);
  const totalPlanned = monthlySpend.reduce((sum, m) => sum + m.planned, 0);
  const forecastEac = totalSpent + (config.budget / 2);

  const history = [
    { sprintName: 'Sprint 21', costPerPoint: Math.round(config.cpp * 0.95) },
    { sprintName: 'Sprint 22', costPerPoint: Math.round(config.cpp * 1.04) },
    { sprintName: 'Sprint 23', costPerPoint: Math.round(config.cpp * 0.90) },
    { sprintName: 'Sprint 24', costPerPoint: Math.round(config.cpp * 1.00) },
    { sprintName: 'Sprint 25', costPerPoint: config.cpp },
  ];

  return {
    budget: {
      totalBudget: config.budget,
      actualSpend: totalSpent,
      plannedSpend: totalPlanned,
      forecastEac,
      monthlySpend,
      breakdown: {
        personnel: config.personnel,
        infrastructure: config.infra,
        tools: config.tools,
      },
    },
    costPerPoint: {
      current: config.cpp,
      trend: 'stable',
      history,
    },
  };
}

// Fetch financial metrics from API
const fetchFinancialMetrics = async (_productId: string): Promise<FinancialMetrics> => {
  // TODO: Implement actual API integration
  // This would connect to financial systems (ERP, accounting software)
  throw new Error('Financial metrics API not implemented');
};

export function useFinancialMetrics({
  productId,
  useMock = false,
}: UseFinancialMetricsOptions) {
  return useQuery<FinancialMetrics>({
    queryKey: ['governance', 'financial', productId, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockFinancialData());
      }
      return fetchFinancialMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 30 * 60 * 1000, // 30 minutes - financial data changes less frequently
    refetchInterval: 30 * 60 * 1000,
  });
}
