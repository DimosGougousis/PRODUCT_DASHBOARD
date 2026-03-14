/**
 * Snapshot Export Button - PDF/PPTX export trigger
 * 
 * TODO[GAP-014]: Export Implementation Options
 *   - Option A: Client-side @react-pdf/renderer (larger bundle)
 *   - Option B: Server-side Puppeteer/Playwright (preferred)
 * 
 * TODO: Implement export endpoint
 *   - POST /governance/snapshot/:productId/export
 *   - Body: { format: 'pdf' | 'pptx', pillars: GovPillar[] }
 */

import { useState } from 'react';
import { Download, FileText, Presentation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type ExportFormat = 'pdf' | 'pptx';

interface SnapshotExportButtonProps {
  productId: string;
  pillars: string[];
}

export function SnapshotExportButton({ productId, pillars }: SnapshotExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: ExportFormat) => {
    setIsExporting(true);
    
    // TODO: Implement export API call
    // const response = await fetch(`/api/governance/snapshot/${productId}/export`, {
    //   method: 'POST',
    //   body: JSON.stringify({ format, pillars }),
    // });
    
    console.log('TODO: Export', { productId, format, pillars });
    
    setTimeout(() => setIsExporting(false), 1000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={isExporting}>
          <Download className={`w-4 h-4 mr-2 ${isExporting ? 'animate-spin' : ''}`} />
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleExport('pdf')}>
          <FileText className="w-4 h-4 mr-2" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport('pptx')}>
          <Presentation className="w-4 h-4 mr-2" />
          Export as PPTX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
