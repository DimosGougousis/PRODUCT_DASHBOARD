/**
 * Budget Burn Chart - Monthly budget vs actual spend
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import type { FinancialMetrics } from '@/types/governance/financial';

interface BudgetBurnChartProps {
  metrics: FinancialMetrics | undefined;
  isLoading: boolean;
}

export function BudgetBurnChart({ metrics, isLoading }: BudgetBurnChartProps) {
  const budget = metrics?.budget;
  const monthlyData = budget?.monthlySpend || [];

  const totalSpent = budget?.spent ?? 0;
  const totalBudget = budget?.totalBudget ?? 0;
  const remaining = budget?.remaining ?? 0;
  const percentUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Budget Burn</CardTitle>
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
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Budget Burn</span>
          <Badge
            variant="outline"
            className={`text-xs ${
              percentUsed > 90 ? 'text-red-600' : percentUsed > 75 ? 'text-yellow-600' : 'text-green-600'
            }`}
          >
            {percentUsed.toFixed(0)}% used
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Budget Summary */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <span className="text-xs text-gray-500 block">Total Budget</span>
            <span className="text-sm font-bold">${(totalBudget / 1000).toFixed(0)}k</span>
          </div>
          <div className="text-center p-2 bg-red-50 rounded">
            <span className="text-xs text-gray-500 block">Spent</span>
            <span className="text-sm font-bold text-red-600">${(totalSpent / 1000).toFixed(0)}k</span>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <span className="text-xs text-gray-500 block">Remaining</span>
            <span className="text-sm font-bold text-green-600">${(remaining / 1000).toFixed(0)}k</span>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{ fontSize: 12 }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="planned" fill="#e5e7eb" name="Planned" radius={[2, 2, 0, 0]} />
              <Bar dataKey="actual" fill="#3b82f6" name="Actual" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Burn Rate */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Monthly Burn Rate</span>
            <span className="font-medium">${(metrics?.budgetBurnRate ?? 0).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
