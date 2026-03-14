import { useState } from 'react';
import { ChevronDown, ChevronRight, Clock, Users, CheckCircle2, Link2 } from 'lucide-react';
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
import { PRDSection, SectionStatus } from '@/types/prd';
import { getStakeholderById } from '@/data/mockData';
import RichTextEditor from './RichTextEditor';
import { SectionIntegrationLinks } from '@/components/integrations/SectionIntegrationLinks';

interface SectionCardProps {
  section: PRDSection;
  prdTitle: string;
  onUpdate: (sectionId: string, updates: Partial<PRDSection>) => void;
}

export default function SectionCard({ section, prdTitle, onUpdate }: SectionCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors: Record<SectionStatus, string> = {
    not_started: 'bg-muted text-muted-foreground',
    in_progress: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    review: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    complete: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
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
    if (section.completeness >= 80) return 'border-l-green-500';
    if (section.completeness >= 50) return 'border-l-yellow-500';
    if (section.assignedStakeholders.length > 0) return 'border-l-blue-500';
    return 'border-l-muted';
  };

  return (
    <Card className={`border-l-4 ${getHealthColor()} transition-all`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 flex-1 text-left hover:bg-muted/50 -m-2 p-2 rounded transition-colors"
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
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground text-xs font-medium">
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
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
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
                      className="flex items-center justify-between bg-background p-3 rounded border"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                          {stakeholder.name.split(' ').map((n) => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium">{stakeholder.name}</p>
                          <p className="text-xs text-muted-foreground">{stakeholder.role}</p>
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

          {/* Metadata & Integration Links */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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

            {/* Integration Links */}
            <div className="flex items-center gap-2">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <SectionIntegrationLinks
                links={section.integrationLinks}
                onUpdate={(links) => onUpdate(section.id, { integrationLinks: links })}
              />
            </div>
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
    </Card>
  );
}
