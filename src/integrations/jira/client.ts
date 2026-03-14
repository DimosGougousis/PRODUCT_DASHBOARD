import { JiraConfig, JiraIssue, CreateJiraIssueRequest, JiraProject, JiraIssueType, PRDJiraLink } from './types';

const JIRA_API_VERSION = '3';

class JiraClient {
  private config: JiraConfig | null = null;

  constructor(config?: JiraConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: JiraConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('Jira not configured');
    }

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    if (this.config.authType === 'oauth' && this.config.accessToken) {
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    } else if (this.config.authType === 'api_token') {
      // For API token, we'd need username:token base64 encoded
      // This is a simplified version
      headers['Authorization'] = `Bearer ${this.config.accessToken}`;
    }

    return headers;
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!this.config) {
      throw new Error('Jira not configured');
    }

    const url = `${this.config.baseUrl}/rest/api/${JIRA_API_VERSION}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Jira API error: ${response.status} - ${error}`);
    }

    return response.json();
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.request('/myself');
      return true;
    } catch {
      return false;
    }
  }

  // Get current user
  async getCurrentUser() {
    return this.request('/myself');
  }

  // Get projects
  async getProjects(): Promise<JiraProject[]> {
    const response = await this.request<{ values: JiraProject[] }>('/project/search');
    return response.values;
  }

  // Get issue types for a project
  async getIssueTypes(projectKey: string): Promise<JiraIssueType[]> {
    const response = await this.request<{ values: JiraIssueType[] }>(`/project/${projectKey}/statuses`);
    return response.values;
  }

  // Create issue
  async createIssue(issueData: CreateJiraIssueRequest): Promise<JiraIssue> {
    const body = {
      fields: {
        project: {
          key: issueData.projectKey,
        },
        summary: issueData.summary,
        description: issueData.description ? {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: issueData.description,
                },
              ],
            },
          ],
        } : undefined,
        issuetype: {
          name: issueData.issueType,
        },
        priority: issueData.priority ? {
          name: issueData.priority,
        } : undefined,
        assignee: issueData.assignee ? {
          id: issueData.assignee,
        } : undefined,
        labels: issueData.labels,
        customfield_10016: issueData.storyPoints,
      },
    };

    return this.request('/issue', {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  // Get issue by key
  async getIssue(issueKey: string): Promise<JiraIssue> {
    return this.request(`/issue/${issueKey}`);
  }

  // Update issue
  async updateIssue(issueKey: string, updates: Partial<JiraIssue['fields']>): Promise<void> {
    const body: { fields: Record<string, unknown> } = { fields: {} };
    
    if (updates.summary) body.fields.summary = updates.summary;
    if (updates.description) {
      body.fields.description = {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: updates.description,
              },
            ],
          },
        ],
      };
    }
    if (updates.status) {
      // Status updates require transitions
      // This is simplified - real implementation would need transition IDs
      body.fields.status = updates.status;
    }

    await this.request(`/issue/${issueKey}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  // Get issue transitions
  async getTransitions(issueKey: string) {
    const response = await this.request<{ transitions: Array<{ id: string; name: string }> }>(`/issue/${issueKey}/transitions`);
    return response.transitions;
  }

  // Transition issue
  async transitionIssue(issueKey: string, transitionId: string): Promise<void> {
    await this.request(`/issue/${issueKey}/transitions`, {
      method: 'POST',
      body: JSON.stringify({
        transition: {
          id: transitionId,
        },
      }),
    });
  }

  // Search issues with JQL - enhanced for sprint queries
  async searchIssues(jql: string, maxResults = 50, fields?: string[]): Promise<JiraIssue[]> {
    const fieldParam = fields ? `&fields=${fields.join(',')}` : '';
    const response = await this.request<{ issues: JiraIssue[] }>(`/search?jql=${encodeURIComponent(jql)}&maxResults=${maxResults}${fieldParam}`);
    return response.issues;
  }

  // Get all sprints for a board (Agile API)
  async getSprints(boardId: number, state: 'active' | 'future' | 'closed' = 'active'): Promise<Array<{ id: number; name: string; state: string; startDate?: string; endDate?: string }>> {
    const response = await this.request<{ values: Array<{ id: number; name: string; state: string; startDate?: string; endDate?: string }> }>(`/board/${boardId}/sprint?state=${state}`);
    return response.values;
  }

  // Get sprint issues with story points (Agile API)
  async getSprintIssues(sprintId: number, fields?: string[]): Promise<JiraIssue[]> {
    const fieldParam = fields ? `?fields=${fields.join(',')}` : '';
    const response = await this.request<{ issues: JiraIssue[] }>(`/sprint/${sprintId}/issue${fieldParam}`);
    return response.issues;
  }

  // Get boards for a project
  async getBoards(projectKey: string): Promise<Array<{ id: number; name: string; type: string }>> {
    const response = await this.request<{ values: Array<{ id: number; name: string; type: string }> }>(`/board?projectKeyOrId=${projectKey}`);
    return response.values;
  }

  // Add comment to issue
  async addComment(issueKey: string, comment: string): Promise<void> {
    await this.request(`/issue/${issueKey}/comment`, {
      method: 'POST',
      body: JSON.stringify({
        body: {
          type: 'doc',
          version: 1,
          content: [
            {
              type: 'paragraph',
              content: [
                {
                  type: 'text',
                  text: comment,
                },
              ],
            },
          ],
        },
      }),
    });
  }

  // Get backlog issues (issues not in any sprint)
  async getBacklogIssues(projectKey: string, fields?: string[]): Promise<JiraIssue[]> {
    const jql = `project = ${projectKey} AND sprint is EMPTY AND status != Done ORDER BY created DESC`;
    const fieldParam = fields ? `&fields=${fields.join(',')}` : '';
    const response = await this.request<{ issues: JiraIssue[] }>(
      `/search?jql=${encodeURIComponent(jql)}&maxResults=100${fieldParam}`
    );
    return response.issues;
  }

  // Get all issues in a project (for metrics)
  async getProjectIssues(
    projectKey: string,
    status?: string[],
    fields?: string[]
  ): Promise<JiraIssue[]> {
    let jql = `project = ${projectKey}`;
    if (status && status.length > 0) {
      jql += ` AND status IN (${status.map((s) => `"${s}"`).join(',')})`;
    }
    jql += ' ORDER BY updated DESC';

    const fieldParam = fields ? `&fields=${fields.join(',')}` : '';
    const response = await this.request<{ issues: JiraIssue[] }>(
      `/search?jql=${encodeURIComponent(jql)}&maxResults=200${fieldParam}`
    );
    return response.issues;
  }

  // Get issue changelog (for aging calculations)
  async getIssueChangelog(issueKey: string): Promise<Array<{
    id: string;
    created: string;
    items: Array<{
      field: string;
      fromString?: string;
      toString?: string;
    }>;
  }>> {
    const response = await this.request<{
      values: Array<{
        id: string;
        created: string;
        items: Array<{
          field: string;
          fromString?: string;
          toString?: string;
        }>;
      }>;
    }>(`/issue/${issueKey}/changelog`);
    return response.values;
  }
}

export const jiraClient = new JiraClient();
export default JiraClient;
