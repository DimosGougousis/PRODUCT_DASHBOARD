import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { VelocityTrendChart } from '@/components/governance/delivery/VelocityTrendChart';
import { SprintBurndownChart } from '@/components/governance/delivery/SprintBurndownChart';
import { SprintGoalStatus } from '@/components/governance/delivery/SprintGoalStatus';
import { useDeliveryMetrics } from '@/hooks/governance/useDeliveryMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Clock, Target, Activity } from 'lucide-react';

export default function DeliveryPerformancePage() {
  const { data: metrics, isLoading } = useDeliveryMetrics({
    boardId: 1,
    useMock: true,
  });

  return (
    <GovernanceLayout
      title="Delivery Performance"
      description="Track sprint velocity, progress, and delivery predictability"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Velocity</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.velocityTrend.average || 0} SP`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.velocityTrend.trend === 'up' ? '+' : ''}
              {metrics?.velocityTrend.changePercent || 0}% from last sprint
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sprint Progress</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.sprint.progress.percentage || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.sprint.progress.remaining || 0} points remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Days Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.sprint.daysRemaining || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Until sprint {metrics?.sprint.sprintName || 'end'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading
                ? '-'
                : `${metrics?.sprint.progress.completed || 0}/${
                    metrics?.sprint.progress.total || 0
                  }`}
            </div>
            <p className="text-xs text-muted-foreground">Stories completed/total</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <VelocityTrendChart data={metrics?.velocityTrend} isLoading={isLoading} />
        </div>
        <div>
          <SprintGoalStatus sprint={metrics?.sprint} isLoading={isLoading} />
        </div>
      </div>

      {/* Burndown Chart */}
      <div className="mt-6">
        <SprintBurndownChart data={metrics?.burndown} isLoading={isLoading} />
      </div>

      {/* Historical Data Table */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Sprint History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Sprint</th>
                  <th className="text-left py-2 px-4">Committed</th>
                  <th className="text-left py-2 px-4">Completed</th>
                  <th className="text-left py-2 px-4">Velocity</th>
                  <th className="text-left py-2 px-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics?.velocityTrend.sprints.map((sprint, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4 font-medium">{sprint.name}</td>
                    <td className="py-2 px-4">{sprint.committed} SP</td>
                    <td className="py-2 px-4">{sprint.completed} SP</td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          sprint.completed >= sprint.committed
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {((sprint.completed / sprint.committed) * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      {sprint.completed >= sprint.committed ? '✅ Success' : '⚠️ Missed'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
