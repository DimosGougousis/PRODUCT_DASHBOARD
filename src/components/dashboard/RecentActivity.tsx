import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { FileText, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Activity {
  id: string;
  type: 'created' | 'updated' | 'completed' | 'comment' | 'blocked';
  user: string;
  prd: string;
  time: string;
}

const activities: Activity[] = [
  { id: '1', type: 'updated', user: 'Sarah Chen', prd: 'User Authentication Redesign', time: '2 hours ago' },
  { id: '2', type: 'comment', user: 'Marcus Johnson', prd: 'Analytics Dashboard V2', time: '4 hours ago' },
  { id: '3', type: 'completed', user: 'Emily Rodriguez', prd: 'Customer Onboarding Flow', time: '6 hours ago' },
  { id: '4', type: 'blocked', user: 'David Kim', prd: 'API Rate Limiting Implementation', time: '1 day ago' },
  { id: '5', type: 'created', user: 'Lisa Thompson', prd: 'Mobile App Performance', time: '2 days ago' },
];

const activityConfig = {
  created: { icon: FileText, color: 'text-primary', bg: 'bg-primary/10' },
  updated: { icon: FileText, color: 'text-status-in-progress', bg: 'bg-status-in-progress/10' },
  completed: { icon: CheckCircle2, color: 'text-status-done', bg: 'bg-status-done/10' },
  comment: { icon: MessageSquare, color: 'text-status-review', bg: 'bg-status-review/10' },
  blocked: { icon: AlertCircle, color: 'text-status-blocked', bg: 'bg-status-blocked/10' },
};

const RecentActivity = () => {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const getActivityText = (type: Activity['type']) => {
    switch (type) {
      case 'created':
        return 'created';
      case 'updated':
        return 'updated';
      case 'completed':
        return 'completed';
      case 'comment':
        return 'commented on';
      case 'blocked':
        return 'flagged as blocked';
    }
  };

  return (
    <Card className="border border-border">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => {
          const config = activityConfig[activity.type];
          const Icon = config.icon;

          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={cn('flex h-8 w-8 items-center justify-center rounded-full', config.bg)}>
                <Icon className={cn('h-4 w-4', config.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{getActivityText(activity.type)}</span>{' '}
                  <span className="font-medium">{activity.prd}</span>
                </p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default RecentActivity;
