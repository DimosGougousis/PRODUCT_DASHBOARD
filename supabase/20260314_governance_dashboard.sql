--
-- PO Governance Dashboard Schema
-- 
-- TODO[GAP-019]: Run this migration to create tables
-- TODO: Review RLS policies for multi-tenant access
-- TODO: Add indexes for query performance
--

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Governance Dashboard Configuration per product
CREATE TABLE governance_dashboard_configs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  enabled_pillars TEXT[] NOT NULL DEFAULT '{}',
  refresh_intervals JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id)
);

-- Alert Rules for threshold monitoring
CREATE TABLE alert_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  pillar TEXT NOT NULL CHECK (pillar IN (
    'strategic', 'backlog', 'delivery', 'quality', 
    'customer', 'financial', 'compliance', 'teamHealth'
  )),
  metric_key TEXT NOT NULL,
  operator TEXT NOT NULL CHECK (operator IN ('>', '<', '>=', '<=', '==', '!=')),
  threshold DECIMAL NOT NULL,
  severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
  cooldown_minutes INTEGER DEFAULT 30,
  slack_channel_id TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Immutable audit log for governance actions
CREATE TABLE governance_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES users(id),
  actor_role TEXT NOT NULL,
  action TEXT NOT NULL CHECK (action IN (
    'RELEASE_SIGN_OFF',
    'COMPLIANCE_CHECKLIST_COMPLETE',
    'RISK_THRESHOLD_BREACHED',
    'DASHBOARD_SNAPSHOT_EXPORTED',
    'ALERT_RULE_UPDATED'
  )),
  payload JSONB DEFAULT '{}',
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Release readiness checklist
CREATE TABLE release_checklists (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  release_version TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending', 'in_review', 'approved', 'rejected'
  )),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Checklist items
CREATE TABLE checklist_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES release_checklists(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('quality', 'compliance', 'security', 'operations')),
  required BOOLEAN DEFAULT TRUE,
  completed_at TIMESTAMP WITH TIME ZONE,
  completed_by UUID REFERENCES users(id)
);

-- Release sign-offs
CREATE TABLE release_signoffs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  checklist_id UUID NOT NULL REFERENCES release_checklists(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL REFERENCES users(id),
  role TEXT NOT NULL,
  decision TEXT NOT NULL CHECK (decision IN ('approved', 'rejected')),
  comment TEXT,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_governance_configs_product_id ON governance_dashboard_configs(product_id);
CREATE INDEX idx_alert_rules_product_id ON alert_rules(product_id);
CREATE INDEX idx_audit_logs_product_id_timestamp ON governance_audit_logs(product_id, timestamp DESC);
CREATE INDEX idx_audit_logs_actor_id ON governance_audit_logs(actor_id);
CREATE INDEX idx_release_checklists_product_id ON release_checklists(product_id);
CREATE INDEX idx_checklist_items_checklist_id ON checklist_items(checklist_id);
CREATE INDEX idx_release_signoffs_checklist_id ON release_signoffs(checklist_id);

-- Row Level Security (RLS) policies
ALTER TABLE governance_dashboard_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE governance_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE release_signoffs ENABLE ROW LEVEL SECURITY;

-- TODO: Define RLS policies based on your auth setup
-- Example: 
-- CREATE POLICY "Users can read own product governance config"
--   ON governance_dashboard_configs
--   FOR SELECT
--   USING (product_id IN (
--     SELECT product_id FROM user_products WHERE user_id = auth.uid()
--   ));

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_governance_dashboard_configs_updated_at
  BEFORE UPDATE ON governance_dashboard_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_alert_rules_updated_at
  BEFORE UPDATE ON alert_rules
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_release_checklists_updated_at
  BEFORE UPDATE ON release_checklists
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
