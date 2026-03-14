/**
 * useCustomerMetrics Hook - Fetch customer satisfaction and support metrics
 */

import { useQuery } from '@tanstack/react-query';

export interface NPSData {
  score: number;
  promoters: number;
  passives: number;
  detractors: number;
  promotersCount: number;
  passivesCount: number;
  detractorsCount: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CSATData {
  score: number;
  responseRate: number;
}

export interface SupportTicketsData {
  total: number;
  highPriority: number;
  avgResolutionTime: number;
}

export interface CustomerMetrics {
  nps: NPSData;
  csat: CSATData;
  supportTickets: SupportTicketsData;
}

interface UseCustomerMetricsOptions {
  productId?: string | null;
  useMock?: boolean;
}

// Generate mock customer data for demonstration
function generateMockCustomerData(): CustomerMetrics {
  const totalResponses = 200;
  const promoters = 62; // 125/200 = 62%
  const passives = 23; // 45/200 = 22%
  const detractors = 15; // 30/200 = 15%
  const npsScore = promoters - detractors; // 47
  
  return {
    nps: {
      score: npsScore,
      promoters,
      passives,
      detractors,
      promotersCount: 125,
      passivesCount: 45,
      detractorsCount: 30,
      trend: 'up',
    },
    csat: {
      score: 4.4, // Out of 5
      responseRate: 87,
    },
    supportTickets: {
      total: 12,
      highPriority: 3,
      avgResolutionTime: 18.5,
    },
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
