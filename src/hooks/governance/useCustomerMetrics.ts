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

// Generate project-specific mock customer data
function generateMockCustomerData(productId: string = 'default'): CustomerMetrics {
  // Project-specific customer profiles
  const projectConfigs: Record<string, { nps: number; csat: number; tickets: number; highPrio: number; resolution: number }> = {
    'default': { nps: 47, csat: 4.4, tickets: 12, highPrio: 3, resolution: 18.5 },
    'payment': { nps: 62, csat: 4.7, tickets: 8, highPrio: 1, resolution: 12.0 },
    'auth': { nps: 38, csat: 3.9, tickets: 18, highPrio: 5, resolution: 24.5 },
    'dashboard': { nps: 55, csat: 4.5, tickets: 6, highPrio: 0, resolution: 8.5 },
  };
  
  const config = projectConfigs[productId] || projectConfigs['default'];
  const promoters = Math.round((config.nps + 100) / 2 * 0.62);
  const passives = Math.round((config.nps + 100) / 2 * 0.23);
  const detractors = Math.round((config.nps + 100) / 2 * 0.15);
  
  return {
    nps: {
      score: config.nps,
      promoters,
      passives,
      detractors,
      promotersCount: Math.round(promoters * 2),
      passivesCount: Math.round(passives * 2),
      detractorsCount: Math.round(detractors * 2),
      trend: config.nps > 50 ? 'up' : config.nps > 30 ? 'stable' : 'down',
    },
    csat: {
      score: config.csat,
      responseRate: 87,
    },
    supportTickets: {
      total: config.tickets,
      highPriority: config.highPrio,
      avgResolutionTime: config.resolution,
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
