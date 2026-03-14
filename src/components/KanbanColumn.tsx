import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import KanbanCard from './KanbanCard';
import { PRDSection } from '@/types';

interface KanbanColumnProps {
  id: string;
  title: string;
  sections: Array<PRDSection & { prdTitle: string }>;
}

export default function KanbanColumn({ id, title, sections }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  const totalCompleteness = sections.length > 0
    ? sections.reduce((sum, s) => sum + s.completeness, 0) / sections.length
    : 0;

  return (
    <div
      ref={setNodeRef}
      className={`bg-gray-100 rounded-lg p-4 transition-colors ${
        isOver ? 'bg-blue-50 border-2 border-blue-400' : 'border-2 border-transparent'
      }`}
    >
      {/* Column Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold">{title}</h3>
          <Badge variant="secondary">{sections.length}</Badge>
        </div>
        {sections.length > 0 && (
          <div className="space-y-1">
            <Progress value={totalCompleteness} className="h-1" />
            <p className="text-xs text-gray-600">{Math.round(totalCompleteness)}% avg</p>
          </div>
        )}
      </div>

      {/* Cards Container */}
      <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3 min-h-[200px]">
          {sections.map((section) => (
            <KanbanCard key={section.id} section={section} />
          ))}
          {sections.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-sm">
              Drop cards here
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}
