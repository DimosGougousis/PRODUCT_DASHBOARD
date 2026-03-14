import { ReactNode, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Kanban,
  Users,
  Sparkles,
  Settings,
  Bell,
  BarChart3,
  Sun,
  Moon,
  Monitor,
  Menu,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import GlobalSearch, { useGlobalSearch } from '@/components/GlobalSearch';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  subNav?: ReactNode;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="flex items-center rounded-lg border border-border p-1 h-8 w-24" />;
  }

  return (
    <div className="flex items-center rounded-lg border border-border p-1">
      <button
        onClick={() => setTheme('light')}
        className={cn('rounded-md p-1.5 transition-colors', theme === 'light' && 'bg-accent')}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn('rounded-md p-1.5 transition-colors', theme === 'dark' && 'bg-accent')}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn('rounded-md p-1.5 transition-colors', theme === 'system' && 'bg-accent')}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}

export default function Layout({ children, title, subtitle, subNav }: LayoutProps) {
  const location = useLocation();
  const { isOpen, setIsOpen } = useGlobalSearch();

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/prds', icon: FileText, label: 'My PRDs' },
    { path: '/kanban', icon: Kanban, label: 'Kanban' },
    { path: '/stakeholders', icon: Users, label: 'Stakeholders' },
    { path: '/insights', icon: Sparkles, label: 'AI Insights' },
    { path: '/governance', icon: BarChart3, label: 'Governance' },
  ];

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md"
      >
        Skip to main content
      </a>

      {/* Top Navigation */}
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 md:gap-8">
            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <nav className="flex flex-col gap-1 pt-6">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActive(item.path);
                    return (
                      <Link key={item.path} to={item.path}>
                        <Button
                          variant={active ? 'secondary' : 'ghost'}
                          className="w-full justify-start gap-3"
                          aria-current={active ? 'page' : undefined}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Button>
                      </Link>
                    );
                  })}
                </nav>
              </SheetContent>
            </Sheet>

            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
                PM
              </div>
              <span className="text-xl font-bold">PO Dashboard</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);
                return (
                  <Link key={item.path} to={item.path}>
                    <Button
                      variant={active ? 'default' : 'ghost'}
                      size="sm"
                      className="gap-2"
                      aria-current={active ? 'page' : undefined}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2">
            {/* Search trigger */}
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-muted-foreground hidden sm:flex"
              onClick={() => setIsOpen(true)}
            >
              <Search className="h-4 w-4" />
              <span className="hidden lg:inline">Search...</span>
              <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 bg-muted rounded text-xs">
                Ctrl+K
              </kbd>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative sm:hidden"
              onClick={() => setIsOpen(true)}
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </Button>

            <ThemeToggle />

            <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
              <Bell className="w-5 h-5" />
              <Badge
                className="absolute -top-1 -right-1 w-5 h-5 p-0 flex items-center justify-center text-xs"
                aria-label="3 unread notifications"
              >
                3
              </Badge>
            </Button>

            <Link to="/settings">
              <Button variant="ghost" size="icon" aria-label="Settings">
                <Settings className="w-5 h-5" />
              </Button>
            </Link>

            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
              AK
            </div>
          </div>
        </div>
      </header>

      {/* Optional sub-navigation (used by governance) */}
      {subNav && (
        <nav className="bg-card border-b sticky top-16 z-40">
          <div className="container mx-auto px-4">{subNav}</div>
        </nav>
      )}

      {/* Page Header if title is provided */}
      {title && (
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main id="main-content">{children}</main>

      {/* Global Search Dialog */}
      <GlobalSearch open={isOpen} onClose={() => setIsOpen(false)} />
    </div>
  );
}
