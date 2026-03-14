/**
 * useComplianceMetrics Hook - Fetch compliance and audit metrics
 */

import { useQuery } from '@tanstack/react-query';

export interface DataSubjectRequests {
  pending: number;
}

export interface DataPrivacy {
  dataSubjectRequests: DataSubjectRequests;
}

export interface SecurityFindings {
  open: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
}

export interface AuditStatus {
  daysSinceLastAudit: number;
  nextAuditDate: string;
}

export interface ComplianceFramework {
  name: string;
  status: 'compliant' | 'partial' | 'non_compliant';
  score: number;
  controlsPassed: number;
  controlsTotal: number;
  lastAssessment: string;
  nextReview: string;
  findings: number;
}

export interface ComplianceMetrics {
  overallScore: number;
  securityFindings: SecurityFindings;
  dataPrivacy: DataPrivacy;
  auditStatus: AuditStatus;
  frameworks: ComplianceFramework[];
}

interface UseComplianceMetricsOptions {
  productId?: string | null;
  useMock?: boolean;
}

// Generate project-specific mock compliance data
function generateMockComplianceData(productId: string = 'default'): ComplianceMetrics {
  // Project-specific compliance profiles
  const projectConfigs: Record<string, { 
    score: number; 
    findings: { open: number; critical: number; high: number; medium: number; low: number };
    frameworks: { name: string; status: 'compliant' | 'partial' | 'non_compliant'; score: number }[];
  }> = {
    'default': { 
      score: 85, 
      findings: { open: 8, critical: 1, high: 2, medium: 3, low: 2 },
      frameworks: [
        { name: 'GDPR', status: 'compliant', score: 92 },
        { name: 'SOC 2 Type II', status: 'compliant', score: 88 },
        { name: 'ISO 27001', status: 'partial', score: 75 },
      ]
    },
    'payment': { 
      score: 94, 
      findings: { open: 3, critical: 0, high: 1, medium: 1, low: 1 },
      frameworks: [
        { name: 'GDPR', status: 'compliant', score: 96 },
        { name: 'SOC 2 Type II', status: 'compliant', score: 94 },
        { name: 'ISO 27001', status: 'compliant', score: 92 },
        { name: 'PCI DSS', status: 'compliant', score: 95 },
      ]
    },
    'auth': { 
      score: 88, 
      findings: { open: 6, critical: 0, high: 2, medium: 3, low: 1 },
      frameworks: [
        { name: 'GDPR', status: 'compliant', score: 90 },
        { name: 'SOC 2 Type II', status: 'compliant', score: 88 },
        { name: 'ISO 27001', status: 'partial', score: 82 },
        { name: 'NIST CSF', status: 'partial', score: 85 },
      ]
    },
    'dashboard': { 
      score: 78, 
      findings: { open: 12, critical: 2, high: 3, medium: 4, low: 3 },
      frameworks: [
        { name: 'GDPR', status: 'partial', score: 82 },
        { name: 'SOC 2 Type II', status: 'partial', score: 75 },
        { name: 'ISO 27001', status: 'non_compliant', score: 68 },
      ]
    },
  };
  
  const config = projectConfigs[productId] || projectConfigs['default'];
  
  return {
    overallScore: config.score,
    securityFindings: config.findings,
    dataPrivacy: {
      dataSubjectRequests: {
        pending: productId === 'payment' ? 0 : productId === 'auth' ? 1 : 2,
      },
    },
    auditStatus: {
      daysSinceLastAudit: productId === 'payment' ? 15 : productId === 'auth' ? 30 : 45,
      nextAuditDate: productId === 'payment' ? '2026-09-01' : productId === 'auth' ? '2026-07-15' : '2026-06-01',
    },
    frameworks: config.frameworks.map(fw => ({
      name: fw.name,
      status: fw.status,
      score: fw.score,
      controlsPassed: Math.floor(fw.score * 0.9),
      controlsTotal: 100,
      lastAssessment: '2026-01-15',
      nextReview: '2026-07-15',
      findings: fw.status === 'compliant' ? 1 : fw.status === 'partial' ? 3 : 6,
    })),
  };
}

// Fetch compliance metrics from API
const fetchComplianceMetrics = async (_productId: string): Promise<ComplianceMetrics> => {
  // TODO: Implement actual API integration
  throw new Error('Compliance metrics API not implemented');
};

export function useComplianceMetrics({
  productId,
  useMock = false,
}: UseComplianceMetricsOptions) {
  return useQuery<ComplianceMetrics>({
    queryKey: ['governance', 'compliance', productId, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockComplianceData(productId || 'default'));
      }
      return fetchComplianceMetrics(productId!);
    },
    enabled: !!productId || useMock,
    staleTime: 60 * 60 * 1000, // 1 hour
    refetchInterval: 60 * 60 * 1000,
  });
}
