/**
 * Compliance Metrics Types
 */

export interface ComplianceFramework {
  id: string;
  name: string;
  description: string;
  status: 'compliant' | 'non_compliant' | 'in_progress' | 'not_applicable';
  lastAuditDate?: string;
  nextAuditDate?: string;
  score?: number; // 0-100
  findings: ComplianceFinding[];
}

export interface ComplianceFinding {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  category: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  assignedTo?: string;
  dueDate?: string;
  resolvedDate?: string;
}

export interface AuditTrail {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  details: string;
  ipAddress?: string;
}

export interface DataPrivacyMetrics {
  // GDPR/CCPA compliance
  dataSubjectRequests: {
    total: number;
    pending: number;
    completed: number;
    avgResponseTime: number; // days
  };
  dataRetention: {
    policiesDefined: number;
    policiesEnforced: number;
    violations: number;
  };
  consentManagement: {
    totalUsers: number;
    consented: number;
    withdrawn: number;
  };
}

export interface SecurityCompliance {
  // SOC 2, ISO 27001
  controls: {
    total: number;
    passed: number;
    failed: number;
    notTested: number;
  };
  penetrationTests: {
    lastTestDate?: string;
    nextTestDate?: string;
    findings: number;
    criticalFindings: number;
  };
  vulnerabilityScans: {
    lastScanDate?: string;
    vulnerabilities: number;
    critical: number;
    high: number;
  };
}

export interface ComplianceMetrics {
  frameworks: ComplianceFramework[];
  dataPrivacy: DataPrivacyMetrics;
  security: SecurityCompliance;
  auditTrail: {
    totalEvents: number;
    eventsThisMonth: number;
    suspiciousEvents: number;
  };
  overallScore: number; // 0-100
  lastAssessmentDate: string;
}
