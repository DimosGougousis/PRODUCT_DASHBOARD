import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PRDSection } from '@/types';
import { getStakeholderById } from '@/data/mockData';

interface KanbanCardProps {
  section: PRDSection & { prdTitle: string };
}

export default function KanbanCard({ section }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getHealthColor = () => {
    if (section.completeness >= 80) return 'border-l-green-500';
    if (section.completeness >= 50) return 'border-l-yellow-500';
    if (section.assignedStakeholders.length > 0) return 'border-l-blue-500';
    return 'border-l-gray-300';
  };

  const assignedStakeholders = section.assignedStakeholders
    .map((a) => getStakeholderById(a.stakeholderId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const hasBlockers = section.dependencies.length > 0;

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={`p-3 border-l-4 ${getHealthColor()} cursor-grab active:cursor-grabbing hover:shadow-md transition-all`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="flex items-start gap-2 mb-2"
      >
        <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 truncate mb-1">{section.prdTitle}</p>
          <h4 className="font-medium text-sm flex items-center gap-1">
            <span>{section.icon}</span>
            <span className="truncate">{section.name}</span>
          </h4>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-2">
        <Progress value={section.completeness} className="h-1.5" />
        <p className="text-xs text-gray-600 mt-1">{section.completeness}% complete</p>
      </div>

      {/* Stakeholders */}
      {assignedStakeholders.length > 0 && (
        <div className="flex items-center gap-1 mb-2">
          {assignedStakeholders.slice(0, 3).map((stakeholder) => (
            <div
              key={stakeholder.id}
              className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium"
              title={stakeholder.name}
            >
              {stakeholder.name.split(' ').map((n) => n[0]).join('')}
            </div>
          ))}
          {assignedStakeholders.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs">
              +{assignedStakeholders.length - 3}
            </div>
          )}
        </div>
      )}

      {/* Warnings */}
      {hasBlockers && (
        <Badge variant="destructive" className="text-xs gap-1">
          <AlertCircle className="w-3 h-3" />
          Blocked
        </Badge>
      )}
    </Card>
  );
}
