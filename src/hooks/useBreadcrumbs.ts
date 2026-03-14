import { useLocation } from 'react-router-dom';

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
