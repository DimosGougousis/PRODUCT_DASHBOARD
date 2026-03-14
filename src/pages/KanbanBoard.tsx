import { useState } from 'react';
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
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

const getInitials = (name: string | { name?: string } | undefined) => {
  const nameStr = typeof name === 'string' ? name : (name?.name || 'U');
  return nameStr
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
};

const getOwnerName = (owner: string | { name?: string } | undefined) => {
  return typeof owner === 'string'
    ? owner
    : ((owner as { name?: string })?.name || 'Unknown');
};

// Static card rendering used inside DragOverlay (no drag hooks)
const KanbanCardContent = ({ prd }: { prd: PRD }) => {
  const ownerName = getOwnerName(prd.owner);

  return (
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
  );
};

// Draggable card wrapper
const KanbanCard = ({ prd }: { prd: PRD }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: prd.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div
        className="relative"
        role="button"
        tabIndex={0}
        aria-roledescription="draggable card"
        aria-label={`${prd.title}. Drag to change status.`}
      >
        {/* Drag handle area - only this part triggers drag */}
        <div
          className="absolute left-2 top-4 z-10 cursor-grab active:cursor-grabbing"
          {...listeners}
          aria-label="Drag handle"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>
        {/* Clicking the card navigates */}
        <Link to={`/prd/${prd.id}`} draggable={false}>
          <Card className="group border border-border bg-card p-4 transition-all hover:border-primary/20 hover:shadow-card-hover">
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2">
                  {/* Invisible spacer matching the absolute-positioned grip */}
                  <div className="mt-0.5 h-4 w-4 flex-shrink-0" />
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
                    {getInitials(getOwnerName(prd.owner))}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </Card>
        </Link>
      </div>
    </div>
  );
};

// Droppable column wrapper
const KanbanColumn = ({ column, prds }: { column: Column; prds: PRD[] }) => {
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex h-full w-full md:w-72 flex-shrink-0 flex-col rounded-xl bg-muted/30 transition-colors',
        isOver && 'bg-primary/5 ring-2 ring-primary/20'
      )}
    >
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
  const { prds, isLoading, updatePRD } = usePRDs();
  const [activeColumn, setActiveColumn] = useState<PRDStatus>('backlog');
  const [activeDragPRD, setActiveDragPRD] = useState<PRD | null>(null);

  // Require a minimum drag distance to avoid conflicts with click-to-navigate
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 8,
    },
  });
  const sensors = useSensors(pointerSensor);

  const getPRDsByStatus = (status: PRDStatus) => {
    return prds.filter((prd) => prd.status === status);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const prd = prds.find((p) => p.id === event.active.id);
    setActiveDragPRD(prd || null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragPRD(null);
    const { active, over } = event;
    if (!over) return;

    const prdId = active.id as string;
    const newStatus = over.id as PRDStatus;

    // Only update if the column actually changed
    const prd = prds.find((p) => p.id === prdId);
    if (prd && prd.status !== newStatus) {
      updatePRD(prdId, { status: newStatus });
    }
  };

  const handleDragCancel = () => {
    setActiveDragPRD(null);
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          {/* Mobile: Column selector */}
          <div className="md:hidden mb-4">
            <Select
              value={activeColumn}
              onValueChange={(v) => setActiveColumn(v as PRDStatus)}
            >
              <SelectTrigger aria-label="Select kanban column">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={col.id} value={col.id}>
                    {col.title} ({getPRDsByStatus(col.id).length})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Desktop: All columns side by side */}
          <div className="hidden md:flex gap-4 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                prds={getPRDsByStatus(column.id)}
              />
            ))}
          </div>

          {/* Mobile: Single selected column */}
          <div className="md:hidden">
            <KanbanColumn
              column={columns.find((c) => c.id === activeColumn)!}
              prds={getPRDsByStatus(activeColumn)}
            />
          </div>

          {/* Drag overlay for a smooth drag preview */}
          <DragOverlay dropAnimation={null}>
            {activeDragPRD ? (
              <div className="w-72 rotate-2 opacity-90">
                <KanbanCardContent prd={activeDragPRD} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </Layout>
  );
};

export default KanbanBoard;
