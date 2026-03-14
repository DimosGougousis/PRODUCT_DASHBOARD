/**
 * Cost Per Story Point - Sprint cost efficiency metrics
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { FinancialMetrics } from '@/types/governance/financial';

interface CostPerStoryPointProps {
  metrics: FinancialMetrics | undefined;
  isLoading: boolean;
}

export function CostPerStoryPoint({ metrics, isLoading }: CostPerStoryPointProps) {
  const sprintCosts = metrics?.sprintCosts || [];
  const avgCostPerPoint = metrics?.costPerStoryPoint ?? 0;

  const chartData = sprintCosts.map((sprint) => ({
    name: sprint.sprintName.replace('Sprint ', 'S'),
    costPerPoint: sprint.costPerPoint,
    points: sprint.storyPointsCompleted,
  }));

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Cost Efficiency</CardTitle>
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
          <span>Cost Per Story Point</span>
          <Badge variant="outline" className="text-xs">
            Avg: ${avgCostPerPoint.toFixed(0)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-28">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(value: number, name: string) => {
                  if (name === 'costPerPoint') return [`$${value.toFixed(0)}`, 'Cost/Point'];
                  return [value, 'Points'];
                }}
              />
              <Line
                type="monotone"
                dataKey="costPerPoint"
                stroke="#8b5cf6"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sprint Breakdown */}
        <div className="mt-3 space-y-1">
          {sprintCosts.slice(-3).map((sprint) => (
            <div key={sprint.sprintName} className="flex justify-between text-xs">
              <span className="text-gray-500">{sprint.sprintName}</span>
              <div className="flex gap-3">
                <span>{sprint.storyPointsCompleted} pts</span>
                <span className="font-medium w-16 text-right">
                  ${sprint.costPerPoint.toFixed(0)}/pt
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* ROI */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Projected ROI</span>
            <span className={`font-medium ${(metrics?.roi ?? 0) > 100 ? 'text-green-600' : 'text-yellow-600'}`}>
              {metrics?.roi ?? 0}%
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
