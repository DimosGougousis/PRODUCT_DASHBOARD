import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StakeholderFunction } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface AddStakeholderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStakeholderModal({ open, onClose }: AddStakeholderModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    function: 'engineering' as StakeholderFunction,
    expertise: '',
    preferredContact: 'slack' as 'slack' | 'email' | 'in_person',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In real app, would call API to create stakeholder
    toast({
      title: 'Stakeholder added',
      description: `${formData.name} has been added to the directory.`,
    });
    
    // Reset form
    setFormData({
      name: '',
      email: '',
      role: '',
      function: 'engineering',
      expertise: '',
      preferredContact: 'slack',
    });
    
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Stakeholder</DialogTitle>
          <DialogDescription>
            Add a new stakeholder to the directory for PRD assignments
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Sarah Chen"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="sarah.chen@company.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">Role / Title *</Label>
            <Input
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              placeholder="Engineering Lead, Payments"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="function">Function *</Label>
            <Select
              value={formData.function}
              onValueChange={(value) =>
                setFormData({ ...formData, function: value as StakeholderFunction })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="design">Design</SelectItem>
                <SelectItem value="analytics">Analytics</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="legal">Legal</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="product">Product</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="expertise">Expertise Areas</Label>
            <Input
              id="expertise"
              value={formData.expertise}
              onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
              placeholder="React, API design, Performance (comma-separated)"
            />
            <p className="text-xs text-gray-500">
              Separate multiple areas with commas
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="contact">Preferred Contact Method</Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  preferredContact: value as 'slack' | 'email' | 'in_person',
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slack">Slack</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="in_person">In Person</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 justify-end pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Stakeholder</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
