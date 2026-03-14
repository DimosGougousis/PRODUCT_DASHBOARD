import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Settings,
  ChevronDown,
  Plus,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import CreatePRDModal from '@/components/prd/CreatePRDModal';

const navigation = [
  { name: 'My PRDs', href: '/prds', icon: FileText },
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
];

const Sidebar = () => {
  const location = useLocation();
  const [createModalOpen, setCreateModalOpen] = useState(false);

  return (
    <>
      <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-sidebar-border bg-sidebar">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-primary">
              <Sparkles className="h-4 w-4 text-sidebar-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-sidebar-foreground">
              PRD Agent
            </span>
          </div>

          {/* Workspace Selector */}
          <div className="border-b border-sidebar-border p-4">
            <button className="flex w-full items-center justify-between rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent/80">
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 items-center justify-center rounded bg-sidebar-primary/20 text-xs font-semibold text-sidebar-primary">
                  PM
                </div>
                <span className="font-medium">Product Team</span>
              </div>
              <ChevronDown className="h-4 w-4 text-sidebar-muted" />
            </button>
          </div>

          {/* Create PRD Button */}
          <div className="p-4">
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
              size="sm"
            >
              <Plus className="h-4 w-4" />
              New PRD
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-4">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href || 
                (item.href === '/prds' && location.pathname.startsWith('/prd'));
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'sidebar-item',
                    isActive ? 'sidebar-item-active' : 'sidebar-item-inactive'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Settings */}
          <div className="border-t border-sidebar-border p-4">
            <Link
              to="/settings"
              className={cn(
                'sidebar-item',
                location.pathname === '/settings' ? 'sidebar-item-active' : 'sidebar-item-inactive'
              )}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </div>
        </div>
      </aside>

      <CreatePRDModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </>
  );
};

export default Sidebar;
