import { GovernanceLayout } from '@/components/governance/GovernanceLayout';
import { NPSCsatTrendChart } from '@/components/governance/customer/NPSCsatTrendChart';
import { SupportTicketVolume } from '@/components/governance/customer/SupportTicketVolume';
import { useCustomerMetrics } from '@/hooks/governance/useCustomerMetrics';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus, Users, HeadphonesIcon, MessageSquare, Star } from 'lucide-react';

export default function CustomerMetricsPage() {
  const { data: metrics, isLoading } = useCustomerMetrics({
    useMock: true,
  });

  const npsTrend = metrics?.nps.trend;

  return (
    <GovernanceLayout
      title="Customer Metrics"
      description="Track customer satisfaction, NPS, and support experience"
    >
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">NPS Score</CardTitle>
            <div className={`flex items-center ${
              npsTrend === 'up' ? 'text-green-600' : 
              npsTrend === 'down' ? 'text-red-600' : 'text-gray-600'
            }`}>
              {npsTrend === 'up' ? <TrendingUp className="h-4 w-4" /> : 
               npsTrend === 'down' ? <TrendingDown className="h-4 w-4" /> : 
               <Minus className="h-4 w-4" />}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.nps.score || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.nps.score && metrics.nps.score >= 50
                ? '✅ Excellent'
                : metrics?.nps.score && metrics.nps.score >= 30
                ? '🟡 Good'
                : '🔴 Needs improvement'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CSAT Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.csat.score || 0}/5`}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.csat.responseRate || 0}% response rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Tickets</CardTitle>
            <HeadphonesIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : metrics?.supportTickets.total || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {metrics?.supportTickets.highPriority || 0} high priority
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoading ? '-' : `${metrics?.supportTickets.avgResolutionTime || 0}h`}
            </div>
            <p className="text-xs text-muted-foreground">
              Resolution time
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2">
          <NPSCsatTrendChart data={metrics} isLoading={isLoading} />
        </div>
        <div>
          <SupportTicketVolume data={metrics?.supportTickets} isLoading={isLoading} />
        </div>
      </div>

      {/* NPS Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Promoters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {isLoading ? '-' : `${metrics?.nps.promoters || 0}%`}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Score 9-10 • Loyal enthusiasts who will recommend your product
            </p>
            <div className="mt-4 text-sm">
              <span className="font-medium">Count: </span>
              {metrics?.nps.promotersCount || 0} respondents
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Passives</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">
              {isLoading ? '-' : `${metrics?.nps.passives || 0}%`}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Score 7-8 • Satisfied but unenthusiastic customers
            </p>
            <div className="mt-4 text-sm">
              <span className="font-medium">Count: </span>
              {metrics?.nps.passivesCount || 0} respondents
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Detractors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {isLoading ? '-' : `${metrics?.nps.detractors || 0}%`}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Score 0-6 • Unhappy customers who can damage your brand
            </p>
            <div className="mt-4 text-sm">
              <span className="font-medium">Count: </span>
              {metrics?.nps.detractorsCount || 0} respondents
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Recent Customer Feedback</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metrics?.recentFeedback?.map((feedback, index) => (
              <div key={index} className="p-4 border rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      feedback.type === 'promoter' ? 'bg-green-100 text-green-800' :
                      feedback.type === 'passive' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {feedback.type.charAt(0).toUpperCase() + feedback.type.slice(1)}
                    </span>
                    <span className="text-sm text-gray-500">{feedback.date}</span>
                  </div>
                  <span className="font-bold">Score: {feedback.score}/10</span>
                </div>
                <p className="text-sm text-gray-700">{feedback.comment}</p>
                {feedback.source && (
                  <p className="text-xs text-gray-500 mt-2">Source: {feedback.source}</p>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </GovernanceLayout>
  );
}
