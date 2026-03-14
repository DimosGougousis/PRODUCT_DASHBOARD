/**
 * Sprint Goal Status - Progress indicator for current sprint goal
 */

import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, AlertCircle, Target } from 'lucide-react';

interface SprintGoalStatusProps {
  goal?: string;
  progress: number; // 0-100
  daysRemaining: number;
  isLoading: boolean;
}

function getStatusConfig(progress: number, daysRemaining: number) {
  // Calculate if on track based on progress vs time elapsed
  const totalSprintDays = 14; // Assume 2-week sprints
  const daysElapsed = totalSprintDays - daysRemaining;
  const expectedProgress = (daysElapsed / totalSprintDays) * 100;
  const progressDelta = progress - expectedProgress;
  
  if (progress >= 100) {
    return { 
      icon: CheckCircle, 
      color: 'text-green-500', 
      bg: 'bg-green-50',
      badge: 'Completed',
      badgeVariant: 'default' as const
    };
  }
  if (progressDelta >= -10) {
    return { 
      icon: Circle, 
      color: 'text-blue-500', 
      bg: 'bg-blue-50',
      badge: 'On Track',
      badgeVariant: 'secondary' as const
    };
  }
  if (progressDelta >= -20) {
    return { 
      icon: AlertCircle, 
      color: 'text-yellow-500', 
      bg: 'bg-yellow-50',
      badge: 'At Risk',
      badgeVariant: 'outline' as const
    };
  }
  return { 
    icon: AlertCircle, 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    badge: 'Behind',
    badgeVariant: 'destructive' as const
  };
}

export function SprintGoalStatus({
  goal,
  progress,
  daysRemaining,
  isLoading,
}: SprintGoalStatusProps) {
  const status = getStatusConfig(progress || 0, daysRemaining);
  const StatusIcon = status.icon;

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="h-20 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  // Handle no active sprint
  if (!goal && progress === 0) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 text-gray-400">
            <Target className="w-5 h-5" />
            <span className="text-sm">No active sprint goal</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className={`p-2 rounded-full ${status.bg}`}>
            <StatusIcon className={`w-5 h-5 ${status.color}`} />
          </div>
          
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wide">Sprint Goal</span>
              <Badge variant={status.badgeVariant} className="text-xs">
                {status.badge}
              </Badge>
            </div>
            
            {/* Sprint Goal */}
            <p className="text-sm font-medium mb-3 line-clamp-2">
              {goal || 'Complete sprint commitments'}
            </p>
            
            {/* Progress Bar */}
            <Progress value={progress} className="h-2 mb-2" />
            
            {/* Stats */}
            <div className="flex justify-between text-xs text-gray-500">
              <span>{Math.round(progress)}% complete</span>
              <span>{daysRemaining} days remaining</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
