import { SlackConfig, SlackMessage, SlackChannel, SlackUser, SlackCommandResponse } from './types';

class SlackClient {
  private config: SlackConfig | null = null;

  constructor(config?: SlackConfig) {
    if (config) {
      this.config = config;
    }
  }

  setConfig(config: SlackConfig) {
    this.config = config;
  }

  private getHeaders(): HeadersInit {
    if (!this.config) {
      throw new Error('Slack not configured');
    }

    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.config.botToken}`,
    };
  }

  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    if (!this.config) {
      throw new Error('Slack not configured');
    }

    const url = `https://slack.com/api/${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options?.headers,
      },
    });

    const data = await response.json();

    if (!data.ok) {
      throw new Error(`Slack API error: ${data.error}`);
    }

    return data;
  }

  // Test connection
  async testConnection(): Promise<boolean> {
    try {
      await this.request('auth.test');
      return true;
    } catch {
      return false;
    }
  }

  // Get bot info
  async getBotInfo() {
    return this.request('auth.test');
  }

  // Get channels
  async getChannels(): Promise<SlackChannel[]> {
    const response = await this.request<{ channels: SlackChannel[] }>('conversations.list', {
      method: 'POST',
      body: JSON.stringify({
        types: 'public_channel,private_channel',
        exclude_archived: true,
      }),
    });
    return response.channels;
  }

  // Get users
  async getUsers(): Promise<SlackUser[]> {
    const response = await this.request<{ members: SlackUser[] }>('users.list');
    return response.members.filter(u => !u.deleted);
  }

  // Send message
  async sendMessage(message: SlackMessage): Promise<{ ts: string; channel: string }> {
    const response = await this.request<{
      ts: string;
      channel: string;
    }>('chat.postMessage', {
      method: 'POST',
      body: JSON.stringify({
        channel: message.channel,
        text: message.text,
        blocks: message.blocks,
        attachments: message.attachments,
        thread_ts: message.threadTs,
        unfurl_links: true,
        unfurl_media: true,
      }),
    });
    return response;
  }

  // Send notification for PRD event
  async sendPRDNotification(
    channelId: string,
    eventType: string,
    prdTitle: string,
    prdId: string,
    prdUrl: string,
    details?: Record<string, string>
  ): Promise<string> {
    const colorMap: Record<string, string> = {
      created: '#36a64f',
      updated: '#2196f3',
      status_changed: '#ff9800',
      stakeholder_assigned: '#9c27b0',
      section_completed: '#4caf50',
      due_date_approaching: '#f44336',
      blocker_detected: '#ff5722',
    };

    const titleMap: Record<string, string> = {
      created: '📝 New PRD Created',
      updated: '✏️ PRD Updated',
      status_changed: '🔄 Status Changed',
      stakeholder_assigned: '👤 Stakeholder Assigned',
      section_completed: '✅ Section Completed',
      due_date_approaching: '⏰ Due Date Approaching',
      blocker_detected: '🚨 Blocker Detected',
    };

    const fields = details ? Object.entries(details).map(([title, value]) => ({
      title,
      value,
      short: true,
    })) : [];

    const message: SlackMessage = {
      channel: channelId,
      text: `${titleMap[eventType]}: ${prdTitle}`,
      attachments: [{
        color: colorMap[eventType] || '#2196f3',
        title: prdTitle,
        title_link: prdUrl,
        text: `View PRD: ${prdUrl}`,
        fields,
        footer: 'PRD Kanban',
        ts: Date.now() / 1000,
      }],
    };

    const response = await this.sendMessage(message);
    return response.ts;
  }

  // Update message
  async updateMessage(channel: string, ts: string, text: string, blocks?: SlackBlock[]): Promise<void> {
    await this.request('chat.update', {
      method: 'POST',
      body: JSON.stringify({
        channel,
        ts,
        text,
        blocks,
      }),
    });
  }

  // Delete message
  async deleteMessage(channel: string, ts: string): Promise<void> {
    await this.request('chat.delete', {
      method: 'POST',
      body: JSON.stringify({
        channel,
        ts,
      }),
    });
  }

  // Handle slash commands
  async handleCommand(command: string, text: string, userId: string, channelId: string): Promise<SlackCommandResponse> {
    const args = text.trim().split(' ');
    
    switch (command) {
      case '/prd':
        return this.handlePRDCommand(args, userId, channelId);
      case '/prd-status':
        return this.handleStatusCommand(args, userId);
      case '/prd-create':
        return this.handleCreateCommand(args, userId, channelId);
      default:
        return {
          text: 'Unknown command. Try: /prd, /prd-status, /prd-create',
          responseType: 'ephemeral',
        };
    }
  }

  private async handlePRDCommand(args: string[], userId: string, channelId: string): Promise<SlackCommandResponse> {
    const subcommand = args[0];
    
    switch (subcommand) {
      case 'create':
        return {
          text: 'Create a new PRD',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Create New PRD*\nClick the button below to create a new PRD:',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Create PRD',
                    emoji: true,
                  },
                  url: `${window.location.origin}/prds`,
                  action_id: 'create_prd',
                },
              ],
            },
          ],
          responseType: 'ephemeral',
        };
      
      case 'list':
        return {
          text: 'Your PRDs',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*Your PRDs*\nView all your PRDs:',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'View PRDs',
                    emoji: true,
                  },
                  url: `${window.location.origin}/prds`,
                  action_id: 'view_prds',
                },
              ],
            },
          ],
          responseType: 'ephemeral',
        };
      
      case 'status':
        return {
          text: 'Check PRD status',
          blocks: [
            {
              type: 'section',
              text: {
                type: 'mrkdwn',
                text: '*PRD Status*\nOpen the dashboard to check PRD status:',
              },
            },
            {
              type: 'actions',
              elements: [
                {
                  type: 'button',
                  text: {
                    type: 'plain_text',
                    text: 'Open Dashboard',
                    emoji: true,
                  },
                  url: `${window.location.origin}/`,
                  action_id: 'open_dashboard',
                },
              ],
            },
          ],
          responseType: 'ephemeral',
        };
      
      default:
        return {
          text: 'Available commands:\n• `/prd create` - Create a new PRD\n• `/prd list` - List your PRDs\n• `/prd status` - Check PRD status',
          responseType: 'ephemeral',
        };
    }
  }

  private async handleStatusCommand(args: string[], userId: string): Promise<SlackCommandResponse> {
    return {
      text: 'PRD Status Dashboard',
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: '*PRD Status Dashboard*\nView the current status of all PRDs:',
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'View Dashboard',
                emoji: true,
              },
              url: `${window.location.origin}/`,
              action_id: 'view_dashboard',
            },
          ],
        },
      ],
      responseType: 'ephemeral',
    };
  }

  private async handleCreateCommand(args: string[], userId: string, channelId: string): Promise<SlackCommandResponse> {
    const prdName = args.join(' ');
    
    if (!prdName) {
      return {
        text: 'Please provide a PRD name. Example: `/prd-create New Feature PRD`',
        responseType: 'ephemeral',
      };
    }

    return {
      text: `Creating PRD: ${prdName}`,
      blocks: [
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Creating PRD: ${prdName}*\nClick below to create and configure your PRD:`,
          },
        },
        {
          type: 'actions',
          elements: [
            {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Create PRD',
                emoji: true,
              },
              url: `${window.location.origin}/prds`,
              action_id: 'create_prd',
            },
          ],
        },
      ],
      responseType: 'ephemeral',
    };
  }
}

export const slackClient = new SlackClient();
export default SlackClient;
