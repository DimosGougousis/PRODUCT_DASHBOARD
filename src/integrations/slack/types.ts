// Slack Integration Types

export interface SlackConfig {
  workspaceId: string;
  workspaceName: string;
  botToken: string;
  userToken?: string;
  webhookUrl?: string;
  isConnected: boolean;
  connectedAt?: string;
  scopes: string[];
}

export interface SlackChannel {
  id: string;
  name: string;
  isPrivate: boolean;
  numMembers: number;
}

export interface SlackUser {
  id: string;
  name: string;
  realName: string;
  email?: string;
  avatarUrl?: string;
}

export interface SlackNotification {
  prdId: string;
  prdTitle: string;
  eventType: 'created' | 'updated' | 'status_changed' | 'stakeholder_assigned' | 'section_completed' | 'due_date_approaching' | 'blocker_detected';
  message: string;
  channelId?: string;
  userId?: string;
  timestamp?: string;
}

export interface SlackCommandRequest {
  command: string;
  text: string;
  userId: string;
  channelId: string;
  teamId: string;
  responseUrl: string;
  triggerId: string;
}

export interface SlackCommandResponse {
  text: string;
  blocks?: SlackBlock[];
  responseType?: 'ephemeral' | 'in_channel';
}

export interface SlackBlock {
  type: string;
  text?: {
    type: string;
    text: string;
  };
  elements?: SlackElement[];
  fields?: SlackField[];
}

export interface SlackElement {
  type: string;
  text?: string;
  actionId?: string;
  url?: string;
  value?: string;
}

export interface SlackField {
  type: string;
  text: string;
}

export interface SlackMessage {
  channel: string;
  text: string;
  blocks?: SlackBlock[];
  attachments?: SlackAttachment[];
  threadTs?: string;
}

export interface SlackAttachment {
  color: string;
  title: string;
  titleLink?: string;
  text?: string;
  fields?: Array<{
    title: string;
    value: string;
    short: boolean;
  }>;
  footer?: string;
  ts?: number;
}

export interface SlackEvent {
  type: string;
  event: {
    type: string;
    user?: string;
    channel?: string;
    text?: string;
    ts?: string;
    threadTs?: string;
  };
  teamId: string;
  eventId: string;
  eventTime: number;
}

export interface PRDSlackLink {
  prdId: string;
  channelId: string;
  threadTs?: string;
  messageTs?: string;
  createdAt: string;
}
