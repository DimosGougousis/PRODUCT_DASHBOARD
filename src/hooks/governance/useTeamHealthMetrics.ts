/**
 * useTeamHealthMetrics Hook - Fetch team satisfaction and health metrics
 */

import { useQuery } from '@tanstack/react-query';
import type { TeamHealthMetrics } from '@/types/governance/teamHealth';

interface UseTeamHealthMetricsOptions {
  productId: string | null;
  useMock?: boolean;
}

// Generate mock team health data for demonstration
function generateMockTeamHealthData(): TeamHealthMetrics {
  return {
    satisfaction: {
      overall: 7.8,
      categories: {
        workload: 7.5,
        autonomy: 8.2,
        growth: 7.0,
        recognition: 7.8,
        collaboration: 8.5,
        purpose: 8.0,
      },
      trend: [7.2, 7.4, 7.5, 7.6, 7.7, 7.8],
      responseRate: 85,
      totalResponses: 13,
    },
    burnout: {
      exhaustionScore: 35,
      cynicismScore: 25,
      efficacyScore: 78,
      riskLevel: 'low',
      atRiskMembers: 1,
      trend: [40, 38, 36, 35, 34, 35],
    },
    retention: {
      totalMembers: 15,
      newHires: 2,
      departures: 0,
      retentionRate: 94,
      avgTenure: 18,
      turnoverRate: 6,
      flightRisk: 1,
    },
    members: [
      { id: '1', name: 'Alice Chen', role: 'Senior Engineer', startDate: '2024-01-15', satisfaction: 8.5, lastOneOnOne: '2026-02-20', goalsDefined: true, growthPlanActive: true },
      { id: '2', name: 'Bob Smith', role: 'Product Manager', startDate: '2023-06-01', satisfaction: 7.8, lastOneOnOne: '2026-02-18', goalsDefined: true, growthPlanActive: true },
      { id: '3', name: 'Carol Jones', role: 'Engineer', startDate: '2024-08-10', satisfaction: 7.2, lastOneOnOne: '2026-02-15', goalsDefined: true, growthPlanActive: false },
      { id: '4', name: 'David Lee', role: 'Designer', startDate: '2023-09-20', satisfaction: 8.0, lastOneOnOne: '2026-02-22', goalsDefined: true, growthPlanActive: true },
    ],
    recentRetrospectives: [
      {
        sprintName: 'Sprint 25',
        date: '2026-03-10',
        whatWentWell: ['Great collaboration on API redesign', 'Quick bug fixes', 'Helpful code reviews'],
        whatToImprove: ['Better estimation needed', 'Reduce context switching', 'More documentation'],
        actionItems: [
          { description: 'Add estimation training session', owner: 'Bob', status: 'in_progress' },
          { description: 'Create API documentation template', owner: 'Alice', status: 'open' },
        ],
        teamMood: 'good',
        participation: 100,
      },
      {
        sprintName: 'Sprint 24',
        date: '2026-02-24',
        whatWentWell: ['Completed all sprint goals', 'Zero production incidents', 'Great demo'],
        whatToImprove: ['Technical debt accumulating', 'Need more testing time'],
        actionItems: [
          { description: 'Schedule tech debt sprint', owner: 'Carol', status: 'done' },
          { description: 'Add integration tests', owner: 'David', status: 'in_progress' },
        ],
        teamMood: 'great',
        participation: 93,
      },
    ],
    oneOnOneCompliance: 92,
    goalsDefined: 87,
    lastSurveyDate: '2026-03-01',
    nextSurveyDate: '2026-04-01',
  };
}

// Fetch team health metrics from API
const fetchTeamHealthMetrics = async (_productId: string): Promise<TeamHealthMetrics> => {
  // TODO: Implement actual API integration
  // This would connect to HR/people platforms (Lattice, 15Five, Culture Amp)
  throw new Error('Team health metrics API not implemented');
};

export function useTeamHealthMetrics({
  productId,
  useMock = false,
}: UseTeamHealthMetricsOptions) {
  return useQuery<TeamHealthMetrics>({
    queryKey: ['governance', 'teamHealth', productId, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockTeamHealthData());
      }
      return fetchTeamHealthMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000,
  });
}
