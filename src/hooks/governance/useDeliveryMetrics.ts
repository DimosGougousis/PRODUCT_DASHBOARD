/**
 * useDeliveryMetrics Hook - Fetch delivery metrics from JIRA
 * 
 * Fetches sprint velocity, burndown, and goal progress from JIRA
 * Uses React Query for caching and automatic refetching
 */

import { useQuery } from '@tanstack/react-query';
import { jiraClient } from '@/integrations/jira/client';
import type { JiraSprint, SprintMetrics, BurndownData } from '@/integrations/jira/types';

// Story points custom field - may vary by JIRA instance
const STORY_POINTS_FIELD = 'customfield_10016';

export interface SprintVelocity {
  sprintName: string;
  committed: number;
  completed: number;
  startDate: Date;
}

export interface BurndownPoint {
  date: Date;
  remaining: number;
  ideal: number;
}

export interface DeliveryMetrics {
  velocityTrend: SprintVelocity[];
  activeBurndown: BurndownPoint[];
  sprintGoalProgress: number;
  leadTimeDays: number;
  cycleTimeDays: number;
  activeSprint: {
    id: number;
    name: string;
    goal?: string;
    startDate: string;
    endDate: string;
  } | null;
}

interface UseDeliveryMetricsOptions {
  productId: string | null; // JIRA project key
  sprintCount?: number;
  useMock?: boolean; // Enable mock data for demo
}

// Generate mock data for demonstration
function generateMockData(sprintCount: number): DeliveryMetrics {
  const today = new Date();
  const sprintLength = 14; // days
  
  // Generate velocity trend (last N sprints)
  const velocityTrend: SprintVelocity[] = Array.from({ length: sprintCount }, (_, i) => {
    const sprintDate = new Date(today);
    sprintDate.setDate(sprintDate.getDate() - (i + 1) * sprintLength);
    
    // Simulate some variance in velocity
    const baseVelocity = 45;
    const variance = Math.floor(Math.random() * 20) - 10;
    const committed = baseVelocity + Math.floor(Math.random() * 15);
    const completed = Math.max(0, Math.min(committed, baseVelocity + variance));
    
    return {
      sprintName: `Sprint ${24 - i}`,
      committed,
      completed,
      startDate: sprintDate,
    };
  });
  
  // Generate active sprint burndown
  const sprintStart = new Date(today);
  sprintStart.setDate(sprintStart.getDate() - 5); // 5 days into sprint
  const sprintEnd = new Date(sprintStart);
  sprintEnd.setDate(sprintEnd.getDate() + sprintLength);
  
  const totalPoints = 50;
  const daysElapsed = 5;
  
  const activeBurndown: BurndownPoint[] = Array.from({ length: daysElapsed + 1 }, (_, i) => {
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + i);
    
    // Ideal burndown
    const ideal = totalPoints * (1 - i / sprintLength);
    
    // Actual burndown (slightly behind ideal)
    const progressRatio = i / daysElapsed;
    const actualCompleted = (totalPoints * 0.6) * progressRatio; // 60% done so far
    const remaining = Math.max(0, totalPoints - actualCompleted);
    
    return {
      date,
      remaining: Math.round(remaining),
      ideal: Math.round(ideal),
    };
  });
  
  // Calculate current progress
  const currentRemaining = activeBurndown[activeBurndown.length - 1].remaining;
  const sprintGoalProgress = Math.round(((totalPoints - currentRemaining) / totalPoints) * 100);
  
  return {
    velocityTrend,
    activeBurndown,
    sprintGoalProgress,
    leadTimeDays: 8,
    cycleTimeDays: 5,
    activeSprint: {
      id: 123,
      name: 'Sprint 25',
      goal: 'Complete user authentication flow and payment integration',
      startDate: sprintStart.toISOString(),
      endDate: sprintEnd.toISOString(),
    },
  };
}

// Calculate story points from JIRA issues
function calculateStoryPoints(issues: Array<{ fields: Record<string, unknown> }>): number {
  return issues.reduce((total, issue) => {
    const points = issue.fields[STORY_POINTS_FIELD] as number | undefined;
    return total + (points || 0);
  }, 0);
}

// Fetch delivery metrics from JIRA
const fetchDeliveryMetrics = async (
  projectKey: string,
  sprintCount: number
): Promise<DeliveryMetrics> => {
  // Get boards for the project
  const boards = await jiraClient.getBoards(projectKey);
  if (boards.length === 0) {
    throw new Error(`No boards found for project ${projectKey}`);
  }
  
  const boardId = boards[0].id;
  
  // Get closed sprints for velocity calculation
  const closedSprints = await jiraClient.getSprints(boardId, 'closed');
  const recentSprints = closedSprints.slice(0, sprintCount);
  
  // Calculate velocity for each sprint
  const velocityTrend: SprintVelocity[] = await Promise.all(
    recentSprints.map(async (sprint) => {
      const issues = await jiraClient.getSprintIssues(sprint.id, [
        'summary',
        'status',
        STORY_POINTS_FIELD,
      ]);
      
      const committed = calculateStoryPoints(issues);
      const completedIssues = issues.filter(
        (issue) => issue.fields.status?.name === 'Done' || issue.fields.status?.name === 'Closed'
      );
      const completed = calculateStoryPoints(completedIssues);
      
      return {
        sprintName: sprint.name,
        committed,
        completed,
        startDate: new Date(sprint.startDate || Date.now()),
      };
    })
  );
  
  // Get active sprint for burndown
  const activeSprints = await jiraClient.getSprints(boardId, 'active');
  const activeSprint = activeSprints[0] || null;
  
  let activeBurndown: BurndownPoint[] = [];
  let sprintGoalProgress = 0;
  
  if (activeSprint) {
    // Get issues in active sprint
    const activeIssues = await jiraClient.getSprintIssues(activeSprint.id, [
      'summary',
      'status',
      STORY_POINTS_FIELD,
    ]);
    
    const totalPoints = calculateStoryPoints(activeIssues);
    const completedPoints = calculateStoryPoints(
      activeIssues.filter(
        (issue) => issue.fields.status?.name === 'Done' || issue.fields.status?.name === 'Closed'
      )
    );
    
    sprintGoalProgress = totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0;
    
    // Generate burndown data (simplified - in real implementation, fetch historical data)
    const startDate = new Date(activeSprint.startDate || Date.now());
    const endDate = new Date(activeSprint.endDate || Date.now());
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const today = new Date();
    const daysElapsed = Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    activeBurndown = Array.from({ length: Math.min(daysElapsed + 1, totalDays + 1) }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Ideal burndown: linear from total to 0
      const ideal = totalPoints * (1 - i / totalDays);
      
      // Actual burndown: simplified calculation
      // In real implementation, fetch historical snapshot data
      const progressRatio = i / daysElapsed;
      const actualCompleted = completedPoints * progressRatio;
      const remaining = totalPoints - actualCompleted;
      
      return {
        date,
        remaining: Math.max(0, remaining),
        ideal: Math.max(0, ideal),
      };
    });
  }
  
  // Calculate lead time and cycle time (simplified)
  // In real implementation, query issue changelog for status transitions
  const leadTimeDays = 0;
  const cycleTimeDays = 0;
  
  return {
    velocityTrend,
    activeBurndown,
    sprintGoalProgress,
    leadTimeDays,
    cycleTimeDays,
    activeSprint: activeSprint ? {
      id: activeSprint.id,
      name: activeSprint.name,
      goal: activeSprint.goal,
      startDate: activeSprint.startDate || '',
      endDate: activeSprint.endDate || '',
    } : null,
  };
};

export function useDeliveryMetrics({
  productId,
  sprintCount = 5,
  useMock = false,
}: UseDeliveryMetricsOptions) {
  return useQuery<DeliveryMetrics>({
    queryKey: ['governance', 'delivery', productId, sprintCount, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockData(sprintCount));
      }
      return fetchDeliveryMetrics(productId!, sprintCount);
    },
    enabled: !!productId || useMock,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
