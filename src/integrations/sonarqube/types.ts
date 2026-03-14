/**
 * SonarQube Integration Types
 */

export interface SonarIssue {
  key: string;
  rule: string;
  severity: 'BLOCKER' | 'CRITICAL' | 'MAJOR' | 'MINOR' | 'INFO';
  component: string;
  type: 'BUG' | 'VULNERABILITY' | 'CODE_SMELL';
  message: string;
  line?: number;
  status: 'OPEN' | 'CONFIRMED' | 'RESOLVED' | 'CLOSED';
  creationDate: string;
  updateDate: string;
}

export interface SonarMeasure {
  metric: string;
  value: string;
  bestValue?: boolean;
}

export interface SonarQualityGateStatus {
  projectStatus: {
    status: 'OK' | 'ERROR' | 'WARN';
    conditions: Array<{
      status: 'OK' | 'ERROR' | 'WARN';
      metricKey: string;
      actualValue: string;
      threshold: string;
    }>;
  };
}

export interface SonarIssuesResponse {
  total: number;
  p: number;
  ps: number;
  issues: SonarIssue[];
}

export interface SonarMeasuresResponse {
  component: {
    id: string;
    key: string;
    name: string;
    qualifier: string;
    measures: SonarMeasure[];
  };
}

// Quality Metrics for Dashboard
export interface QualityMetrics {
  // Coverage
  testCoverage: number;
  lineCoverage: number;
  branchCoverage: number;
  
  // Defects
  bugs: number;
  codeSmells: number;
  vulnerabilities: number;
  
  // Severity breakdown
  blockerIssues: number;
  criticalIssues: number;
  majorIssues: number;
  minorIssues: number;
  infoIssues: number;
  
  // Maintainability
  technicalDebt: string;
  technicalDebtRatio: number;
  duplicatedLinesDensity: number;
  
  // Ratings (1-5, A-E)
  reliabilityRating: number;
  securityRating: number;
  maintainabilityRating: number;
  
  // Quality Gate
  qualityGateStatus: 'passed' | 'failed' | 'warning';
  
  // Trends (last 5 analyses)
  coverageTrend: number[];
  bugsTrend: number[];
}
