import Layout from '@/components/layout/Layout';
import MetricCard from '@/components/dashboard/MetricCard';
import RecentActivity from '@/components/dashboard/RecentActivity';
import PRDChart from '@/components/dashboard/PRDChart';
import PRDCard from '@/components/prd/PRDCard';
import { usePRDs } from '@/context/PRDContext';
import { FileText, Clock, CheckCircle2, AlertCircle, TrendingUp, Users, Loader2 } from 'lucide-react';
import { useEffect } from 'react';

const Dashboard = () => {
  const { prds, isLoading } = usePRDs();
  
  useEffect(() => {
    console.log('Dashboard mounted, isLoading:', isLoading, 'prds count:', prds?.length);
  }, [isLoading, prds]);

  const metrics = {
    totalPRDs: prds.length,
    inProgress: prds.filter((p) => p.status === 'waiting' || p.status === 'research').length,
    completed: prds.filter((p) => p.status === 'complete').length,
    inReview: prds.filter((p) => p.status === 'review').length,
  };

  const recentPRDs = prds.slice(0, 3);

  if (isLoading) {
    return (
      <Layout title="Dashboard" subtitle="Overview of your PRD Kanban board">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Dashboard" subtitle="Overview of your PRD Kanban board">
      <div className="space-y-6 animate-fade-in p-6">
        {/* Metrics Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            title="Total PRDs"
            value={metrics.totalPRDs}
            icon={<FileText className="h-5 w-5 text-primary" />}
            trend={{ value: 12, label: 'vs last month' }}
          />
          <MetricCard
            title="In Progress"
            value={metrics.inProgress}
            icon={<Clock className="h-5 w-5 text-amber-500" />}
            subtitle="Actively being worked on"
          />
          <MetricCard
            title="Completed"
            value={metrics.completed}
            icon={<CheckCircle2 className="h-5 w-5 text-green-500" />}
            trend={{ value: 8, label: 'vs last month' }}
          />
          <MetricCard
            title="In Review"
            value={metrics.inReview}
            icon={<AlertCircle className="h-5 w-5 text-purple-500" />}
            subtitle="Awaiting approval"
          />
        </div>

        {/* Secondary Metrics */}
        <div className="grid gap-4 md:grid-cols-2">
          <MetricCard
            title="Avg. Completion Time"
            value="14 days"
            icon={<TrendingUp className="h-5 w-5 text-accent-foreground" />}
            subtitle="From backlog to complete"
            trend={{ value: -15, label: 'improvement' }}
          />
          <MetricCard
            title="Stakeholder Response Rate"
            value="78%"
            icon={<Users className="h-5 w-5 text-primary" />}
            subtitle="Within 24 hours"
            trend={{ value: 5, label: 'vs last month' }}
          />
        </div>

        {/* Charts and Activity */}
        <div className="grid gap-6 lg:grid-cols-2">
          <PRDChart />
          <RecentActivity />
        </div>

        {/* Recent PRDs */}
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Recent PRDs</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentPRDs.map((prd) => (
              <PRDCard key={prd.id} prd={prd} />
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
