import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { ComplianceStatusWidget } from '@/components/governance/compliance/ComplianceStatusWidget';
import { AuditTrailStatus } from '@/components/governance/compliance/AuditTrailStatus';
import { useComplianceMetrics } from '@/hooks/governance/useComplianceMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, CheckCircle, AlertCircle, XCircle, FileText, Lock } from 'lucide-react';

export default function CompliancePage() {
  const { data: metrics, isLoading } = useComplianceMetrics({
    useMock: true,
  });

  const getFrameworkIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'partial':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'non_compliant':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <GovernanceLayout
      title="Compliance & Security"
      description="Monitor regulatory compliance, security posture, and audit readiness"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.overallScore || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics && metrics.overallScore >= 95
                ? '✅ Compliant'
                : metrics && metrics.overallScore >= 85
                ? '🟢 Good'
                : metrics && metrics.overallScore >= 70
                ? '⚠️ Fair'
                : '🔴 At Risk'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Findings</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : (metrics?.securityFindings.open || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.securityFindings.critical || 0} critical
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : (metrics?.dataPrivacy.dataSubjectRequests.pending || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              GDPR data requests
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Audit</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.auditStatus.daysSinceLastAudit || 0} days`}
            </div>
            <p className="text-xs text-muted-foreground">
              Next: {metrics?.auditStatus.nextAuditDate}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <ComplianceStatusWidget data={metrics} isLoading={isLoading} />
        <AuditTrailStatus data={metrics?.auditStatus} isLoading={isLoading} />
      </div>

      {/* Framework Status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Compliance Framework Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {metrics?.frameworks.map((framework) => (
              <div key={framework.name} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {getFrameworkIcon(framework.status)}
                    <h4 className="font-semibold">{framework.name}</h4>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    framework.status === 'compliant' ? 'bg-green-100 text-green-800' :
                    framework.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {framework.status.replace('_', ' ')}
                  </span>
                </div>
                
                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Score</span>
                    <span className="font-medium">{framework.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        framework.score >= 90 ? 'bg-green-500' :
                        framework.score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${framework.score}%` }}
                    />
                  </div>
                </div>

                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Controls Passed:</span>
                    <span>{framework.controlsPassed}/{framework.controlsTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Last Assessment:</span>
                    <span>{framework.lastAssessment}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Next Review:</span>
                    <span>{framework.nextReview}</span>
                  </div>
                </div>

                {framework.findings > 0 && (
                  <div className="mt-3 p-2 bg-red-50 rounded text-sm">
                    <span className="text-red-700">
                      {framework.findings} open finding{framework.findings > 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Security Findings Detail */}
      <Card>
        <CardHeader>
          <CardTitle>Security Findings by Severity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-24 font-medium text-red-600">Critical</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-red-500 h-full flex items-center justify-end px-2 text-white text-sm font-medium"
                  style={{ width: `${Math.min((metrics?.securityFindings.critical || 0) * 10, 100)}%` }}
                >
                  {metrics?.securityFindings.critical || 0}
                </div>
              </div>
              <div className="w-20 text-sm text-gray-500">
                Fix immediately
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 font-medium text-orange-600">High</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-orange-500 h-full flex items-center justify-end px-2 text-white text-sm font-medium"
                  style={{ width: `${Math.min((metrics?.securityFindings.high || 0) * 10, 100)}%` }}
                >
                  {metrics?.securityFindings.high || 0}
                </div>
              </div>
              <div className="w-20 text-sm text-gray-500">
                Fix within 7 days
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 font-medium text-yellow-600">Medium</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full flex items-center justify-end px-2 text-white text-sm font-medium"
                  style={{ width: `${Math.min((metrics?.securityFindings.medium || 0) * 5, 100)}%` }}
                >
                  {metrics?.securityFindings.medium || 0}
                </div>
              </div>
              <div className="w-20 text-sm text-gray-500">
                Fix within 30 days
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-24 font-medium text-blue-600">Low</div>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-blue-500 h-full flex items-center justify-end px-2 text-white text-sm font-medium"
                  style={{ width: `${Math.min((metrics?.securityFindings.low || 0) * 3, 100)}%` }}
                >
                  {metrics?.securityFindings.low || 0}
                </div>
              </div>
              <div className="w-20 text-sm text-gray-500">
                Fix within 90 days
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
