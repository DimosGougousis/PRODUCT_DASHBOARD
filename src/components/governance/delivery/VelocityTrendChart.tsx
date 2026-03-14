/**
 * Velocity Trend Chart - Rolling 5-sprint velocity + forecast
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import type { SprintVelocity } from '@/hooks/governance/useDeliveryMetrics';

interface VelocityTrendChartProps {
  data: SprintVelocity[];
  isLoading: boolean;
}

function calculateForecast(data: SprintVelocity[]): number {
  if (data.length === 0) return 0;
  const recent = data.slice(0, 3); // Last 3 sprints
  const avg = recent.reduce((sum, sprint) => sum + sprint.completed, 0) / recent.length;
  return Math.round(avg);
}

function calculateTrend(data: SprintVelocity[]): 'up' | 'down' | 'stable' {
  if (data.length < 2) return 'stable';
  const recent = data.slice(0, 3);
  const older = data.slice(3, 6);
  if (older.length === 0) return 'stable';
  
  const recentAvg = recent.reduce((sum, s) => sum + s.completed, 0) / recent.length;
  const olderAvg = older.reduce((sum, s) => sum + s.completed, 0) / older.length;
  
  const change = (recentAvg - olderAvg) / olderAvg;
  if (change > 0.1) return 'up';
  if (change < -0.1) return 'down';
  return 'stable';
}

export function VelocityTrendChart({ data, isLoading }: VelocityTrendChartProps) {
  const forecast = calculateForecast(data || []);
  const trend = calculateTrend(data || []);
  
  const trendConfig = {
    up: { icon: TrendingUp, color: 'bg-green-100 text-green-700', label: 'Improving' },
    down: { icon: TrendingDown, color: 'bg-red-100 text-red-700', label: 'Declining' },
    stable: { icon: Minus, color: 'bg-gray-100 text-gray-700', label: 'Stable' },
  };
  const trendInfo = trendConfig[trend];
  const TrendIcon = trendInfo.icon;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Velocity Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Handle empty data
  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Velocity Trend (5 Sprints)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-48 bg-gray-50 rounded flex items-center justify-center text-sm text-gray-400">
            No sprint data available
          </div>
        </CardContent>
      </Card>
    );
  }

  // Reverse data for chronological order (oldest first)
  const chartData = [...data].reverse().map(sprint => ({
    ...sprint,
    // Shorten sprint name for display
    displayName: sprint.sprintName.replace(/Sprint\s+/i, 'S'),
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Velocity Trend (5 Sprints)</span>
          <Badge variant="outline" className={`text-xs ${trendInfo.color}`}>
            <TrendIcon className="w-3 h-3 mr-1" />
            {trendInfo.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis 
              dataKey="displayName" 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11 }} 
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{ fontSize: 12, borderRadius: 6 }}
              formatter={(value: number) => [`${value} pts`, '']}
            />
            <Legend wrapperStyle={{ fontSize: 11, paddingTop: 8 }} />
            <Bar dataKey="committed" fill="#94a3b8" name="Committed" radius={[2, 2, 0, 0]} />
            <Bar dataKey="completed" fill="#3b82f6" name="Completed" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        
        {/* Forecast summary */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between text-xs">
          <span className="text-gray-500">Next sprint forecast:</span>
          <span className="font-semibold text-blue-600">{forecast} points</span>
        </div>
      </CardContent>
    </Card>
  );
}
