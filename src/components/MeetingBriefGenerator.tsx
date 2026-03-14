import { useState } from 'react';
import { Calendar, Clock, User, Target, AlertTriangle, Copy, Send } from 'lucide-react';
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
import { Stakeholder, PRDSection } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface MeetingBriefGeneratorProps {
  stakeholder: Stakeholder;
  section: PRDSection;
  prdTitle: string;
  open: boolean;
  onClose: () => void;
}

interface MeetingBrief {
  duration: number;
  objective: string;
  contextTheyKnow: string[];
  newInformation: string[];
  prioritizedQuestions: Array<{ priority: string; text: string }>;
  likelyConcerns: string[];
  successCriteria: string[];
}

export default function MeetingBriefGenerator({
  stakeholder,
  section,
  prdTitle,
  open,
  onClose,
}: MeetingBriefGeneratorProps) {
  const { toast } = useToast();
  const [selectedFormat, setSelectedFormat] = useState<'concise' | 'detailed'>('concise');

  const brief = generateMeetingBrief(stakeholder, section, prdTitle, selectedFormat);

  const handleCopy = () => {
    const text = formatBriefAsText(brief);
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'Meeting brief copied successfully',
    });
  };

  const handleSchedule = () => {
    toast({
      title: 'Calendar invite sent',
      description: `Meeting scheduled with ${stakeholder.name}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Pre-Meeting Intelligence Brief
          </DialogTitle>
          <DialogDescription>
            Prepared for meeting with {stakeholder.name} about {section.name}
          </DialogDescription>
        </DialogHeader>

        {/* Format Toggle */}
        <div className="flex gap-2 border-b pb-3">
          <Button
            variant={selectedFormat === 'concise' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFormat('concise')}
          >
            Concise View
          </Button>
          <Button
            variant={selectedFormat === 'detailed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFormat('detailed')}
          >
            Detailed View
          </Button>
        </div>

        <div className="flex-1 overflow-auto space-y-4">
          {/* Meeting Details */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Meeting Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-600" />
                <span className="font-medium">{stakeholder.name}</span>
                <Badge variant="outline">{stakeholder.function}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span>Duration: {brief.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-gray-600" />
                <span>Objective: {brief.objective}</span>
              </div>
            </CardContent>
          </Card>

          {/* Context They Know */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">📚 Context They Already Know</CardTitle>
              <p className="text-xs text-gray-600">Don't repeat this information</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {brief.contextTheyKnow.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-500 mt-1">•</span>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* New Information */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">🆕 New Information to Share</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {brief.newInformation.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Badge className="mt-0.5">{idx + 1}</Badge>
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">❓ Prioritized Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {brief.prioritizedQuestions.map((q) => (
                  <div
                    key={q.id}
                    className={`p-3 rounded-lg border-l-4 ${
                      q.priority === 'P0'
                        ? 'bg-red-50 border-red-500'
                        : q.priority === 'P1'
                        ? 'bg-yellow-50 border-yellow-500'
                        : 'bg-blue-50 border-blue-500'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={
                          q.priority === 'P0'
                            ? 'bg-red-100'
                            : q.priority === 'P1'
                            ? 'bg-yellow-100'
                            : 'bg-blue-100'
                        }
                      >
                        {q.priority}
                      </Badge>
                      <p className="text-sm font-medium flex-1">{q.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Likely Concerns */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Likely Concerns
              </CardTitle>
              <p className="text-xs text-gray-600">Based on past interactions</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {brief.likelyConcerns.map((concern, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-orange-500 mt-1">⚠</span>
                    <span className="text-gray-700">{concern}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Success Criteria */}
          <Card className="bg-green-50 border-green-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">✓ Meeting Success Criteria</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {brief.successCriteria.map((criteria, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-green-600 mt-1">✓</span>
                    <span className="text-gray-700">{criteria}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Follow-up Prep */}
          {selectedFormat === 'detailed' && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">📋 Follow-up Preparation</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium mb-1">If they need time to research:</p>
                    <p className="text-gray-600">
                      "No problem! Can you get back to me by [date]? Here are the specific
                      questions I need answered..."
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">If they identify blockers:</p>
                    <p className="text-gray-600">
                      Document the blocker, ask for suggested workarounds, and clarify who
                      needs to be involved to resolve it.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Next steps after meeting:</p>
                    <p className="text-gray-600">
                      Update PRD section with their input, send summary email, set reminder
                      for any follow-up commitments.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="border-t pt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy Brief
          </Button>
          <Button onClick={handleSchedule}>
            <Send className="w-4 h-4 mr-2" />
            Schedule Meeting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function generateMeetingBrief(
  stakeholder: Stakeholder,
  section: PRDSection,
  prdTitle: string,
  format: 'concise' | 'detailed'
) {
  return {
    duration: 30,
    objective: `Get ${stakeholder.name}'s input on ${section.name} to move PRD forward`,
    contextTheyKnow: [
      `PRD: "${prdTitle}" - overall goals and problem statement`,
      `Their role: ${stakeholder.role}`,
      `Previous conversations about similar features (3 past PRDs)`,
    ],
    newInformation: [
      'User research completed: 35% checkout abandonment rate with promo codes',
      'Target timeline: 4-week launch to align with marketing campaign',
      'Mobile-first decision has been made based on 70% mobile traffic',
    ],
    prioritizedQuestions: [
      {
        id: 'q1',
        priority: 'P0' as const,
        text: 'Is a 4-week implementation timeline technically feasible?',
        answered: false,
      },
      {
        id: 'q2',
        priority: 'P0' as const,
        text: 'What are the main technical risks you foresee?',
        answered: false,
      },
      {
        id: 'q3',
        priority: 'P1' as const,
        text: 'Are there dependencies on other systems or teams?',
        answered: false,
      },
      {
        id: 'q4',
        priority: 'P2' as const,
        text: 'Any alternative approaches we should consider?',
        answered: false,
      },
    ],
    likelyConcerns: [
      'Timeline pressure - may push back on 4-week constraint',
      'Code quality vs speed trade-off concerns',
      'Current team workload (they have 3 other active PRDs)',
    ],
    successCriteria: [
      'Get clear yes/no on 4-week feasibility',
      'Document any dependencies or blockers',
      'Agree on next steps and follow-up timeline',
      'Capture rough effort estimate (T-shirt sizing is fine)',
    ],
  };
}

function formatBriefAsText(brief: MeetingBrief): string {
  return `
MEETING BRIEF
Duration: ${brief.duration} minutes
Objective: ${brief.objective}

CONTEXT THEY KNOW (Don't repeat):
${brief.contextTheyKnow.map((item: string) => `• ${item}`).join('\n')}

NEW INFORMATION TO SHARE:
${brief.newInformation.map((item: string, idx: number) => `${idx + 1}. ${item}`).join('\n')}

PRIORITIZED QUESTIONS:
${brief.prioritizedQuestions.map((q: { priority: string; text: string }) => `${q.priority}: ${q.text}`).join('\n')}

LIKELY CONCERNS:
${brief.likelyConcerns.map((concern: string) => `⚠ ${concern}`).join('\n')}

SUCCESS CRITERIA:
${brief.successCriteria.map((criteria: string) => `✓ ${criteria}`).join('\n')}
  `.trim();
}
