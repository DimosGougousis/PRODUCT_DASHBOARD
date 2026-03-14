/**
 * Backlog Health Card - Size, readiness %, aging breakdown
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import type { BacklogMetrics } from '@/integrations/jira/types';

interface BacklogHealthCardProps {
  metrics: BacklogMetrics | undefined;
  isLoading: boolean;
}

export function BacklogHealthCard({ metrics, isLoading }: BacklogHealthCardProps) {
  const totalIssues = metrics?.totalIssues ?? 0;
  const readyForDev = metrics?.readiness.ready ?? 0;
  const needsRefinement = metrics?.readiness.needsRefinement ?? 0;
  const inProgress = metrics?.readiness.inProgress ?? 0;

  const readinessPercent = totalIssues
    ? Math.round((readyForDev / totalIssues) * 100)
    : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Backlog Health</CardTitle>
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
          <span>Backlog Health</span>
          <Badge variant="outline" className="text-xs">
            {metrics?.totalStoryPoints ?? 0} pts
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Readiness */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Ready for Development</span>
            <span className="font-medium">{readyForDev} / {totalIssues}</span>
          </div>
          <Progress value={readinessPercent} className="h-2" />
          <div className="flex justify-between text-xs mt-1 text-gray-500">
            <span>{readinessPercent}% ready</span>
            <span>{needsRefinement} need refinement</span>
          </div>
        </div>

        {/* Readiness Breakdown */}
        <div className="grid grid-cols-3 gap-2 text-xs mb-4">
          <div className="p-2 bg-green-50 rounded text-center">
            <span className="text-green-600 font-bold block">{readyForDev}</span>
            <span className="text-green-600">Ready</span>
          </div>
          <div className="p-2 bg-yellow-50 rounded text-center">
            <span className="text-yellow-600 font-bold block">{inProgress}</span>
            <span className="text-yellow-600">In Progress</span>
          </div>
          <div className="p-2 bg-red-50 rounded text-center">
            <span className="text-red-600 font-bold block">{needsRefinement}</span>
            <span className="text-red-600">Needs Work</span>
          </div>
        </div>

        {/* WIP */}
        <div className="p-2 bg-blue-50 rounded">
          <div className="flex justify-between text-xs">
            <span className="text-blue-600 font-medium">Current WIP</span>
            <span className="text-blue-600">
              {metrics?.wipIssues ?? 0} issues ({metrics?.wipStoryPoints ?? 0} pts)
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
