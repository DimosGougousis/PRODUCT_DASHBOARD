/**
 * useTeamHealthMetrics Hook - Fetch team satisfaction and health metrics
 */

import { useQuery } from '@tanstack/react-query';

export interface SatisfactionCategory {
  name: string;
  score: number;
}

export interface TeamSatisfaction {
  overall: {
    score: number;
    trend: 'up' | 'down' | 'stable';
  };
  categories: SatisfactionCategory[];
}

export interface TeamSize {
  current: number;
  change: number;
}

export interface Retention {
  rate: number;
}

export interface Burnout {
  riskLevel: 'low' | 'medium' | 'high';
}

export interface RetrospectiveActionItem {
  description: string;
  owner: string;
  status: 'open' | 'in_progress' | 'done';
}

export interface SprintRetrospective {
  sprintName: string;
  date: string;
  whatWentWell: string[];
  whatToImprove: string[];
  actionItems: RetrospectiveActionItem[];
  teamMood: 'great' | 'good' | 'neutral' | 'challenging' | 'difficult';
  participation: number;
}

export interface TeamHealthMetrics {
  satisfaction: TeamSatisfaction;
  teamSize: TeamSize;
  retention: Retention;
  burnout: Burnout;
  recentRetrospectives: SprintRetrospective[];
}

interface UseTeamHealthMetricsOptions {
  productId?: string | null;
  useMock?: boolean;
}

// Generate mock team health data for demonstration
function generateMockTeamHealthData(): TeamHealthMetrics {
  return {
    satisfaction: {
      overall: {
        score: 7.8,
        trend: 'up',
      },
      categories: [
        { name: 'Workload', score: 7.5 },
        { name: 'Autonomy', score: 8.2 },
        { name: 'Growth', score: 7.0 },
        { name: 'Recognition', score: 7.8 },
        { name: 'Collaboration', score: 8.5 },
        { name: 'Purpose', score: 8.0 },
      ],
    },
    teamSize: {
      current: 15,
      change: 2,
    },
    retention: {
      rate: 94,
    },
    burnout: {
      riskLevel: 'low',
    },
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
