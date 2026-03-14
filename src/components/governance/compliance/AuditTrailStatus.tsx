/**
 * Audit Trail Status - Security events and audit log summary
 */

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import type { ComplianceMetrics } from '@/types/governance/compliance';

interface AuditTrailStatusProps {
  metrics: ComplianceMetrics | undefined;
  isLoading: boolean;
}

export function AuditTrailStatus({ metrics, isLoading }: AuditTrailStatusProps) {
  const auditTrail = metrics?.auditTrail;
  const security = metrics?.security;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Security & Audit</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-24 bg-gray-100 animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">Security & Audit</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Vulnerability Scan */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Vulnerabilities</span>
            <div className="flex gap-2">
              {security?.vulnerabilityScans.critical ? (
                <Badge variant="destructive" className="text-xs">
                  {security.vulnerabilityScans.critical} Critical
                </Badge>
              ) : (
                <Badge className="bg-green-100 text-green-700 text-xs">Clean</Badge>
              )}
            </div>
          </div>
          <div className="text-xs text-gray-500">
            Last scan: {security?.vulnerabilityScans.lastScanDate || 'N/A'}
          </div>
        </div>

        {/* Penetration Test */}
        <div className="mb-3">
          <div className="flex justify-between items-center text-sm mb-1">
            <span className="text-gray-600">Pen Test</span>
            <span className="text-xs">
              {security?.penetrationTests.findings ?? 0} findings
            </span>
          </div>
          <div className="text-xs text-gray-500">
            Next: {security?.penetrationTests.nextTestDate || 'N/A'}
          </div>
        </div>

        {/* Audit Trail */}
        <div className="pt-3 border-t">
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-gray-600 flex items-center gap-1">
              <FileText className="w-3 h-3" />
              Audit Events
            </span>
            <span className="font-medium">{auditTrail?.eventsThisMonth.toLocaleString() ?? 0}</span>
          </div>

          {auditTrail && auditTrail.suspiciousEvents > 0 && (
            <div className="flex items-center gap-2 p-2 bg-red-50 rounded text-xs">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <span className="text-red-600">
                {auditTrail.suspiciousEvents} suspicious events detected
              </span>
            </div>
          )}

          {auditTrail && auditTrail.suspiciousEvents === 0 && (
            <div className="flex items-center gap-2 p-2 bg-green-50 rounded text-xs">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-green-600">No suspicious activity</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
