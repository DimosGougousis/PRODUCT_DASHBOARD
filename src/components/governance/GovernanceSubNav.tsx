import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
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

export function GovernanceSubNav() {
  const location = useLocation();

  return (
    <div className="flex items-center gap-1 py-2 overflow-x-auto scrollbar-thin">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <Link key={item.path} to={item.path}>
            <Button
              variant={isActive ? 'secondary' : 'ghost'}
              size="sm"
              className="gap-2 whitespace-nowrap"
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
