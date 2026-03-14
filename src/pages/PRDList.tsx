import { useState } from 'react';
import Layout from '@/components/layout/Layout';
import PRDCard from '@/components/prd/PRDCard';
import { usePRDs } from '@/context/PRDContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Search, Filter, LayoutGrid, List, Loader2 } from 'lucide-react';
import { PRDStatus, Priority } from '@/types/prd';
import { cn } from '@/lib/utils';
import PRDCreationFlow from '@/components/prd/PRDCreationFlow';

const PRDList = () => {
  const { prds, isLoading } = usePRDs();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<PRDStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const filteredPRDs = prds.filter((prd) => {
    const matchesSearch =
      prd.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prd.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || prd.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || prd.priority === priorityFilter;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  if (isLoading) {
    return (
      <Layout title="PRDs" subtitle="Manage your Product Requirements Documents">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout title="My PRDs" subtitle="Manage your Product Requirements Documents">
      <div className="space-y-6 animate-fade-in">
        {/* Toolbar */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-1 items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search PRDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as PRDStatus | 'all')}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="backlog">Backlog</SelectItem>
                <SelectItem value="research">Research</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="complete">Complete</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={(v) => setPriorityFilter(v as Priority | 'all')}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="P0">P0 - Critical</SelectItem>
                <SelectItem value="P1">P1 - High</SelectItem>
                <SelectItem value="P2">P2 - Medium</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            {/* View Toggle */}
            <div className="flex rounded-lg border border-border p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                  viewMode === 'grid'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-md transition-colors',
                  viewMode === 'list'
                    ? 'bg-accent text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <Button className="gap-2" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4" />
              New PRD
            </Button>
          </div>
        </div>

        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          Showing {filteredPRDs.length} of {prds.length} PRDs
        </p>

        {/* PRD Grid/List */}
        {filteredPRDs.length > 0 ? (
          <div
            className={cn(
              'grid gap-4',
              viewMode === 'grid'
                ? 'md:grid-cols-2 lg:grid-cols-3'
                : 'grid-cols-1'
            )}
          >
            {filteredPRDs.map((prd) => (
              <PRDCard key={prd.id} prd={prd} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Filter className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-foreground">No PRDs found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      <PRDCreationFlow open={createModalOpen} onClose={() => setCreateModalOpen(false)} />
    </Layout>
  );
};

export default PRDList;
