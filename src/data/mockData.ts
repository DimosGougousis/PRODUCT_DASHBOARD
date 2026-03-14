// Mock data utilities for development

import { PRD, PRDSection, Stakeholder, SectionType } from '../types';

export const SECTION_TYPES: Record<SectionType, { name: string; icon: string; description: string }> = {
  problem_statement: {
    name: 'Problem Statement',
    icon: '🎯',
    description: 'Define the user problem and desired outcome',
  },
  user_stories: {
    name: 'User Stories & Requirements',
    icon: '👥',
    description: 'User stories and functional requirements',
  },
  success_metrics: {
    name: 'Success Metrics & KPIs',
    icon: '📊',
    description: 'Measurable success criteria and KPIs',
  },
  technical_approach: {
    name: 'Technical Approach',
    icon: '🔧',
    description: 'Architecture and implementation approach',
  },
  dependencies_risks: {
    name: 'Dependencies & Risks',
    icon: '⚠️',
    description: 'Dependencies, risks, and mitigation strategies',
  },
  go_to_market: {
    name: 'Go-to-Market Plan',
    icon: '🚀',
    description: 'Launch strategy and marketing approach',
  },
  resource_estimation: {
    name: 'Resource Estimation',
    icon: '⏱️',
    description: 'Effort estimates and resource requirements',
  },
  legal_compliance: {
    name: 'Legal & Compliance',
    icon: '⚖️',
    description: 'Legal requirements and compliance considerations',
  },
};

export const mockStakeholders: Stakeholder[] = [
  {
    id: 'stakeholder-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@company.com',
    role: 'Engineering Lead, Payments',
    function: 'engineering',
    expertise: ['payment systems', 'checkout', 'integrations'],
    responseRate: 92,
    avgResponseTime: 1.2,
    qualityScore: 4.8,
    currentWorkload: 3,
    preferredContactMethod: 'slack',
  },
  {
    id: 'stakeholder-2',
    name: 'Jamie Park',
    email: 'jamie.park@company.com',
    role: 'Senior Product Analyst',
    function: 'analytics',
    expertise: ['user behavior', 'metrics', 'experimentation'],
    responseRate: 88,
    avgResponseTime: 0.9,
    qualityScore: 4.7,
    currentWorkload: 5,
    preferredContactMethod: 'email',
  },
  {
    id: 'stakeholder-3',
    name: 'Alex Rivera',
    email: 'alex.rivera@company.com',
    role: 'Lead Product Designer',
    function: 'design',
    expertise: ['UX research', 'mobile design', 'prototyping'],
    responseRate: 79,
    avgResponseTime: 1.5,
    qualityScore: 4.6,
    currentWorkload: 4,
    preferredContactMethod: 'slack',
  },
  {
    id: 'stakeholder-4',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@company.com',
    role: 'Security Engineer',
    function: 'security',
    expertise: ['application security', 'compliance', 'threat modeling'],
    responseRate: 61,
    avgResponseTime: 4.2,
    qualityScore: 4.5,
    currentWorkload: 8,
    preferredContactMethod: 'email',
  },
  {
    id: 'stakeholder-5',
    name: 'Lisa Wang',
    email: 'lisa.wang@company.com',
    role: 'Legal Counsel',
    function: 'legal',
    expertise: ['privacy law', 'contracts', 'compliance'],
    responseRate: 58,
    avgResponseTime: 4.8,
    qualityScore: 4.3,
    currentWorkload: 6,
    preferredContactMethod: 'email',
  },
  {
    id: 'stakeholder-6',
    name: 'Chris Martinez',
    email: 'chris.martinez@company.com',
    role: 'Product Marketing Manager',
    function: 'marketing',
    expertise: ['go-to-market', 'messaging', 'launch strategy'],
    responseRate: 65,
    avgResponseTime: 3.4,
    qualityScore: 4.1,
    currentWorkload: 7,
    preferredContactMethod: 'slack',
  },
];

export function createDefaultSections(prdId: string): PRDSection[] {
  return Object.entries(SECTION_TYPES).map(([type, info], index) => ({
    id: `section-${prdId}-${type}`,
    prdId,
    name: info.name,
    type: type as SectionType,
    content: '',
    status: 'not_started',
    completeness: 0,
    assignedStakeholders: [],
    lastUpdated: new Date().toISOString(),
    dependencies: [],
    blocks: [],
    order: index,
    icon: info.icon,
  }));
}

export const mockPRDs: PRD[] = [
  {
    id: 'prd-1',
    title: 'Promo Code Error Handling Enhancement',
    description: 'Improve promo code validation and error messaging to reduce checkout abandonment',
    status: 'research',
    progress: 35,
    owner: 'Alex Kim',
    ownerId: 'user-1',
    priority: 'P0',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-07T14:23:00Z',
    targetDate: '2026-01-17T00:00:00Z',
    template: 'enhancement',
    sections: [],
    tags: ['checkout', 'payments', 'mobile'],
    daysInProgress: 7,
  },
  {
    id: 'prd-2',
    title: 'User Dashboard Redesign',
    description: 'Modernize user dashboard with improved data visualization and personalization',
    status: 'waiting',
    progress: 62,
    owner: 'Taylor Swift',
    ownerId: 'user-2',
    priority: 'P1',
    createdAt: '2025-12-20T10:00:00Z',
    updatedAt: '2026-01-06T09:15:00Z',
    targetDate: '2026-02-01T00:00:00Z',
    template: 'feature',
    sections: [],
    tags: ['dashboard', 'UX', 'analytics'],
    daysInProgress: 18,
  },
  {
    id: 'prd-3',
    title: 'API Rate Limiting Infrastructure',
    description: 'Implement distributed rate limiting to protect API endpoints',
    status: 'review',
    progress: 88,
    owner: 'Morgan Lee',
    ownerId: 'user-3',
    priority: 'P1',
    createdAt: '2025-12-10T10:00:00Z',
    updatedAt: '2026-01-05T16:45:00Z',
    targetDate: '2026-01-15T00:00:00Z',
    template: 'technical',
    sections: [],
    tags: ['infrastructure', 'security', 'backend'],
    daysInProgress: 28,
  },
];

// Initialize sections for mock PRDs
mockPRDs.forEach(prd => {
  prd.sections = createDefaultSections(prd.id);
  
  // Add some sample content to first PRD
  if (prd.id === 'prd-1') {
    prd.sections[0].content = `## Problem Overview
User telemetry indicates that 35% of checkout attempts involving promo codes result in abandonment (vs. 18% baseline). Analysis of 1,247 support tickets over the past quarter reveals three primary failure modes:

1. **Invalid code entry** (48% of issues): Users apply expired or incorrect codes, receive generic error messages, and drop off rather than retry
2. **Code stacking confusion** (31%): Users attempt to apply multiple codes simultaneously, unaware that codes are mutually exclusive
3. **Mobile UX friction** (21%): Promo code field is hidden below fold on mobile

## Business Impact
- Estimated annual revenue loss: $2.3M
- Support cost: ~$45K/year for promo code-related tickets
- Brand perception: NPS drops 12 points for users who experience promo code failures`;
    prd.sections[0].status = 'complete';
    prd.sections[0].completeness = 95;
    
    prd.sections[2].content = `## Success Metrics
- Reduce promo code abandonment from 35% to <20%
- Decrease support tickets by 60%
- Improve mobile promo code usage by 40%

## KPIs
- Error rate for promo codes
- Time to apply promo code successfully
- Mobile vs desktop promo code usage ratio`;
    prd.sections[2].status = 'in_progress';
    prd.sections[2].completeness = 70;
    
    prd.sections[3].assignedStakeholders = [
      {
        stakeholderId: 'stakeholder-1',
        raciRole: 'responsible',
        status: 'in_progress',
        assignedAt: '2026-01-03T10:00:00Z',
        expectedContribution: ['Technical feasibility', 'Architecture approach', 'Effort estimate'],
        estimatedHours: 8,
        daysAssigned: 4,
      },
      {
        stakeholderId: 'stakeholder-4',
        raciRole: 'consulted',
        status: 'not_started',
        assignedAt: '2026-01-05T14:00:00Z',
        expectedContribution: ['Security review', 'Validation rules'],
        estimatedHours: 3,
        daysAssigned: 2,
      },
    ];
  }
});

export function getStakeholderById(id: string): Stakeholder | undefined {
  return mockStakeholders.find(s => s.id === id);
}

export function calculateSectionCompleteness(content: string): number {
  if (!content || content.trim().length === 0) return 0;
  const wordCount = content.split(/\s+/).length;
  const targetWords = 200;
  return Math.min(100, Math.round((wordCount / targetWords) * 100));
}

export function calculatePRDProgress(sections: PRDSection[]): number {
  if (sections.length === 0) return 0;
  const totalCompleteness = sections.reduce((sum, section) => sum + section.completeness, 0);
  return Math.round(totalCompleteness / sections.length);
}
