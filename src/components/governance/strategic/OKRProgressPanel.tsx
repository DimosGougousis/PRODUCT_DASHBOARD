/**
 * OKR Progress Panel - Display OKRs linked to current sprint
 * 
 * TODO[STAGE-2]: Strategic Alignment Implementation
 *   - Manual OKR data entry (no external OKR tool integration yet)
 *   - Store in GovernanceDashboardConfig JSON
 *   - Link OKRs to sprint goals
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Edit } from 'lucide-react';

interface OKR {
  id: string;
  objective: string;
  keyResults: Array<{
    description: string;
    target: number;
    current: number;
  }>;
}

interface OKRProgressPanelProps {
  okrs: OKR[];
  isLoading: boolean;
}

export function OKRProgressPanel({ okrs, isLoading }: OKRProgressPanelProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">OKR Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-32 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-medium">OKR Progress</CardTitle>
        <Button variant="ghost" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent>
        {(!okrs || okrs.length === 0) ? (
          <div className="text-sm text-gray-500 text-center py-4">
            No OKRs configured
            <br />
            <span className="text-xs text-gray-400">
              (TODO: Add OKR management UI)
            </span>
          </div>
        ) : (
          <div className="space-y-4">
            {okrs.map((okr) => (
              <div key={okr.id}>
                <p className="font-medium text-sm mb-2">{okr.objective}</p>
                {okr.keyResults.map((kr, idx) => {
                  const progress = (kr.current / kr.target) * 100;
                  return (
                    <div key={idx} className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">{kr.description}</span>
                        <span>{kr.current}/{kr.target}</span>
                      </div>
                      <Progress value={progress} className="h-1.5" />
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
