import { cn } from '@/lib/utils';
import { Priority } from '@/types/prd';

interface PriorityIndicatorProps {
  priority: Priority;
  showLabel?: boolean;
}

const priorityConfig: Record<Priority, { label: string; className: string; bgClass: string }> = {
  P0: { label: 'P0', className: 'text-red-600', bgClass: 'bg-red-100 text-red-700 border-red-200' },
  P1: { label: 'P1', className: 'text-amber-600', bgClass: 'bg-amber-100 text-amber-700 border-amber-200' },
  P2: { label: 'P2', className: 'text-slate-600', bgClass: 'bg-slate-100 text-slate-700 border-slate-200' },
};

const PriorityIndicator = ({ priority, showLabel = true }: PriorityIndicatorProps) => {
  const config = priorityConfig[priority];

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded border px-2 py-0.5 text-xs font-semibold',
        config.bgClass
      )}
    >
      {config.label}
    </span>
  );
};

export default PriorityIndicator;
