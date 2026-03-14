import { TrendingUp, TrendingDown, Users, Clock, Target, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function ExecutiveDashboard() {
  const metrics = {
    prdsCreated: { value: 47, change: 85, trend: 'up' as const },
    avgCycleTime: { value: 8.2, change: -47, trend: 'down' as const },
    pmTimeSaved: { value: 62, change: 12, trend: 'up' as const },
    adoptionRate: { value: 73, change: 8, trend: 'up' as const },
  };

  const healthIndicators = [
    { name: 'Agent Performance', score: 89, color: 'bg-green-500' },
    { name: 'User Satisfaction', score: 88, color: 'bg-green-500' },
    { name: 'System Reliability', score: 99, color: 'bg-green-500' },
    { name: 'Data Quality', score: 76, color: 'bg-yellow-500' },
  ];

  const adoptionFunnel = [
    { stage: 'Eligible PMs', value: 65, percentage: 100 },
    { stage: 'Activated', value: 47, percentage: 73 },
    { stage: 'Regular Use', value: 38, percentage: 58 },
    { stage: 'Power Users', value: 12, percentage: 18 },
  ];

  const trendData = [
    { week: 'W1', prds: 8, cycleTime: 14 },
    { week: 'W2', prds: 10, cycleTime: 12 },
    { week: 'W3', prds: 12, cycleTime: 10 },
    { week: 'W4', prds: 11, cycleTime: 9 },
  ];

  const alerts = [
    {
      severity: 'critical',
      title: '2 PRDs at risk of missing timeline',
      description: 'Escalation sent to respective teams',
    },
    {
      severity: 'medium',
      title: 'Data quality score dropped 8pts',
      description: 'Investigation started',
    },
    {
      severity: 'info',
      title: '3 teams showing low adoption',
      description: 'Targeted training scheduled',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">Executive Dashboard</h1>
          <p className="text-gray-600">AI PM Agent performance and business impact</p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <MetricCard
            title="PRDs Created"
            value={metrics.prdsCreated.value}
            unit=""
            change={metrics.prdsCreated.change}
            trend={metrics.prdsCreated.trend}
            icon={Target}
          />
          <MetricCard
            title="Avg Cycle Time"
            value={metrics.avgCycleTime.value}
            unit="days"
            change={metrics.avgCycleTime.change}
            trend={metrics.avgCycleTime.trend}
            icon={Clock}
          />
          <MetricCard
            title="PM Time Saved"
            value={metrics.pmTimeSaved.value}
            unit="%"
            change={metrics.pmTimeSaved.change}
            trend={metrics.pmTimeSaved.trend}
            icon={TrendingUp}
          />
          <MetricCard
            title="Adoption Rate"
            value={metrics.adoptionRate.value}
            unit="%"
            change={metrics.adoptionRate.change}
            trend={metrics.adoptionRate.trend}
            icon={Users}
          />
        </div>

        {/* Business Impact */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Business Impact</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold text-sm mb-3">📈 Productivity Gains</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">PRDs per PM/quarter:</span>
                    <span className="font-medium">12 → 22 (+83%)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Time-to-first-draft:</span>
                    <span className="font-medium">14d → 2.8d (-80%)</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Revision cycles:</span>
                    <span className="font-medium">3.2 → 1.4 (-56%)</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">💰 Cost Efficiency</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">PM hours saved:</span>
                    <span className="font-medium">1,840 hrs/month</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Stakeholder time saved:</span>
                    <span className="font-medium">620 hrs/month</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Estimated value:</span>
                    <span className="font-medium text-green-600">$615K/quarter</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3">✨ Quality Improvements</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-gray-600">First-draft completeness:</span>
                    <span className="font-medium">47% → 82%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Eng acceptance rate:</span>
                    <span className="font-medium">71% → 89%</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Stakeholder satisfaction:</span>
                    <span className="font-medium">3.8 → 4.4 / 5</span>
                  </li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Indicators */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Health Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {healthIndicators.map((indicator) => (
                <div key={indicator.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">{indicator.name}</span>
                    <span className="text-sm font-semibold">{indicator.score}/100</span>
                  </div>
                  <Progress value={indicator.score} className="h-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-6 mb-6">
          {/* Adoption Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Adoption Funnel</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {adoptionFunnel.map((stage) => (
                  <div key={stage.stage}>
                    <div className="flex items-center justify-between mb-1 text-sm">
                      <span className="font-medium">{stage.stage}</span>
                      <span className="text-gray-600">
                        {stage.value} ({stage.percentage}%)
                      </span>
                    </div>
                    <Progress value={stage.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Recent Alerts
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {alerts.map((alert, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg border-l-4 ${
                      alert.severity === 'critical'
                        ? 'bg-red-50 border-red-500'
                        : alert.severity === 'medium'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <p className="font-medium text-sm mb-1">{alert.title}</p>
                    <p className="text-xs text-gray-600">{alert.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trends</CardTitle>
            <CardDescription>Last 4 weeks</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="prds"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="PRDs Created"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="cycleTime"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Avg Cycle Time (days)"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}

function MetricCard({
  title,
  value,
  unit,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}) {
  const isPositive = (trend === 'up' && change > 0) || (trend === 'down' && change < 0);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className="w-4 h-4 text-gray-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline justify-between">
          <div>
            <p className="text-3xl font-bold">
              {value}
              <span className="text-lg text-gray-500 ml-1">{unit}</span>
            </p>
          </div>
          <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span>{Math.abs(change)}%</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">vs last month</p>
      </CardContent>
    </Card>
  );
}
