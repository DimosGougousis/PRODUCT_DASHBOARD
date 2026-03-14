import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { BacklogHealthCard } from '@/components/governance/backlog/BacklogHealthCard';
import { BacklogAgingChart } from '@/components/governance/backlog/BacklogAgingChart';
import { StoryReadinessChart } from '@/components/governance/backlog/StoryReadinessChart';
import { useBacklogMetrics } from '@/hooks/governance/useBacklogMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, AlertCircle, Clock } from 'lucide-react';

export default function BacklogHealthPage() {
  const { data: metrics, isLoading } = useBacklogMetrics({
    projectKey: 'PROJ',
    useMock: true,
  });

  const readyPercentage = metrics
    ? Math.round((metrics.readyStories / metrics.totalStories) * 100)
    : 0;

  return (
    <GovernanceLayout
      title="Backlog Health"
      description="Monitor backlog quality, aging, and story readiness"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Stories</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.totalStories || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              In product backlog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ready Stories</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.readyStories || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {readyPercentage}% of backlog
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Health Score</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.healthScore || 0}/100`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics && metrics.healthScore >= 80
                ? '✅ Healthy'
                : metrics && metrics.healthScore >= 60
                ? '⚠️ Fair'
                : '🔴 Needs attention'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Story Age</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.averageAge || 0} days`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics && metrics.averageAge > 60
                ? '⚠️ Stories aging'
                : '✅ Fresh backlog'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <BacklogHealthCard data={metrics} isLoading={isLoading} />
        <StoryReadinessChart data={metrics} isLoading={isLoading} />
      </div>

      <BacklogAgingChart data={metrics} isLoading={isLoading} />

      {/* INVEST/DEEP Breakdown */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Backlog Quality Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* INVEST Scores */}
            <div>
              <h4 className="font-semibold mb-4">INVEST Criteria</h4>
              <div className="space-y-3">
                {metrics?.investScores && Object.entries(metrics.investScores).map(([key, score]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DEEP Scores */}
            <div>
              <h4 className="font-semibold mb-4">DEEP Criteria</h4>
              <div className="space-y-3">
                {metrics?.deepScores && Object.entries(metrics.deepScores).map(([key, score]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-sm capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            score >= 80 ? 'bg-green-500' : score >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium w-8">{score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
