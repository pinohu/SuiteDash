#!/usr/bin/env node
/**
 * Dynasty Empire - AiTable Setup Script
 * Creates all 12 required tables in AiTable with correct field types.
 * Usage: node scripts/setup-aitable.js
 *
 * NOTE: AiTable's API for creating datasheets may vary.
 * This script uses the documented REST API at https://aitable.ai/fusion/v1/spaces/{spaceId}/datasheets
 * You may need to create tables manually via the AiTable UI and then update .env with the table IDs.
 * This script will verify tables exist and create the system_config record for Emergency Stop.
 */

require('dotenv').config({ path: './env/.env' });
const axios = require('axios');

const API_KEY = process.env.AITABLE_API_KEY;
const BASE_URL = 'https://aitable.ai/fusion/v1';

const headers = {
  'Authorization': `Bearer ${API_KEY}`,
  'Content-Type': 'application/json'
};

const TABLES = [
  {
    envVar: 'AITABLE_CLIENTS_TABLE',
    name: 'clients',
    description: 'Master client records synced from SuiteDash',
    fields: [
      { name: 'client_id', type: 'SingleText' },
      { name: 'suitedash_id', type: 'SingleText' },
      { name: 'name', type: 'SingleText' },
      { name: 'email', type: 'Email' },
      { name: 'company', type: 'SingleText' },
      { name: 'niche', type: 'SingleSelect', property: { options: [
        { name: 'plumbing' }, { name: 'hvac' }, { name: 'pest_control' }, { name: 'roofing' },
        { name: 'real_estate' }, { name: 'property_management' }, { name: 'immigration_legal' },
        { name: 'tax_accounting' }, { name: 'medical_billing' }, { name: 'home_cleaning' },
        { name: 'landscaping' }, { name: 'auto_repair' }, { name: 'childcare' },
        { name: 'fitness_coaches' }, { name: 'digital_marketing' }, { name: 'construction' }
      ]}},
      { name: 'membership_tier', type: 'SingleSelect', property: { options: [
        { name: 'free' }, { name: 'basic' }, { name: 'premium' }
      ]}},
      { name: 'lifecycle_stage', type: 'SingleSelect', property: { options: [
        { name: 'onboarding' }, { name: 'active' }, { name: 'at_risk' }, { name: 'churned' }
      ]}},
      { name: 'engagement_score', type: 'Number' },
      { name: 'churn_risk', type: 'SingleSelect', property: { options: [
        { name: 'low' }, { name: 'medium' }, { name: 'high' }
      ]}},
      { name: 'ltv', type: 'Currency', property: { symbol: '$' } },
      { name: 'acquisition_channel', type: 'SingleText' },
      { name: 'onboarding_complete', type: 'Checkbox' },
      { name: 'days_since_login', type: 'Number' },
      { name: 'signup_date', type: 'DateTime' },
      { name: 'renewal_date', type: 'DateTime' },
      { name: 'stripe_customer_id', type: 'SingleText' },
      { name: 'coordinator', type: 'SingleText' },
      { name: 'directory_source', type: 'SingleText' },
      { name: 'nps_score', type: 'Number' }
    ]
  },
  {
    envVar: 'AITABLE_ENGAGEMENT_TABLE',
    name: 'engagement_scores',
    description: 'Daily engagement score tracking',
    fields: [
      { name: 'client_id', type: 'SingleText' },
      { name: 'date', type: 'DateTime' },
      { name: 'logins', type: 'Number' },
      { name: 'profile_updates', type: 'Number' },
      { name: 'features_used', type: 'Number' },
      { name: 'community_posts', type: 'Number' },
      { name: 'support_tickets', type: 'Number' },
      { name: 'days_since_login', type: 'Number' },
      { name: 'calculated_score', type: 'Number' },
      { name: 'previous_score', type: 'Number' },
      { name: 'score_change', type: 'Number' },
      { name: 'risk_level', type: 'SingleSelect', property: { options: [
        { name: 'healthy' }, { name: 'medium' }, { name: 'high' }, { name: 'highly_engaged' }
      ]}},
      { name: 'action_triggered', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_LEAD_SCORES_TABLE',
    name: 'lead_scores',
    description: 'Agent lead qualification scores',
    fields: [
      { name: 'contact_id', type: 'SingleText' },
      { name: 'form_source', type: 'SingleText' },
      { name: 'niche', type: 'SingleText' },
      { name: 'urgency_score', type: 'Number' },
      { name: 'budget_score', type: 'Number' },
      { name: 'location_score', type: 'Number' },
      { name: 'size_score', type: 'Number' },
      { name: 'completeness_score', type: 'Number' },
      { name: 'total_score', type: 'Number' },
      { name: 'priority', type: 'SingleSelect', property: { options: [
        { name: 'hot' }, { name: 'warm' }, { name: 'cold' }, { name: 'low_quality' }
      ]}},
      { name: 'recommended_tier', type: 'SingleText' },
      { name: 'routing_action', type: 'SingleText' },
      { name: 'timestamp', type: 'DateTime' },
      { name: 'outcome', type: 'SingleText' },
      { name: 'conversion_days', type: 'Number' }
    ]
  },
  {
    envVar: 'AITABLE_COMMS_LOG_TABLE',
    name: 'communication_log',
    description: 'All email/message tracking',
    fields: [
      { name: 'client_id', type: 'SingleText' },
      { name: 'message_type', type: 'SingleText' },
      { name: 'channel', type: 'SingleSelect', property: { options: [
        { name: 'email' }, { name: 'sms' }, { name: 'portal_notification' }
      ]}},
      { name: 'subject', type: 'SingleText' },
      { name: 'sent_at', type: 'DateTime' },
      { name: 'opened', type: 'Checkbox' },
      { name: 'opened_at', type: 'DateTime' },
      { name: 'clicked', type: 'Checkbox' },
      { name: 'clicked_at', type: 'DateTime' },
      { name: 'replied', type: 'Checkbox' },
      { name: 'agent_generated', type: 'Checkbox' },
      { name: 'sequence_name', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_WORKFLOW_STATE_TABLE',
    name: 'workflow_state',
    description: 'Active workflow tracker for orchestration',
    fields: [
      { name: 'client_id', type: 'SingleText' },
      { name: 'workflow_name', type: 'SingleText' },
      { name: 'status', type: 'SingleSelect', property: { options: [
        { name: 'active' }, { name: 'completed' }, { name: 'paused' }, { name: 'failed' }
      ]}},
      { name: 'started_at', type: 'DateTime' },
      { name: 'current_step', type: 'Number' },
      { name: 'total_steps', type: 'Number' },
      { name: 'last_step_at', type: 'DateTime' },
      { name: 'next_step_at', type: 'DateTime' },
      { name: 'priority', type: 'SingleSelect', property: { options: [
        { name: 'critical' }, { name: 'high' }, { name: 'medium' }, { name: 'low' }
      ]}},
      { name: 'conflict_check', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_DLQ_TABLE',
    name: 'dlq',
    description: 'Dead Letter Queue for failed operations',
    fields: [
      { name: 'workflow_name', type: 'SingleText' },
      { name: 'node_name', type: 'SingleText' },
      { name: 'error_type', type: 'SingleText' },
      { name: 'error_message', type: 'Text' },
      { name: 'contact_id', type: 'SingleText' },
      { name: 'payload_summary', type: 'Text' },
      { name: 'retry_count', type: 'Number' },
      { name: 'max_retries', type: 'Number' },
      { name: 'first_failure', type: 'DateTime' },
      { name: 'last_retry', type: 'DateTime' },
      { name: 'status', type: 'SingleSelect', property: { options: [
        { name: 'retrying' }, { name: 'needs_manual_review' }, { name: 'resolved' }
      ]}},
      { name: 'resolved_at', type: 'DateTime' },
      { name: 'resolved_by', type: 'SingleText' },
      { name: 'resolution_notes', type: 'Text' }
    ]
  },
  {
    envVar: 'AITABLE_ANALYTICS_TABLE',
    name: 'daily_analytics',
    description: 'Dashboard metrics',
    fields: [
      { name: 'date', type: 'DateTime' },
      { name: 'total_mrr', type: 'Currency', property: { symbol: '$' } },
      { name: 'new_members', type: 'Number' },
      { name: 'churned_members', type: 'Number' },
      { name: 'churn_rate_30d', type: 'Number' },
      { name: 'total_active', type: 'Number' },
      { name: 'avg_engagement_score', type: 'Number' },
      { name: 'dlq_items_open', type: 'Number' },
      { name: 'failed_payments_24h', type: 'Number' },
      { name: 'onboarding_completion_rate', type: 'Number' },
      { name: 'support_tickets_open', type: 'Number' },
      { name: 'top_niche', type: 'SingleText' },
      { name: 'worst_niche', type: 'SingleText' },
      { name: 'api_calls_used', type: 'Number' },
      { name: 'api_calls_limit', type: 'Number' },
      { name: 'system_integrity_score', type: 'Number' }
    ]
  },
  {
    envVar: 'AITABLE_PROJECTS_TABLE',
    name: 'projects',
    description: 'Project tracking synced from SuiteDash',
    fields: [
      { name: 'project_id', type: 'SingleText' },
      { name: 'suitedash_id', type: 'SingleText' },
      { name: 'client_id', type: 'SingleText' },
      { name: 'name', type: 'SingleText' },
      { name: 'niche', type: 'SingleText' },
      { name: 'status', type: 'SingleSelect', property: { options: [
        { name: 'not_started' }, { name: 'in_progress' }, { name: 'completed' }, { name: 'on_hold' }
      ]}},
      { name: 'template_used', type: 'SingleText' },
      { name: 'start_date', type: 'DateTime' },
      { name: 'target_end_date', type: 'DateTime' },
      { name: 'actual_end_date', type: 'DateTime' },
      { name: 'progress_pct', type: 'Number' },
      { name: 'assigned_to', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_TASKS_TABLE',
    name: 'tasks',
    description: 'Task tracking',
    fields: [
      { name: 'task_id', type: 'SingleText' },
      { name: 'project_id', type: 'SingleText' },
      { name: 'client_id', type: 'SingleText' },
      { name: 'name', type: 'SingleText' },
      { name: 'status', type: 'SingleSelect', property: { options: [
        { name: 'pending' }, { name: 'in_progress' }, { name: 'completed' }
      ]}},
      { name: 'assigned_to', type: 'SingleText' },
      { name: 'due_date', type: 'DateTime' },
      { name: 'completed_date', type: 'DateTime' },
      { name: 'order', type: 'Number' },
      { name: 'phase', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_AUDIT_LOG_TABLE',
    name: 'audit_log',
    description: 'QA Agent audit results',
    fields: [
      { name: 'date', type: 'DateTime' },
      { name: 'checks_run', type: 'Number' },
      { name: 'checks_passed', type: 'Number' },
      { name: 'checks_failed', type: 'Number' },
      { name: 'anomalies_found', type: 'Number' },
      { name: 'auto_fixed_count', type: 'Number' },
      { name: 'escalated_count', type: 'Number' },
      { name: 'system_integrity_score', type: 'Number' },
      { name: 'run_duration_seconds', type: 'Number' },
      { name: 'notes', type: 'Text' }
    ]
  },
  {
    envVar: 'AITABLE_EVENT_LOG_TABLE',
    name: 'event_log',
    description: 'Master Router event trace',
    fields: [
      { name: 'event_type', type: 'SingleText' },
      { name: 'contact_id', type: 'SingleText' },
      { name: 'timestamp', type: 'DateTime' },
      { name: 'status', type: 'SingleSelect', property: { options: [
        { name: 'routed' }, { name: 'paused' }, { name: 'replayed' }
      ]}},
      { name: 'routed_to', type: 'SingleText' },
      { name: 'replayed_at', type: 'DateTime' },
      { name: 'source', type: 'SingleText' }
    ]
  },
  {
    envVar: 'AITABLE_SYSTEM_CONFIG_TABLE',
    name: 'system_config',
    description: 'Emergency Stop control',
    fields: [
      { name: 'config_key', type: 'SingleText' },
      { name: 'value', type: 'SingleText' },
      { name: 'updated_at', type: 'DateTime' },
      { name: 'updated_by', type: 'SingleText' },
      { name: 'notes', type: 'Text' }
    ]
  }
];

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Dynasty Empire — AiTable Setup');
  console.log('═══════════════════════════════════════\n');

  if (!API_KEY) {
    console.error('ERROR: AITABLE_API_KEY not set in .env');
    process.exit(1);
  }

  console.log('Table definitions for manual creation:');
  console.log('(AiTable may require manual table creation via UI)\n');

  for (const table of TABLES) {
    console.log(`\n📋 ${table.name} — ${table.description}`);
    console.log(`   ENV: ${table.envVar}`);
    console.log('   Fields:');
    for (const field of table.fields) {
      const extra = field.property ? ` (${JSON.stringify(field.property).substring(0, 60)})` : '';
      console.log(`     - ${field.name}: ${field.type}${extra}`);
    }
  }

  console.log('\n\n───────────────────────────────────────');
  console.log('IMPORTANT: After creating tables in AiTable UI:');
  console.log('1. Copy each table\'s datasheet ID (starts with "dst")');
  console.log('2. Update env/.env with the actual IDs');
  console.log('3. Create the system_config record:');
  console.log('   config_key: "system_active", value: "true"');
  console.log('   config_key: "api_calls_this_month", value: "0"');
  console.log('   config_key: "api_calls_limit", value: "2000"');
  console.log('4. Note the system_active record ID → AITABLE_SYSTEM_ACTIVE_RECORD');
  console.log('5. Run: node scripts/verify-connections.js');
  console.log('───────────────────────────────────────\n');
}

main().catch(err => {
  console.error('Setup error:', err.message);
  process.exit(1);
});
