/**
 * Customer Metrics Types
 */

export interface NPSData {
  score: number; // -100 to 100
  promoters: number; // 9-10 ratings
  passives: number; // 7-8 ratings
  detractors: number; // 0-6 ratings
  totalResponses: number;
  trend: number[]; // Last 6 months
}

export interface CSATData {
  score: number; // 0-100
  satisfied: number; // 4-5 ratings
  neutral: number; // 3 ratings
  dissatisfied: number; // 1-2 ratings
  totalResponses: number;
  trend: number[]; // Last 6 months
}

export interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: string;
  resolvedAt?: string;
  category: string;
  satisfaction?: number; // 1-5 rating
}

export interface SupportMetrics {
  totalTickets: number;
  openTickets: number;
  resolvedThisWeek: number;
  avgResolutionTime: number; // hours
  avgSatisfaction: number; // 1-5
  ticketsByCategory: {
    bug: number;
    feature: number;
    question: number;
    other: number;
  };
  ticketsByPriority: {
    urgent: number;
    high: number;
    medium: number;
    low: number;
  };
  trend: number[]; // Last 4 weeks
}

export interface CustomerMetrics {
  nps: NPSData;
  csat: CSATData;
  support: SupportMetrics;
  // Feature adoption
  featureAdoption: {
    feature: string;
    users: number;
    percentage: number;
  }[];
}
