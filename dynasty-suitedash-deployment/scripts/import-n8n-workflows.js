#!/usr/bin/env node
/**
 * Dynasty Empire - n8n Workflow Importer
 * Imports all 9 workflow JSONs into your n8n instance via API.
 * Usage: node scripts/import-n8n-workflows.js
 */

require('dotenv').config({ path: './env/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const N8N_URL = process.env.N8N_BASE_URL;
const API_KEY = process.env.N8N_API_KEY;
const CF_CLIENT_ID = process.env.N8N_CF_ACCESS_CLIENT_ID;
const CF_CLIENT_SECRET = process.env.N8N_CF_ACCESS_CLIENT_SECRET;

const headers = {
  'X-N8N-API-KEY': API_KEY,
  'Content-Type': 'application/json'
};

// Add Cloudflare Access headers if configured
if (CF_CLIENT_ID && CF_CLIENT_SECRET) {
  headers['CF-Access-Client-Id'] = CF_CLIENT_ID;
  headers['CF-Access-Client-Secret'] = CF_CLIENT_SECRET;
}

// Import order matters: failure handler first, then router, then packs
const IMPORT_ORDER = [
  '05_failure_handler.json',     // Must be first — other workflows reference it
  '08_master_event_router.json', // Must be second — single entry point
  '01_onboarding.json',
  '02_engagement_scoring.json',
  '03_renewal.json',
  '04_winback.json',
  '06_data_sync.json',
  '07_agent_router.json',        // Agent layer — activate in Phase 4
  '09_qa_audit.json'             // Agent layer — activate in Phase 4
];

async function importWorkflow(filename) {
  const filepath = path.join(__dirname, '..', 'n8n', filename);

  if (!fs.existsSync(filepath)) {
    console.log(`  ⚠ ${filename} — File not found, skipping`);
    return null;
  }

  const workflow = JSON.parse(fs.readFileSync(filepath, 'utf8'));

  try {
    const res = await axios.post(`${N8N_URL}/api/v1/workflows`, workflow, {
      headers,
      timeout: 30000
    });
    return res.data;
  } catch (err) {
    if (err.response?.status === 409) {
      console.log(`  ⚠ ${filename} — Already exists, skipping`);
      return { skipped: true };
    }
    throw err;
  }
}

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Dynasty Empire — n8n Workflow Import');
  console.log('═══════════════════════════════════════\n');

  if (!N8N_URL || !API_KEY) {
    console.error('ERROR: n8n credentials not configured in .env');
    process.exit(1);
  }

  console.log(`Target: ${N8N_URL}`);
  console.log(`Importing ${IMPORT_ORDER.length} workflows...\n`);

  let imported = 0;
  let skipped = 0;
  let failed = 0;

  for (const filename of IMPORT_ORDER) {
    try {
      const result = await importWorkflow(filename);
      if (result?.skipped) {
        skipped++;
        continue;
      }
      if (result) {
        console.log(`  ✓ ${filename} — Imported (ID: ${result.id || 'unknown'})`);
        imported++;
      }
    } catch (err) {
      console.log(`  ✗ ${filename} — Failed: ${err.message}`);
      failed++;
    }
  }

  console.log('\n───────────────────────────────────────');
  console.log(`Results: ${imported} imported, ${skipped} skipped, ${failed} failed`);

  if (imported > 0) {
    console.log('\n  NEXT STEPS:');
    console.log('  1. Activate 05_failure_handler first');
    console.log('  2. Activate 08_master_event_router');
    console.log('  3. Set 05_failure_handler as error workflow for all other workflows');
    console.log('  4. Activate packs 01-06 one at a time');
    console.log('  5. Configure SuiteDash webhook → master event router URL');
    console.log('  6. In Phase 4: Activate 07 (agent router) and 09 (QA audit)');
  }
}

main().catch(err => {
  console.error('Import error:', err.message);
  process.exit(1);
});
