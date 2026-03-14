/**
 * useFinancialMetrics Hook - Fetch budget and cost metrics
 */

import { useQuery } from '@tanstack/react-query';
import type { FinancialMetrics } from '@/types/governance/financial';

interface UseFinancialMetricsOptions {
  productId: string | null;
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

  return {
    budget: {
      totalBudget: 600000,
      spent: totalSpent,
      remaining: 600000 - totalSpent,
      projected: totalSpent + 300000, // Projected for remaining 6 months
      currency: 'USD',
      period: {
        start: '2026-01-01',
        end: '2026-12-31',
      },
      monthlySpend,
    },
    costs: {
      totalCost: totalSpent,
      teamCosts: [
        { role: 'Engineering', count: 8, costPerPerson: 8000, totalCost: 384000 },
        { role: 'Product', count: 3, costPerPerson: 9000, totalCost: 81000 },
        { role: 'Design', count: 2, costPerPerson: 7000, totalCost: 42000 },
        { role: 'QA', count: 2, costPerPerson: 6000, totalCost: 36000 },
      ],
      infrastructureCost: 18000,
      toolingCost: 12000,
      otherCosts: 8000,
    },
    sprintCosts: [
      { sprintName: 'Sprint 21', storyPointsCompleted: 42, cost: 28500, costPerPoint: 679 },
      { sprintName: 'Sprint 22', storyPointsCompleted: 38, cost: 28200, costPerPoint: 742 },
      { sprintName: 'Sprint 23', storyPointsCompleted: 45, cost: 28800, costPerPoint: 640 },
      { sprintName: 'Sprint 24', storyPointsCompleted: 40, cost: 28500, costPerPoint: 713 },
      { sprintName: 'Sprint 25', storyPointsCompleted: 35, cost: 28000, costPerPoint: 800 },
    ],
    costPerStoryPoint: 715,
    budgetBurnRate: 47500,
    projectedOverUnder: -15000,
    roi: 125,
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
