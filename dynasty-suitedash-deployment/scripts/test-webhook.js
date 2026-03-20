#!/usr/bin/env node
/**
 * Dynasty Empire - Webhook Test Script
 * Sends test events to the Master Event Router to verify routing.
 * Usage: node scripts/test-webhook.js [event_type]
 */

require('dotenv').config({ path: './env/.env' });
const axios = require('axios');

const WEBHOOK_URL = `${process.env.N8N_WEBHOOK_BASE}/dynasty-events`;

const TEST_EVENTS = {
  kickoff_form_submitted: {
    event_type: 'kickoff_form_submitted',
    contact_id: 'TEST_001',
    first_name: 'Test',
    last_name: 'Plumber',
    email: 'test@plumbco-test.com',
    phone: '555-0100',
    niche: 'plumbing',
    urgency: 'This Week',
    service_type: 'Residential',
    source: 'test_script'
  },
  lead_form_submitted: {
    event_type: 'lead_form_submitted',
    contact_id: 'TEST_002',
    first_name: 'Test',
    last_name: 'HVAC',
    email: 'test@hvacpro-test.com',
    niche: 'hvac',
    urgency: 'Emergency',
    budget: 'Premium',
    in_primary_area: true,
    team_size: 25,
    source: 'test_script'
  },
  engagement_score_dropped: {
    event_type: 'engagement_score_dropped',
    contact_id: 'TEST_003',
    score: 15,
    previous_score: 45,
    score_change: -30,
    risk_level: 'high',
    source: 'test_script'
  },
  subscription_cancelled: {
    event_type: 'subscription_cancelled',
    contact_id: 'TEST_004',
    email: 'test@cancelled.com',
    niche: 'roofing',
    membership_tier: 'basic',
    source: 'test_script'
  },
  workflow_failed: {
    event_type: 'workflow_failed',
    workflow_name: 'test_workflow',
    node_name: 'test_node',
    error_message: 'Test failure event',
    contact_id: 'TEST_005',
    source: 'test_script'
  }
};

async function sendEvent(eventType) {
  const event = TEST_EVENTS[eventType];
  if (!event) {
    console.log(`Unknown event type: ${eventType}`);
    console.log('Available:', Object.keys(TEST_EVENTS).join(', '));
    return;
  }

  console.log(`\n  Sending: ${eventType}`);
  console.log(`  URL: ${WEBHOOK_URL}`);
  console.log(`  Payload: ${JSON.stringify(event).substring(0, 100)}...`);

  try {
    const res = await axios.post(WEBHOOK_URL, event, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });
    console.log(`  Response (${res.status}): ${JSON.stringify(res.data)}`);
    return res.data;
  } catch (err) {
    if (err.response) {
      console.log(`  Error (${err.response.status}): ${JSON.stringify(err.response.data)}`);
    } else {
      console.log(`  Error: ${err.message}`);
    }
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Dynasty Empire — Webhook Tester');
  console.log('═══════════════════════════════════════');

  const eventType = process.argv[2];

  if (!eventType) {
    console.log('\nUsage: node scripts/test-webhook.js [event_type | --all]');
    console.log('\nAvailable event types:');
    Object.keys(TEST_EVENTS).forEach(e => {
      console.log(`  - ${e}: routes to ${TEST_EVENTS[e].event_type}`);
    });
    return;
  }

  if (eventType === '--all') {
    console.log('\nSending all test events...');
    for (const type of Object.keys(TEST_EVENTS)) {
      await sendEvent(type);
    }
  } else {
    await sendEvent(eventType);
  }

  console.log('\n  Check n8n execution log and AiTable event_log for results.');
}

main().catch(err => {
  console.error('Test error:', err.message);
  process.exit(1);
});
