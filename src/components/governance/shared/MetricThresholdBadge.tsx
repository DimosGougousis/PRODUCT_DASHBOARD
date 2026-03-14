/**
 * Metric Threshold Badge - Green/Amber/Red status badge
 * 
 * TODO[GAP-012]: Define threshold defaults
 *   - velocity drop > 20%: warning
 *   - velocity drop > 40%: critical
 *   - defects > 10 critical: critical
 *   - coverage < 60%: warning
 *   - coverage < 40%: critical
 */

import { Badge } from '@/components/ui/badge';

type Status = 'green' | 'amber' | 'red' | 'unknown';

interface MetricThresholdBadgeProps {
  status: Status;
  label?: string;
  value?: string | number;
}

const statusConfig: Record<Status, { variant: 'default' | 'destructive' | 'secondary' | 'outline'; className: string; icon: string }> = {
  green: { variant: 'default', className: 'bg-green-500 hover:bg-green-500', icon: '✓' },
  amber: { variant: 'default', className: 'bg-yellow-500 hover:bg-yellow-500', icon: '!' },
  red: { variant: 'destructive', className: '', icon: '✕' },
  unknown: { variant: 'secondary', className: '', icon: '?' },
};

export function MetricThresholdBadge({ status, label, value }: MetricThresholdBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge variant={config.variant} className={config.className}>
      <span className="mr-1">{config.icon}</span>
      {label && <span className="mr-1">{label}:</span>}
      {value !== undefined && <span>{value}</span>}
    </Badge>
  );
}
