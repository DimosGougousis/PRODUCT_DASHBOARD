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

export interface SprintVelocityItem {
  name: string;
  committed: number;
  completed: number;
  startDate: Date;
}

export interface BurndownPoint {
  date: Date;
  remaining: number;
  ideal: number;
}

export interface VelocityTrend {
  average: number;
  trend: 'up' | 'down' | 'stable';
  changePercent: number;
  sprints: SprintVelocityItem[];
}

export interface SprintProgress {
  percentage: number;
  completed: number;
  total: number;
  remaining: number;
}

export interface SprintInfo {
  sprintName: string;
  daysRemaining: number;
  progress: SprintProgress;
  goal?: string;
  startDate: string;
  endDate: string;
}

export interface DeliveryMetrics {
  velocityTrend: VelocityTrend;
  burndown: BurndownPoint[];
  sprint: SprintInfo;
  leadTimeDays: number;
  cycleTimeDays: number;
}

interface UseDeliveryMetricsOptions {
  productId?: string | null; // JIRA project key
  boardId?: number;
  sprintCount?: number;
  useMock?: boolean; // Enable mock data for demo
}

// Generate project-specific mock data
function generateMockData(sprintCount: number, projectKey: string = 'PROJ'): DeliveryMetrics {
  const today = new Date();
  const sprintLength = 14; // days
  
  // Project-specific configurations
  const projectConfigs: Record<string, { baseVelocity: number; sprintGoal: string; leadTime: number }> = {
    'PROJ': { baseVelocity: 45, sprintGoal: 'Complete user authentication flow and payment integration', leadTime: 8 },
    'PAY': { baseVelocity: 38, sprintGoal: 'Implement PCI-compliant payment processing', leadTime: 6 },
    'AUTH': { baseVelocity: 42, sprintGoal: 'Deploy OAuth2 SSO integration', leadTime: 7 },
    'DASH': { baseVelocity: 52, sprintGoal: 'Release new analytics dashboard v2', leadTime: 5 },
  };
  
  const config = projectConfigs[projectKey] || projectConfigs['PROJ'];
  
  // Generate velocity trend (last N sprints)
  const sprints: SprintVelocityItem[] = Array.from({ length: sprintCount }, (_, i) => {
    const sprintDate = new Date(today);
    sprintDate.setDate(sprintDate.getDate() - (i + 1) * sprintLength);
    
    // Simulate some variance in velocity based on project
    const variance = Math.floor(Math.random() * 20) - 10;
    const committed = config.baseVelocity + Math.floor(Math.random() * 15);
    const completed = Math.max(0, Math.min(committed, config.baseVelocity + variance));
    
    return {
      name: `Sprint ${25 - i}`,
      committed,
      completed,
      startDate: sprintDate,
    };
  });
  
  // Calculate velocity trend
  const velocities = sprints.map(s => s.completed);
  const average = Math.round(velocities.reduce((a, b) => a + b, 0) / velocities.length);
  const lastVelocity = velocities[0];
  const prevVelocity = velocities[1] || lastVelocity;
  const changePercent = prevVelocity > 0 ? Math.round(((lastVelocity - prevVelocity) / prevVelocity) * 100) : 0;
  const trend: 'up' | 'down' | 'stable' = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable';
  
  // Generate active sprint burndown
  const sprintStart = new Date(today);
  sprintStart.setDate(sprintStart.getDate() - 5); // 5 days into sprint
  const sprintEnd = new Date(sprintStart);
  sprintEnd.setDate(sprintEnd.getDate() + sprintLength);
  
  const totalPoints = Math.round(config.baseVelocity * 1.1);
  const daysElapsed = 5;
  const daysRemaining = sprintLength - daysElapsed;
  const completedPoints = Math.round(totalPoints * 0.6); // 60% done
  const remainingPoints = totalPoints - completedPoints;
  
  const burndown: BurndownPoint[] = Array.from({ length: daysElapsed + 1 }, (_, i) => {
    const date = new Date(sprintStart);
    date.setDate(date.getDate() + i);
    
    // Ideal burndown
    const ideal = totalPoints * (1 - i / sprintLength);
    
    // Actual burndown (slightly behind ideal)
    const progressRatio = i / daysElapsed;
    const actualCompleted = completedPoints * progressRatio;
    const remaining = Math.max(0, totalPoints - actualCompleted);
    
    return {
      date,
      remaining: Math.round(remaining),
      ideal: Math.round(ideal),
    };
  });
  
  return {
    velocityTrend: {
      average,
      trend,
      changePercent,
      sprints,
    },
    burndown,
    sprint: {
      sprintName: 'Sprint 25',
      daysRemaining,
      progress: {
        percentage: Math.round((completedPoints / totalPoints) * 100),
        completed: completedPoints,
        total: totalPoints,
        remaining: remainingPoints,
      },
      goal: config.sprintGoal,
      startDate: sprintStart.toISOString(),
      endDate: sprintEnd.toISOString(),
    },
    leadTimeDays: config.leadTime,
    cycleTimeDays: Math.round(config.leadTime * 0.6),
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
  const sprints: SprintVelocityItem[] = await Promise.all(
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
        name: sprint.name,
        committed,
        completed,
        startDate: new Date(sprint.startDate || Date.now()),
      };
    })
  );
  
  // Calculate velocity trend
  const velocities = sprints.map(s => s.completed);
  const average = Math.round(velocities.reduce((a, b) => a + b, 0) / velocities.length);
  const lastVelocity = velocities[0] || 0;
  const prevVelocity = velocities[1] || lastVelocity;
  const changePercent = prevVelocity > 0 ? Math.round(((lastVelocity - prevVelocity) / prevVelocity) * 100) : 0;
  const trend: 'up' | 'down' | 'stable' = changePercent > 5 ? 'up' : changePercent < -5 ? 'down' : 'stable';
  
  // Get active sprint for burndown
  const activeSprints = await jiraClient.getSprints(boardId, 'active');
  const activeSprint = activeSprints[0] || null;
  
  let burndown: BurndownPoint[] = [];
  let sprint: SprintInfo = {
    sprintName: 'No Active Sprint',
    daysRemaining: 0,
    progress: { percentage: 0, completed: 0, total: 0, remaining: 0 },
    startDate: '',
    endDate: '',
  };
  
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
    const remainingPoints = totalPoints - completedPoints;
    
    // Generate burndown data (simplified - in real implementation, fetch historical data)
    const startDate = new Date(activeSprint.startDate || Date.now());
    const endDate = new Date(activeSprint.endDate || Date.now());
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const today = new Date();
    const daysElapsed = Math.max(1, Math.ceil((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
    const daysRemaining = Math.max(0, totalDays - daysElapsed);
    
    burndown = Array.from({ length: Math.min(daysElapsed + 1, totalDays + 1) }, (_, i) => {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Ideal burndown: linear from total to 0
      const ideal = totalPoints * (1 - i / totalDays);
      
      // Actual burndown: simplified calculation
      const progressRatio = i / daysElapsed;
      const actualCompleted = completedPoints * progressRatio;
      const remaining = totalPoints - actualCompleted;
      
      return {
        date,
        remaining: Math.max(0, remaining),
        ideal: Math.max(0, ideal),
      };
    });
    
    sprint = {
      sprintName: activeSprint.name,
      daysRemaining,
      progress: {
        percentage: totalPoints > 0 ? Math.round((completedPoints / totalPoints) * 100) : 0,
        completed: completedPoints,
        total: totalPoints,
        remaining: remainingPoints,
      },
      goal: activeSprint.goal,
      startDate: activeSprint.startDate || '',
      endDate: activeSprint.endDate || '',
    };
  }
  
  // Calculate lead time and cycle time (simplified)
  const leadTimeDays = 8;
  const cycleTimeDays = 5;
  
  return {
    velocityTrend: {
      average,
      trend,
      changePercent,
      sprints,
    },
    burndown,
    sprint,
    leadTimeDays,
    cycleTimeDays,
  };
};

export function useDeliveryMetrics({
  productId,
  boardId,
  sprintCount = 5,
  useMock = false,
}: UseDeliveryMetricsOptions) {
  return useQuery<DeliveryMetrics>({
    queryKey: ['governance', 'delivery', productId, boardId, sprintCount, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockData(sprintCount, productId || 'PROJ'));
      }
      return fetchDeliveryMetrics(productId!, sprintCount);
    },
    enabled: (!!productId || !!boardId) || useMock,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
