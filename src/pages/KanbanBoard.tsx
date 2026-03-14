import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { usePRDs } from '@/context/PRDContext';
import { PRD, PRDStatus } from '@/types/prd';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import PriorityIndicator from '@/components/prd/PriorityIndicator';
import { Progress } from '@/components/ui/progress';
import { Calendar, GripVertical, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Column {
  id: PRDStatus;
  title: string;
  color: string;
}

const columns: Column[] = [
  { id: 'backlog', title: 'Backlog', color: 'bg-muted-foreground' },
  { id: 'research', title: 'Research', color: 'bg-blue-500' },
  { id: 'waiting', title: 'Waiting', color: 'bg-amber-500' },
  { id: 'review', title: 'Review', color: 'bg-purple-500' },
  { id: 'complete', title: 'Complete', color: 'bg-green-500' },
];

const KanbanCard = ({ prd }: { prd: PRD }) => {
  const getInitials = (name: string | { name?: string } | undefined) => {
    const nameStr = typeof name === 'string' ? name : (name?.name || 'U');
    return nameStr
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Handle owner being either string (new) or object (old localStorage data)
  const ownerName = typeof prd.owner === 'string' ? prd.owner : ((prd.owner as { name?: string })?.name || 'Unknown');

  return (
    <Link to={`/prd/${prd.id}`}>
      <Card className="group cursor-grab border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-card-hover active:cursor-grabbing">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <GripVertical className="mt-0.5 h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="min-w-0 flex-1">
                <h4 className="text-sm font-medium text-foreground line-clamp-2 hover:text-primary">
                  {prd.title}
                </h4>
              </div>
            </div>
            <PriorityIndicator priority={prd.priority} />
          </div>

          <Progress value={prd.progress} className="h-1" />

          <div className="flex items-center justify-between">
            {prd.targetDate && (
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {new Date(prd.targetDate).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            )}
            
            <Avatar className="h-6 w-6">
              <AvatarFallback className="bg-accent text-[10px] font-medium text-accent-foreground">
                {getInitials(ownerName)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </Card>
    </Link>
  );
};

const KanbanColumn = ({ column, prds }: { column: Column; prds: PRD[] }) => {
  return (
    <div className="flex h-full w-72 flex-shrink-0 flex-col rounded-xl bg-muted/30">
      {/* Column Header */}
      <div className="flex items-center gap-2 p-3">
        <div className={cn('h-2 w-2 rounded-full', column.color)} />
        <h3 className="text-sm font-semibold text-foreground">{column.title}</h3>
        <span className="ml-auto flex h-5 w-5 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
          {prds.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2 pt-0">
        {prds.map((prd) => (
          <KanbanCard key={prd.id} prd={prd} />
        ))}
        {prds.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border-2 border-dashed border-border p-4">
            <p className="text-xs text-muted-foreground">No PRDs</p>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanBoard = () => {
  const { prds, isLoading } = usePRDs();

  const getPRDsByStatus = (status: PRDStatus) => {
    return prds.filter((prd) => prd.status === status);
  };

  if (isLoading) {
    return (
      <Layout title="Kanban Board" subtitle="Visualize PRD workflow">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="Kanban Board" subtitle="Visualize PRD workflow">
      <div className="animate-fade-in p-6">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              prds={getPRDsByStatus(column.id)}
            />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default KanbanBoard;
