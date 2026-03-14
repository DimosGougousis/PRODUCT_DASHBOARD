import { Copy, Send, Calendar, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Stakeholder, PRDSection, StakeholderAssignment } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ContextPackageModalProps {
  stakeholder: Stakeholder;
  assignment: StakeholderAssignment;
  section: PRDSection;
  prdTitle: string;
  prdDescription: string;
  open: boolean;
  onClose: () => void;
}

export default function ContextPackageModal({
  stakeholder,
  assignment,
  section,
  prdTitle,
  prdDescription,
  open,
  onClose,
}: ContextPackageModalProps) {
  const { toast } = useToast();

  // Generate context package content
  const contextPackage = {
    overview: `We're working on "${prdTitle}". ${prdDescription}`,
    whatWeNeed: assignment.expectedContribution,
    backgroundResearch: section.content
      ? `Current section content:\n\n${section.content.slice(0, 500)}...`
      : 'Section is currently empty and needs your input.',
    timeCommitment: `${assignment.estimatedHours} hours`,
    deadline: `${assignment.daysAssigned} days ago (please respond within 48 hours)`,
    questions: [
      {
        priority: 'P0',
        text: 'What is your assessment of the technical feasibility?',
      },
      {
        priority: 'P0',
        text: 'What is your ballpark effort estimate?',
      },
      {
        priority: 'P1',
        text: 'Are there dependencies on other teams or systems?',
      },
      {
        priority: 'P1',
        text: 'What are the main technical risks?',
      },
    ],
  };

  const formattedPackage = `
# Context Package for ${stakeholder.name}

## PRD: ${prdTitle}
**Section:** ${section.name}
**Your Role:** ${assignment.raciRole.toUpperCase()}

---

## 📋 Overview
${contextPackage.overview}

---

## 🎯 What We Need From You

${contextPackage.whatWeNeed.map((item, idx) => `${idx + 1}. ${item}`).join('\n')}

---

## 📚 Background Research

${contextPackage.backgroundResearch}

---

## ⏱️ Time Commitment
**Estimated:** ${contextPackage.timeCommitment}
- 30 min: Review context materials
- ${assignment.estimatedHours - 0.5} hours: Provide detailed input

---

## 📅 Deadline
**Assigned:** ${contextPackage.deadline}
**Why it matters:** This input is blocking other workstreams and sprint planning.

---

## ❓ Key Questions (Priority Order)

${contextPackage.questions
  .map(
    (q) => `**${q.priority}:**
${q.text}`
  )
  .join('\n\n')}

---

## 🚀 Next Steps

1. Review this context package
2. Reply directly via ${stakeholder.preferredContactMethod}
3. Or schedule a 30-min sync if needed
4. Add your input to the PRD section

**Thank you for your contribution!**
  `.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(formattedPackage);
    toast({
      title: 'Copied to clipboard',
      description: 'Context package copied successfully',
    });
  };

  const handleSend = () => {
    // Simulate sending
    toast({
      title: 'Context package sent',
      description: `Email sent to ${stakeholder.email}`,
    });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Context Package</DialogTitle>
            <div className="flex items-center gap-2">
              <Badge>{stakeholder.function}</Badge>
              <Badge variant="outline" className="uppercase">
                {assignment.raciRole[0]}
              </Badge>
            </div>
          </div>
          <DialogDescription>
            Prepared for {stakeholder.name} • {stakeholder.role}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="formatted" className="flex-1 flex flex-col overflow-hidden">
          <TabsList>
            <TabsTrigger value="formatted">Formatted View</TabsTrigger>
            <TabsTrigger value="markdown">Markdown Source</TabsTrigger>
          </TabsList>

          <TabsContent value="formatted" className="flex-1 overflow-auto mt-4">
            <div className="space-y-6 pr-2">
              {/* Header */}
              <div className="border-b pb-4">
                <h2 className="text-2xl font-bold mb-2">
                  Context Package for {stakeholder.name}
                </h2>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{contextPackage.timeCommitment}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Due: 48 hours</span>
                  </div>
                </div>
              </div>

              {/* Overview */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📋 Overview</h3>
                <p className="text-gray-700">{contextPackage.overview}</p>
              </div>

              {/* What We Need */}
              <div>
                <h3 className="text-lg font-semibold mb-2">🎯 What We Need From You</h3>
                <ul className="space-y-2">
                  {contextPackage.whatWeNeed.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-blue-500 font-bold">{idx + 1}.</span>
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Background */}
              <div>
                <h3 className="text-lg font-semibold mb-2">📚 Background Research</h3>
                <div className="bg-gray-50 border rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {contextPackage.backgroundResearch}
                  </p>
                </div>
              </div>

              {/* Questions */}
              <div>
                <h3 className="text-lg font-semibold mb-3">❓ Key Questions</h3>
                <div className="space-y-3">
                  {contextPackage.questions.map((question, idx) => (
                    <div key={idx} className="border-l-4 border-blue-500 pl-4">
                      <Badge className="mb-1">{question.priority}</Badge>
                      <p className="text-gray-700">{question.text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-2">🚀 Next Steps</h3>
                <ol className="space-y-2 text-sm">
                  <li>1. Review this context package</li>
                  <li>2. Reply via {stakeholder.preferredContactMethod}</li>
                  <li>3. Or schedule a 30-min sync if needed</li>
                  <li>4. Add your input to the PRD section</li>
                </ol>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="markdown" className="flex-1 overflow-auto mt-4">
            <pre className="bg-gray-900 text-gray-100 p-6 rounded-lg text-sm font-mono whitespace-pre-wrap">
              {formattedPackage}
            </pre>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 flex gap-2 justify-end">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button variant="outline" onClick={handleCopy}>
            <Copy className="w-4 h-4 mr-2" />
            Copy to Clipboard
          </Button>
          <Button onClick={handleSend}>
            <Send className="w-4 h-4 mr-2" />
            Send via {stakeholder.preferredContactMethod}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
