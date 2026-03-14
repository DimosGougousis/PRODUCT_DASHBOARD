/**
 * useBacklogMetrics Hook - Fetch backlog health metrics
 */

import { useQuery } from '@tanstack/react-query';
import { jiraClient } from '@/integrations/jira/client';

export interface BacklogMetrics {
  totalStories: number;
  readyStories: number;
  healthScore: number;
  averageAge: number;
  investScores: Record<string, number>;
  deepScores: Record<string, number>;
}

interface UseBacklogMetricsOptions {
  projectKey?: string | null;
  useMock?: boolean;
}

// Generate project-specific mock backlog data
function generateMockBacklogData(projectKey: string = 'PROJ'): BacklogMetrics {
  // Project-specific data variations
  const projectConfigs: Record<string, { total: number; ready: number; health: number; age: number }> = {
    'PROJ': { total: 47, ready: 18, health: 78, age: 12 },
    'PAY': { total: 32, ready: 24, health: 85, age: 8 },
    'AUTH': { total: 56, ready: 15, health: 62, age: 18 },
    'DASH': { total: 28, ready: 20, health: 88, age: 6 },
  };
  
  const config = projectConfigs[projectKey] || projectConfigs['PROJ'];
  
  return {
    totalStories: config.total,
    readyStories: config.ready,
    healthScore: config.health,
    averageAge: config.age,
    investScores: {
      independent: 85,
      negotiable: 78,
      valuable: 92,
      estimable: 75,
      small: 68,
      testable: 88,
    },
    deepScores: {
      detailedAppropriately: 82,
      estimated: 76,
      emergent: 90,
      prioritized: 85,
    },
  };
}

// Calculate days between two dates
function daysBetween(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return Math.floor((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

// Fetch backlog metrics from JIRA
const fetchBacklogMetrics = async (projectKey: string): Promise<BacklogMetrics> => {
  const fields = [
    'summary',
    'status',
    'issuetype',
    'priority',
    'created',
    'updated',
    'customfield_10016', // story points
    'assignee',
    'labels',
    'description',
  ];

  // Get backlog issues (not in sprint, not done)
  const backlogIssues = await jiraClient.getBacklogIssues(projectKey, fields);

  // Get in-progress issues for WIP
  const wipIssues = await jiraClient.getProjectIssues(
    projectKey,
    ['In Progress', 'In Review', 'Testing'],
    fields
  );

  const now = new Date().toISOString();

  // Calculate metrics
  const metrics: BacklogMetrics = {
    totalIssues: backlogIssues.length,
    totalStoryPoints: 0,
    aging: { fresh: 0, aging: 0, stale: 0 },
    readiness: { ready: 0, needsRefinement: 0, inProgress: 0 },
    byPriority: { highest: 0, high: 0, medium: 0, low: 0, lowest: 0 },
    byType: { story: 0, bug: 0, task: 0, epic: 0, other: 0 },
    issuesTrend: [backlogIssues.length], // Would need historical data
    velocityTrend: [35, 38, 42, 40], // Mock trend
    wipIssues: wipIssues.length,
    wipStoryPoints: 0,
  };

  backlogIssues.forEach((issue) => {
    const points = issue.fields.customfield_10016 || 0;
    metrics.totalStoryPoints += points;

    // Aging
    const daysInBacklog = daysBetween(issue.fields.created, now);
    if (daysInBacklog < 7) {
      metrics.aging.fresh++;
    } else if (daysInBacklog < 30) {
      metrics.aging.aging++;
    } else {
      metrics.aging.stale++;
    }

    // Readiness
    const hasDescription = !!issue.fields.description;
    const hasPoints = points > 0;
    const hasAssignee = !!issue.fields.assignee;

    if (hasDescription && hasPoints) {
      metrics.readiness.ready++;
    } else if (hasDescription || hasPoints) {
      metrics.readiness.inProgress++;
    } else {
      metrics.readiness.needsRefinement++;
    }

    // Priority
    const priority = issue.fields.priority?.name.toLowerCase() || 'medium';
    if (priority.includes('highest')) metrics.byPriority.highest++;
    else if (priority.includes('high')) metrics.byPriority.high++;
    else if (priority.includes('lowest')) metrics.byPriority.lowest++;
    else if (priority.includes('low')) metrics.byPriority.low++;
    else metrics.byPriority.medium++;

    // Type
    const type = issue.fields.issuetype.name.toLowerCase();
    if (type.includes('story')) metrics.byType.story++;
    else if (type.includes('bug')) metrics.byType.bug++;
    else if (type.includes('task')) metrics.byType.task++;
    else if (type.includes('epic')) metrics.byType.epic++;
    else metrics.byType.other++;
  });

  // Calculate WIP story points
  wipIssues.forEach((issue) => {
    metrics.wipStoryPoints += issue.fields.customfield_10016 || 0;
  });

  return metrics;
};

export function useBacklogMetrics({
  productId,
  useMock = false,
}: UseBacklogMetricsOptions) {
  return useQuery<BacklogMetrics>({
    queryKey: ['governance', 'backlog', productId, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockBacklogData());
      }
      return fetchBacklogMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 5 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}
