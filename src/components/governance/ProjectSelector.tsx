import { useState } from 'react';
import { Check, ChevronDown, FolderKanban } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Mock projects - replace with actual project data from your backend
const PROJECTS = [
  { id: 'PROJ-1', name: 'E-Commerce Platform', key: 'ECOM' },
  { id: 'PROJ-2', name: 'Mobile App Redesign', key: 'MOBILE' },
  { id: 'PROJ-3', name: 'AI Recommendation Engine', key: 'AI-REC' },
  { id: 'PROJ-4', name: 'Payment Gateway', key: 'PAY' },
  { id: 'PROJ-5', name: 'Customer Portal', key: 'PORTAL' },
];

interface ProjectSelectorProps {
  selectedProject: string | null;
  onProjectChange: (projectId: string | null) => void;
  className?: string;
}

export function ProjectSelector({
  selectedProject,
  onProjectChange,
  className,
}: ProjectSelectorProps) {
  const [open, setOpen] = useState(false);

  const selectedProjectData = PROJECTS.find((p) => p.id === selectedProject);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-[300px] justify-between',
            !selectedProject && 'text-muted-foreground',
            className
          )}
        >
          <div className="flex items-center gap-2">
            <FolderKanban className="h-4 w-4" />
            {selectedProjectData ? (
              <span>
                <span className="font-semibold">{selectedProjectData.key}</span>
                <span className="text-muted-foreground ml-2">
                  {selectedProjectData.name}
                </span>
              </span>
            ) : (
              <span>Select project...</span>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search projects..." />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  onProjectChange(null);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    selectedProject === null ? 'opacity-100' : 'opacity-0'
                  )}
                />
                All Projects
              </CommandItem>
              {PROJECTS.map((project) => (
                <CommandItem
                  key={project.id}
                  value={`${project.key} ${project.name}`}
                  onSelect={() => {
                    onProjectChange(project.id);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      selectedProject === project.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                  <div className="flex flex-col">
                    <span className="font-semibold">{project.key}</span>
                    <span className="text-xs text-muted-foreground">
                      {project.name}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { PROJECTS };
