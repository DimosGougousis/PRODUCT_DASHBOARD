import { cn } from '@/lib/utils';
import { PRDStatus, SectionStatus } from '@/types/prd';
import { Circle, Loader2, CheckCircle2, AlertCircle, Search, Eye, Clock } from 'lucide-react';

interface StatusBadgeProps {
  status: PRDStatus | SectionStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<PRDStatus | SectionStatus, { label: string; className: string; icon: React.ElementType }> = {
  // PRD Statuses
  backlog: { label: 'Backlog', className: 'status-todo', icon: Circle },
  research: { label: 'Research', className: 'status-research', icon: Search },
  waiting: { label: 'Waiting', className: 'status-in-progress', icon: Clock },
  review: { label: 'Review', className: 'status-review', icon: Eye },
  complete: { label: 'Complete', className: 'status-done', icon: CheckCircle2 },
  // Section Statuses
  not_started: { label: 'Not Started', className: 'status-todo', icon: Circle },
  in_progress: { label: 'In Progress', className: 'status-in-progress', icon: Loader2 },
};

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const config = statusConfig[status];
  if (!config) return null;
  
  const Icon = config.icon;

  return (
    <span
      className={cn(
        'status-badge',
        config.className,
        size === 'sm' && 'px-2 py-0.5 text-xs'
      )}
    >
      <Icon className={cn('h-3 w-3', status === 'in_progress' && 'animate-spin')} />
      {config.label}
    </span>
  );
};

export default StatusBadge;
