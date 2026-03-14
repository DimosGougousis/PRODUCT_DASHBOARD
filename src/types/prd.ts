// Core Type Definitions for AI PM Agent

export type PRDStatus = 'backlog' | 'research' | 'waiting' | 'review' | 'complete' | 'archived';
export type SectionStatus = 'not_started' | 'in_progress' | 'review' | 'complete';
export type Priority = 'P0' | 'P1' | 'P2';
export type RACIRole = 'responsible' | 'accountable' | 'consulted' | 'informed';
export type StakeholderFunction = 'engineering' | 'design' | 'analytics' | 'marketing' | 'legal' | 'security' | 'finance' | 'product';
export type StakeholderStatus = 'not_started' | 'assigned' | 'contacted' | 'in_progress' | 'completed';
export type ConflictType = 'timeline' | 'technical' | 'resource' | 'assumption';
export type AlertSeverity = 'critical' | 'medium' | 'info';
export type PRDTemplateKind = 'feature' | 'enhancement' | 'technical';

export interface PRD {
  id: string;
  title: string;
  description: string;
  status: PRDStatus;
  progress: number;
  owner: string;
  ownerId: string;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  targetDate: string;
  template: PRDTemplateKind;
  sections: PRDSection[];
  tags: string[];
  daysInProgress: number;
  stakeholders?: string[];
  jiraIssueKey?: string;
  jiraIssueUrl?: string;
}

export interface SectionIntegrationLinks {
  jira?: string;
  slack?: string;
  github?: string;
  googleDrive?: string;
  confluence?: string;
}

export interface PRDSection {
  id: string;
  prdId: string;
  name: string;
  type: SectionType;
  content: string;
  status: SectionStatus;
  completeness: number;
  assignedStakeholders: StakeholderAssignment[];
  lastUpdated: string;
  dependencies: string[];
  blocks: string[];
  order: number;
  icon: string;
  integrationLinks?: SectionIntegrationLinks;
}

export type SectionType = 
  | 'problem_statement'
  | 'user_stories'
  | 'success_metrics'
  | 'technical_approach'
  | 'dependencies_risks'
  | 'go_to_market'
  | 'resource_estimation'
  | 'legal_compliance';

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  role: string;
  function: StakeholderFunction;
  avatar?: string;
  expertise: string[];
  responseRate: number;
  avgResponseTime: number;
  qualityScore: number;
  currentWorkload: number;
  preferredContactMethod: 'slack' | 'email' | 'in_person';
}

export interface StakeholderAssignment {
  stakeholderId: string;
  raciRole: RACIRole;
  status: StakeholderStatus;
  assignedAt: string;
  completedAt?: string;
  expectedContribution: string[];
  estimatedHours: number;
  daysAssigned: number;
}

export interface ContextPackage {
  overview: string;
  whatWeNeed: string[];
  backgroundResearch: string;
  timeCommitment: string;
  deadline: string;
  questions: Question[];
}

export interface Question {
  id: string;
  text: string;
  priority: Priority;
  answered: boolean;
  answer?: string;
}

export interface RACISuggestion {
  sectionId: string;
  suggestions: {
    responsible: StakeholderSuggestion[];
    accountable: StakeholderSuggestion[];
    consulted: StakeholderSuggestion[];
    informed: StakeholderSuggestion[];
  };
}

export interface StakeholderSuggestion {
  stakeholderId: string;
  stakeholder: Stakeholder;
  confidence: number;
  reasoning: string;
  expectedContribution: string[];
  estimatedHours: number;
}

export interface Recommendation {
  id: string;
  type: 'bottleneck' | 'parallel_work' | 'pattern_match' | 'risk' | 'optimization';
  title: string;
  description: string;
  impact: string;
  confidence: number;
  createdAt: string;
  applied: boolean;
  dismissed: boolean;
}

export interface Conflict {
  id: string;
  type: ConflictType;
  severity: AlertSeverity;
  title: string;
  description: string;
  affectedSections: string[];
  affectedStakeholders: string[];
}

// Orchestrator Multi-Agent Types
export interface SectionOrchestrator {
  sectionId: string;
  brainstorming: BrainstormingSession[];
  criteria: SectionCriteria[];
  agentInsights: AgentInsight[];
  consensus: Consensus | null;
}

export interface BrainstormingSession {
  id: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  timestamp: string;
  ideas: BrainstormingIdea[];
  status: 'active' | 'completed' | 'archived';
}

export interface BrainstormingIdea {
  id: string;
  content: string;
  category: 'requirement' | 'constraint' | 'assumption' | 'risk' | 'opportunity';
  confidence: number;
  votes: number;
  selected: boolean;
  rationale: string;
}

export interface SectionCriteria {
  id: string;
  category: 'functional' | 'technical' | 'business' | 'user_experience' | 'compliance';
  description: string;
  priority: Priority;
  acceptanceCriteria: string[];
  validationMethod: string;
  definedBy: string[];
  status: 'draft' | 'review' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface AgentInsight {
  id: string;
  agentId: string;
  agentName: string;
  agentAvatar: string;
  type: 'question' | 'suggestion' | 'concern' | 'validation';
  content: string;
  sectionReference?: string;
  timestamp: string;
  acknowledged: boolean;
  incorporated: boolean;
}

export interface Consensus {
  sectionId: string;
  summary: string;
  keyPoints: string[];
  agreedCriteria: string[];
  openQuestions: string[];
  nextSteps: string[];
  participants: string[];
  reachedAt: string;
  confidence: number;
  detectedAt: string;
  resolved: boolean;
  resolutionOptions: ConflictResolution[];
}

export interface ConflictResolution {
  id: string;
  title: string;
  description: string;
  pros: string[];
  cons: string[];
}

export interface Alert {
  id: string;
  severity: AlertSeverity;
  title: string;
  description: string;
  prdId?: string;
  sectionId?: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export interface MeetingBrief {
  stakeholder: Stakeholder;
  objective: string;
  duration: number;
  contextTheyKnow: string[];
  newInformation: string[];
  prioritizedQuestions: Question[];
  likelyConcerns: string[];
  successCriteria: string[];
}

export interface Pattern {
  id: string;
  name: string;
  description: string;
  prdCount: number;
  avgTimeline: number;
  successRate: number;
  commonStakeholders: StakeholderFunction[];
  typicalRequirements: string[];
}

export interface DashboardMetrics {
  prdsCreated: number;
  prdsCreatedChange: number;
  avgCycleTime: number;
  avgCycleTimeChange: number;
  pmTimeSaved: number;
  adoptionRate: number;
  agentPerformance: number;
  userSatisfaction: number;
  systemReliability: number;
  dataQuality: number;
}
