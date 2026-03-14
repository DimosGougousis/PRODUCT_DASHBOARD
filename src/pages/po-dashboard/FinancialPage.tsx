import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { BudgetBurnChart } from '@/components/governance/financial/BudgetBurnChart';
import { CostPerStoryPoint } from '@/components/governance/financial/CostPerStoryPoint';
import { useFinancialMetrics } from '@/hooks/governance/useFinancialMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, TrendingDown, PiggyBank, Calculator, AlertTriangle } from 'lucide-react';

export default function FinancialPage() {
  const { data: metrics, isLoading } = useFinancialMetrics({
    useMock: true,
  });

  const budgetVariance = metrics
    ? ((metrics.budget.actualSpend / metrics.budget.plannedSpend) * 100 - 100).toFixed(1)
    : '0';

  return (
    <GovernanceLayout
      title="Financial Metrics"
      description="Track budget consumption, costs, and financial health"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Status</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `$${(metrics?.budget.actualSpend || 0).toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">
              of ${(metrics?.budget.totalBudget || 0).toLocaleString()} total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Variance</CardTitle>
            {Number(budgetVariance) > 0 ? (
              <TrendingUp className="h-4 w-4 text-red-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-green-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              Number(budgetVariance) > 5 ? 'text-red-600' : 
              Number(budgetVariance) < -5 ? 'text-green-600' : 'text-gray-600'
            }`}>
              {isLoading ? '-' : `${Number(budgetVariance) > 0 ? '+' : ''}${budgetVariance}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {Number(budgetVariance) > 5 ? '⚠️ Over budget' : 
               Number(budgetVariance) < -5 ? '✅ Under budget' : '✅ On track'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cost Per Point</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `$${metrics?.costPerPoint.current || 0}`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.costPerPoint.trend === 'down' ? '✅ Improving' : 
               metrics?.costPerPoint.trend === 'up' ? '⚠️ Increasing' : '➡️ Stable'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Forecast EAC</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `$${(metrics?.budget.forecastEac || 0).toLocaleString()}`}
            </div>
            <p className="text-xs text-muted-foreground">
              Estimated at completion
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <BudgetBurnChart data={metrics?.budget} isLoading={isLoading} />
        </div>
        <div>
          <CostPerStoryPoint data={metrics?.costPerPoint} isLoading={isLoading} />
        </div>
      </div>

      {/* Budget Breakdown */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Budget Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Personnel</h4>
              <div className="text-2xl font-bold">
                ${(metrics?.budget.breakdown.personnel || 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">
                {((metrics?.budget.breakdown.personnel || 0) / (metrics?.budget.totalBudget || 1) * 100).toFixed(0)}% of budget
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-500 h-2 rounded-full"
                  style={{ width: `${((metrics?.budget.breakdown.personnel || 0) / (metrics?.budget.totalBudget || 1) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Infrastructure</h4>
              <div className="text-2xl font-bold">
                ${(metrics?.budget.breakdown.infrastructure || 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">
                {((metrics?.budget.breakdown.infrastructure || 0) / (metrics?.budget.totalBudget || 1) * 100).toFixed(0)}% of budget
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full"
                  style={{ width: `${((metrics?.budget.breakdown.infrastructure || 0) / (metrics?.budget.totalBudget || 1) * 100)}%` }}
                />
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <h4 className="font-semibold mb-2">Tools & Licenses</h4>
              <div className="text-2xl font-bold">
                ${(metrics?.budget.breakdown.tools || 0).toLocaleString()}
              </div>
              <p className="text-sm text-gray-500">
                {((metrics?.budget.breakdown.tools || 0) / (metrics?.budget.totalBudget || 1) * 100).toFixed(0)}% of budget
              </p>
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-purple-500 h-2 rounded-full"
                  style={{ width: `${((metrics?.budget.breakdown.tools || 0) / (metrics?.budget.totalBudget || 1) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alerts */}
      {Number(budgetVariance) > 10 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 text-red-600" />
          <div>
            <h4 className="font-semibold text-red-800">Budget Alert</h4>
            <p className="text-sm text-red-700">
              Project is {budgetVariance}% over budget. Review spending and consider scope adjustments.
            </p>
          </div>
        </div>
      )}
    </GovernanceLayout>
  );
}
