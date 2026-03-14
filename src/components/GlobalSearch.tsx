import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, Clock, Command } from 'lucide-react';
import { usePRDs } from '@/context/PRDContext';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GlobalSearchProps {
  open: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  type: 'prd' | 'section' | 'stakeholder' | 'recommendation';
  title: string;
  description: string;
  url: string;
  metadata?: string;
}

export default function GlobalSearch({ open, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { prds, stakeholders } = usePRDs();

  const performSearch = useCallback(
    (searchQuery: string): SearchResult[] => {
      const q = searchQuery.toLowerCase();
      const matched: SearchResult[] = [];

      for (const prd of prds) {
        if (
          prd.title.toLowerCase().includes(q) ||
          prd.description.toLowerCase().includes(q) ||
          prd.tags.some((t) => t.toLowerCase().includes(q))
        ) {
          matched.push({
            id: prd.id,
            type: 'prd',
            title: prd.title,
            description: prd.description,
            url: `/prds/${prd.id}`,
            metadata: `${prd.status} · ${prd.progress}% complete · Updated ${formatRelativeDate(prd.updatedAt)}`,
          });
        }

        for (const section of prd.sections) {
          if (
            section.name.toLowerCase().includes(q) ||
            section.content.toLowerCase().includes(q)
          ) {
            matched.push({
              id: `${prd.id}-${section.id}`,
              type: 'section',
              title: `${section.name} — ${prd.title}`,
              description: section.content.slice(0, 120) || 'No content yet',
              url: `/prds/${prd.id}`,
              metadata: `${section.completeness}% complete`,
            });
          }
        }
      }

      for (const s of stakeholders) {
        if (
          s.name.toLowerCase().includes(q) ||
          s.role.toLowerCase().includes(q) ||
          s.function.toLowerCase().includes(q) ||
          s.expertise.some((e) => e.toLowerCase().includes(q))
        ) {
          matched.push({
            id: s.id,
            type: 'stakeholder',
            title: s.name,
            description: `${s.role}, ${s.function}`,
            url: '/stakeholders',
            metadata: `${Math.round(s.responseRate * 100)}% response rate`,
          });
        }
      }

      return matched.slice(0, 20);
    },
    [prds, stakeholders]
  );

  const getRecentItems = useCallback((): SearchResult[] => {
    const sorted = [...prds].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
    return sorted.slice(0, 5).map((prd) => ({
      id: prd.id,
      type: 'prd' as const,
      title: prd.title,
      description: prd.description,
      url: `/prds/${prd.id}`,
      metadata: `Updated ${formatRelativeDate(prd.updatedAt)}`,
    }));
  }, [prds]);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.length > 0) {
      const timer = setTimeout(() => {
        setResults(performSearch(query));
        setSelectedIndex(0);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setResults(getRecentItems());
    }
  }, [query, performSearch, getRecentItems]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (results[selectedIndex]) {
        handleSelect(results[selectedIndex]);
      }
    }
  };

  const handleSelect = (result: SearchResult) => {
    navigate(result.url);
    onClose();
  };

  const typeIcons = {
    prd: FileText,
    section: FileText,
    stakeholder: Users,
    recommendation: Clock,
  };

  const typeColors = {
    prd: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    section: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    stakeholder: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    recommendation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-muted-foreground" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search PRDs, sections, stakeholders..."
            className="border-0 focus-visible:ring-0 text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-muted px-2 py-1 text-xs">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-96">
          {results.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
            </div>
          ) : (
            <div className="p-2">
              {query.length === 0 && (
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground">
                  Recent
                </div>
              )}
              {results.map((result, idx) => {
                const Icon = typeIcons[result.type];
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={result.id}
                    onClick={() => handleSelect(result)}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`w-full text-left px-3 py-3 rounded-lg transition-colors ${
                      isSelected ? 'bg-accent' : 'hover:bg-muted'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${typeColors[result.type]}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm truncate">
                            {result.title}
                          </p>
                          <Badge variant="outline" className="text-xs capitalize">
                            {result.type}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-1">
                          {result.description}
                        </p>
                        {result.metadata && (
                          <p className="text-xs text-muted-foreground/70 mt-1">
                            {result.metadata}
                          </p>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-muted rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function formatRelativeDate(dateStr: string): string {
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diffMs = now - then;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

// Hook to set up global keyboard shortcut
// eslint-disable-next-line react-refresh/only-export-components
export function useGlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(true);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return { isOpen, setIsOpen };
}
