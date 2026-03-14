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

// Generate mock financial data for demonstration
function generateMockFinancialData(): FinancialMetrics {
  const monthlySpend = [
    { month: 'Jan', planned: 45000, actual: 42000 },
    { month: 'Feb', planned: 45000, actual: 46500 },
    { month: 'Mar', planned: 48000, actual: 47500 },
    { month: 'Apr', planned: 48000, actual: 49000 },
    { month: 'May', planned: 50000, actual: 48500 },
    { month: 'Jun', planned: 50000, actual: 51000 },
  ];

  const totalSpent = monthlySpend.reduce((sum, m) => sum + m.actual, 0);
  const totalPlanned = monthlySpend.reduce((sum, m) => sum + m.planned, 0);
  const forecastEac = totalSpent + 300000; // Projected for remaining 6 months

  const history = [
    { sprintName: 'Sprint 21', costPerPoint: 679 },
    { sprintName: 'Sprint 22', costPerPoint: 742 },
    { sprintName: 'Sprint 23', costPerPoint: 640 },
    { sprintName: 'Sprint 24', costPerPoint: 713 },
    { sprintName: 'Sprint 25', costPerPoint: 715 },
  ];

  return {
    budget: {
      totalBudget: 600000,
      actualSpend: totalSpent,
      plannedSpend: totalPlanned,
      forecastEac,
      monthlySpend,
      breakdown: {
        personnel: 543000,
        infrastructure: 18000,
        tools: 12000,
      },
    },
    costPerPoint: {
      current: 715,
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
