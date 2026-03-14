import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRDTemplateType, PRD_TEMPLATES } from '@/data/prdTemplates';
import PRDTemplateSelector from './PRDTemplateSelector';
import PRDCreationWizard, { PRDFormData } from './PRDCreationWizard';
import { usePRDs } from '@/context/PRDContext';
import { useToast } from '@/components/ui/use-toast';
import { PRDSection, SectionType } from '@/types/prd';

interface PRDCreationFlowProps {
  open: boolean;
  onClose: () => void;
}

export default function PRDCreationFlow({
  open,
  onClose,
}: PRDCreationFlowProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addPRD } = usePRDs();
  const [selectedTemplate, setSelectedTemplate] = useState<PRDTemplateType | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  const handleTemplateSelected = (templateType: PRDTemplateType) => {
    setSelectedTemplate(templateType);
    setShowWizard(true);
  };

  const handleWizardComplete = async (formData: PRDFormData) => {
    const template = PRD_TEMPLATES[selectedTemplate!];
    
    const timestamp = new Date().toISOString();

    // Extract title from first answer
    const firstAnswer = formData.answers[template.questions[0].id] || 'Untitled PRD';
    const secondAnswer = formData.answers[template.questions[1]?.id] || '';
    
    // Map template type to priority
    const priorityMap: Record<PRDTemplateType, 'P0' | 'P1' | 'P2'> = {
      feature: 'P1',
      technical: 'P1',
      enhancement: 'P2',
    };

    // Create the PRD using context
    addPRD({
      title: firstAnswer,
      description: secondAnswer,
      status: 'backlog',
      progress: 0,
      owner: 'Current User',
      ownerId: 'user-current',
      priority: priorityMap[selectedTemplate!],
      targetDate: formData.answers['launch-date'] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      template: selectedTemplate!,
      tags: [],
      daysInProgress: 0,
    });

    // Generate Kanban tasks
    generateKanbanTasks(template, firstAnswer);

    // Show success message
    toast({
      title: 'PRD Created! 🎉',
      description: `${template.name} created with ${template.autoTasks.length} tasks`,
    });

    // Close modals
    setShowWizard(false);
    setSelectedTemplate(null);
    onClose();

    // Navigate to PRD list
    navigate('/prds');
  };

  const generateKanbanTasks = (template: typeof PRD_TEMPLATES.feature, prdTitle: string) => {
    const tasks = template.autoTasks.map((taskConfig, index) => ({
      id: `task-${Date.now()}-${index}`,
      prdTitle: prdTitle,
      sectionName: taskConfig.assignToSection || 'General',
      title: taskConfig.title,
      description: taskConfig.description,
      status: taskConfig.status,
      assignedStakeholders: [],
      estimatedDays: taskConfig.estimatedDays,
      createdAt: new Date().toISOString(),
    }));

    // Store tasks in localStorage
    const existingTasks = JSON.parse(localStorage.getItem('kanban-tasks') || '[]');
    localStorage.setItem('kanban-tasks', JSON.stringify([...existingTasks, ...tasks]));

    console.log(`Created ${tasks.length} tasks for PRD`, tasks);
  };

  const handleCloseWizard = () => {
    setShowWizard(false);
    setSelectedTemplate(null);
  };

  const handleClose = () => {
    setShowWizard(false);
    setSelectedTemplate(null);
    onClose();
  };

  return (
    <>
      {!showWizard && (
        <PRDTemplateSelector
          open={open}
          onClose={handleClose}
          onSelectTemplate={handleTemplateSelected}
        />
      )}
      
      {showWizard && selectedTemplate && (
        <PRDCreationWizard
          template={PRD_TEMPLATES[selectedTemplate]}
          open={showWizard}
          onClose={handleCloseWizard}
          onComplete={handleWizardComplete}
        />
      )}
    </>
  );
}
