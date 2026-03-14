import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Link } from 'react-router-dom';
import { 
  Truck, ShieldCheck, ClipboardList, Activity, Users, DollarSign, Target, Heart,
  TrendingUp, TrendingDown, ArrowRight, AlertCircle, CheckCircle2, Clock
} from 'lucide-react';

// Mock data for overview - in real implementation, these would come from aggregated API calls
const PILLARS = [
  {
    id: 'delivery',
    name: 'Delivery Performance',
    path: '/governance/delivery',
    icon: Truck,
    status: 'on_track',
    score: 87,
    kpis: { primary: '34 SP', secondary: 'Velocity this sprint' },
    trend: 'up',
    alert: null,
  },
  {
    id: 'quality',
    name: 'Quality Metrics',
    path: '/governance/quality',
    icon: ShieldCheck,
    status: 'good',
    score: 81,
    kpis: { primary: '81.5%', secondary: 'Test coverage' },
    trend: 'stable',
    alert: '3 vulnerabilities found',
  },
  {
    id: 'backlog',
    name: 'Backlog Health',
    path: '/governance/backlog',
    icon: ClipboardList,
    status: 'fair',
    score: 72,
    kpis: { primary: '42', secondary: 'Stories ready' },
    trend: 'down',
    alert: '12 stale stories',
  },
  {
    id: 'sprint',
    name: 'Active Sprint',
    path: '/governance/sprint',
    icon: Activity,
    status: 'on_track',
    score: 92,
    kpis: { primary: '73%', secondary: 'Sprint progress' },
    trend: 'up',
    alert: null,
  },
  {
    id: 'customer',
    name: 'Customer Metrics',
    path: '/governance/customer',
    icon: Users,
    status: 'good',
    score: 68,
    kpis: { primary: 'NPS 68', secondary: 'Customer satisfaction' },
    trend: 'up',
    alert: null,
  },
  {
    id: 'financial',
    name: 'Financial',
    path: '/governance/financial',
    icon: DollarSign,
    status: 'good',
    score: 94,
    kpis: { primary: '+2.4%', secondary: 'Budget variance' },
    trend: 'stable',
    alert: null,
  },
  {
    id: 'compliance',
    name: 'Compliance',
    path: '/governance/compliance',
    icon: Target,
    status: 'good',
    score: 85,
    kpis: { primary: '5 open', secondary: 'Security findings' },
    trend: 'stable',
    alert: null,
  },
  {
    id: 'team',
    name: 'Team Health',
    path: '/governance/team',
    icon: Heart,
    status: 'excellent',
    score: 78,
    kpis: { primary: '7.8/10', secondary: 'Team satisfaction' },
    trend: 'up',
    alert: null,
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent':
    case 'on_track':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'good':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'fair':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'at_risk':
    case 'poor':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getTrendIcon = (trend: string) => {
  switch (trend) {
    case 'up':
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    case 'down':
      return <TrendingDown className="h-4 w-4 text-red-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-400" />;
  }
};

export default function GovernanceOverviewPage() {
  return (
    <GovernanceLayout
      title="Governance Overview"
      description="High-level view of all 8 SDLC governance pillars"
    >
      {/* Overall Health */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Overall Governance Health
          </CardTitle>
          <CardDescription>
            Aggregated health score across all governance pillars
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-green-600">82</div>
              <div className="text-sm text-gray-500">Overall Score</div>
            </div>
            <div className="flex-1">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Excellent</span>
                  <span className="text-sm text-gray-500">2 pillars</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Good</span>
                  <span className="text-sm text-gray-500">4 pillars</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Needs Attention</span>
                  <span className="text-sm text-gray-500">2 pillars</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-gray-500">Active Alerts</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pillar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {PILLARS.map((pillar) => {
          const Icon = pillar.icon;
          return (
            <Link key={pillar.id} to={pillar.path}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-5 w-5" />
                      </div>
                      <CardTitle className="text-base">{pillar.name}</CardTitle>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Score */}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">Health Score</span>
                      <div className="flex items-center gap-2">
                        {getTrendIcon(pillar.trend)}
                        <span className="font-semibold">{pillar.score}%</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <Progress value={pillar.score} className="h-2" />

                    {/* Status Badge */}
                    <div className="flex items-center justify-between pt-2">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pillar.status)}`}>
                        {pillar.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* KPI */}
                    <div className="pt-2 border-t">
                      <div className="text-xl font-bold">{pillar.kpis.primary}</div>
                      <div className="text-xs text-gray-500">{pillar.kpis.secondary}</div>
                    </div>

                    {/* Alert */}
                    {pillar.alert && (
                      <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-sm">
                        <AlertCircle className="h-4 w-4 text-red-500" />
                        <span className="text-red-700">{pillar.alert}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/governance/sprint">
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Activity className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Active Sprint</div>
                      <div className="text-sm text-gray-500">View current sprint progress</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/governance/backlog">
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ClipboardList className="h-5 w-5 text-purple-500" />
                    <div>
                      <div className="font-medium">Backlog Health</div>
                      <div className="text-sm text-gray-500">Review stale stories</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>

            <Link to="/governance/compliance">
              <Card className="hover:bg-gray-50 cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium">Security</div>
                      <div className="text-sm text-gray-500">Review open findings</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
