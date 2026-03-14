import { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: {
    value: number;
    label: string;
  };
  className?: string;
}

const MetricCard = ({ title, value, subtitle, icon, trend, className }: MetricCardProps) => {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="h-3 w-3" />;
    if (trend.value < 0) return <TrendingDown className="h-3 w-3" />;
    return <Minus className="h-3 w-3" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-status-done';
    if (trend.value < 0) return 'text-status-blocked';
    return 'text-muted-foreground';
  };

  return (
    <div className={cn('metric-card', className)}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-semibold text-foreground">{value}</p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
          {icon}
        </div>
      </div>

      {trend && (
        <div className={cn('mt-3 flex items-center gap-1 text-xs font-medium', getTrendColor())}>
          {getTrendIcon()}
          <span>{Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground">{trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
