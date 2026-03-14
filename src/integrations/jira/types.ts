// Jira Integration Types

export interface JiraConfig {
  baseUrl: string;
  projectKey: string;
  authType: 'oauth' | 'api_token';
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: string;
  isConnected: boolean;
  lastSyncedAt?: string;
}

export interface JiraIssue {
  id: string;
  key: string;
  self: string;
  fields: {
    summary: string;
    description?: string;
    status: {
      name: string;
      id: string;
    };
    assignee?: {
      displayName: string;
      emailAddress: string;
    };
    priority?: {
      name: string;
    };
    issuetype: {
      name: string;
    };
    created: string;
    updated: string;
    customfield_10016?: number; // Story points
  };
}

export interface JiraProject {
  id: string;
  key: string;
  name: string;
}

export interface JiraStatus {
  id: string;
  name: string;
}

export interface JiraIssueType {
  id: string;
  name: string;
  description?: string;
}

export interface PRDJiraLink {
  prdId: string;
  prdSectionId?: string;
  jiraIssueKey: string;
  jiraIssueId: string;
  syncEnabled: boolean;
  lastSyncedAt?: string;
  createdAt: string;
}

export interface CreateJiraIssueRequest {
  projectKey: string;
  summary: string;
  description?: string;
  issueType: string;
  priority?: string;
  assignee?: string;
  labels?: string[];
  storyPoints?: number;
}

export interface JiraSyncStatus {
  prdId: string;
  jiraIssueKey: string;
  prdStatus: string;
  jiraStatus: string;
  lastSynced: string;
  syncDirection: 'prd_to_jira' | 'jira_to_prd' | 'bidirectional';
}

export interface JiraWebhookPayload {
  webhookEvent: string;
  issue: JiraIssue;
  changelog?: {
    items: Array<{
      field: string;
      fromString?: string;
      toString?: string;
    }>;
  };
}

// Sprint-related types for Governance Dashboard
export interface JiraSprint {
  id: number;
  name: string;
  state: 'active' | 'closed' | 'future';
  startDate?: string;
  endDate?: string;
  completeDate?: string;
  goal?: string;
}

export interface SprintMetrics {
  sprintId: number;
  sprintName: string;
  committed: number; // Story points at start
  completed: number; // Story points done
  inProgress: number;
  notStarted: number;
  startDate: string;
  endDate: string;
}

export interface BurndownData {
  sprintId: number;
  points: Array<{
    date: string;
    remaining: number;
    ideal: number;
  }>;
}

// Backlog-related types for Governance Dashboard
export interface BacklogIssue {
  id: string;
  key: string;
  summary: string;
  status: string;
  issueType: string;
  priority: string;
  created: string;
  updated: string;
  storyPoints?: number;
  assignee?: string;
  labels: string[];
  // Refinement fields
  hasDescription: boolean;
  hasAcceptanceCriteria: boolean;
  hasStoryPoints: boolean;
  hasAssignee: boolean;
  // Aging
  daysInBacklog: number;
  daysSinceLastUpdate: number;
}

export interface BacklogMetrics {
  totalIssues: number;
  totalStoryPoints: number;
  // Aging buckets
  aging: {
    fresh: number; // < 7 days
    aging: number; // 7-30 days
    stale: number; // > 30 days
  };
  // Readiness breakdown
  readiness: {
    ready: number; // Has description, AC, points
    needsRefinement: number; // Missing key fields
    inProgress: number; // Currently being refined
  };
  // Priority distribution
  byPriority: {
    highest: number;
    high: number;
    medium: number;
    low: number;
    lowest: number;
  };
  // Issue type distribution
  byType: {
    story: number;
    bug: number;
    task: number;
    epic: number;
    other: number;
  };
  // Trends
  issuesTrend: number[]; // Last 4 weeks
  velocityTrend: number[]; // Last 4 sprints
  // WIP limits
  wipIssues: number;
  wipStoryPoints: number;
}
