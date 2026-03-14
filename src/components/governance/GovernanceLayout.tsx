import { Button } from '@/components/ui/button';
import { ProjectSelector } from './ProjectSelector';
import { GovernanceSubNav } from './GovernanceSubNav';
import Layout from '@/components/layout/Layout';
import { useGovernanceProject } from '@/hooks/useGovernanceProject';

interface GovernanceLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export function GovernanceLayout({
  children,
  title,
  description,
}: GovernanceLayoutProps) {
  const { projectId: selectedProject, setProject: setSelectedProject } = useGovernanceProject();

  return (
    <Layout title={title} subtitle={description} subNav={<GovernanceSubNav />}>
      <div className="container mx-auto px-4 py-6">
        {/* Project selector + filter banner */}
        <div className="flex items-center gap-4 mb-6">
          <ProjectSelector
            selectedProject={selectedProject}
            onProjectChange={setSelectedProject}
          />
          <div className="flex-1" />
          <span className="text-sm text-muted-foreground">
            Last updated: {new Date().toLocaleTimeString()}
          </span>
          <Button variant="outline" size="sm">
            Refresh
          </Button>
        </div>

        {selectedProject ? (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <span className="font-semibold">Project Filter Active:</span> Showing
              data for selected project only.{' '}
              <button
                onClick={() => setSelectedProject(null)}
                className="underline hover:text-blue-900 dark:hover:text-blue-200"
              >
                Clear filter
              </button>
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-muted border border-border rounded-lg">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold">No Project Selected:</span> Showing
              aggregated data across all projects. Select a project above to filter.
            </p>
          </div>
        )}
        {children}
      </div>
    </Layout>
  );
}
