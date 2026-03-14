import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { PRDSection, RACISuggestion, StakeholderSuggestion, RACIRole } from '@/types';
import { mockStakeholders } from '@/data/mockData';

interface RACIGeneratorModalProps {
  section: PRDSection;
  open: boolean;
  onClose: () => void;
  onApply: (assignments: Array<{ stakeholderId: string; raciRole: RACIRole }>) => void;
}

export default function RACIGeneratorModal({
  section,
  open,
  onClose,
  onApply,
}: RACIGeneratorModalProps) {
  const [selectedAssignments, setSelectedAssignments] = useState<
    Map<string, RACIRole>
  >(new Map());

  // Generate mock RACI suggestions
  const suggestions: RACISuggestion = generateMockRACISuggestions(section);

  const toggleSelection = (stakeholderId: string, role: RACIRole) => {
    const newSelections = new Map(selectedAssignments);
    if (newSelections.get(stakeholderId) === role) {
      newSelections.delete(stakeholderId);
    } else {
      newSelections.set(stakeholderId, role);
    }
    setSelectedAssignments(newSelections);
  };

  const handleApply = () => {
    const assignments = Array.from(selectedAssignments.entries()).map(
      ([stakeholderId, raciRole]) => ({
        stakeholderId,
        raciRole,
      })
    );
    onApply(assignments);
    onClose();
  };

  const raciRoleInfo: Record<RACIRole, { label: string; color: string; description: string }> = {
    responsible: {
      label: 'Responsible',
      color: 'bg-blue-500',
      description: 'Does the work to complete the task',
    },
    accountable: {
      label: 'Accountable',
      color: 'bg-purple-500',
      description: 'Ultimately answerable for the correct completion',
    },
    consulted: {
      label: 'Consulted',
      color: 'bg-green-500',
      description: 'Provides input and expertise',
    },
    informed: {
      label: 'Informed',
      color: 'bg-gray-500',
      description: 'Kept up-to-date on progress',
    },
  };

  const renderStakeholderCard = (
    suggestion: StakeholderSuggestion,
    role: RACIRole
  ) => {
    const isSelected = selectedAssignments.get(suggestion.stakeholderId) === role;
    const stakeholder = suggestion.stakeholder;

    return (
      <Card
        key={suggestion.stakeholderId}
        className={`p-4 cursor-pointer transition-all ${
          isSelected
            ? 'ring-2 ring-blue-500 bg-blue-50'
            : 'hover:shadow-md hover:border-blue-200'
        }`}
        onClick={() => toggleSelection(suggestion.stakeholderId, role)}
      >
        <div className="flex items-start gap-3">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
              {stakeholder.name.split(' ').map((n) => n[0]).join('')}
            </div>
            {isSelected && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-3 h-3 text-white" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div>
                <h4 className="font-medium">{stakeholder.name}</h4>
                <p className="text-sm text-gray-600">{stakeholder.role}</p>
              </div>
              <Badge variant="outline" className="text-xs">
                {Math.round(suggestion.confidence * 100)}% match
              </Badge>
            </div>

            {/* Confidence Bar */}
            <Progress value={suggestion.confidence * 100} className="h-1 mb-2" />

            {/* Reasoning */}
            <p className="text-xs text-gray-600 mb-2">{suggestion.reasoning}</p>

            {/* Expected Contribution */}
            <div className="space-y-1">
              <p className="text-xs font-medium text-gray-700">Expected contribution:</p>
              <ul className="text-xs text-gray-600 space-y-0.5">
                {suggestion.expectedContribution.slice(0, 2).map((contrib, idx) => (
                  <li key={idx} className="flex items-start gap-1">
                    <span className="text-blue-500 mt-0.5">•</span>
                    <span>{contrib}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Estimated Hours */}
            <p className="text-xs text-gray-500 mt-2">
              Est. {suggestion.estimatedHours} hours
            </p>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>{section.icon}</span>
            <span>Generate RACI Matrix - {section.name}</span>
          </DialogTitle>
          <DialogDescription>
            AI-suggested stakeholder assignments based on expertise, past involvement, and
            workload. Click to select.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="responsible" className="w-full">
            <TabsList className="grid grid-cols-4 w-full">
              {(Object.keys(raciRoleInfo) as RACIRole[]).map((role) => (
                <TabsTrigger key={role} value={role} className="relative">
                  <div
                    className={`w-2 h-2 rounded-full ${raciRoleInfo[role].color} mr-2`}
                  />
                  {raciRoleInfo[role].label}
                  {selectedAssignments.size > 0 &&
                    Array.from(selectedAssignments.values()).filter((r) => r === role)
                      .length > 0 && (
                      <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                        {
                          Array.from(selectedAssignments.values()).filter((r) => r === role)
                            .length
                        }
                      </Badge>
                    )}
                </TabsTrigger>
              ))}
            </TabsList>

            {(Object.keys(raciRoleInfo) as RACIRole[]).map((role) => (
              <TabsContent key={role} value={role} className="mt-4 space-y-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-blue-900">
                      {raciRoleInfo[role].label}
                    </p>
                    <p className="text-xs text-blue-700">
                      {raciRoleInfo[role].description}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  {suggestions.suggestions[role].map((suggestion) =>
                    renderStakeholderCard(suggestion, role)
                  )}
                  {suggestions.suggestions[role].length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No suggestions for this role</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>

        <div className="border-t pt-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            {selectedAssignments.size} stakeholder{selectedAssignments.size !== 1 ? 's' : ''}{' '}
            selected
          </p>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleApply} disabled={selectedAssignments.size === 0}>
              Apply RACI Assignments
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to generate mock RACI suggestions
function generateMockRACISuggestions(section: PRDSection): RACISuggestion {
  const allStakeholders = mockStakeholders;
  
  // Simple mapping logic
  const functionMap: Record<string, string[]> = {
    problem_statement: ['product', 'analytics'],
    user_stories: ['product', 'design'],
    success_metrics: ['analytics', 'product'],
    technical_approach: ['engineering', 'security'],
    dependencies_risks: ['engineering', 'product'],
    go_to_market: ['marketing', 'product'],
    resource_estimation: ['engineering', 'finance'],
    legal_compliance: ['legal', 'security'],
  };

  const relevantFunctions = functionMap[section.type] || ['product'];
  const relevantStakeholders = allStakeholders.filter((s) =>
    relevantFunctions.includes(s.function)
  );

  const createSuggestions = (count: number): StakeholderSuggestion[] => {
    return relevantStakeholders.slice(0, count).map((stakeholder) => ({
      stakeholderId: stakeholder.id,
      stakeholder,
      confidence: 0.75 + Math.random() * 0.2,
      reasoning: `High expertise in ${stakeholder.expertise.join(', ')}. Quality score: ${stakeholder.qualityScore}/5`,
      expectedContribution: [
        'Review and provide feedback',
        'Validate technical approach',
        'Identify risks and dependencies',
      ],
      estimatedHours: 3 + Math.floor(Math.random() * 5),
    }));
  };

  return {
    sectionId: section.id,
    suggestions: {
      responsible: createSuggestions(2),
      accountable: createSuggestions(1),
      consulted: createSuggestions(3),
      informed: createSuggestions(2),
    },
  };
}
