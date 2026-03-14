/**
 * Test Coverage Gauge - Circular progress indicator for test coverage %
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { QualityMetrics } from '@/integrations/sonarqube/types';

interface TestCoverageGaugeProps {
  metrics: QualityMetrics | undefined;
  isLoading: boolean;
}

export function TestCoverageGauge({ metrics, isLoading }: TestCoverageGaugeProps) {
  const coverage = metrics?.testCoverage ?? 0;
  const lineCoverage = metrics?.lineCoverage ?? 0;
  const branchCoverage = metrics?.branchCoverage ?? 0;
  const qualityGate = metrics?.qualityGateStatus ?? 'failed';

  // Determine color based on threshold
  const getColor = (value: number): string => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getStrokeColor = (value: number): string => {
    if (value >= 80) return '#22c55e';
    if (value >= 60) return '#eab308';
    return '#ef4444';
  };

  const gateConfig = {
    passed: { label: 'Passed', color: 'bg-green-100 text-green-700' },
    warning: { label: 'Warning', color: 'bg-yellow-100 text-yellow-700' },
    failed: { label: 'Failed', color: 'bg-red-100 text-red-700' },
  };

  const gateInfo = gateConfig[qualityGate];

  // SVG circular progress
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (coverage / 100) * circumference;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Test Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Test Coverage</span>
          <Badge className={`text-xs ${gateInfo.color}`}>{gateInfo.label}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Main Gauge */}
        <div className="flex items-center justify-center py-4">
          <div className="relative w-24 h-24">
            <svg className="w-24 h-24 transform -rotate-90">
              {/* Background circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="48"
                cy="48"
                r={radius}
                stroke={getStrokeColor(coverage)}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'stroke-dashoffset 0.5s ease' }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-2xl font-bold ${getColor(coverage)}`}>
                {coverage.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Breakdown */}
        <div className="space-y-1 text-xs">
          <div className="flex justify-between">
            <span className="text-gray-500">Line Coverage</span>
            <span className={`font-medium ${getColor(lineCoverage)}`}>
              {lineCoverage.toFixed(1)}%
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Branch Coverage</span>
            <span className={`font-medium ${getColor(branchCoverage)}`}>
              {branchCoverage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Technical Debt */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Technical Debt</span>
            <span className="font-medium">{metrics?.technicalDebt ?? '0min'}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
