/**
 * Story Readiness Chart - Priority and type distribution
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { BacklogMetrics } from '@/integrations/jira/types';

interface StoryReadinessChartProps {
  metrics: BacklogMetrics | undefined;
  isLoading: boolean;
}

export function StoryReadinessChart({ metrics, isLoading }: StoryReadinessChartProps) {
  const priorityData = [
    { label: 'Highest', count: metrics?.byPriority.highest ?? 0, color: 'bg-red-500' },
    { label: 'High', count: metrics?.byPriority.high ?? 0, color: 'bg-orange-500' },
    { label: 'Medium', count: metrics?.byPriority.medium ?? 0, color: 'bg-yellow-500' },
    { label: 'Low', count: metrics?.byPriority.low ?? 0, color: 'bg-blue-500' },
    { label: 'Lowest', count: metrics?.byPriority.lowest ?? 0, color: 'bg-gray-400' },
  ];

  const typeData = [
    { label: 'Stories', count: metrics?.byType.story ?? 0, icon: '📖' },
    { label: 'Bugs', count: metrics?.byType.bug ?? 0, icon: '🐛' },
    { label: 'Tasks', count: metrics?.byType.task ?? 0, icon: '✅' },
    { label: 'Epics', count: metrics?.byType.epic ?? 0, icon: '🎯' },
  ];

  const totalPriority = priorityData.reduce((sum, p) => sum + p.count, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Priority Distribution</CardTitle>
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
        <CardTitle className="text-sm font-medium">Priority & Types</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Priority Distribution */}
        <div className="mb-4">
          <div className="flex h-3 rounded-full overflow-hidden">
            {priorityData.map((p, i) => (
              <div
                key={p.label}
                className={`${p.color} ${i === 0 ? '' : 'border-l border-white'}`}
                style={{ width: `${totalPriority > 0 ? (p.count / totalPriority) * 100 : 20}%` }}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {priorityData.map((p) => (
              <div key={p.label} className="flex items-center gap-1 text-xs">
                <div className={`w-2 h-2 rounded-full ${p.color}`} />
                <span className="text-gray-600">{p.label}:</span>
                <span className="font-medium">{p.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Type Distribution */}
        <div className="grid grid-cols-4 gap-2">
          {typeData.map((t) => (
            <div key={t.label} className="text-center p-2 bg-gray-50 rounded">
              <span className="text-lg">{t.icon}</span>
              <div className="text-xs font-bold">{t.count}</div>
              <div className="text-xs text-gray-500">{t.label}</div>
            </div>
          ))}
        </div>

        {/* Trend */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">4-week trend</span>
            <div className="flex gap-1">
              {metrics?.issuesTrend.map((count, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {count}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
