import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Users, Clock, Command } from 'lucide-react';
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

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    if (query.length > 0) {
      // Simulate search with debounce
      const timer = setTimeout(() => {
        setResults(performSearch(query));
        setSelectedIndex(0);
      }, 200);
      return () => clearTimeout(timer);
    } else {
      setResults(getRecentItems());
    }
  }, [query]);

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
    prd: 'bg-blue-100 text-blue-700',
    section: 'bg-purple-100 text-purple-700',
    stakeholder: 'bg-green-100 text-green-700',
    recommendation: 'bg-orange-100 text-orange-700',
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 max-w-2xl overflow-hidden">
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Search className="w-5 h-5 text-gray-400" />
          <Input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search PRDs, sections, stakeholders..."
            className="border-0 focus-visible:ring-0 text-base"
          />
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border bg-gray-100 px-2 py-1 text-xs">
            <Command className="w-3 h-3" />K
          </kbd>
        </div>

        {/* Results */}
        <ScrollArea className="max-h-96">
          {results.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>No results found</p>
            </div>
          ) : (
            <div className="p-2">
              {query.length === 0 && (
                <div className="px-3 py-2 text-xs font-semibold text-gray-500">
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
                      isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'
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
                        <p className="text-xs text-gray-600 line-clamp-1">
                          {result.description}
                        </p>
                        {result.metadata && (
                          <p className="text-xs text-gray-400 mt-1">
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
        <div className="border-t p-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">↵</kbd>
              Select
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-gray-100 rounded">Esc</kbd>
              Close
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function performSearch(query: string): SearchResult[] {
  const mockResults: SearchResult[] = [
    {
      id: 'prd-1',
      type: 'prd',
      title: 'Promo Code Error Handling Enhancement',
      description: 'Improve promo code validation and error messaging',
      url: '/prds/prd-1',
      metadata: 'Last updated 2 days ago',
    },
    {
      id: 'prd-2',
      type: 'prd',
      title: 'User Dashboard Redesign',
      description: 'Modernize user dashboard with improved data visualization',
      url: '/prds/prd-2',
      metadata: 'Last updated 5 days ago',
    },
    {
      id: 'stakeholder-1',
      type: 'stakeholder',
      title: 'Sarah Chen',
      description: 'Engineering Lead, Payments',
      url: '/stakeholders',
      metadata: '87% response rate',
    },
    {
      id: 'section-1',
      type: 'section',
      title: 'Technical Approach - Promo Code Enhancement',
      description: 'Architecture and implementation approach for promo code validation',
      url: '/prds/prd-1',
      metadata: '70% complete',
    },
  ];

  return mockResults.filter(
    (result) =>
      result.title.toLowerCase().includes(query.toLowerCase()) ||
      result.description.toLowerCase().includes(query.toLowerCase())
  );
}

function getRecentItems(): SearchResult[] {
  return [
    {
      id: 'recent-1',
      type: 'prd',
      title: 'Promo Code Error Handling Enhancement',
      description: 'Improve promo code validation and error messaging',
      url: '/prds/prd-1',
      metadata: 'Viewed 5 minutes ago',
    },
    {
      id: 'recent-2',
      type: 'stakeholder',
      title: 'Sarah Chen',
      description: 'Engineering Lead, Payments',
      url: '/stakeholders',
      metadata: 'Viewed today',
    },
  ];
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
