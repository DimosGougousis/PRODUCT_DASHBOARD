/**
 * Support Ticket Volume - Ticket metrics and breakdown
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import type { CustomerMetrics } from '@/types/governance/customer';

interface SupportTicketVolumeProps {
  metrics: CustomerMetrics | undefined;
  isLoading: boolean;
}

export function SupportTicketVolume({ metrics, isLoading }: SupportTicketVolumeProps) {
  const support = metrics?.support;

  const categoryData = [
    { name: 'Bugs', count: support?.ticketsByCategory.bug ?? 0, color: '#ef4444' },
    { name: 'Features', count: support?.ticketsByCategory.feature ?? 0, color: '#3b82f6' },
    { name: 'Questions', count: support?.ticketsByCategory.question ?? 0, color: '#10b981' },
    { name: 'Other', count: support?.ticketsByCategory.other ?? 0, color: '#6b7280' },
  ];

  const priorityData = [
    { name: 'Urgent', count: support?.ticketsByPriority.urgent ?? 0 },
    { name: 'High', count: support?.ticketsByPriority.high ?? 0 },
    { name: 'Medium', count: support?.ticketsByPriority.medium ?? 0 },
    { name: 'Low', count: support?.ticketsByPriority.low ?? 0 },
  ];

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Support Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center justify-between">
          <span>Support Tickets</span>
          <Badge variant="outline" className="text-xs">
            {support?.openTickets ?? 0} open
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          <div className="text-center p-2 bg-gray-50 rounded">
            <span className="text-lg font-bold">{support?.totalTickets ?? 0}</span>
            <span className="text-xs text-gray-500 block">Total</span>
          </div>
          <div className="text-center p-2 bg-green-50 rounded">
            <span className="text-lg font-bold">{support?.resolvedThisWeek ?? 0}</span>
            <span className="text-xs text-gray-500 block">This Week</span>
          </div>
          <div className="text-center p-2 bg-blue-50 rounded">
            <span className="text-lg font-bold">{support?.avgSatisfaction ?? 0}</span>
            <span className="text-xs text-gray-500 block">Avg Rating</span>
          </div>
        </div>

        {/* Category Chart */}
        <div className="h-24 mb-3">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Priority Breakdown */}
        <div className="flex justify-between text-xs">
          {priorityData.map((p) => (
            <div key={p.name} className="text-center">
              <span className="font-bold">{p.count}</span>
              <span className="text-gray-500 block">{p.name}</span>
            </div>
          ))}
        </div>

        {/* Avg Resolution Time */}
        <div className="mt-3 pt-3 border-t">
          <div className="flex justify-between text-xs">
            <span className="text-gray-500">Avg Resolution Time</span>
            <span className="font-medium">{support?.avgResolutionTime ?? 0} hours</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
