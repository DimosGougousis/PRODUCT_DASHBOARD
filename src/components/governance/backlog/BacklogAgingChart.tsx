/**
 * Backlog Aging Chart - Issues by age buckets
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { BacklogMetrics } from '@/integrations/jira/types';

interface BacklogAgingChartProps {
  metrics: BacklogMetrics | undefined;
  isLoading: boolean;
}

export function BacklogAgingChart({ metrics, isLoading }: BacklogAgingChartProps) {
  const data = [
    { name: 'Fresh', count: metrics?.aging.fresh ?? 0, color: '#22c55e' },
    { name: 'Aging', count: metrics?.aging.aging ?? 0, color: '#eab308' },
    { name: 'Stale', count: metrics?.aging.stale ?? 0, color: '#ef4444' },
  ];

  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Backlog Aging</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-40 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Backlog Aging</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary */}
        <div className="flex justify-between text-xs mb-3">
          <span className="text-gray-500">Total: {total} issues</span>
          <span className="text-red-600 font-medium">
            {metrics?.aging.stale ?? 0} stale (&gt;30 days)
          </span>
        </div>

        {/* Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" hide />
              <YAxis
                type="category"
                dataKey="name"
                width={50}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value: number) => [`${value} issues`, 'Count']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex justify-between text-xs mt-2 text-gray-500">
          <span>&lt; 7 days</span>
          <span>7-30 days</span>
          <span>&gt; 30 days</span>
        </div>
      </CardContent>
    </Card>
  );
}
