/**
 * useBacklogMetrics Hook - Fetch backlog health metrics
 */

import { useQuery } from '@tanstack/react-query';
import { jiraClient } from '@/integrations/jira/client';
import type { BacklogMetrics, BacklogIssue } from '@/integrations/jira/types';

interface UseBacklogMetricsOptions {
  productId: string | null;
  useMock?: boolean;
}

// Generate mock backlog data for demonstration
function generateMockBacklogData(): BacklogMetrics {
  return {
    totalIssues: 47,
    totalStoryPoints: 186,
    aging: {
      fresh: 12, // < 7 days
      aging: 23, // 7-30 days
      stale: 12, // > 30 days
    },
    readiness: {
      ready: 18,
      needsRefinement: 22,
      inProgress: 7,
    },
    byPriority: {
      highest: 3,
      high: 12,
      medium: 22,
      low: 8,
      lowest: 2,
    },
    byType: {
      story: 32,
      bug: 8,
      task: 5,
      epic: 2,
      other: 0,
    },
    issuesTrend: [42, 44, 45, 47],
    velocityTrend: [38, 42, 35, 40],
    wipIssues: 8,
    wipStoryPoints: 32,
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
