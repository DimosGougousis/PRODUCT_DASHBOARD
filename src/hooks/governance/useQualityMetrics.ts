/**
 * useQualityMetrics Hook - Fetch quality metrics from SonarQube
 */

import { useQuery } from '@tanstack/react-query';

export interface QualityMetrics {
  testCoverage: number;
  bugs: number;
  vulnerabilities: number;
  technicalDebt: string;
  technicalDebtRatio: number;
  reliabilityRating: number;
  securityRating: number;
  maintainabilityRating: number;
  qualityGateStatus: string;
}

interface UseQualityMetricsOptions {
  projectKey?: string | null;
  useMock?: boolean;
}

// Generate project-specific mock quality data
function generateMockQualityData(projectKey: string = 'demo-project'): QualityMetrics {
  // Project-specific quality profiles
  const projectConfigs: Record<string, { coverage: number; bugs: number; vulns: number; debt: string; debtRatio: number; rel: number; sec: number; maint: number }> = {
    'demo-project': { coverage: 81.5, bugs: 8, vulns: 3, debt: '2d 4h', debtRatio: 4.2, rel: 3, sec: 2, maint: 3 },
    'payment-service': { coverage: 92.3, bugs: 2, vulns: 0, debt: '8h', debtRatio: 1.2, rel: 2, sec: 1, maint: 2 },
    'auth-service': { coverage: 88.7, bugs: 4, vulns: 1, debt: '1d 2h', debtRatio: 2.1, rel: 2, sec: 2, maint: 2 },
    'legacy-api': { coverage: 62.4, bugs: 24, vulns: 8, debt: '5d 6h', debtRatio: 12.5, rel: 4, sec: 3, maint: 4 },
  };
  
  const config = projectConfigs[projectKey] || projectConfigs['demo-project'];
  
  return {
    testCoverage: config.coverage,
    bugs: config.bugs,
    vulnerabilities: config.vulns,
    technicalDebt: config.debt,
    technicalDebtRatio: config.debtRatio,
    reliabilityRating: config.rel,
    securityRating: config.sec,
    maintainabilityRating: config.maint,
    qualityGateStatus: config.coverage >= 80 && config.vulns === 0 ? 'passed' : 'warning',
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
