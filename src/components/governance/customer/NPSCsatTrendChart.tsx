/**
 * NPS/CSAT Trend Chart - Customer satisfaction over time
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
  ReferenceLine,
} from 'recharts';
import type { CustomerMetrics } from '@/types/governance/customer';

interface NPSCsatTrendChartProps {
  metrics: CustomerMetrics | undefined;
  isLoading: boolean;
}

export function NPSCsatTrendChart({ metrics, isLoading }: NPSCsatTrendChartProps) {
  const nps = metrics?.nps;
  const csat = metrics?.csat;

  // Generate trend data from NPS trend
  const trendData = nps?.trend.map((score, index) => ({
    month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'][index] || `M${index + 1}`,
    nps: score,
    csat: csat?.trend[index] || 0,
  })) || [];

  const currentNps = nps?.score ?? 0;
  const currentCsat = csat?.score ?? 0;

  // NPS color based on score
  const getNpsColor = (score: number): string => {
    if (score >= 50) return 'text-green-600';
    if (score >= 0) return 'text-yellow-600';
    return 'text-red-600';
  };

  // CSAT color based on score
  const getCsatColor = (score: number): string => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">NPS & CSAT Trend</CardTitle>
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
        <CardTitle className="text-sm font-medium">NPS & CSAT (6 months)</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis yAxisId="left" domain={[-50, 100]} tick={{ fontSize: 10 }} />
              <YAxis yAxisId="right" orientation="right" domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <ReferenceLine yAxisId="left" y={0} stroke="#666" strokeDasharray="3 3" />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="nps"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="NPS"
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="csat"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 3 }}
                name="CSAT %"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Current Values */}
        <div className="mt-3 grid grid-cols-2 gap-4">
          <div className="text-center p-2 bg-blue-50 rounded">
            <span className="text-xs text-gray-500 block">NPS Score</span>
            <span className={`text-xl font-bold ${getNpsColor(currentNps)}`}>
              {currentNps}
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {nps?.promoters ?? 0} promoters • {nps?.detractors ?? 0} detractors
            </div>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <span className="text-xs text-gray-500 block">CSAT Score</span>
            <span className={`text-xl font-bold ${getCsatColor(currentCsat)}`}>
              {currentCsat}%
            </span>
            <div className="text-xs text-gray-500 mt-1">
              {csat?.satisfied ?? 0} satisfied • {csat?.totalResponses ?? 0} responses
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
