/**
 * Alert Rules Drawer - Configure threshold alerts
 * 
 * TODO[GAP-013]: Alert Rule Data Model (Supabase)
 *   - Table: alert_rules
 *   - Fields: pillar, metricKey, operator, threshold, severity, cooldownMinutes, slackChannelId
 * 
 * TODO: Implement Slack webhook integration
 * TODO: Add 30-minute cooldown deduplication
 */

import { useState } from 'react';
import { Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';

interface AlertRule {
  id: string;
  pillar: string;
  metricKey: string;
  threshold: number;
  severity: 'info' | 'warning' | 'critical';
  enabled: boolean;
}

interface AlertRulesDrawerProps {
  productId: string;
  rules: AlertRule[];
  onSave: (rules: AlertRule[]) => void;
}

export function AlertRulesDrawer({ productId, rules, onSave }: AlertRulesDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  // TODO: Load rules from API
  // TODO: Implement rule CRUD

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm">
          <Bell className="w-4 h-4 mr-2" />
          Alert Rules
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Alert Rules Configuration
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          {/* TODO: Implement rule list */}
          <div className="text-sm text-gray-500">
            Product: {productId || 'Not selected'}
          </div>
          
          <div className="p-4 bg-gray-50 rounded-lg text-sm text-gray-500">
            TODO: Alert rule configuration (Stage 3)
            <ul className="mt-2 list-disc list-inside text-xs">
              <li>Add/edit/delete rules</li>
              <li>Configure thresholds</li>
              <li>Set Slack channels</li>
              <li>Configure cooldown periods</li>
            </ul>
          </div>
          
          {/* TODO: Add rule form */}
          <div className="text-xs text-gray-400">
            Current rules: {rules?.length || 0}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
