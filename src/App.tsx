import { lazy, Suspense } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { PRDProvider } from "@/context/PRDContext";
import { ErrorBoundary } from "@/components/shared/ErrorBoundary";
import { PageSkeleton } from "@/components/shared/PageSkeleton";
import Dashboard from "./pages/Dashboard";
import PRDList from "./pages/PRDList";
import PRDDetail from "./pages/PRDDetail";
import KanbanBoard from "./pages/KanbanBoard";
import Stakeholders from "./pages/Stakeholders";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

// Governance Pillar Pages — lazy loaded
const GovernanceOverviewPage = lazy(() => import("./pages/po-dashboard/GovernanceOverviewPage"));
const DeliveryPerformancePage = lazy(() => import("./pages/po-dashboard/DeliveryPerformancePage"));
const QualityMetricsPage = lazy(() => import("./pages/po-dashboard/QualityMetricsPage"));
const BacklogHealthPage = lazy(() => import("./pages/po-dashboard/BacklogHealthPage"));
const ActiveSprintPage = lazy(() => import("./pages/po-dashboard/ActiveSprintPage"));
const CustomerMetricsPage = lazy(() => import("./pages/po-dashboard/CustomerMetricsPage"));
const FinancialPage = lazy(() => import("./pages/po-dashboard/FinancialPage"));
const CompliancePage = lazy(() => import("./pages/po-dashboard/CompliancePage"));
const TeamHealthPage = lazy(() => import("./pages/po-dashboard/TeamHealthPage"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <PRDProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <HashRouter>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/prds" element={<PRDList />} />
                  <Route path="/prd/:id" element={<PRDDetail />} />
                  <Route path="/kanban" element={<KanbanBoard />} />
                  <Route path="/stakeholders" element={<Stakeholders />} />
                  <Route path="/insights" element={<AIInsights />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/governance" element={<Suspense fallback={<PageSkeleton />}><GovernanceOverviewPage /></Suspense>} />
                  <Route path="/governance/delivery" element={<Suspense fallback={<PageSkeleton />}><DeliveryPerformancePage /></Suspense>} />
                  <Route path="/governance/quality" element={<Suspense fallback={<PageSkeleton />}><QualityMetricsPage /></Suspense>} />
                  <Route path="/governance/backlog" element={<Suspense fallback={<PageSkeleton />}><BacklogHealthPage /></Suspense>} />
                  <Route path="/governance/sprint" element={<Suspense fallback={<PageSkeleton />}><ActiveSprintPage /></Suspense>} />
                  <Route path="/governance/customer" element={<Suspense fallback={<PageSkeleton />}><CustomerMetricsPage /></Suspense>} />
                  <Route path="/governance/financial" element={<Suspense fallback={<PageSkeleton />}><FinancialPage /></Suspense>} />
                  <Route path="/governance/compliance" element={<Suspense fallback={<PageSkeleton />}><CompliancePage /></Suspense>} />
                  <Route path="/governance/team" element={<Suspense fallback={<PageSkeleton />}><TeamHealthPage /></Suspense>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
            </HashRouter>
          </TooltipProvider>
        </PRDProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
