import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExternalLink, Link2, Unlink, Github, FileText, Folder, MessageSquare, Ticket } from 'lucide-react';
import { SectionIntegrationLinks as SectionIntegrationLinksType } from '@/types/prd';

interface SectionIntegrationLinksProps {
  links?: SectionIntegrationLinksType;
  onUpdate: (links: SectionIntegrationLinksType) => void;
}

const integrationConfigs = [
  { key: 'jira', label: 'Jira', icon: Ticket, placeholder: 'https://your-domain.atlassian.net/browse/PROJ-123', color: 'text-blue-600' },
  { key: 'slack', label: 'Slack', icon: MessageSquare, placeholder: 'https://your-workspace.slack.com/archives/...', color: 'text-purple-600' },
  { key: 'github', label: 'GitHub', icon: Github, placeholder: 'https://github.com/org/repo/issues/123', color: 'text-gray-800' },
  { key: 'googleDrive', label: 'Google Drive', icon: Folder, placeholder: 'https://drive.google.com/file/d/...', color: 'text-green-600' },
  { key: 'confluence', label: 'Confluence', icon: FileText, placeholder: 'https://your-domain.atlassian.net/wiki/...', color: 'text-blue-500' },
] as const;

export function SectionIntegrationLinks({ links = {}, onUpdate }: SectionIntegrationLinksProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<SectionIntegrationLinksType>(links);

  const handleSave = () => {
    // Remove empty URLs
    const cleaned: SectionIntegrationLinksType = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (value?.trim()) {
        cleaned[key as keyof SectionIntegrationLinksType] = value.trim();
      }
    });
    onUpdate(cleaned);
    setIsOpen(false);
  };

  const handleUnlink = (key: keyof SectionIntegrationLinksType) => {
    const newLinks = { ...links };
    delete newLinks[key];
    onUpdate(newLinks);
  };

  const hasLinks = Object.keys(links).length > 0;

  return (
    <div className="space-y-2">
      {/* Display existing links */}
      {hasLinks && (
        <div className="flex flex-wrap gap-2">
          {integrationConfigs.map((config) => {
            const url = links[config.key];
            if (!url) return null;
            
            const Icon = config.icon;
            return (
              <div key={config.key} className="flex items-center gap-1">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-1 text-xs px-2 py-1 rounded bg-muted hover:bg-muted/80 transition-colors ${config.color}`}
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleUnlink(config.key)}
                  className="h-5 w-5 p-0 text-muted-foreground hover:text-red-500"
                >
                  <Unlink className="h-3 w-3" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Links Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1">
            <Link2 className="h-3 w-3" />
            {hasLinks ? 'Edit Links' : 'Add Links'}
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Integration Links</DialogTitle>
            <DialogDescription>
              Add links to external tools and resources for this section.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {integrationConfigs.map((config) => {
              const Icon = config.icon;
              return (
                <div key={config.key} className="grid gap-2">
                  <Label htmlFor={config.key} className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${config.color}`} />
                    {config.label}
                  </Label>
                  <Input
                    id={config.key}
                    placeholder={config.placeholder}
                    value={formData[config.key] || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, [config.key]: e.target.value }))
                    }
                  />
                </div>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Links</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
