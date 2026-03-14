import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { DefectDensityChart } from '@/components/governance/quality/DefectDensityChart';
import { TestCoverageGauge } from '@/components/governance/quality/TestCoverageGauge';
import { SecurityFindingsBadge } from '@/components/governance/quality/SecurityFindingsBadge';
import { useQualityMetrics } from '@/hooks/governance/useQualityMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Bug, Gauge, AlertTriangle } from 'lucide-react';

export default function QualityMetricsPage() {
  const { data: metrics, isLoading } = useQualityMetrics({
    projectKey: 'demo-project',
    useMock: true,
  });

  return (
    <GovernanceLayout
      title="Quality Metrics"
      description="Monitor code quality, test coverage, and security posture"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
            <Gauge className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.testCoverage || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.testCoverage && metrics.testCoverage >= 80
                ? '✅ Good coverage'
                : '⚠️ Needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Bugs</CardTitle>
            <Bug className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.bugs || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.bugs && metrics.bugs > 10 ? '🔴 High priority' : '🟢 Manageable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vulnerabilities</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.vulnerabilities || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.vulnerabilities && metrics.vulnerabilities > 0
                ? '🔴 Action required'
                : '✅ No critical issues'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tech Debt</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.technicalDebt || '0d'}
            </div>
            <p className="text-xs text-muted-foreground">
              Ratio: {metrics?.technicalDebtRatio || 0}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DefectDensityChart data={metrics} isLoading={isLoading} />
        </div>
        <div className="space-y-6">
          <TestCoverageGauge data={metrics} isLoading={isLoading} />
          <SecurityFindingsBadge data={metrics} isLoading={isLoading} />
        </div>
      </div>

      {/* Quality Gate Status */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quality Gate Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    metrics?.reliabilityRating && metrics.reliabilityRating <= 2
                      ? 'bg-green-500'
                      : metrics?.reliabilityRating === 3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">Reliability</span>
              </div>
              <p className="text-sm text-gray-600">
                {metrics?.reliabilityRating === 1 && 'A - No bugs'}
                {metrics?.reliabilityRating === 2 && 'B - Minor issues'}
                {metrics?.reliabilityRating === 3 && 'C - Moderate issues'}
                {metrics?.reliabilityRating === 4 && 'D - High impact bugs'}
                {metrics?.reliabilityRating === 5 && 'E - Critical bugs'}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    metrics?.securityRating && metrics.securityRating <= 2
                      ? 'bg-green-500'
                      : metrics?.securityRating === 3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">Security</span>
              </div>
              <p className="text-sm text-gray-600">
                {metrics?.securityRating === 1 && 'A - No vulnerabilities'}
                {metrics?.securityRating === 2 && 'B - Minor vulnerabilities'}
                {metrics?.securityRating === 3 && 'C - Moderate risk'}
                {metrics?.securityRating === 4 && 'D - High risk'}
                {metrics?.securityRating === 5 && 'E - Critical risk'}
              </p>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    metrics?.maintainabilityRating && metrics.maintainabilityRating <= 2
                      ? 'bg-green-500'
                      : metrics?.maintainabilityRating === 3
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                />
                <span className="font-medium">Maintainability</span>
              </div>
              <p className="text-sm text-gray-600">
                {metrics?.maintainabilityRating === 1 && 'A - Excellent'}
                {metrics?.maintainabilityRating === 2 && 'B - Good'}
                {metrics?.maintainabilityRating === 3 && 'C - Moderate'}
                {metrics?.maintainabilityRating === 4 && 'D - Poor'}
                {metrics?.maintainabilityRating === 5 && 'E - Critical'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
