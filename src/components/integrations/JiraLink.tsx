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
import { ExternalLink, Link2, Unlink } from 'lucide-react';

interface JiraLinkProps {
  prdId: string;
  jiraIssueKey?: string;
  jiraIssueUrl?: string;
  onLink: (issueKey: string, issueUrl: string) => void;
  onUnlink: () => void;
}

export function JiraLink({ prdId, jiraIssueKey, jiraIssueUrl, onLink, onUnlink }: JiraLinkProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [issueKey, setIssueKey] = useState('');
  const [issueUrl, setIssueUrl] = useState('');

  const handleLink = () => {
    if (issueKey && issueUrl) {
      onLink(issueKey, issueUrl);
      setIsOpen(false);
      setIssueKey('');
      setIssueUrl('');
    }
  };

  if (jiraIssueKey && jiraIssueUrl) {
    return (
      <div className="flex items-center gap-2">
        <a
          href={jiraIssueUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800"
        >
          <ExternalLink className="h-4 w-4" />
          {jiraIssueKey}
        </a>
        <Button
          variant="ghost"
          size="sm"
          onClick={onUnlink}
          className="h-6 w-6 p-0 text-muted-foreground hover:text-red-500"
        >
          <Unlink className="h-3 w-3" />
        </Button>
      </div>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Link2 className="h-4 w-4" />
          Link Jira Issue
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Link Jira Issue</DialogTitle>
          <DialogDescription>
            Link this PRD to an existing Jira issue.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="issueKey">Issue Key</Label>
            <Input
              id="issueKey"
              placeholder="e.g., PROJ-123"
              value={issueKey}
              onChange={(e) => setIssueKey(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="issueUrl">Issue URL</Label>
            <Input
              id="issueUrl"
              placeholder="https://your-domain.atlassian.net/browse/PROJ-123"
              value={issueUrl}
              onChange={(e) => setIssueUrl(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleLink} disabled={!issueKey || !issueUrl}>
            Link Issue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
