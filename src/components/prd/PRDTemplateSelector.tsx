import { useState } from 'react';
import { FileText, Settings, TrendingUp, ChevronRight } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PRDTemplateType, PRD_TEMPLATES } from '@/data/prdTemplates';

interface PRDTemplateSelectorProps {
  open: boolean;
  onClose: () => void;
  onSelectTemplate: (templateType: PRDTemplateType) => void;
}

export default function PRDTemplateSelector({
  open,
  onClose,
  onSelectTemplate,
}: PRDTemplateSelectorProps) {
  const [selectedType, setSelectedType] = useState<PRDTemplateType | null>(null);

  const templates = [
    {
      type: 'feature' as PRDTemplateType,
      icon: FileText,
      color: 'bg-blue-500',
      examples: ['New dashboard widget', 'User onboarding flow', 'Mobile app feature'],
    },
    {
      type: 'technical' as PRDTemplateType,
      icon: Settings,
      color: 'bg-purple-500',
      examples: ['Database migration', 'API redesign', 'Performance optimization'],
    },
    {
      type: 'enhancement' as PRDTemplateType,
      icon: TrendingUp,
      color: 'bg-green-500',
      examples: ['Faster page load', 'Better search accuracy', 'UI polish'],
    },
  ];

  const handleSelect = (type: PRDTemplateType) => {
    setSelectedType(type);
  };

  const handleContinue = () => {
    if (selectedType) {
      onSelectTemplate(selectedType);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Create New PRD</DialogTitle>
          <DialogDescription>
            Choose a template to get started. I'll guide you through the process.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
          {templates.map((template) => {
            const config = PRD_TEMPLATES[template.type];
            const Icon = template.icon;
            const isSelected = selectedType === template.type;

            return (
              <Card
                key={template.type}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => handleSelect(template.type)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className={`p-3 rounded-lg ${template.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    {isSelected && (
                      <Badge className="bg-primary">Selected</Badge>
                    )}
                  </div>
                  <CardTitle className="mt-4">{config.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {config.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-foreground">
                      {config.icon} Examples:
                    </p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      {template.examples.map((example, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="text-muted-foreground mr-2">•</span>
                          {example}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground">
                      {config.questions.length} questions • {config.autoTasks.length} auto-tasks
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {selectedType && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <h4 className="font-semibold text-sm mb-2">What happens next?</h4>
            <ol className="text-sm text-muted-foreground space-y-2">
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">1</Badge>
                <span>I'll ask you {PRD_TEMPLATES[selectedType].questions.length} questions to understand your needs</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">2</Badge>
                <span>Link any local folders with supporting docs (optional)</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">3</Badge>
                <span>Your PRD will be generated with AI-powered content</span>
              </li>
              <li className="flex items-start">
                <Badge variant="outline" className="mr-2 mt-0.5">4</Badge>
                <span>{PRD_TEMPLATES[selectedType].autoTasks.length} tasks will be automatically created in your Kanban board</span>
              </li>
            </ol>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleContinue} disabled={!selectedType}>
            Continue
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
