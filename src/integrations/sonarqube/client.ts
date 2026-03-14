/**
 * SonarQube Integration Client
 */

import type {
  SonarIssue,
  SonarIssuesResponse,
  SonarMeasuresResponse,
  SonarQualityGateStatus,
} from './types';

const SONARQUBE_BASE_URL = import.meta.env.VITE_SONARQUBE_URL || '';
const SONARQUBE_TOKEN = import.meta.env.VITE_SONARQUBE_TOKEN || '';

// Create basic auth header with token
const getAuthHeaders = (): HeadersInit => {
  const encoded = btoa(`${SONARQUBE_TOKEN}:`);
  return {
    'Authorization': `Basic ${encoded}`,
    'Content-Type': 'application/json',
  };
};

const sonarFetch = async <T>(endpoint: string, params: Record<string, string> = {}): Promise<T> => {
  const url = new URL(`${SONARQUBE_BASE_URL}${endpoint}`);
  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.append(key, value);
  });

  const response = await fetch(url.toString(), {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error(`SonarQube API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Get issues by type and severity
export const getIssues = async (
  componentKey: string,
  types?: string[],
  severities?: string[]
): Promise<SonarIssuesResponse> => {
  const params: Record<string, string> = {
    componentKeys: componentKey,
    ps: '500',
  };

  if (types && types.length > 0) {
    params.types = types.join(',');
  }

  if (severities && severities.length > 0) {
    params.severities = severities.join(',');
  }

  return sonarFetch<SonarIssuesResponse>('/api/issues/search', params);
};

// Get measures for specific metrics
export const getMeasures = async (
  componentKey: string,
  metricKeys: string[]
): Promise<SonarMeasuresResponse> => {
  return sonarFetch<SonarMeasuresResponse>('/api/measures/component', {
    component: componentKey,
    metricKeys: metricKeys.join(','),
  });
};

// Get quality gate status for project
export const getQualityGateStatus = async (projectKey: string): Promise<SonarQualityGateStatus> => {
  return sonarFetch<SonarQualityGateStatus>('/api/qualitygates/project_status', {
    projectKey,
  });
};

// Get all quality metrics for a project
export const getAllQualityMetrics = async (projectKey: string) => {
  const metricKeys = [
    'coverage',
    'line_coverage',
    'branch_coverage',
    'bugs',
    'code_smells',
    'vulnerabilities',
    'blocker_violations',
    'critical_violations',
    'major_violations',
    'minor_violations',
    'info_violations',
    'sqale_index',
    'sqale_debt_ratio',
    'duplicated_lines_density',
    'reliability_rating',
    'security_rating',
    'sqale_rating',
  ];

  const [measures, bugs, vulnerabilities, qualityGate] = await Promise.all([
    getMeasures(projectKey, metricKeys),
    getIssues(projectKey, ['BUG']),
    getIssues(projectKey, ['VULNERABILITY']),
    getQualityGateStatus(projectKey),
  ]);

  const getMeasureValue = (metric: string): number => {
    const measure = measures.component.measures.find((m) => m.metric === metric);
    return measure ? parseFloat(measure.value) : 0;
  };

  return {
    testCoverage: getMeasureValue('coverage'),
    lineCoverage: getMeasureValue('line_coverage'),
    branchCoverage: getMeasureValue('branch_coverage'),
    bugs: bugs.total,
    codeSmells: getMeasureValue('code_smells'),
    vulnerabilities: vulnerabilities.total,
    blockerIssues: getMeasureValue('blocker_violations'),
    criticalIssues: getMeasureValue('critical_violations'),
    majorIssues: getMeasureValue('major_violations'),
    minorIssues: getMeasureValue('minor_violations'),
    infoIssues: getMeasureValue('info_violations'),
    technicalDebt: formatTechnicalDebt(getMeasureValue('sqale_index')),
    technicalDebtRatio: getMeasureValue('sqale_debt_ratio'),
    duplicatedLinesDensity: getMeasureValue('duplicated_lines_density'),
    reliabilityRating: getMeasureValue('reliability_rating'),
    securityRating: getMeasureValue('security_rating'),
    maintainabilityRating: getMeasureValue('sqale_rating'),
    qualityGateStatus: qualityGate.projectStatus.status === 'OK' ? 'passed' :
                       qualityGate.projectStatus.status === 'WARN' ? 'warning' : 'failed',
  };
};

// Format technical debt from minutes to readable string
function formatTechnicalDebt(minutes: number): string {
  if (minutes === 0) return '0min';

  const days = Math.floor(minutes / 480); // 8 hours per day
  const hours = Math.floor((minutes % 480) / 60);
  const mins = minutes % 60;

  const parts: string[] = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0) parts.push(`${hours}h`);
  if (mins > 0) parts.push(`${mins}min`);

  return parts.join(' ');
}
