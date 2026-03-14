/**
 * Pillar Card - Common card wrapper with pillar header
 * 
 * TODO[GAP-011]: Define pillar color scheme
 *   - strategic: blue
 *   - delivery: green
 *   - quality: purple
 *   - backlog: orange
 *   - customer: pink
 *   - financial: amber
 *   - compliance: indigo
 *   - teamHealth: teal
 */

import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type GovPillar = 
  | 'strategic'
  | 'delivery'
  | 'quality'
  | 'backlog'
  | 'customer'
  | 'financial'
  | 'compliance'
  | 'teamHealth';

interface PillarCardProps {
  pillar: GovPillar;
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

const pillarColors: Record<GovPillar, string> = {
  strategic: 'border-l-blue-500',
  delivery: 'border-l-green-500',
  quality: 'border-l-purple-500',
  backlog: 'border-l-orange-500',
  customer: 'border-l-pink-500',
  financial: 'border-l-amber-500',
  compliance: 'border-l-indigo-500',
  teamHealth: 'border-l-teal-500',
};

export function PillarCard({ pillar, title, children, action }: PillarCardProps) {
  return (
    <Card className={`border-l-4 ${pillarColors[pillar]}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {action && <div className="flex-shrink-0">{action}</div>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
