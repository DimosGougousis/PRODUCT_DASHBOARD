// PRD Template Types and Configurations

export type PRDTemplateType = 'feature' | 'technical' | 'enhancement';

export interface PRDTemplate {
  id: string;
  type: PRDTemplateType;
  name: string;
  description: string;
  icon: string;
  questions: TemplateQuestion[];
  sections: TemplateSectionConfig[];
  autoTasks: AutoTaskConfig[];
}

export interface TemplateQuestion {
  id: string;
  step: number;
  question: string;
  description?: string;
  fieldType: 'text' | 'textarea' | 'select' | 'multiselect' | 'date' | 'number';
  options?: string[];
  required: boolean;
  placeholder?: string;
  mapsToSection?: string;
}

export interface TemplateSectionConfig {
  name: string;
  required: boolean;
  defaultContent?: string;
  aiPrompt?: string;
}

export interface AutoTaskConfig {
  title: string;
  description: string;
  status: 'backlog' | 'in-progress' | 'review' | 'blocked' | 'complete';
  assignToSection?: string;
  estimatedDays?: number;
}

// Feature PRD Template
export const FEATURE_PRD_TEMPLATE: PRDTemplate = {
  id: 'feature-template',
  type: 'feature',
  name: 'Feature PRD',
  description: 'For new user-facing features and product capabilities',
  icon: '✨',
  questions: [
    {
      id: 'feature-name',
      step: 1,
      question: 'What is the feature name?',
      description: 'Give your feature a clear, concise name',
      fieldType: 'text',
      required: true,
      placeholder: 'e.g., Smart Search with Filters',
      mapsToSection: 'Overview',
    },
    {
      id: 'problem-statement',
      step: 2,
      question: 'What problem does this solve?',
      description: 'Describe the user pain point or business need',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Users currently struggle to find relevant content because...',
      mapsToSection: 'Problem Statement',
    },
    {
      id: 'target-users',
      step: 3,
      question: 'Who are the target users?',
      description: 'Which user segments will benefit most?',
      fieldType: 'multiselect',
      options: ['All users', 'Premium users', 'Enterprise users', 'Admins', 'Power users', 'New users'],
      required: true,
      mapsToSection: 'Target Users',
    },
    {
      id: 'success-metrics',
      step: 4,
      question: 'How will you measure success?',
      description: 'Define 2-3 key metrics',
      fieldType: 'textarea',
      required: true,
      placeholder: '1. Search usage increases by 40%\n2. Time to find content decreases by 30%\n3. User satisfaction score improves to 4.5/5',
      mapsToSection: 'Success Metrics',
    },
    {
      id: 'launch-date',
      step: 5,
      question: 'Target launch date?',
      description: 'When do you need this shipped?',
      fieldType: 'date',
      required: false,
      mapsToSection: 'Timeline',
    },
    {
      id: 'dependencies',
      step: 6,
      question: 'Any dependencies or blockers?',
      description: 'Other features, teams, or systems required',
      fieldType: 'textarea',
      required: false,
      placeholder: 'Requires new search index from Platform team...',
      mapsToSection: 'Dependencies',
    },
  ],
  sections: [
    { name: 'Overview', required: true },
    { name: 'Problem Statement', required: true },
    { name: 'Target Users', required: true },
    { name: 'User Stories', required: true, defaultContent: 'As a [user type], I want to [action] so that [benefit]' },
    { name: 'Success Metrics', required: true },
    { name: 'Technical Approach', required: false },
    { name: 'Timeline', required: true },
    { name: 'Dependencies', required: false },
  ],
  autoTasks: [
    {
      title: 'Conduct user research',
      description: 'Interview 5-10 users to validate problem statement',
      status: 'backlog',
      assignToSection: 'Problem Statement',
      estimatedDays: 5,
    },
    {
      title: 'Create design mocks',
      description: 'Work with design team to create UI mockups',
      status: 'backlog',
      assignToSection: 'User Stories',
      estimatedDays: 7,
    },
    {
      title: 'Technical feasibility review',
      description: 'Engineering to assess implementation approach',
      status: 'backlog',
      assignToSection: 'Technical Approach',
      estimatedDays: 3,
    },
    {
      title: 'Define success metrics',
      description: 'Work with analytics to set up tracking',
      status: 'backlog',
      assignToSection: 'Success Metrics',
      estimatedDays: 2,
    },
    {
      title: 'Stakeholder approval',
      description: 'Present PRD to leadership for sign-off',
      status: 'backlog',
      estimatedDays: 1,
    },
  ],
};

// Technical PRD Template
export const TECHNICAL_PRD_TEMPLATE: PRDTemplate = {
  id: 'technical-template',
  type: 'technical',
  name: 'Technical PRD',
  description: 'For infrastructure, architecture, and technical improvements',
  icon: '⚙️',
  questions: [
    {
      id: 'technical-initiative',
      step: 1,
      question: 'What is the technical initiative?',
      description: 'Name the technical project or improvement',
      fieldType: 'text',
      required: true,
      placeholder: 'e.g., Migrate to Microservices Architecture',
      mapsToSection: 'Overview',
    },
    {
      id: 'technical-problem',
      step: 2,
      question: 'What technical problem are you solving?',
      description: 'Describe the current technical debt or limitation',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Current monolithic architecture causes deployment bottlenecks...',
      mapsToSection: 'Problem Statement',
    },
    {
      id: 'current-system',
      step: 3,
      question: 'Describe the current system',
      description: 'How does it work today?',
      fieldType: 'textarea',
      required: true,
      mapsToSection: 'Current State',
    },
    {
      id: 'proposed-solution',
      step: 4,
      question: 'What is the proposed solution?',
      description: 'High-level technical approach',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Break monolith into 5 microservices: Auth, User, Content, Search, Analytics...',
      mapsToSection: 'Technical Approach',
    },
    {
      id: 'performance-impact',
      step: 5,
      question: 'Expected performance impact?',
      description: 'Latency, throughput, reliability improvements',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Reduce API latency from 500ms to 100ms\nImprove uptime from 99.5% to 99.9%',
      mapsToSection: 'Success Metrics',
    },
    {
      id: 'migration-strategy',
      step: 6,
      question: 'How will you migrate?',
      description: 'Rollout plan and rollback strategy',
      fieldType: 'textarea',
      required: true,
      mapsToSection: 'Implementation Plan',
    },
  ],
  sections: [
    { name: 'Overview', required: true },
    { name: 'Problem Statement', required: true },
    { name: 'Current State', required: true },
    { name: 'Technical Approach', required: true },
    { name: 'Architecture Diagram', required: false, defaultContent: '[Attach architecture diagram]' },
    { name: 'Implementation Plan', required: true },
    { name: 'Success Metrics', required: true },
    { name: 'Risks & Mitigation', required: true },
  ],
  autoTasks: [
    {
      title: 'Create technical design doc',
      description: 'Detailed architecture and system design',
      status: 'backlog',
      assignToSection: 'Technical Approach',
      estimatedDays: 5,
    },
    {
      title: 'Proof of concept',
      description: 'Build POC to validate approach',
      status: 'backlog',
      assignToSection: 'Technical Approach',
      estimatedDays: 10,
    },
    {
      title: 'Performance benchmarking',
      description: 'Test performance in staging environment',
      status: 'backlog',
      assignToSection: 'Success Metrics',
      estimatedDays: 3,
    },
    {
      title: 'Create migration runbook',
      description: 'Document step-by-step migration process',
      status: 'backlog',
      assignToSection: 'Implementation Plan',
      estimatedDays: 3,
    },
    {
      title: 'Security review',
      description: 'Security team review of new architecture',
      status: 'backlog',
      estimatedDays: 2,
    },
  ],
};

// Enhancement PRD Template
export const ENHANCEMENT_PRD_TEMPLATE: PRDTemplate = {
  id: 'enhancement-template',
  type: 'enhancement',
  name: 'Enhancement PRD',
  description: 'For improvements to existing features',
  icon: '🚀',
  questions: [
    {
      id: 'enhancement-name',
      step: 1,
      question: 'What are you enhancing?',
      description: 'Name the existing feature being improved',
      fieldType: 'text',
      required: true,
      placeholder: 'e.g., Dashboard Performance',
      mapsToSection: 'Overview',
    },
    {
      id: 'current-issue',
      step: 2,
      question: 'What is the current issue or limitation?',
      description: 'Why does this need enhancement?',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Dashboard takes 8 seconds to load, users complain about slowness...',
      mapsToSection: 'Problem Statement',
    },
    {
      id: 'user-impact',
      step: 3,
      question: 'How many users are affected?',
      description: 'Scope of impact',
      fieldType: 'select',
      options: ['<100 users', '100-1,000 users', '1,000-10,000 users', '10,000+ users', 'All users'],
      required: true,
      mapsToSection: 'Impact Analysis',
    },
    {
      id: 'proposed-improvements',
      step: 4,
      question: 'What improvements are you proposing?',
      description: 'List specific enhancements',
      fieldType: 'textarea',
      required: true,
      placeholder: '1. Implement caching\n2. Lazy load widgets\n3. Reduce API calls',
      mapsToSection: 'Proposed Changes',
    },
    {
      id: 'backward-compatibility',
      step: 5,
      question: 'Will this break existing functionality?',
      description: 'Backward compatibility considerations',
      fieldType: 'select',
      options: ['Fully backward compatible', 'Minor breaking changes', 'Major breaking changes'],
      required: true,
      mapsToSection: 'Technical Approach',
    },
    {
      id: 'success-criteria',
      step: 6,
      question: 'What does success look like?',
      description: 'Quantifiable improvements',
      fieldType: 'textarea',
      required: true,
      placeholder: 'Dashboard load time < 2 seconds\n90% of users see improvement',
      mapsToSection: 'Success Metrics',
    },
  ],
  sections: [
    { name: 'Overview', required: true },
    { name: 'Problem Statement', required: true },
    { name: 'Impact Analysis', required: true },
    { name: 'Proposed Changes', required: true },
    { name: 'Technical Approach', required: true },
    { name: 'Success Metrics', required: true },
    { name: 'Timeline', required: true },
    { name: 'Rollout Plan', required: false },
  ],
  autoTasks: [
    {
      title: 'Analyze current metrics',
      description: 'Gather baseline performance data',
      status: 'backlog',
      assignToSection: 'Problem Statement',
      estimatedDays: 2,
    },
    {
      title: 'Identify optimization opportunities',
      description: 'Profile and find bottlenecks',
      status: 'backlog',
      assignToSection: 'Proposed Changes',
      estimatedDays: 3,
    },
    {
      title: 'Implement improvements',
      description: 'Code changes for enhancements',
      status: 'backlog',
      assignToSection: 'Technical Approach',
      estimatedDays: 10,
    },
    {
      title: 'A/B testing setup',
      description: 'Test improvements with subset of users',
      status: 'backlog',
      assignToSection: 'Rollout Plan',
      estimatedDays: 3,
    },
    {
      title: 'Measure impact',
      description: 'Track metrics post-launch',
      status: 'backlog',
      assignToSection: 'Success Metrics',
      estimatedDays: 5,
    },
  ],
};

export const PRD_TEMPLATES: Record<PRDTemplateType, PRDTemplate> = {
  feature: FEATURE_PRD_TEMPLATE,
  technical: TECHNICAL_PRD_TEMPLATE,
  enhancement: ENHANCEMENT_PRD_TEMPLATE,
};
