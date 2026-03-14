/**
 * Governance Dashboard Layout - 3-Column Responsive Shell
 * 
 * TODO[GAP-003]: Define responsive breakpoints
 *   - Desktop: 3 columns (strategic | delivery/quality | operations)
 *   - Tablet: 2 columns (strategic+delivery | operations)
 *   - Mobile: 1 column stacked
 * 
 * TODO: Implement auto-refresh indicator
 * TODO: Implement last-updated timestamp
 */

import { ReactNode } from 'react';

interface GovernanceDashboardLayoutProps {
  strategicPanel: ReactNode;
  deliveryPanel: ReactNode;
  operationsPanel: ReactNode;
  topBar: ReactNode;
}

export function GovernanceDashboardLayout({
  strategicPanel,
  deliveryPanel,
  operationsPanel,
  topBar,
}: GovernanceDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
        {topBar}
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Strategic */}
          <div className="space-y-6">
            {strategicPanel}
          </div>
          
          {/* Center Column - Delivery & Quality */}
          <div className="space-y-6">
            {deliveryPanel}
          </div>
          
          {/* Right Column - Operations */}
          <div className="space-y-6">
            {operationsPanel}
          </div>
        </div>
      </div>
    </div>
  );
}
