import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { StakeholderFunction } from '@/types/prd';

interface AddStakeholderModalProps {
  open: boolean;
  onClose: () => void;
}

export default function AddStakeholderModal({ open, onClose }: AddStakeholderModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [func, setFunc] = useState<StakeholderFunction>('engineering');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add the stakeholder to the context/API
    console.log('Adding stakeholder:', { name, email, role, function: func });
    onClose();
    // Reset form
    setName('');
    setEmail('');
    setRole('');
    setFunc('engineering');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Add New Stakeholder</DialogTitle>
            <DialogDescription>
              Add a new stakeholder to the directory. They can be assigned to PRD sections.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@company.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Senior Engineer"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="function">Function</Label>
              <Select value={func} onValueChange={(v) => setFunc(v as StakeholderFunction)}>
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
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Stakeholder</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
