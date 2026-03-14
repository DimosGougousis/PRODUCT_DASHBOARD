import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { PRDProvider } from "@/context/PRDContext";
import Dashboard from "./pages/Dashboard";
import PRDList from "./pages/PRDList";
import PRDDetail from "./pages/PRDDetail";
import KanbanBoard from "./pages/KanbanBoard";
import Stakeholders from "./pages/Stakeholders";
import AIInsights from "./pages/AIInsights";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import GovernanceDashboard from "./pages/po-dashboard/GovernanceDashboard";

// Governance Pillar Pages
import GovernanceOverviewPage from "./pages/po-dashboard/GovernanceOverviewPage";
import DeliveryPerformancePage from "./pages/po-dashboard/DeliveryPerformancePage";
import QualityMetricsPage from "./pages/po-dashboard/QualityMetricsPage";
import BacklogHealthPage from "./pages/po-dashboard/BacklogHealthPage";
import ActiveSprintPage from "./pages/po-dashboard/ActiveSprintPage";
import CustomerMetricsPage from "./pages/po-dashboard/CustomerMetricsPage";
import FinancialPage from "./pages/po-dashboard/FinancialPage";
import CompliancePage from "./pages/po-dashboard/CompliancePage";
import TeamHealthPage from "./pages/po-dashboard/TeamHealthPage";

const queryClient = new QueryClient();

function App() {
  console.log("App component rendering");
  return (
    <QueryClientProvider client={queryClient}>
      <PRDProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HashRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/prds" element={<PRDList />} />
              <Route path="/prd/:id" element={<PRDDetail />} />
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route path="/stakeholders" element={<Stakeholders />} />
              <Route path="/insights" element={<AIInsights />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/governance" element={<GovernanceOverviewPage />} />
              <Route path="/governance/delivery" element={<DeliveryPerformancePage />} />
              <Route path="/governance/quality" element={<QualityMetricsPage />} />
              <Route path="/governance/backlog" element={<BacklogHealthPage />} />
              <Route path="/governance/sprint" element={<ActiveSprintPage />} />
              <Route path="/governance/customer" element={<CustomerMetricsPage />} />
              <Route path="/governance/financial" element={<FinancialPage />} />
              <Route path="/governance/compliance" element={<CompliancePage />} />
              <Route path="/governance/team" element={<TeamHealthPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </HashRouter>
        </TooltipProvider>
      </PRDProvider>
    </QueryClientProvider>
  );
}

export default App;
