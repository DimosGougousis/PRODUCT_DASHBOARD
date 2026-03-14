import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Users, CheckCircle2, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PRDSection, SectionStatus, SectionOrchestrator } from '@/types';
import { getStakeholderById } from '@/data/mockData';
import RichTextEditor from './RichTextEditor';
import SectionOrchestratorModal from './SectionOrchestratorModal';

interface SectionCardProps {
  section: PRDSection;
  prdTitle: string;
  onUpdate: (sectionId: string, updates: Partial<PRDSection>) => void;
  onUpdateOrchestrator?: (sectionId: string, orchestrator: Partial<SectionOrchestrator>) => void;
}

export default function SectionCard({ section, prdTitle, onUpdate, onUpdateOrchestrator }: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOrchestratorOpen, setIsOrchestratorOpen] = useState(false);

  const statusColors: Record<SectionStatus, string> = {
    not_started: 'bg-gray-200 text-gray-700',
    in_progress: 'bg-blue-100 text-blue-700',
    review: 'bg-purple-100 text-purple-700',
    complete: 'bg-green-100 text-green-700',
  };

  const statusLabels: Record<SectionStatus, string> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    review: 'In Review',
    complete: 'Complete',
  };

  const assignedStakeholders = section.assignedStakeholders
    .map((assignment) => getStakeholderById(assignment.stakeholderId))
    .filter((s): s is NonNullable<typeof s> => s !== undefined);

  const handleContentSave = (newContent: string) => {
    const wordCount = newContent.split(/\s+/).filter(Boolean).length;
    const completeness = Math.min(100, Math.round((wordCount / 200) * 100));
    
    onUpdate(section.id, {
      content: newContent,
      completeness,
      lastUpdated: new Date().toISOString(),
      status: completeness > 80 ? 'complete' : completeness > 0 ? 'in_progress' : 'not_started',
    });
  };

  const getHealthColor = () => {
    if (section.completeness >= 80) return 'border-green-500';
    if (section.completeness >= 50) return 'border-yellow-500';
    if (section.assignedStakeholders.length > 0) return 'border-blue-500';
    return 'border-gray-300';
  };

  return (
    <Card className={`border-l-4 ${getHealthColor()} transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1 text-left hover:bg-gray-50 -m-2 p-2 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 flex-shrink-0" />
            ) : (
              <ChevronRight className="w-5 h-5 flex-shrink-0" />
            )}
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center gap-2">
                <span>{section.icon}</span>
                <span>{section.name}</span>
              </CardTitle>
              <CardDescription className="mt-1">
                {section.completeness}% complete • {assignedStakeholders.length}{' '}
                stakeholder{assignedStakeholders.length !== 1 ? 's' : ''} assigned
              </CardDescription>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setIsOrchestratorOpen(true);
              }}
              className="gap-1"
            >
              <Brain className="w-4 h-4" />
              Orchestrate
            </Button>
            <Badge className={statusColors[section.status]} variant="secondary">
              {statusLabels[section.status]}
            </Badge>
          </div>
        </div>

        {/* Compact Info Bar */}
        <div className="flex items-center gap-4 mt-3">
          <div className="flex-1">
            <Progress value={section.completeness} className="h-2" />
          </div>
          {assignedStakeholders.length > 0 && (
            <div className="flex items-center gap-1">
              {assignedStakeholders.slice(0, 3).map((stakeholder) => (
                <div
                  key={stakeholder.id}
                  className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-medium"
                  title={stakeholder.name}
                >
                  {stakeholder.name.split(' ').map((n) => n[0]).join('')}
                </div>
              ))}
              {assignedStakeholders.length > 3 && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
                  +{assignedStakeholders.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          {/* Stakeholder Info */}
          {section.assignedStakeholders.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h4 className="font-medium text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Assigned Stakeholders
              </h4>
              <div className="space-y-2">
                {section.assignedStakeholders.map((assignment) => {
                  const stakeholder = getStakeholderById(assignment.stakeholderId);
                  if (!stakeholder) return null;

                  return (
                    <div
                      key={assignment.stakeholderId}
                      className="flex items-center justify-between bg-white p-3 rounded border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                          {stakeholder.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{stakeholder.name}</p>
                          <p className="text-xs text-gray-500">{stakeholder.role}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="uppercase text-xs">
                          {assignment.raciRole[0]}
                        </Badge>
                        <Badge
                          variant={
                            assignment.status === 'completed'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {assignment.status.replace('_', ' ')}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>
                Last updated {new Date(section.lastUpdated).toLocaleDateString()}
              </span>
            </div>
            {section.status === 'complete' && (
              <div className="flex items-center gap-1 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>Section complete</span>
              </div>
            )}
          </div>

          {/* Rich Text Editor */}
          <div className="border-t pt-4">
            <RichTextEditor
              initialContent={section.content}
              onSave={handleContentSave}
              placeholder={`Write the ${section.name} here...`}
            />
          </div>
        </CardContent>
      )}

      {/* Orchestrator Modal */}
      <SectionOrchestratorModal
        section={section}
        isOpen={isOrchestratorOpen}
        onClose={() => setIsOrchestratorOpen(false)}
        onUpdateOrchestrator={onUpdateOrchestrator || (() => {})}
      />
    </Card>
  );
}
