/**
 * Compliance Status Widget - Framework compliance overview
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import type { ComplianceMetrics } from '@/types/governance/compliance';

interface ComplianceStatusWidgetProps {
  metrics: ComplianceMetrics | undefined;
  isLoading: boolean;
}

export function ComplianceStatusWidget({ metrics, isLoading }: ComplianceStatusWidgetProps) {
  const frameworks = metrics?.frameworks || [];
  const overallScore = metrics?.overallScore ?? 0;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'non_compliant':
        return <AlertTriangle className="w-4 h-4 text-red-500" />;
      default:
        return <Shield className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'compliant':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'non_compliant':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-muted text-foreground';
    }
  };

  const openFindings = frameworks.reduce(
    (sum, f) => sum + f.findings.filter((finding) => finding.status === 'open').length,
    0
  );

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Compliance</span>
          <Badge className={overallScore >= 80 ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : overallScore >= 60 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}>
            {overallScore}%
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Frameworks */}
        <div className="space-y-2 mb-3">
          {frameworks.map((framework) => (
            <div key={framework.id} className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                {getStatusIcon(framework.status)}
                <span className="text-foreground">{framework.name}</span>
              </div>
              <Badge variant="outline" className={`text-xs ${getStatusColor(framework.status)}`}>
                {framework.score}%
              </Badge>
            </div>
          ))}
        </div>

        {/* Findings Summary */}
        <div className="pt-3 border-t">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Open Findings</span>
            <span className={`font-medium ${openFindings > 0 ? 'text-red-600' : 'text-green-600'}`}>
              {openFindings}
            </span>
          </div>
        </div>

        {/* Data Privacy */}
        <div className="pt-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">GDPR Requests</span>
            <span className="font-medium">
              {metrics?.dataPrivacy.dataSubjectRequests.pending ?? 0} pending
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
