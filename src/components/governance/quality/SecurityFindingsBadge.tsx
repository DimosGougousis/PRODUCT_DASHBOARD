/**
 * Security Findings Badge - Vulnerabilities by severity
 */

import { Card, CardContent } from '@/components/ui/card';
import { Shield, ShieldAlert, ShieldCheck } from 'lucide-react';
import type { QualityMetrics } from '@/integrations/sonarqube/types';

interface SecurityFindingsBadgeProps {
  metrics: QualityMetrics | undefined;
  isLoading: boolean;
}

export function SecurityFindingsBadge({ metrics, isLoading }: SecurityFindingsBadgeProps) {
  const vulnerabilities = metrics?.vulnerabilities ?? 0;
  const critical = metrics?.criticalIssues ?? 0;
  const major = metrics?.majorIssues ?? 0;
  const minor = metrics?.minorIssues ?? 0;

  // Determine overall status based on vulnerabilities
  const hasCritical = critical > 0;
  const hasVulnerabilities = vulnerabilities > 0;

  // Get security rating (1=A, 2=B, 3=C, 4=D, 5=E)
  const securityRating = metrics?.securityRating ?? 5;
  const ratingLetter = ['A', 'B', 'C', 'D', 'E'][securityRating - 1] || 'E';

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-16 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={`p-2 rounded-full ${
            hasCritical ? 'bg-red-100' : hasVulnerabilities ? 'bg-orange-100' : 'bg-green-100'
          }`}>
            {hasCritical ? (
              <ShieldAlert className="w-5 h-5 text-red-600" />
            ) : hasVulnerabilities ? (
              <Shield className="w-5 h-5 text-orange-600" />
            ) : (
              <ShieldCheck className="w-5 h-5 text-green-600" />
            )}
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-medium">Security Findings</p>
              <span className={`text-xs px-1.5 py-0.5 rounded font-bold ${
                securityRating <= 2 ? 'bg-green-100 text-green-700' :
                securityRating === 3 ? 'bg-yellow-100 text-yellow-700' :
                'bg-red-100 text-red-700'
              }`}>
                {ratingLetter}
              </span>
            </div>

            {/* Counts */}
            <div className="flex gap-3 mt-1 text-xs">
              <span className={vulnerabilities > 0 ? 'text-red-600 font-bold' : 'text-gray-500'}>
                {vulnerabilities} Vulnerabilities
              </span>
            </div>

            {/* Severity breakdown */}
            <div className="flex gap-2 mt-1 text-xs text-gray-500">
              <span>{critical} Critical</span>
              <span>•</span>
              <span>{major} Major</span>
              <span>•</span>
              <span>{minor} Minor</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
