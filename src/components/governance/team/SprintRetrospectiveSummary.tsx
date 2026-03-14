/**
 * Sprint Retrospective Summary - Recent retro highlights and action items
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Circle, TrendingUp, Users } from 'lucide-react';
import type { TeamHealthMetrics } from '@/types/governance/teamHealth';

interface SprintRetrospectiveSummaryProps {
  metrics: TeamHealthMetrics | undefined;
  isLoading: boolean;
}

export function SprintRetrospectiveSummary({ metrics, isLoading }: SprintRetrospectiveSummaryProps) {
  const recentRetro = metrics?.recentRetrospectives[0];
  const retention = metrics?.retention;

  const getMoodColor = (mood: string): string => {
    switch (mood) {
      case 'great':
        return 'bg-green-100 text-green-700';
      case 'good':
        return 'bg-blue-100 text-blue-700';
      case 'neutral':
        return 'bg-gray-100 text-gray-700';
      case 'challenging':
        return 'bg-yellow-100 text-yellow-700';
      case 'difficult':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Team Health</CardTitle>
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
          <span>Team Health</span>
          <div className="flex gap-2">
            <Badge variant="outline" className="text-xs flex items-center gap-1">
              <Users className="w-3 h-3" />
              {retention?.totalMembers ?? 0}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Retention Metrics */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="text-center p-2 bg-green-50 rounded">
            <span className="text-lg font-bold text-green-600">{retention?.retentionRate ?? 0}%</span>
            <span className="text-xs text-green-600 block">Retention</span>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <span className="text-lg font-bold text-blue-600">{retention?.avgTenure ?? 0}mo</span>
            <span className="text-xs text-blue-600 block">Avg Tenure</span>
          </div>
          <div className="text-center p-2 bg-purple-50 rounded">
            <span className="text-lg font-bold text-purple-600">{metrics?.oneOnOneCompliance ?? 0}%</span>
            <span className="text-xs text-purple-600 block">1:1s</span>
          </div>
        </div>

        {/* Latest Retro */}
        {recentRetro && (
          <div className="pt-3 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Latest Retro: {recentRetro.sprintName}</span>
              <Badge className={`text-xs ${getMoodColor(recentRetro.teamMood)}`}>
                {recentRetro.teamMood}
              </Badge>
            </div>

            {/* Action Items */}
            <div className="space-y-1">
              {recentRetro.actionItems.slice(0, 2).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-xs">
                  {item.status === 'done' ? (
                    <CheckCircle2 className="w-3 h-3 text-green-500" />
                  ) : (
                    <Circle className="w-3 h-3 text-gray-400" />
                  )}
                  <span className={item.status === 'done' ? 'text-gray-400 line-through' : 'text-gray-700'}>
                    {item.description}
                  </span>
                </div>
              ))}
              {recentRetro.actionItems.length > 2 && (
                <div className="text-xs text-gray-500 pl-5">
                  +{recentRetro.actionItems.length - 2} more
                </div>
              )}
            </div>
          </div>
        )}

        {/* Burnout Risk */}
        {metrics?.burnout.riskLevel && metrics.burnout.riskLevel !== 'low' && (
          <div className="mt-3 p-2 bg-yellow-50 rounded">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="w-4 h-4 text-yellow-600" />
              <span className="text-yellow-700">
                {metrics.burnout.atRiskMembers} member(s) showing burnout risk
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
