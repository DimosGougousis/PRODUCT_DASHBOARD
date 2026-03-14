/**
 * Sprint Burndown Chart - Active sprint remaining work over time
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { BurndownPoint } from '@/hooks/governance/useDeliveryMetrics';

interface SprintBurndownChartProps {
  sprintName: string;
  goal?: string;
  data: BurndownPoint[];
  totalPoints: number;
  isLoading: boolean;
}

export function SprintBurndownChart({
  sprintName,
  goal,
  data,
  totalPoints,
  isLoading,
}: SprintBurndownChartProps) {
  // Calculate if sprint is on track
  const isOnTrack = React.useMemo(() => {
    if (!data || data.length === 0) return true;
    const lastPoint = data[data.length - 1];
    return lastPoint.remaining <= lastPoint.ideal * 1.1; // 10% tolerance
  }, [data]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Sprint Burndown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Handle no active sprint
  if (!sprintName || !data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Sprint Burndown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-sm text-gray-400">
            No active sprint
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for chart
  const chartData = data.map(point => ({
    ...point,
    dateLabel: format(point.date, 'MMM dd'),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">
            Sprint Burndown: {sprintName}
          </CardTitle>
          <Badge 
            variant={isOnTrack ? 'default' : 'destructive'}
            className={`text-xs ${isOnTrack ? 'bg-green-100 text-green-700 hover:bg-green-100' : ''}`}
          >
            {isOnTrack ? 'On Track' : 'At Risk'}
          </Badge>
        </div>
        {goal && (
          <p className="text-xs text-gray-500 truncate">{goal}</p>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="dateLabel" 
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
              formatter={(value: number) => [`${value} pts`, '']}
              labelFormatter={(label) => label}
            />
            <Line 
              type="monotone" 
              dataKey="ideal" 
              stroke="#94a3b8" 
              strokeDasharray="4 4"
              strokeWidth={2}
              dot={false}
              name="Ideal"
            />
            <Line 
              type="monotone" 
              dataKey="remaining" 
              stroke="#3b82f6" 
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5 }}
              name="Actual"
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Stats */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
          <span className="text-gray-500">Total scope: <span className="font-medium">{totalPoints} pts</span></span>
          <span className="text-gray-500">
            Remaining: <span className="font-medium">{data[data.length - 1]?.remaining || 0} pts</span>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}


