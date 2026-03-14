import Layout from '@/components/layout/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  AlertTriangle,
  TrendingUp,
  Clock,
  Users,
  Lightbulb,
  ArrowRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface Insight {
  id: string;
  type: 'warning' | 'opportunity' | 'suggestion';
  title: string;
  description: string;
  prd?: string;
  action?: string;
}

const insights: Insight[] = [
  {
    id: '1',
    type: 'warning',
    title: 'Stakeholder Bottleneck Detected',
    description: 'Sarah Chen has 4 pending section reviews. Consider redistributing workload or sending a reminder.',
    prd: 'User Authentication Redesign',
    action: 'Send reminder',
  },
  {
    id: '2',
    type: 'opportunity',
    title: 'Fast-Track Opportunity',
    description: 'Analytics Dashboard V2 is 85% complete with only 1 section pending. Prioritize review to ship early.',
    prd: 'Analytics Dashboard V2',
    action: 'View PRD',
  },
  {
    id: '3',
    type: 'warning',
    title: 'Overdue Deadline',
    description: 'API Rate Limiting Implementation has been blocked for 3 days. Infrastructure team capacity issue identified.',
    prd: 'API Rate Limiting Implementation',
    action: 'Escalate',
  },
  {
    id: '4',
    type: 'suggestion',
    title: 'Similar PRDs Detected',
    description: 'Mobile App Performance and User Authentication share 3 stakeholders. Consider consolidating timelines.',
    action: 'Review overlap',
  },
  {
    id: '5',
    type: 'opportunity',
    title: 'High Response Rate',
    description: 'Marcus Johnson has responded to 95% of requests within 4 hours. Consider assigning critical sections.',
  },
];

const insightConfig = {
  warning: {
    icon: AlertTriangle,
    bg: 'bg-status-blocked/10',
    border: 'border-status-blocked/20',
    iconColor: 'text-status-blocked',
    badge: 'bg-status-blocked/10 text-status-blocked',
  },
  opportunity: {
    icon: TrendingUp,
    bg: 'bg-status-done/10',
    border: 'border-status-done/20',
    iconColor: 'text-status-done',
    badge: 'bg-status-done/10 text-status-done',
  },
  suggestion: {
    icon: Lightbulb,
    bg: 'bg-status-in-progress/10',
    border: 'border-status-in-progress/20',
    iconColor: 'text-status-in-progress',
    badge: 'bg-status-in-progress/10 text-status-in-progress',
  },
};

const AIInsights = () => {
  return (
    <Layout title="AI Insights" subtitle="Intelligent recommendations for your PRD portfolio">
      <div className="space-y-6 animate-fade-in">
        {/* Hero Card */}
        <Card className="overflow-hidden border border-primary/20 bg-gradient-to-br from-accent to-background">
          <CardContent className="flex items-center gap-6 p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
              <Sparkles className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-foreground">
                AI-Powered Insights
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Based on your PRD data, we've identified {insights.length} actionable insights to help you
                optimize your workflow and unblock your team.
              </p>
            </div>
            <Button variant="outline" className="gap-2">
              Refresh Analysis
              <Sparkles className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-blocked/10">
                <AlertTriangle className="h-5 w-5 text-status-blocked" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Warnings</p>
              </div>
            </div>
          </Card>
          <Card className="border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-done/10">
                <TrendingUp className="h-5 w-5 text-status-done" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Opportunities</p>
              </div>
            </div>
          </Card>
          <Card className="border border-border p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-status-in-progress/10">
                <Lightbulb className="h-5 w-5 text-status-in-progress" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">1</p>
                <p className="text-sm text-muted-foreground">Suggestions</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Insights List */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">All Insights</h3>
          {insights.map((insight) => {
            const config = insightConfig[insight.type];
            const Icon = config.icon;

            return (
              <Card
                key={insight.id}
                className={cn(
                  'border transition-all hover:shadow-card-hover',
                  config.border
                )}
              >
                <CardContent className="flex items-start gap-4 p-5">
                  <div
                    className={cn(
                      'flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg',
                      config.bg
                    )}
                  >
                    <Icon className={cn('h-5 w-5', config.iconColor)} />
                  </div>

                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {insight.title}
                      </h4>
                      <Badge className={cn('text-xs', config.badge)}>
                        {insight.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {insight.description}
                    </p>
                    {insight.prd && (
                      <p className="text-xs text-muted-foreground">
                        Related PRD:{' '}
                        <span className="font-medium text-foreground">
                          {insight.prd}
                        </span>
                      </p>
                    )}
                  </div>

                  {insight.action && (
                    <Button variant="outline" size="sm" className="gap-1.5">
                      {insight.action}
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default AIInsights;
