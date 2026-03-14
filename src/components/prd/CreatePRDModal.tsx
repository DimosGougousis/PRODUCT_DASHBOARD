import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { usePRDs } from '@/context/PRDContext';
import { Priority, PRDTemplateKind } from '@/types/prd';
import { Loader2 } from 'lucide-react';

interface CreatePRDModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreatePRDModal = ({ open, onOpenChange }: CreatePRDModalProps) => {
  const { addPRD } = usePRDs();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    targetDate: '',
    priority: 'P1' as Priority,
    template: 'feature' as PRDTemplateKind,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    
    // Simulate async operation
    await new Promise((resolve) => setTimeout(resolve, 500));

    addPRD({
      title: formData.title.trim(),
      description: formData.description.trim(),
      targetDate: formData.targetDate || new Date().toISOString(),
      priority: formData.priority,
      template: formData.template,
      status: 'backlog',
      progress: 0,
      owner: 'Current User',
      ownerId: 'user-current',
      tags: [],
      daysInProgress: 0,
    });

    setFormData({
      title: '',
      description: '',
      targetDate: '',
      priority: 'P1',
      template: 'feature',
    });
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New PRD</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              PRD Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter PRD title..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description / Concept</Label>
            <Textarea
              id="description"
              placeholder="Describe the product concept..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetDate">Target Completion Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={formData.priority}
                onValueChange={(v) => setFormData({ ...formData, priority: v as Priority })}
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="P0">P0 - Critical</SelectItem>
                  <SelectItem value="P1">P1 - High</SelectItem>
                  <SelectItem value="P2">P2 - Medium</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">PRD Template</Label>
            <Select
              value={formData.template}
              onValueChange={(v) => setFormData({ ...formData, template: v as PRDTemplateKind })}
            >
              <SelectTrigger id="template">
                <SelectValue placeholder="Select template" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="feature">Feature PRD</SelectItem>
                <SelectItem value="enhancement">Enhancement PRD</SelectItem>
                <SelectItem value="technical">Technical PRD</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.title.trim()}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create PRD'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePRDModal;
