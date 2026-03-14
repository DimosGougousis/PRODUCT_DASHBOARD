import { AlertCircle, CheckCircle2, Calendar, Users, Code } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Conflict, ConflictResolution } from '@/types';
import { useState } from 'react';

interface ConflictDetectionModalProps {
  conflicts: Conflict[];
  open: boolean;
  onClose: () => void;
  onResolve: (conflictId: string, resolutionId: string) => void;
}

export default function ConflictDetectionModal({
  conflicts,
  open,
  onClose,
  onResolve,
}: ConflictDetectionModalProps) {
  const [selectedConflict, setSelectedConflict] = useState<string | null>(
    conflicts[0]?.id || null
  );
  const [selectedResolution, setSelectedResolution] = useState<string | null>(null);

  const currentConflict = conflicts.find(c => c.id === selectedConflict);

  const handleResolve = () => {
    if (selectedConflict && selectedResolution) {
      onResolve(selectedConflict, selectedResolution);
      onClose();
    }
  };

  const conflictIcons = {
    timeline: Calendar,
    technical: Code,
    resource: Users,
    assumption: AlertCircle,
  };

  const severityColors = {
    critical: 'bg-red-100 text-red-700 border-red-300',
    medium: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    info: 'bg-blue-100 text-blue-700 border-blue-300',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Conflict Detection & Resolution</DialogTitle>
          <DialogDescription>
            {conflicts.length} conflict{conflicts.length !== 1 ? 's' : ''} detected that require your attention
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 flex-1 overflow-hidden">
          {/* Conflict List */}
          <div className="w-80 space-y-2 overflow-auto pr-2">
            <h3 className="font-semibold text-sm mb-2">Detected Conflicts</h3>
            {conflicts.map((conflict) => {
              const Icon = conflictIcons[conflict.type];
              const isSelected = selectedConflict === conflict.id;

              return (
                <Card
                  key={conflict.id}
                  className={`cursor-pointer transition-all ${
                    isSelected ? 'ring-2 ring-blue-500 shadow-md' : 'hover:shadow-sm'
                  }`}
                  onClick={() => {
                    setSelectedConflict(conflict.id);
                    setSelectedResolution(null);
                  }}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start gap-2">
                      <Icon className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-sm font-semibold mb-1">
                          {conflict.title}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-xs ${severityColors[conflict.severity]}`}
                          >
                            {conflict.severity}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {conflict.type}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {conflict.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Conflict Details & Resolution */}
          <div className="flex-1 overflow-auto space-y-4">
            {currentConflict ? (
              <>
                {/* Conflict Details */}
                <div className={`border-2 rounded-lg p-4 ${severityColors[currentConflict.severity]}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {(() => {
                      const Icon = conflictIcons[currentConflict.type];
                      return <Icon className="w-6 h-6 flex-shrink-0 mt-0.5" />;
                    })()}
                    <div>
                      <h3 className="font-semibold text-lg mb-1">
                        {currentConflict.title}
                      </h3>
                      <p className="text-sm">{currentConflict.description}</p>
                    </div>
                  </div>

                  {/* Impact */}
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <div>
                      <p className="text-xs font-medium mb-1">Affected Sections</p>
                      <div className="space-y-1">
                        {currentConflict.affectedSections.map((section) => (
                          <Badge key={section} variant="outline" className="text-xs">
                            {section}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-medium mb-1">Affected Stakeholders</p>
                      <div className="space-y-1">
                        {currentConflict.affectedStakeholders.map((stakeholder) => (
                          <Badge key={stakeholder} variant="outline" className="text-xs">
                            {stakeholder}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resolution Options */}
                <div>
                  <h3 className="font-semibold mb-3">Resolution Options</h3>
                  <RadioGroup value={selectedResolution || ''} onValueChange={setSelectedResolution}>
                    <div className="space-y-3">
                      {currentConflict.resolutionOptions.map((option) => (
                        <ResolutionOption
                          key={option.id}
                          option={option}
                          selected={selectedResolution === option.id}
                        />
                      ))}
                    </div>
                  </RadioGroup>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    onClick={handleResolve}
                    disabled={!selectedResolution}
                    className="flex-1"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Apply Resolution
                  </Button>
                  <Button variant="outline" onClick={onClose}>
                    Skip for Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                <p>Select a conflict to view details</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function ResolutionOption({
  option,
  selected,
}: {
  option: ConflictResolution;
  selected: boolean;
}) {
  return (
    <Card className={`cursor-pointer transition-all ${selected ? 'ring-2 ring-blue-500' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <RadioGroupItem value={option.id} id={option.id} className="mt-1" />
          <Label htmlFor={option.id} className="flex-1 cursor-pointer">
            <h4 className="font-semibold mb-2">{option.title}</h4>
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="font-medium text-green-700 mb-1">Pros:</p>
                <ul className="space-y-0.5">
                  {option.pros.map((pro, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-red-700 mb-1">Cons:</p>
                <ul className="space-y-0.5">
                  {option.cons.map((con, idx) => (
                    <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                      <span className="text-red-500 mt-0.5">✗</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Label>
        </div>
      </CardContent>
    </Card>
  );
}

// Mock conflict generator
// eslint-disable-next-line react-refresh/only-export-components
export function generateMockConflicts(): Conflict[] {
  return [
    {
      id: 'conflict-1',
      type: 'timeline',
      severity: 'critical',
      title: 'Timeline Mismatch: Engineering vs Marketing',
      description: 'Engineering estimates 6 weeks for MVP. Marketing campaign launches in 4 weeks with $50K committed spend.',
      affectedSections: ['Technical Approach', 'Go-to-Market'],
      affectedStakeholders: ['Sarah Chen (Eng)', 'Chris Martinez (Marketing)'],
      detectedAt: new Date().toISOString(),
      resolved: false,
      resolutionOptions: [
        {
          id: 'res-1-1',
          title: 'Descope to 4-Week MVP',
          description: 'Reduce scope to meet marketing timeline. Launch with core features only.',
          pros: [
            'Hits marketing campaign timing',
            'Delivers some value quickly',
            'No wasted marketing spend',
          ],
          cons: [
            'May need Phase 2 PRD',
            'Reduced impact',
            'Technical debt risk',
          ],
        },
        {
          id: 'res-1-2',
          title: 'Delay Marketing Campaign',
          description: 'Push marketing launch to Week 6 to align with full engineering delivery.',
          pros: [
            'No technical compromise',
            'Complete feature set',
            'Better user experience',
          ],
          cons: [
            '$50K sunk marketing costs',
            'Competitive timing loss',
            'Revenue delay of ~$180K',
          ],
        },
        {
          id: 'res-1-3',
          title: 'Add Engineering Resources',
          description: 'Bring in contract engineers for 4-week sprint to compress timeline.',
          pros: [
            'Meets both timelines',
            'Full scope delivery',
            'No marketing waste',
          ],
          cons: [
            'Additional $50K cost',
            'Onboarding overhead',
            'Quality risk',
          ],
        },
      ],
    },
    {
      id: 'conflict-2',
      type: 'technical',
      severity: 'medium',
      title: 'Technical Contradiction: Latency Budget',
      description: 'Product Analytics states 200ms available. Engineering found only 100ms after investigation.',
      affectedSections: ['Technical Approach', 'Success Metrics'],
      affectedStakeholders: ['Jamie Park (Analytics)', 'Sarah Chen (Eng)'],
      detectedAt: new Date().toISOString(),
      resolved: false,
      resolutionOptions: [
        {
          id: 'res-2-1',
          title: 'Revise Technical Approach',
          description: 'Redesign for 100ms constraint. Use async validation.',
          pros: ['Technically sound', 'No performance degradation'],
          cons: ['More complex', 'Longer implementation'],
        },
        {
          id: 'res-2-2',
          title: 'Accept Higher Latency',
          description: 'Proceed with 200ms approach, accept slightly degraded UX.',
          pros: ['Simpler implementation', 'Faster delivery'],
          cons: ['User experience impact', 'Violates performance goals'],
        },
      ],
    },
  ];
}
