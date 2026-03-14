import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { TeamSatisfactionGauge } from '@/components/governance/team/TeamSatisfactionGauge';
import { SprintRetrospectiveSummary } from '@/components/governance/team/SprintRetrospectiveSummary';
import { useTeamHealthMetrics } from '@/hooks/governance/useTeamHealthMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, TrendingUp, TrendingDown, Minus, Users, Smile, Activity } from 'lucide-react';

export default function TeamHealthPage() {
  const { data: metrics, isLoading } = useTeamHealthMetrics({
    useMock: true,
  });

  const satisfactionTrend = metrics?.satisfaction.overall.trend;

  return (
    <GovernanceLayout
      title="Team Health"
      description="Monitor team satisfaction, well-being, and retention metrics"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <div className={`flex items-center ${
              satisfactionTrend === 'up' ? 'text-green-600' : 
              satisfactionTrend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {satisfactionTrend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
               satisfactionTrend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
               <Minus className="h-4 w-4" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.satisfaction.overall.score || 0}/10`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.satisfaction.overall.score && metrics.satisfaction.overall.score >= 8
                ? '✅ High satisfaction'
                : metrics?.satisfaction.overall.score && metrics.satisfaction.overall.score >= 6
                ? '🟡 Moderate'
                : '🔴 Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Team Size</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.teamSize.current || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.teamSize.change && metrics.teamSize.change > 0 ? '+' : ''}
              {metrics?.teamSize.change || 0} from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Retention Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.retention.rate || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.retention.rate && metrics.retention.rate >= 90
                ? '✅ Excellent'
                : metrics?.retention.rate && metrics.retention.rate >= 80
                ? '🟡 Good'
                : '⚠️ Monitor'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Burnout Risk</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {isLoading ? '-' : (metrics?.burnout.riskLevel || 'low')}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.burnout.riskLevel === 'low'
                ? '✅ Healthy team'
                : metrics?.burnout.riskLevel === 'medium'
                ? '⚠️ Watch closely'
                : '🔴 Immediate action'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <TeamSatisfactionGauge data={metrics?.satisfaction} isLoading={isLoading} />
        <SprintRetrospectiveSummary data={metrics} isLoading={isLoading} />
      </div>

      {/* Satisfaction Categories */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Satisfaction Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics?.satisfaction.categories.map((category) => (
              <div key={category.name} className="flex items-center gap-4">
                <div className="w-32 font-medium">{category.name}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                  <div
                    className={`h-full flex items-center justify-end px-2 text-white text-sm font-medium ${
                      category.score >= 8 ? 'bg-green-500' :
                      category.score >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(category.score / 10) * 100}%` }}
                  >
                    {category.score}/10
                  </div>
                </div>
                <div className="w-24 text-sm">
                  {category.score >= 8 ? (
                    <span className="text-green-600 flex items-center gap-1">
                      <Smile className="h-4 w-4" /> Good
                    </span>
                  ) : category.score >= 6 ? (
                    <span className="text-yellow-600">Fair</span>
                  ) : (
                    <span className="text-red-600">Poor</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Items */}
      <Card>
        <CardHeader>
          <CardTitle>Retrospective Action Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {metrics?.retrospectives?.latest?.actionItems?.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      item.status === 'completed'
                        ? 'bg-green-500'
                        : item.status === 'in_progress'
                        ? 'bg-blue-500'
                        : 'bg-gray-300'
                    }`}
                  />
                  <span className={item.status === 'completed' ? 'line-through text-gray-500' : ''}>
                    {item.text}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-500">Owner: {item.owner}</span>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      item.status === 'completed'
                        ? 'bg-green-100 text-green-800'
                        : item.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {item.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between text-sm">
              <span>
                <strong>Completion Rate:</strong>{' '}
                {metrics?.retrospectives?.latest?.completionRate || 0}%
              </span>
              <span className="text-gray-500">
                {metrics?.retrospectives?.latest?.completedCount || 0} of{' '}
                {metrics?.retrospectives?.latest?.totalCount || 0} items completed
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
