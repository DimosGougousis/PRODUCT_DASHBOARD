import { useState } from 'react';
import { Folder, File, X, Upload, AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

interface LocalFolderLinkerProps {
  open: boolean;
  onClose: () => void;
  onLinked: (folders: string[], files: File[]) => void;
}

export default function LocalFolderLinker({
  open,
  onClose,
  onLinked,
}: LocalFolderLinkerProps) {
  const { toast } = useToast();
  const [linkedFolders, setLinkedFolders] = useState<string[]>([]);
  const [linkedFiles, setLinkedFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  // Check if File System Access API is supported
  const isFileSystemSupported = 'showDirectoryPicker' in window;

  const handleBrowseFolder = async () => {
    if (!isFileSystemSupported) {
      toast({
        title: 'Not supported',
        description: 'Your browser does not support folder access. Try Chrome or Edge.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsProcessing(true);

      // @ts-expect-error - File System Access API not yet in TypeScript DOM lib
      const dirHandle = await window.showDirectoryPicker({
        mode: 'read',
      });

      const folderPath = dirHandle.name;
      const files: File[] = [];

      // Read files from the directory
      for await (const entry of dirHandle.values()) {
        if (entry.kind === 'file') {
          const fileHandle = entry;
          const file = await fileHandle.getFile();
          
          // Only include supported file types
          const supportedTypes = [
            '.txt', '.md', '.pdf', '.doc', '.docx',
            '.png', '.jpg', '.jpeg', '.gif',
            '.json', '.csv', '.xlsx',
          ];
          
          const hasValidExtension = supportedTypes.some(ext => 
            file.name.toLowerCase().endsWith(ext)
          );
          
          if (hasValidExtension) {
            files.push(file);
          }
        }
      }

      if (files.length === 0) {
        toast({
          title: 'No supported files found',
          description: 'The folder does not contain any supported file types.',
          variant: 'destructive',
        });
        setIsProcessing(false);
        return;
      }

      setLinkedFolders((prev) => [...prev, folderPath]);
      setLinkedFiles((prev) => [...prev, ...files]);

      toast({
        title: 'Folder linked!',
        description: `Found ${files.length} supported files in ${folderPath}`,
      });

      setIsProcessing(false);
    } catch (error: unknown) {
      if (error instanceof Error && error.name !== 'AbortError') {
        toast({
          title: 'Error accessing folder',
          description: error.message,
          variant: 'destructive',
        });
      }
      setIsProcessing(false);
    }
  };

  const handleUploadFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (files.length === 0) return;

    setLinkedFiles((prev) => [...prev, ...files]);

    toast({
      title: 'Files added!',
      description: `Added ${files.length} files`,
    });
  };

  const handleRemoveFile = (index: number) => {
    setLinkedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleConfirm = () => {
    onLinked(linkedFolders, linkedFiles);
  };

  const totalSize = linkedFiles.reduce((sum, file) => sum + file.size, 0);
  const formattedSize = (totalSize / 1024 / 1024).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Link Supporting Documents</DialogTitle>
          <DialogDescription>
            Connect local folders or upload files to help AI generate better PRD content
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-auto space-y-6">
          {/* Browse Folder Button */}
          {isFileSystemSupported ? (
            <div className="space-y-2">
              <Button
                onClick={handleBrowseFolder}
                disabled={isProcessing}
                className="w-full"
                size="lg"
              >
                <Folder className="w-4 h-4 mr-2" />
                {isProcessing ? 'Processing...' : 'Browse Local Folder'}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                AI will analyze: .txt, .md, .pdf, .doc, .docx, images, .json, .csv, .xlsx
              </p>
            </div>
          ) : (
            <div className="bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                  Folder browsing not supported
                </p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Use Chrome or Edge browser for folder access, or upload individual files below
                </p>
              </div>
            </div>
          )}

          {/* Upload Files Button */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-3">or</p>
            <label className="cursor-pointer">
              <input
                type="file"
                multiple
                onChange={handleUploadFiles}
                className="hidden"
                accept=".txt,.md,.pdf,.doc,.docx,.png,.jpg,.jpeg,.gif,.json,.csv,.xlsx"
              />
              <Button variant="outline" className="w-full" size="lg" asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Individual Files
                </span>
              </Button>
            </label>
          </div>

          {/* Linked Folders */}
          {linkedFolders.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Linked Folders</h4>
              <div className="space-y-1">
                {linkedFolders.map((folder, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-muted rounded border"
                  >
                    <Folder className="w-4 h-4 text-primary" />
                    <span className="text-sm flex-1">{folder}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Linked Files */}
          {linkedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold">
                  Files ({linkedFiles.length})
                </h4>
                <Badge variant="outline">
                  {formattedSize} MB total
                </Badge>
              </div>
              <div className="space-y-1 max-h-64 overflow-auto">
                {linkedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 bg-muted rounded border group"
                  >
                    <File className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm truncate">{file.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(idx)}
                      className="opacity-0 group-hover:opacity-100"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Info Box */}
          {linkedFiles.length === 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold text-sm mb-2">How this helps</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>AI reads your research notes and requirements docs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Analyzes design mockups and technical specs</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Generates more detailed and accurate PRD content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  <span>Your files stay local - only read access needed</span>
                </li>
              </ul>
            </div>
          )}

          {/* Privacy Notice */}
          <div className="bg-muted border rounded-lg p-3">
            <p className="text-xs text-muted-foreground">
              🔒 <strong>Privacy:</strong> Files are processed locally in your browser. 
              AI may send file content to generate PRD text, but files are never stored permanently.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={linkedFiles.length === 0 && linkedFolders.length === 0}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
