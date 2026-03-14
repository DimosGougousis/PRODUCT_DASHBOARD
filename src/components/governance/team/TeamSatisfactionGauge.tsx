/**
 * Team Satisfaction Gauge - Overall satisfaction and category breakdown
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Smile, Meh, Frown } from 'lucide-react';
import type { TeamHealthMetrics } from '@/types/governance/teamHealth';

interface TeamSatisfactionGaugeProps {
  metrics: TeamHealthMetrics | undefined;
  isLoading: boolean;
}

export function TeamSatisfactionGauge({ metrics, isLoading }: TeamSatisfactionGaugeProps) {
  const satisfaction = metrics?.satisfaction;
  const overall = satisfaction?.overall ?? 0;

  const getMoodIcon = (score: number) => {
    if (score >= 8) return <Smile className="w-6 h-6 text-green-500" />;
    if (score >= 6) return <Meh className="w-6 h-6 text-yellow-500" />;
    return <Frown className="w-6 h-6 text-red-500" />;
  };

  const getMoodColor = (score: number): string => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const categories = [
    { label: 'Workload', score: satisfaction?.categories.workload ?? 0 },
    { label: 'Autonomy', score: satisfaction?.categories.autonomy ?? 0 },
    { label: 'Growth', score: satisfaction?.categories.growth ?? 0 },
    { label: 'Recognition', score: satisfaction?.categories.recognition ?? 0 },
    { label: 'Collaboration', score: satisfaction?.categories.collaboration ?? 0 },
    { label: 'Purpose', score: satisfaction?.categories.purpose ?? 0 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Team Satisfaction</CardTitle>
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
          <span>Team Satisfaction</span>
          <Badge variant="outline" className="text-xs">
            {satisfaction?.responseRate ?? 0}% response
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Score */}
        <div className="flex items-center justify-center gap-3 mb-4">
          {getMoodIcon(overall)}
          <div>
            <span className={`text-3xl font-bold ${getMoodColor(overall)}`}>
              {overall.toFixed(1)}
            </span>
            <span className="text-gray-400 text-sm">/10</span>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.label}>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-600">{cat.label}</span>
                <span className="font-medium">{cat.score.toFixed(1)}</span>
              </div>
              <Progress value={cat.score * 10} className="h-1.5" />
            </div>
          ))}
        </div>

        {/* Last Survey */}
        <div className="mt-3 pt-3 border-t text-xs text-gray-500">
          Last survey: {metrics?.lastSurveyDate || 'N/A'}
        </div>
      </CardContent>
    </Card>
  );
}
