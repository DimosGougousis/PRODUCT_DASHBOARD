# PO Dashboard: UX Architecture Enhancement Plan

**Date**: 2026-03-15
**Auditor**: ArchitectUX
**Repository**: DimosGougousis/PRODUCT_DASHBOARD
**Stack**: React 18 + TypeScript + Tailwind CSS + shadcn/ui + Recharts + React Query + React Router (HashRouter)

---

## Executive Summary

The PO Dashboard is a feature-rich Product Owner tool spanning PRD management (create, detail, kanban, stakeholder assignment, AI insights) and an 8-pillar governance dashboard (delivery, quality, backlog, sprint, customer, financial, compliance, team health). The codebase demonstrates strong fundamentals: a well-structured CSS design system with semantic tokens in `index.css`, consistent use of shadcn/ui primitives, React Query for data fetching, and a clear domain separation between PRD management and governance.

However, the audit reveals several high-impact architectural issues that prevent this from reaching best-in-class status:

1. **Dual, inconsistent layout systems** -- two competing Layout components (`src/components/Layout.tsx` vs `src/components/layout/Layout.tsx`) with different navigation items and branding ("PRD Partner" vs "PRD Kanban"), plus a third layout shell in `GovernanceLayout.tsx` that bypasses both and uses hardcoded gray colors.
2. **No dark mode activation** -- the CSS design system defines `.dark` variables and `tailwind.config.ts` sets `darkMode: ["class"]`, but no code anywhere toggles the `dark` class. The Settings page has a non-functional dark mode switch. The `next-themes` package is installed but unused.
3. **Navigation fragmentation** -- main app pages use the top-bar Layout, governance pages use GovernanceLayout with its own separate header and sub-nav, and the PRDDetail page imports from the wrong Layout file (`@/components/Layout` instead of `@/components/layout/Layout`).
4. **Hardcoded colors throughout governance** -- despite having a semantic token system (`bg-background`, `text-foreground`, etc.), governance pages use hardcoded colors like `bg-gray-50`, `text-gray-900`, `bg-white`, `text-gray-500`, `bg-blue-50`, making dark mode impossible and creating visual inconsistency.
5. **Mobile responsiveness gaps** -- the Kanban board has fixed-width 288px columns with no mobile strategy, governance sub-navigation overflows without scroll indicators, and the main navigation hides on mobile with no hamburger menu alternative.
6. **Orphaned/dead code** -- `ExecutiveDashboard.tsx`, `AgentPerformanceDashboard.tsx`, `SettingsPage.tsx`, `StakeholdersPage.tsx` are not routed. `App.css` contains Vite boilerplate. A Sidebar component exists but is never used.
7. **No loading/error boundaries** -- each page implements its own loading spinner inline rather than using Suspense boundaries or a shared skeleton system.

The recommendations below are ordered by impact-to-effort ratio, with the first three items addressing structural issues that unlock all subsequent improvements.

---

## Enhancement 1: Unified Layout Architecture

**Impact**: Critical | **Effort**: Medium | **Phase**: 1

### Problem

There are three independent layout shells creating visual and navigational inconsistency:

| File | Used by | Branding | Nav items | Governance link? |
|------|---------|----------|-----------|-----------------|
| `src/components/Layout.tsx` | PRDDetail | "PRD Partner" | 5 items | No |
| `src/components/layout/Layout.tsx` | Dashboard, PRDList, KanbanBoard, Stakeholders, AIInsights, Settings | "PRD Kanban" | 6 items (incl. Governance) | Yes |
| `src/components/governance/GovernanceLayout.tsx` | All governance pages | None (own header) | 9 pillar sub-nav items | N/A (is governance) |

When a user navigates from Dashboard to Governance, the entire chrome changes -- different header, no global navigation, no way to return except browser back. The governance section is an isolated island.

### Solution

Create a single unified layout with a persistent top-level navigation and optional sub-navigation support for governance pages.

**Files to modify**:
- `src/components/layout/Layout.tsx` -- becomes the single source of truth
- `src/components/governance/GovernanceLayout.tsx` -- refactor to only render sub-nav + content, delegating chrome to Layout
- `src/pages/PRDDetail.tsx` -- fix import from `@/components/Layout` to `@/components/layout/Layout`
- `src/App.tsx` -- optionally wrap governance routes in a layout route

**Implementation**:

```tsx
// src/components/layout/Layout.tsx -- enhanced
interface LayoutProps {
  children: ReactNode;
  title?: string;
  subtitle?: string;
  subNav?: ReactNode;  // <-- NEW: slot for governance sub-navigation
}

export default function Layout({ children, title, subtitle, subNav }: LayoutProps) {
  // ... existing nav items (ensure Governance is included)
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        {/* ... existing global navigation ... */}
      </header>

      {/* Optional sub-navigation (used by governance) */}
      {subNav && (
        <nav className="bg-card border-b sticky top-16 z-40">
          <div className="container mx-auto px-4">
            {subNav}
          </div>
        </nav>
      )}

      {/* Page header */}
      {title && (
        <div className="bg-card border-b">
          <div className="container mx-auto px-4 py-4">
            <h1 className="text-2xl font-bold">{title}</h1>
            {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
          </div>
        </div>
      )}

      <main>{children}</main>
    </div>
  );
}
```

```tsx
// src/components/governance/GovernanceSubNav.tsx -- extracted from GovernanceLayout
export function GovernanceSubNav() {
  const location = useLocation();
  return (
    <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-thin">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button variant={isActive ? 'secondary' : 'ghost'} size="sm" className="gap-2 whitespace-nowrap">
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
```

```tsx
// src/components/governance/GovernanceLayout.tsx -- simplified wrapper
export function GovernanceLayout({ children, title, description }: GovernanceLayoutProps) {
  return (
    <Layout title={title} subtitle={description} subNav={<GovernanceSubNav />}>
      {/* Project selector + filter banner */}
      <div className="container mx-auto px-4 py-6">
        <ProjectSelector ... />
        {children}
      </div>
    </Layout>
  );
}
```

**Delete after migration**: `src/components/Layout.tsx` (the duplicate without Governance link).

---

## Enhancement 2: Dark Mode Activation with Theme Toggle

**Impact**: High | **Effort**: Low | **Phase**: 1

### Problem

The infrastructure for dark mode is 90% complete but entirely non-functional:
- `index.css` defines `.dark { ... }` with a full dark palette.
- `tailwind.config.ts` has `darkMode: ["class"]`.
- `next-themes` is installed as a dependency but never used.
- The Settings page renders a dark mode `<Switch>` that does nothing.
- Governance pages use hardcoded colors (`bg-gray-50`, `text-gray-900`, `bg-white`) that will not respond to dark mode.

### Solution

**Step 1**: Wire up `next-themes` in `App.tsx`:

```tsx
// src/App.tsx
import { ThemeProvider } from 'next-themes';

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {/* ... rest of app ... */}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
```

**Step 2**: Add a theme toggle to the global header in `src/components/layout/Layout.tsx`:

```tsx
import { useTheme } from 'next-themes';
import { Sun, Moon, Monitor } from 'lucide-react';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="flex items-center rounded-lg border border-border p-1">
      <button
        onClick={() => setTheme('light')}
        className={cn('rounded-md p-1.5', theme === 'light' && 'bg-accent')}
        aria-label="Light theme"
      >
        <Sun className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('dark')}
        className={cn('rounded-md p-1.5', theme === 'dark' && 'bg-accent')}
        aria-label="Dark theme"
      >
        <Moon className="h-4 w-4" />
      </button>
      <button
        onClick={() => setTheme('system')}
        className={cn('rounded-md p-1.5', theme === 'system' && 'bg-accent')}
        aria-label="System theme"
      >
        <Monitor className="h-4 w-4" />
      </button>
    </div>
  );
}
```

**Step 3**: Wire up the Settings page switch to actually call `setTheme`.

**Step 4**: Fix hardcoded colors (see Enhancement 3).

---

## Enhancement 3: Eliminate Hardcoded Colors Across Governance

**Impact**: High | **Effort**: Medium | **Phase**: 1

### Problem

Governance pages bypass the semantic token system extensively. A search reveals approximately 120+ instances of hardcoded Tailwind colors in governance components and pages:

| Pattern | Semantic Equivalent | Occurrences |
|---------|-------------------|-------------|
| `bg-gray-50` | `bg-muted` or `bg-background` | ~15 |
| `bg-white` | `bg-card` | ~8 |
| `text-gray-900` | `text-foreground` | ~5 |
| `text-gray-500` / `text-gray-600` | `text-muted-foreground` | ~30 |
| `text-gray-400` | `text-muted-foreground` | ~10 |
| `bg-gray-100` | `bg-muted` or `bg-accent` | ~12 |
| `bg-gray-200` | `bg-border` | ~3 |
| `border-gray-200` | `border-border` | ~5 |
| `bg-blue-50`, `bg-red-50`, etc. | Keep (semantic status colors) | ~15 (keep as-is) |

### Solution

Systematic find-and-replace across all governance files:

**Files to update** (all in `src/components/governance/` and `src/pages/po-dashboard/`):
- `GovernanceLayout.tsx` -- `bg-gray-50` to `bg-background`, `bg-white` to `bg-card`, `text-gray-900` to `text-foreground`, `text-gray-500` to `text-muted-foreground`, `bg-gray-200` to `bg-border`
- `GovernanceOverviewPage.tsx` -- same pattern
- `DeliveryPerformancePage.tsx` -- status indicator colors can stay, text colors should use tokens
- `QualityMetricsPage.tsx` -- `text-gray-600` to `text-muted-foreground`
- `TeamHealthPage.tsx` -- `bg-gray-100` to `bg-muted`, `text-gray-500` to `text-muted-foreground`
- All governance chart components in `src/components/governance/*/`

**Status/semantic colors** (`bg-green-100 text-green-800`, `bg-red-50 text-red-700`, etc.) should be preserved for governance status indicators but should add dark mode variants:

```tsx
// Instead of:
'bg-green-100 text-green-800'

// Use:
'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
```

The Stakeholders page (`src/pages/Stakeholders.tsx`) already demonstrates this pattern correctly at line 57-64 -- follow that model for governance.

Also fix `GlobalSearch.tsx` which has `bg-gray-100`, `bg-gray-50`, `text-gray-500`, `text-gray-600`, `text-gray-400` hardcoded throughout.

---

## Enhancement 4: Mobile Navigation Strategy

**Impact**: High | **Effort**: Medium | **Phase**: 2

### Problem

The main navigation uses `hidden md:flex` to hide nav items on mobile, but provides no alternative. Users on mobile devices have no way to navigate between sections. The governance sub-navigation overflows horizontally with `overflow-x-auto` but has no visual indicator of scrollability.

### Solution

**Approach**: Add a mobile hamburger menu using the existing shadcn/ui `Sheet` component.

```tsx
// In Layout.tsx header section, add:
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';

// Inside the header, before the desktop nav:
<Sheet>
  <SheetTrigger asChild className="md:hidden">
    <Button variant="ghost" size="icon">
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
            <Button variant={active ? 'secondary' : 'ghost'} className="w-full justify-start gap-3">
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </nav>
  </SheetContent>
</Sheet>
```

For governance sub-navigation scrollability, add fade indicators:

```css
/* In index.css */
.scroll-fade-right::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 48px;
  background: linear-gradient(to right, transparent, hsl(var(--card)));
  pointer-events: none;
}
```

---

## Enhancement 5: Kanban Board Mobile Responsiveness and Drag-and-Drop

**Impact**: High | **Effort**: Medium | **Phase**: 2

### Problem

1. The Kanban board uses fixed `w-72` (288px) columns with horizontal scrolling. On mobile, this is awkward -- the user sees one column at a time with no affordance.
2. Despite having `@dnd-kit/core`, `@dnd-kit/sortable`, and `@dnd-kit/utilities` installed as dependencies, the Kanban board has no drag-and-drop functionality. Cards link to detail pages but cannot be moved between columns.
3. The `KanbanCard` and `KanbanColumn` components in `src/components/` are orphaned -- the `KanbanBoard.tsx` page defines its own inline versions.

### Solution

**Mobile**: Add a column selector dropdown on mobile instead of horizontal scroll:

```tsx
// In KanbanBoard.tsx, add above the columns:
const [activeColumn, setActiveColumn] = useState<PRDStatus>('backlog');

return (
  <Layout title="Kanban Board" subtitle="Visualize PRD workflow">
    <div className="p-6">
      {/* Mobile: Column selector */}
      <div className="md:hidden mb-4">
        <Select value={activeColumn} onValueChange={(v) => setActiveColumn(v as PRDStatus)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col.id} value={col.id}>
                {col.title} ({getPRDsByStatus(col.id).length})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Desktop: All columns */}
      <div className="hidden md:flex gap-4 overflow-x-auto pb-4">
        {columns.map(col => <KanbanColumn ... />)}
      </div>

      {/* Mobile: Single column */}
      <div className="md:hidden">
        <KanbanColumn column={columns.find(c => c.id === activeColumn)!} prds={getPRDsByStatus(activeColumn)} />
      </div>
    </div>
  </Layout>
);
```

**Drag-and-Drop**: Wire up `@dnd-kit` which is already installed:

```tsx
import { DndContext, closestCorners, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';

// Wrap columns in DndContext, each column as a droppable, each card as a draggable.
// On dragEnd, call updatePRD(prdId, { status: newColumnId }).
```

**Cleanup**: Delete the orphaned `src/components/KanbanCard.tsx` and `src/components/KanbanColumn.tsx`, or refactor `KanbanBoard.tsx` to use them.

---

## Enhancement 6: Shared Loading States and Error Boundaries

**Impact**: Medium | **Effort**: Low | **Phase**: 2

### Problem

Every page independently implements its own loading state with an inline `<Loader2>` spinner. There are no error boundaries, so a failing React Query request or rendering error shows a blank white screen.

### Solution

**Create shared components**:

```tsx
// src/components/shared/PageSkeleton.tsx
export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6 animate-pulse">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-muted" />
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="h-64 rounded-xl bg-muted" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </div>
  );
}
```

```tsx
// src/components/shared/ErrorBoundary.tsx
import { Component, ErrorInfo, ReactNode } from 'react';

export class ErrorBoundary extends Component<
  { children: ReactNode; fallback?: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex min-h-[400px] items-center justify-center">
          <div className="text-center space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Something went wrong</h2>
            <p className="text-muted-foreground">{this.state.error?.message}</p>
            <Button onClick={() => this.setState({ hasError: false })}>Try again</Button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
```

**Wrap routes in App.tsx**: Add `<ErrorBoundary>` around the `<Routes>` component.

---

## Enhancement 7: Clean Up Dead Code and Orphaned Files

**Impact**: Medium | **Effort**: Low | **Phase**: 1

### Problem

Several files exist but are unreachable:

| File | Issue |
|------|-------|
| `src/pages/ExecutiveDashboard.tsx` | Not in any route. Contains its own inline `MetricCard` that shadows the shared one. |
| `src/pages/AgentPerformanceDashboard.tsx` | Not routed |
| `src/pages/SettingsPage.tsx` | Duplicate of `Settings.tsx`, not routed |
| `src/pages/StakeholdersPage.tsx` | Duplicate of `Stakeholders.tsx`, not routed |
| `src/components/Layout.tsx` | Duplicate of `src/components/layout/Layout.tsx` with fewer nav items |
| `src/components/KanbanCard.tsx` | Orphaned, KanbanBoard defines its own inline |
| `src/components/KanbanColumn.tsx` | Orphaned |
| `src/components/layout/Sidebar.tsx` | Not used by any page (branded "PRD Agent") |
| `src/App.css` | Vite boilerplate, not imported or needed |
| `src/pages/po-dashboard/GovernanceDashboard.tsx` | Imported in App.tsx but not routed (GovernanceOverviewPage is used instead) |

### Solution

1. **Delete**: `src/App.css`, `src/components/Layout.tsx`, `src/pages/SettingsPage.tsx`, `src/pages/StakeholdersPage.tsx`
2. **Route or delete**: `ExecutiveDashboard.tsx` and `AgentPerformanceDashboard.tsx` -- if these are planned features, add routes; if not, delete.
3. **Consolidate**: Either use the component-level `KanbanCard.tsx`/`KanbanColumn.tsx` in the page, or delete them.
4. **Decide on Sidebar**: The `layout/Sidebar.tsx` component represents a different navigation paradigm (left sidebar). Either adopt it for a future redesign or remove it.
5. **Remove unused import**: `GovernanceDashboard` is imported in `App.tsx` but never actually rendered in any route.

---

## Enhancement 8: Governance Project Selector State Management

**Impact**: Medium | **Effort**: Medium | **Phase**: 2

### Problem

The `ProjectSelector` state lives inside `GovernanceLayout` as local `useState`. This means:
- The selected project resets on every page navigation between governance pillars.
- The selected project ID is never passed to the data-fetching hooks (`useDeliveryMetrics`, `useQualityMetrics`, etc.) -- they all use `useMock: true` with hardcoded project keys.
- There is no URL-level persistence of the project selection.

### Solution

**Option A (Recommended)**: Use URL search params for project state:

```tsx
// In GovernanceLayout or a new useGovernanceProject hook:
import { useSearchParams } from 'react-router-dom';

export function useGovernanceProject() {
  const [searchParams, setSearchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  const setProject = (id: string | null) => {
    if (id) {
      searchParams.set('project', id);
    } else {
      searchParams.delete('project');
    }
    setSearchParams(searchParams, { replace: true });
  };

  return { projectId, setProject };
}
```

This preserves the selection across navigation and makes governance URLs shareable (e.g., `/governance/delivery?project=PROJ-1`).

**Then pass `projectId` to hooks**:

```tsx
// In DeliveryPerformancePage.tsx:
const { projectId } = useGovernanceProject();
const { data: metrics, isLoading } = useDeliveryMetrics({
  productId: projectId || undefined,
  useMock: true,
});
```

---

## Enhancement 9: Accessibility Improvements

**Impact**: Medium | **Effort**: Low-Medium | **Phase**: 2

### Problem

1. **Missing skip navigation link** -- no "Skip to main content" link for keyboard users.
2. **Navigation active state** -- buttons used as nav links lack `aria-current="page"`.
3. **Kanban board** -- no keyboard interaction model. Cards cannot be moved via keyboard.
4. **Color-only status indicators** -- status badges rely on color alone (red/green/yellow) without text or icons for colorblind users. Some governance pages use bare colored dots.
5. **Page titles** -- no `<title>` updates on route change. All pages show the same browser tab title.
6. **Notification badge** -- the hardcoded "3" notification count is not announced to screen readers.
7. **Theme toggle** -- see Enhancement 2 for `aria-label` additions.

### Solution

**Skip link** (add to Layout):
```tsx
<a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-md">
  Skip to main content
</a>
// ... then on <main>:
<main id="main-content">{children}</main>
```

**Document titles** (add a hook):
```tsx
// src/hooks/useDocumentTitle.ts
export function useDocumentTitle(title: string) {
  useEffect(() => {
    document.title = title ? `${title} - PO Dashboard` : 'PO Dashboard';
  }, [title]);
}
// Call in each page or in Layout: useDocumentTitle(title || 'Dashboard')
```

**Status indicators**: Add text labels alongside colored dots, or use icons that convey meaning beyond color.

---

## Enhancement 10: Design System Consistency and Component Patterns

**Impact**: Medium | **Effort**: Medium | **Phase**: 3

### Problem

1. **Duplicate MetricCard patterns** -- `src/components/dashboard/MetricCard.tsx` and an inline `MetricCard` in `ExecutiveDashboard.tsx` have different APIs. Governance KPI cards are yet another pattern (bare `<Card>` with inline layout).
2. **Inconsistent spacing** -- Dashboard uses `space-y-6 p-6`, PRDList uses `space-y-6` without padding, governance pages use `py-8` with `max-w-7xl`. There is no consistent page content wrapper.
3. **Table styling** -- DeliveryPerformancePage has an inline table with manual padding. No shared table component conventions beyond the shadcn/ui `<Table>`.
4. **Status badge patterns** -- four different ways to render status: CSS classes in `index.css` (`.status-todo`, `.status-in-progress`), inline conditional classes in governance, `Badge` component variants, and manual color strings.

### Solution

**Standardize governance KPI cards** to use the existing `MetricCard` component or extend it:

```tsx
// Instead of bare Card with manual layout in each governance page,
// reuse MetricCard:
<MetricCard
  title="Test Coverage"
  value={`${metrics?.testCoverage || 0}%`}
  icon={<Gauge className="h-5 w-5 text-primary" />}
  subtitle={metrics?.testCoverage >= 80 ? 'Good coverage' : 'Needs improvement'}
  trend={metrics?.testCoverageTrend}
/>
```

**Create a standardized page content wrapper**:

```tsx
// src/components/layout/PageContent.tsx
export function PageContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('container mx-auto px-4 py-6 space-y-6', className)}>
      {children}
    </div>
  );
}
```

**Consolidate status badge patterns** into a single `StatusBadge` component. The one in `src/components/prd/StatusBadge.tsx` can be enhanced to handle governance statuses as well.

---

## Enhancement 11: Performance Optimizations

**Impact**: Medium | **Effort**: Low | **Phase**: 3

### Problem

1. **No code splitting** -- all 176 files are bundled together. The governance module (8 pages + components + hooks) loads even when the user only uses PRD management.
2. **Console.log statements in production** -- `App.tsx` line 31, `PRDContext.tsx` lines 29-65, `Dashboard.tsx` line 14 all log to console.
3. **QueryClient instantiation** -- `new QueryClient()` is called at module scope in `App.tsx`, which is fine, but no default options are set for `staleTime` or `gcTime`.
4. **Google Fonts loaded synchronously** -- `index.css` imports Inter via `@import url(...)` which is render-blocking.

### Solution

**Route-level code splitting**:
```tsx
// src/App.tsx
const GovernanceOverviewPage = lazy(() => import('./pages/po-dashboard/GovernanceOverviewPage'));
const DeliveryPerformancePage = lazy(() => import('./pages/po-dashboard/DeliveryPerformancePage'));
// ... etc.

// Wrap routes in Suspense:
<Suspense fallback={<PageSkeleton />}>
  <Route path="/governance" element={<GovernanceOverviewPage />} />
</Suspense>
```

**Remove console.log**: Strip all `console.log` calls from `App.tsx`, `PRDContext.tsx`, `Dashboard.tsx`, and `PRDDetail.tsx`.

**Font loading**: Move to `<link rel="preconnect">` and `<link rel="stylesheet">` in `index.html` instead of CSS `@import`, or use `font-display: swap`.

**QueryClient defaults**:
```tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});
```

---

## Enhancement 12: Breadcrumb Navigation for Deep Pages

**Impact**: Low-Medium | **Effort**: Low | **Phase**: 3

### Problem

Users on governance pillar pages or PRD detail pages have no breadcrumb trail. The `shadcn/ui` `breadcrumb.tsx` component exists in `src/components/ui/` but is unused.

### Solution

Add breadcrumbs to the Layout component when navigating into sub-pages:

```tsx
// src/hooks/useBreadcrumbs.ts
export function useBreadcrumbs() {
  const location = useLocation();
  const segments = location.pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const path = '/' + segments.slice(0, index + 1).join('/');
    const label = ROUTE_LABELS[path] || segment.charAt(0).toUpperCase() + segment.slice(1);
    return { path, label };
  });

  return [{ path: '/', label: 'Dashboard' }, ...breadcrumbs];
}

const ROUTE_LABELS: Record<string, string> = {
  '/governance': 'Governance',
  '/governance/delivery': 'Delivery Performance',
  '/governance/quality': 'Quality Metrics',
  '/governance/backlog': 'Backlog Health',
  '/governance/sprint': 'Active Sprint',
  '/governance/customer': 'Customer Metrics',
  '/governance/financial': 'Financial',
  '/governance/compliance': 'Compliance',
  '/governance/team': 'Team Health',
  '/prds': 'My PRDs',
  '/kanban': 'Kanban Board',
  '/stakeholders': 'Stakeholders',
  '/insights': 'AI Insights',
  '/settings': 'Settings',
};
```

Render using the existing `Breadcrumb` UI component in the page header area.

---

## Enhancement 13: Global Search Integration with Actual Data

**Impact**: Low-Medium | **Effort**: Medium | **Phase**: 3

### Problem

`GlobalSearch.tsx` uses entirely hardcoded mock results in `performSearch()` and `getRecentItems()`. The `useGlobalSearch()` hook for `Cmd+K` is defined but never integrated into the Layout -- there is no way for users to trigger it.

### Solution

1. **Wire up the keyboard shortcut** in Layout:
```tsx
// In Layout.tsx:
const { isOpen, setIsOpen } = useGlobalSearch();

// In the header, add a search trigger button:
<Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => setIsOpen(true)}>
  <Search className="h-4 w-4" />
  <span className="hidden lg:inline">Search...</span>
  <kbd className="hidden lg:inline ml-2 px-1.5 py-0.5 bg-muted rounded text-xs">Cmd+K</kbd>
</Button>

<GlobalSearch open={isOpen} onClose={() => setIsOpen(false)} />
```

2. **Connect to real data**: Make `performSearch` query the PRD context:
```tsx
const { prds, stakeholders } = usePRDs();

function performSearch(query: string): SearchResult[] {
  const results: SearchResult[] = [];
  const q = query.toLowerCase();

  prds.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    .forEach(p => results.push({
      id: p.id, type: 'prd', title: p.title, description: p.description,
      url: `/prd/${p.id}`, metadata: `${p.status} - ${p.priority}`
    }));

  stakeholders.filter(s => s.name.toLowerCase().includes(q))
    .forEach(s => results.push({
      id: s.id, type: 'stakeholder', title: s.name, description: s.role,
      url: '/stakeholders', metadata: `${s.responseRate}% response rate`
    }));

  return results.slice(0, 10);
}
```

3. **Fix hardcoded colors** in `GlobalSearch.tsx` (see Enhancement 3).

---

## Phased Implementation Roadmap

### Phase 1: Foundation Fixes (Week 1-2)

| # | Enhancement | Key Files | Est. Effort |
|---|-------------|-----------|-------------|
| 1 | Unified Layout Architecture | `Layout.tsx`, `GovernanceLayout.tsx`, `PRDDetail.tsx`, `App.tsx` | 4-6 hrs |
| 2 | Dark Mode Activation | `App.tsx`, `Layout.tsx`, `Settings.tsx` | 1-2 hrs |
| 3 | Hardcoded Color Migration | All governance files (~20 files) | 3-4 hrs |
| 7 | Dead Code Cleanup | Delete ~8 orphaned files | 1 hr |

**Outcome**: Consistent navigation across all pages, functional dark mode, no visual inconsistencies between PRD and governance sections.

### Phase 2: User Experience (Week 3-4)

| # | Enhancement | Key Files | Est. Effort |
|---|-------------|-----------|-------------|
| 4 | Mobile Navigation | `Layout.tsx` | 2-3 hrs |
| 5 | Kanban Mobile + DnD | `KanbanBoard.tsx` | 4-6 hrs |
| 6 | Loading/Error Boundaries | New shared components, `App.tsx` | 2-3 hrs |
| 8 | Project Selector Persistence | `GovernanceLayout.tsx`, governance hooks | 2-3 hrs |
| 9 | Accessibility | Layout, navigation, status components | 3-4 hrs |

**Outcome**: Mobile-usable application, drag-and-drop Kanban, resilient error handling, persistent governance context.

### Phase 3: Polish and Performance (Week 5-6)

| # | Enhancement | Key Files | Est. Effort |
|---|-------------|-----------|-------------|
| 10 | Design System Consistency | MetricCard, PageContent, StatusBadge | 3-4 hrs |
| 11 | Performance Optimizations | `App.tsx`, `index.html`, `PRDContext.tsx` | 2-3 hrs |
| 12 | Breadcrumb Navigation | New hook, Layout integration | 1-2 hrs |
| 13 | Global Search Integration | `GlobalSearch.tsx`, `Layout.tsx` | 3-4 hrs |

**Outcome**: Consistent component patterns, faster load times, enhanced navigation context, functional global search.

---

## Appendix A: File Impact Summary

Files requiring changes (by priority):

**Must change (Phase 1)**:
- `src/App.tsx` -- add ThemeProvider, remove dead import, add Suspense
- `src/components/layout/Layout.tsx` -- add subNav slot, theme toggle, mobile menu, skip link, search trigger
- `src/components/governance/GovernanceLayout.tsx` -- use unified Layout, extract sub-nav
- `src/pages/PRDDetail.tsx` -- fix Layout import path
- `src/index.css` -- no changes needed (already has dark theme)
- `src/pages/Settings.tsx` -- wire dark mode switch
- ~15 governance component/page files -- replace hardcoded colors

**Should change (Phase 2)**:
- `src/pages/KanbanBoard.tsx` -- mobile column selector, DnD
- `src/components/GlobalSearch.tsx` -- fix colors, connect data
- New files: `PageSkeleton.tsx`, `ErrorBoundary.tsx`, `useGovernanceProject.ts`, `useDocumentTitle.ts`

**Nice to have (Phase 3)**:
- `src/components/dashboard/MetricCard.tsx` -- extend for governance use
- New files: `PageContent.tsx`, `useBreadcrumbs.ts`

**Delete**:
- `src/App.css`
- `src/components/Layout.tsx`
- `src/pages/SettingsPage.tsx`
- `src/pages/StakeholdersPage.tsx`
- `src/components/KanbanCard.tsx` (orphaned)
- `src/components/KanbanColumn.tsx` (orphaned)

## Appendix B: Current Design Token Coverage

The existing design system in `src/index.css` is well-structured. Here is the token coverage:

| Category | Tokens Defined | Coverage |
|----------|---------------|----------|
| Core colors (bg, fg, card, popover) | Yes | Used in main pages, not governance |
| Primary/Secondary/Accent | Yes | Used consistently |
| Destructive | Yes | Used in Settings |
| Muted | Yes | Used extensively |
| Status colors | Yes (5 statuses) | Used in main pages via CSS classes |
| Priority colors | Yes (3 levels) | Used in PRD pages |
| Sidebar colors | Yes (7 tokens) | Used only by orphaned Sidebar component |
| Shadows | Yes (4 levels) | Used via `.card-hover` and `.metric-card` |
| Dark theme | Yes (full override) | Not activated |
| Border radius | Yes (3 sizes) | Used via Tailwind config |
| Animations | Yes (5 keyframes) | `fade-in` used, others available |

**Gap**: No tokens for governance pillar colors. The `PillarCard` component defines them inline. Consider adding to the design system if governance expands.

---

**ArchitectUX Agent**
**Foundation Date**: 2026-03-15
**Status**: Ready for implementation
**Next Steps**: Begin Phase 1 -- unify Layout, activate dark mode, migrate hardcoded colors, clean dead code
