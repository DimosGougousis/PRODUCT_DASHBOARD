import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bold, Italic, List, ListOrdered, Link as LinkIcon, Save } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface RichTextEditorProps {
  initialContent: string;
  onSave: (content: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({
  initialContent,
  onSave,
  placeholder = 'Start writing...',
}: RichTextEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setHasChanges(false);
  }, [initialContent]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(newContent !== initialContent);
  };

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate save delay
    await new Promise((resolve) => setTimeout(resolve, 500));
    onSave(content);
    setIsSaving(false);
    setHasChanges(false);
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const newText =
      content.substring(0, start) +
      before +
      selectedText +
      after +
      content.substring(end);

    handleContentChange(newText);

    // Set cursor position
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + before.length + selectedText.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  return (
    <div className="space-y-2">
      <Tabs defaultValue="edit" className="w-full">
        <div className="flex items-center justify-between mb-2">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            {hasChanges && (
              <span className="text-sm text-muted-foreground">Unsaved changes</span>
            )}
            <Button
              onClick={handleSave}
              disabled={!hasChanges || isSaving}
              size="sm"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>

        <TabsContent value="edit" className="space-y-2">
          {/* Formatting Toolbar */}
          <div className="flex items-center gap-1 p-2 bg-muted rounded-md border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('**', '**')}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('*', '*')}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('\n- ', '')}
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('\n1. ', '')}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>
            <div className="w-px h-6 bg-border mx-1" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown('[', '](url)')}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>
          </div>

          {/* Editor */}
          <Textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[400px] font-mono text-sm"
          />

          <p className="text-xs text-muted-foreground">
            Supports Markdown formatting. {content.split(/\s+/).filter(Boolean).length}{' '}
            words
          </p>
        </TabsContent>

        <TabsContent value="preview">
          <div className="min-h-[400px] p-6 bg-background rounded-md border">
            {content ? (
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <ReactMarkdown>{content}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-muted-foreground">Nothing to preview yet...</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
