import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { SprintBurndownChart } from '@/components/governance/delivery/SprintBurndownChart';
import { SprintGoalStatus } from '@/components/governance/delivery/SprintGoalStatus';
import { useDeliveryMetrics } from '@/hooks/governance/useDeliveryMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Activity, Users, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function ActiveSprintPage() {
  const { data: metrics, isLoading } = useDeliveryMetrics({
    boardId: 1,
    useMock: true,
  });

  const sprint = metrics?.sprint;

  return (
    <GovernanceLayout
      title="Active Sprint"
      description={`Sprint ${sprint?.sprintName || 'Current'} - Day ${sprint?.day || 1} of ${sprint?.totalDays || 14}`}
    >
      {/* Sprint Status Banner */}
      <div className={`p-4 rounded-lg mb-6 ${
        sprint?.goalStatus === 'on_track' ? 'bg-green-50 border border-green-200' :
        sprint?.goalStatus === 'at_risk' ? 'bg-yellow-50 border border-yellow-200' :
        'bg-red-50 border border-red-200'
      }`}>
        <div className="flex items-center gap-3">
          {sprint?.goalStatus === 'on_track' ? (
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          ) : sprint?.goalStatus === 'at_risk' ? (
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          ) : (
            <AlertCircle className="h-6 w-6 text-red-600" />
          )}
          <div>
            <h3 className={`font-semibold ${
              sprint?.goalStatus === 'on_track' ? 'text-green-800' :
              sprint?.goalStatus === 'at_risk' ? 'text-yellow-800' :
              'text-red-800'
            }`}>
              Sprint Goal: {sprint?.goalStatus === 'on_track' ? 'On Track' : sprint?.goalStatus === 'at_risk' ? 'At Risk' : 'Off Track'}
            </h3>
            <p className={`text-sm ${
              sprint?.goalStatus === 'on_track' ? 'text-green-700' :
              sprint?.goalStatus === 'at_risk' ? 'text-yellow-700' :
              'text-red-700'
            }`}>
              {sprint?.goal}
            </p>
          </div>
        </div>
      </div>

      {/* Sprint Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progress</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprint?.progress.percentage || 0}%</div>
            <Progress value={sprint?.progress.percentage || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stories</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sprint?.progress.completed || 0}/{sprint?.progress.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {sprint?.progress.total && sprint.progress.completed
                ? sprint.progress.total - sprint.progress.completed
                : 0} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Story Points</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sprint?.progress.completedPoints || 0}/{sprint?.progress.totalPoints || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              SP completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Remaining</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sprint?.daysRemaining || 0} days</div>
            <p className="text-xs text-muted-foreground">
              Ends {sprint?.endDate ? new Date(sprint.endDate).toLocaleDateString() : 'soon'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Burndown Chart */}
      <div className="mb-6">
        <SprintBurndownChart data={metrics?.burndown} isLoading={isLoading} />
      </div>

      {/* Sprint Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Sprint Issues</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4">Key</th>
                      <th className="text-left py-2 px-4">Summary</th>
                      <th className="text-left py-2 px-4">Status</th>
                      <th className="text-left py-2 px-4">Assignee</th>
                      <th className="text-left py-2 px-4">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sprint?.issues?.map((issue) => (
                      <tr key={issue.key} className="border-b">
                        <td className="py-2 px-4 font-medium">{issue.key}</td>
                        <td className="py-2 px-4">{issue.summary}</td>
                        <td className="py-2 px-4">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            issue.status === 'Done'
                              ? 'bg-green-100 text-green-800'
                              : issue.status === 'In Progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {issue.status}
                          </span>
                        </td>
                        <td className="py-2 px-4">{issue.assignee || 'Unassigned'}</td>
                        <td className="py-2 px-4">{issue.storyPoints || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <SprintGoalStatus sprint={sprint} isLoading={isLoading} />
        </div>
      </div>

      {/* Team Velocity */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Team Capacity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {sprint?.teamCapacity?.map((member) => (
              <div key={member.name} className="p-3 border rounded-lg">
                <p className="font-medium text-sm">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(member.capacity.used / member.capacity.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs">{member.capacity.used}h</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
