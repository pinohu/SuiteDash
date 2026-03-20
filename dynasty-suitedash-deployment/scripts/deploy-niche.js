#!/usr/bin/env node
/**
 * Dynasty Empire - Niche Deployment Script
 * Deploys a single niche pack: creates circles, custom fields, and kickoff form in SuiteDash.
 *
 * Usage: node scripts/deploy-niche.js plumbing
 *        node scripts/deploy-niche.js --all
 *
 * NOTE: SuiteDash does not have a bulk import API for most settings.
 * This script creates contacts/circles via API and outputs a checklist for manual UI steps.
 */

require('dotenv').config({ path: './.env' });
require('dotenv').config({ path: './env/.env' });
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const SD_URL = process.env.SUITEDASH_BASE_URL;

const headers = {
  'X-Public-ID': (process.env.SUITEDASH_API_ID || '').trim(),
  'X-Secret-Key': (process.env.SUITEDASH_API_SECRET || '').trim(),
  'Content-Type': 'application/json'
};

const NICHE_ORDER = [
  'plumbing', 'hvac', 'pest_control', 'roofing',
  'real_estate', 'property_management', 'immigration_legal',
  'tax_accounting', 'medical_billing', 'home_cleaning',
  'landscaping', 'auto_repair', 'childcare',
  'fitness_coaches', 'digital_marketing', 'construction'
];

const TIERS = ['Free', 'Basic', 'Premium', 'Churned', 'VIP'];

function loadNicheConfig(niche) {
  const filepath = path.join(__dirname, '..', 'suitedash', 'niche_configs', `${niche}.json`);
  if (fs.existsSync(filepath)) {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  }
  return null;
}

function formatNicheName(slug) {
  return slug.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function pipelineStages(pipeline) {
  if (!pipeline) return [];
  if (Array.isArray(pipeline)) return pipeline;
  if (Array.isArray(pipeline.stages)) return pipeline.stages;
  return [];
}

async function deployNiche(niche) {
  const displayName = formatNicheName(niche);
  console.log(`\n━━━ Deploying: ${displayName} ━━━\n`);

  const config = loadNicheConfig(niche);

  // Step 1: Create circles via API (if circle endpoint exists)
  console.log('  Step 1: Circles');
  for (const tier of TIERS) {
    const circleName = `${displayName}-${tier}`;
    console.log(`    → Create circle: "${circleName}"`);
    // SuiteDash may not have circle creation API - log for manual creation
  }
  console.log('    ⚠ SuiteDash circles must be created manually in Admin > CRM > Circles');

  // Step 2: Custom fields
  console.log('\n  Step 2: Custom Fields');
  if (config?.custom_fields) {
    for (const field of config.custom_fields) {
      console.log(`    → ${field.name} (${field.type})`);
    }
  } else {
    console.log('    Using shared custom fields from custom_fields.json');
  }
  console.log('    ⚠ Custom fields must be added in Admin > CRM > Custom Fields');

  // Step 3: Pipeline stages
  console.log('\n  Step 3: Pipeline');
  const salesStages = pipelineStages(config?.sales_pipeline);
  if (salesStages.length) {
    console.log('    Sales Pipeline:');
    salesStages.forEach((stage, i) => {
      console.log(`      ${i + 1}. ${stage.name}`);
    });
  }
  const serviceStages = pipelineStages(config?.service_pipeline);
  if (serviceStages.length) {
    console.log('    Service Pipeline:');
    serviceStages.forEach((stage, i) => {
      console.log(`      ${i + 1}. ${stage.name}`);
    });
  }
  console.log('    ⚠ Pipelines must be created in Admin > CRM > Pipelines');

  // Step 4: Kickoff Form
  console.log('\n  Step 4: Kickoff Form');
  if (config?.kickoff_form) {
    console.log(`    Form: "${displayName} Onboarding Kickoff"`);
    console.log(`    Fields: ${config.kickoff_form.fields?.length || 0} fields defined`);
  }
  console.log('    ⚠ Forms must be built in Admin > Marketing > Forms');

  // Step 5: Project Template
  console.log('\n  Step 5: Project Template');
  if (config?.project_template) {
    console.log(`    Template: "${displayName} Onboarding"`);
    console.log(`    Tasks: ${config.project_template.tasks?.length || 0} tasks defined`);
  }
  console.log('    ⚠ Project templates must be created in Admin > Projects > Templates');

  // Step 6: Test contact
  console.log('\n  Step 6: Test Contact');
  try {
    const testContact = {
      first_name: 'Test',
      last_name: displayName,
      email: `test-${niche}@dynasty-test.com`,
      role: 'lead'
    };
    console.log(`    Creating test contact: ${testContact.email}`);
    // Uncomment to actually create:
    // await axios.post(`${SD_URL}/contact`, testContact, { headers });
    console.log(`    → Test contact ready (uncomment in script to auto-create)`);
  } catch (err) {
    console.log(`    ⚠ Test contact creation failed: ${err.message}`);
  }

  console.log(`\n  ✓ ${displayName} niche deployment guide generated.`);
  console.log('  Complete the manual steps marked with ⚠ in SuiteDash admin.\n');
}

async function main() {
  console.log('\n═══════════════════════════════════════');
  console.log('  Dynasty Empire — Niche Deployer');
  console.log('═══════════════════════════════════════\n');

  const arg = process.argv[2];

  if (!arg) {
    console.log('Usage:');
    console.log('  node scripts/deploy-niche.js plumbing');
    console.log('  node scripts/deploy-niche.js --all');
    console.log('\nAvailable niches:');
    NICHE_ORDER.forEach((n, i) => console.log(`  ${i + 1}. ${formatNicheName(n)}`));
    return;
  }

  if (arg === '--all') {
    console.log(`Deploying all ${NICHE_ORDER.length} niches...\n`);
    for (const niche of NICHE_ORDER) {
      await deployNiche(niche);
    }
  } else {
    if (!NICHE_ORDER.includes(arg)) {
      console.error(`Unknown niche: ${arg}`);
      console.log('Available:', NICHE_ORDER.join(', '));
      process.exit(1);
    }
    await deployNiche(arg);
  }
}

main().catch(err => {
  console.error('Deploy error:', err.message);
  process.exit(1);
});
