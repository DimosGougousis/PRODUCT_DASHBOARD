import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ProjectSelector } from './ProjectSelector';
import {
  LayoutDashboard,
  Truck,
  ShieldCheck,
  ClipboardList,
  Users,
  Heart,
  DollarSign,
  Activity,
  Target,
} from 'lucide-react';

interface GovernanceLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

const NAV_ITEMS = [
  {
    label: 'Overview',
    path: '/governance',
    icon: LayoutDashboard,
  },
  {
    label: 'Delivery Performance',
    path: '/governance/delivery',
    icon: Truck,
  },
  {
    label: 'Quality Metrics',
    path: '/governance/quality',
    icon: ShieldCheck,
  },
  {
    label: 'Backlog Health',
    path: '/governance/backlog',
    icon: ClipboardList,
  },
  {
    label: 'Active Sprint',
    path: '/governance/sprint',
    icon: Activity,
  },
  {
    label: 'Customer Metrics',
    path: '/governance/customer',
    icon: Users,
  },
  {
    label: 'Financial',
    path: '/governance/financial',
    icon: DollarSign,
  },
  {
    label: 'Compliance',
    path: '/governance/compliance',
    icon: Target,
  },
  {
    label: 'Team Health',
    path: '/governance/team',
    icon: Heart,
  },
];

export function GovernanceLayout({
  children,
  title,
  description,
}: GovernanceLayoutProps) {
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Title and Project Selector */}
            <div className="flex items-center gap-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {description && (
                  <p className="text-sm text-gray-500">{description}</p>
                )}
              </div>
              <div className="h-8 w-px bg-gray-200" />
              <ProjectSelector
                selectedProject={selectedProject}
                onProjectChange={setSelectedProject}
              />
            </div>

            {/* Right: Last Updated */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Last updated: {new Date().toLocaleTimeString()}
              </span>
              <Button variant="outline" size="sm">
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1 py-2 overflow-x-auto">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={isActive ? 'secondary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'gap-2 whitespace-nowrap',
                        isActive && 'bg-gray-200/80'
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedProject ? (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Project Filter Active:</span> Showing
              data for selected project only.{' '}
              <button
                onClick={() => setSelectedProject(null)}
                className="underline hover:text-blue-900"
              >
                Clear filter
              </button>
            </p>
          </div>
        ) : (
          <div className="mb-6 p-4 bg-gray-100 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <span className="font-semibold">No Project Selected:</span> Showing
              aggregated data across all projects. Select a project above to filter.
            </p>
          </div>
        )}
        {children}
      </main>
    </div>
  );
}
