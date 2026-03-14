/**
 * Defect Density Chart - Bugs by severity with trend
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, TrendingUp, Minus } from 'lucide-react';
import type { QualityMetrics } from '@/integrations/sonarqube/types';

interface DefectDensityChartProps {
  metrics: QualityMetrics | undefined;
  isLoading: boolean;
}

export function DefectDensityChart({ metrics, isLoading }: DefectDensityChartProps) {
  const total = metrics ?
    metrics.blockerIssues + metrics.criticalIssues + metrics.majorIssues +
    metrics.minorIssues + metrics.infoIssues : 0;

  // Calculate trend from bugsTrend array
  const trend = React.useMemo(() => {
    if (!metrics?.bugsTrend || metrics.bugsTrend.length < 2) return 'stable';
    const recent = metrics.bugsTrend[metrics.bugsTrend.length - 1];
    const previous = metrics.bugsTrend[metrics.bugsTrend.length - 2];
    if (recent < previous) return 'improving';
    if (recent > previous) return 'worsening';
    return 'stable';
  }, [metrics?.bugsTrend]);

  const trendConfig = {
    improving: { icon: TrendingDown, color: 'text-green-600', label: 'Improving' },
    worsening: { icon: TrendingUp, color: 'text-red-600', label: 'Worsening' },
    stable: { icon: Minus, color: 'text-gray-500', label: 'Stable' },
  };

  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Defect Density</CardTitle>
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
          <span>Bugs by Severity</span>
          <Badge variant="outline" className={`text-xs flex items-center gap-1 ${trendInfo.color}`}>
            <TrendIcon className="w-3 h-3" />
            {trendInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Severity Breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-red-600 font-medium">Blocker</span>
            <span className="text-sm font-bold">{metrics?.blockerIssues ?? 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-orange-600 font-medium">Critical</span>
            <span className="text-sm font-bold">{metrics?.criticalIssues ?? 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-yellow-600 font-medium">Major</span>
            <span className="text-sm font-bold">{metrics?.majorIssues ?? 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-blue-600 font-medium">Minor</span>
            <span className="text-sm font-bold">{metrics?.minorIssues ?? 0}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 font-medium">Info</span>
            <span className="text-sm font-bold">{metrics?.infoIssues ?? 0}</span>
          </div>
        </div>

        {/* Total */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Total Bugs</span>
            <span className="text-sm font-bold">{total}</span>
          </div>
        </div>

        {/* Code Smells */}
        <div className="mt-2 pt-2 border-t">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Code Smells</span>
            <span className="text-sm font-bold">{metrics?.codeSmells ?? 0}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}


