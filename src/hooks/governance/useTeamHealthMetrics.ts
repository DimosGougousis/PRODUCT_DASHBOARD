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

// Generate project-specific mock team health data
function generateMockTeamHealthData(productId: string = 'default'): TeamHealthMetrics {
  // Project-specific team profiles
  const projectConfigs: Record<string, { size: number; change: number; satisfaction: number; retention: number; risk: 'low' | 'medium' | 'high' }> = {
    'default': { size: 15, change: 2, satisfaction: 7.8, retention: 94, risk: 'low' },
    'payment': { size: 8, change: 1, satisfaction: 8.2, retention: 96, risk: 'low' },
    'auth': { size: 6, change: 0, satisfaction: 7.2, retention: 88, risk: 'medium' },
    'dashboard': { size: 12, change: 3, satisfaction: 8.5, retention: 98, risk: 'low' },
  };
  
  const config = projectConfigs[productId] || projectConfigs['default'];
  
  return {
    satisfaction: {
      overall: {
        score: config.satisfaction,
        trend: config.satisfaction >= 8 ? 'up' : config.satisfaction >= 7 ? 'stable' : 'down',
      },
      categories: [
        { name: 'Workload', score: Math.min(10, config.satisfaction + 0.3) },
        { name: 'Autonomy', score: Math.min(10, config.satisfaction + 0.5) },
        { name: 'Growth', score: Math.min(10, config.satisfaction - 0.2) },
        { name: 'Recognition', score: Math.min(10, config.satisfaction + 0.1) },
        { name: 'Collaboration', score: Math.min(10, config.satisfaction + 0.8) },
        { name: 'Purpose', score: Math.min(10, config.satisfaction + 0.4) },
      ],
    },
    teamSize: {
      current: config.size,
      change: config.change,
    },
    retention: {
      rate: config.retention,
    },
    burnout: {
      riskLevel: config.risk,
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
        teamMood: config.satisfaction >= 8 ? 'great' : config.satisfaction >= 7 ? 'good' : 'neutral',
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
        teamMood: config.satisfaction >= 7.5 ? 'great' : 'good',
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
        return Promise.resolve(generateMockTeamHealthData(productId || 'default'));
      }
      return fetchTeamHealthMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000,
  });
}
