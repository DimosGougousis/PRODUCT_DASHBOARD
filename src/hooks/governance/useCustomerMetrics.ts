/**
 * useCustomerMetrics Hook - Fetch customer satisfaction and support metrics
 */

import { useQuery } from '@tanstack/react-query';
import type { CustomerMetrics } from '@/types/governance/customer';

interface UseCustomerMetricsOptions {
  productId: string | null;
  useMock?: boolean;
}

// Generate mock customer data for demonstration
function generateMockCustomerData(): CustomerMetrics {
  return {
    nps: {
      score: 42,
      promoters: 125,
      passives: 45,
      detractors: 30,
      totalResponses: 200,
      trend: [35, 38, 40, 39, 41, 42],
    },
    csat: {
      score: 87,
      satisfied: 174,
      neutral: 18,
      dissatisfied: 8,
      totalResponses: 200,
      trend: [82, 84, 85, 86, 86, 87],
    },
    support: {
      totalTickets: 156,
      openTickets: 12,
      resolvedThisWeek: 23,
      avgResolutionTime: 18.5,
      avgSatisfaction: 4.2,
      ticketsByCategory: {
        bug: 45,
        feature: 32,
        question: 56,
        other: 23,
      },
      ticketsByPriority: {
        urgent: 8,
        high: 24,
        medium: 78,
        low: 46,
      },
      trend: [38, 42, 35, 41],
    },
    featureAdoption: [
      { feature: 'Dashboard', users: 850, percentage: 85 },
      { feature: 'Reports', users: 620, percentage: 62 },
      { feature: 'API Integration', users: 340, percentage: 34 },
      { feature: 'Mobile App', users: 480, percentage: 48 },
    ],
  };
}

// Fetch customer metrics from API
const fetchCustomerMetrics = async (_productId: string): Promise<CustomerMetrics> => {
  // TODO: Implement actual API integration
  // This would connect to customer feedback tools (Typeform, SurveyMonkey)
  // and support platforms (Zendesk, Intercom)
  throw new Error('Customer metrics API not implemented');
};

export function useCustomerMetrics({
  productId,
  useMock = false,
}: UseCustomerMetricsOptions) {
  return useQuery<CustomerMetrics>({
    queryKey: ['governance', 'customer', productId, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockCustomerData());
      }
      return fetchCustomerMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchInterval: 10 * 60 * 1000,
  });
}
