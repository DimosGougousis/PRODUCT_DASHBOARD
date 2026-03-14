import { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, Folder } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { PRDTemplate, TemplateQuestion } from '@/data/prdTemplates';
import LocalFolderLinker from './LocalFolderLinker';

interface PRDCreationWizardProps {
  template: PRDTemplate;
  open: boolean;
  onClose: () => void;
  onComplete: (prdData: PRDFormData) => void;
}

export interface PRDFormData {
  templateId: string;
  answers: Record<string, string | string[]>;
  linkedFolders: string[];
  linkedFiles: File[];
}

export default function PRDCreationWizard({
  template,
  open,
  onClose,
  onComplete,
}: PRDCreationWizardProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showFolderLinker, setShowFolderLinker] = useState(false);
  const [linkedFolders, setLinkedFolders] = useState<string[]>([]);
  const [linkedFiles, setLinkedFiles] = useState<File[]>([]);

  const totalSteps = template.questions.length + 1; // +1 for folder linking step
  const progress = ((currentStep + 1) / totalSteps) * 100;
  const currentQuestion = template.questions[currentStep];
  const isFolderStep = currentStep === template.questions.length;

  const handleAnswer = (questionId: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (isFolderStep) {
      // Complete the wizard
      onComplete({
        templateId: template.id,
        answers,
        linkedFolders,
        linkedFiles,
      });
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const isCurrentStepValid = () => {
    if (isFolderStep) return true; // Folder linking is optional
    
    const question = template.questions[currentStep];
    if (!question.required) return true;
    
    const answer = answers[question.id];
    if (!answer) return false;
    
    if (typeof answer === 'string') return answer.trim().length > 0;
    if (Array.isArray(answer)) return answer.length > 0;
    
    return true;
  };

  const handleFolderLinked = (folders: string[], files: File[]) => {
    setLinkedFolders(folders);
    setLinkedFiles(files);
    setShowFolderLinker(false);
  };

  const renderQuestionField = (question: TemplateQuestion) => {
    const value = answers[question.id] || '';

    switch (question.fieldType) {
      case 'text':
        return (
          <Input
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full"
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            rows={6}
            className="w-full"
          />
        );

      case 'select':
        return (
          <Select value={value} onValueChange={(val) => handleAnswer(question.id, val)}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
              {question.options?.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case 'multiselect': {
        const selectedOptions = Array.isArray(value) ? value : [];
        return (
          <div className="space-y-2">
            {question.options?.map((option) => (
              <label key={option} className="flex items-center gap-2 cursor-pointer">
                <Checkbox
                  checked={selectedOptions.includes(option)}
                  onCheckedChange={(checked) => {
                    const newValue = checked
                      ? [...selectedOptions, option]
                      : selectedOptions.filter((o) => o !== option);
                    handleAnswer(question.id, newValue);
                  }}
                />
                <span className="text-sm">{option}</span>
              </label>
            ))}
          </div>
        );
      }

      case 'date':
        return (
          <Input
            type="date"
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            className="w-full"
          />
        );

      case 'number':
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) => handleAnswer(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full"
          />
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Dialog open={open && !showFolderLinker} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                {template.icon} {template.name}
              </DialogTitle>
              <Badge variant="outline">
                Step {currentStep + 1} of {totalSteps}
              </Badge>
            </div>
            <Progress value={progress} className="mt-2" />
          </DialogHeader>

          <div className="flex-1 overflow-auto">
            {!isFolderStep ? (
              <div className="space-y-6 py-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    {currentQuestion.question}
                    {currentQuestion.required && (
                      <span className="text-destructive ml-1">*</span>
                    )}
                  </h3>
                  {currentQuestion.description && (
                    <p className="text-sm text-muted-foreground">{currentQuestion.description}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={currentQuestion.id}>Your answer</Label>
                  {renderQuestionField(currentQuestion)}
                </div>

                {currentQuestion.mapsToSection && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs text-primary">
                      💡 This will populate the <strong>{currentQuestion.mapsToSection}</strong> section of your PRD
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-6 py-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Link Supporting Documents (Optional)
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Connect a local folder containing research, notes, designs, or other files that can help generate better PRD content.
                  </p>
                </div>

                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <Folder className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <Button onClick={() => setShowFolderLinker(true)}>
                    <Folder className="w-4 h-4 mr-2" />
                    Browse Local Folders
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    AI will analyze your files to enhance PRD content
                  </p>
                </div>

                {linkedFolders.length > 0 && (
                  <div className="bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4">
                    <h4 className="font-semibold text-sm mb-2 text-green-800 dark:text-green-200">
                      ✓ Linked Resources
                    </h4>
                    <div className="space-y-2">
                      {linkedFolders.map((folder, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Folder className="w-4 h-4 text-green-600" />
                          <span>{folder}</span>
                        </div>
                      ))}
                      {linkedFiles.length > 0 && (
                        <p className="text-xs text-green-700 dark:text-green-300 mt-2">
                          {linkedFiles.length} files will be analyzed
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                  <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>AI generates PRD with your answers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>{template.autoTasks.length} tasks created in Kanban</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5" />
                      <span>Stakeholders automatically identified</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-between pt-4 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
            >
              {isFolderStep ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create PRD
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <LocalFolderLinker
        open={showFolderLinker}
        onClose={() => setShowFolderLinker(false)}
        onLinked={handleFolderLinked}
      />
    </>
  );
}
