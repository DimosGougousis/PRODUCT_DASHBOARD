/**
 * useQualityMetrics Hook - Fetch quality metrics from SonarQube
 */

import { useQuery } from '@tanstack/react-query';
import * as sonarClient from '@/integrations/sonarqube/client';
import type { QualityMetrics } from '@/integrations/sonarqube/types';

interface UseQualityMetricsOptions {
  projectKey: string | null;
  useMock?: boolean;
}

// Generate mock quality data for demonstration
function generateMockQualityData(): QualityMetrics {
  // Generate realistic coverage trend (fluctuating between 75-85%)
  const coverageTrend = [78, 80, 79, 82, 81];
  const bugsTrend = [12, 10, 11, 9, 8];

  return {
    testCoverage: 81.5,
    lineCoverage: 83.2,
    branchCoverage: 76.8,
    bugs: 8,
    codeSmells: 45,
    vulnerabilities: 3,
    blockerIssues: 0,
    criticalIssues: 2,
    majorIssues: 15,
    minorIssues: 28,
    infoIssues: 11,
    technicalDebt: '2d 4h',
    technicalDebtRatio: 4.2,
    duplicatedLinesDensity: 2.1,
    reliabilityRating: 3, // C
    securityRating: 2, // B
    maintainabilityRating: 3, // C
    qualityGateStatus: 'warning',
    coverageTrend,
    bugsTrend,
  };
}

// Fetch quality metrics from SonarQube
const fetchQualityMetrics = async (projectKey: string): Promise<QualityMetrics> => {
  const metrics = await sonarClient.getAllQualityMetrics(projectKey);

  // Fetch trends (mock for now - would need historical data)
  const coverageTrend = [75, 77, 79, 80, metrics.testCoverage];
  const bugsTrend = [15, 14, 12, 10, metrics.bugs];

  return {
    ...metrics,
    coverageTrend,
    bugsTrend,
  };
};

export function useQualityMetrics({
  projectKey,
  useMock = false,
}: UseQualityMetricsOptions) {
  return useQuery<QualityMetrics>({
    queryKey: ['governance', 'quality', projectKey, useMock],
    queryFn: () => {
      if (useMock) {
        return Promise.resolve(generateMockQualityData());
      }
      return fetchQualityMetrics(projectKey!);
    },
    enabled: !!projectKey || useMock,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // 5 minutes
  });
}
