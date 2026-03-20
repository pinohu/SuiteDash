#!/usr/bin/env node
// tests/test-agents.js — mock AiTable, exercise agents
async function main() {
  const path = require('path')
  require('dotenv').config({ path: path.join(__dirname, '..', 'env', '.env') })

  const config = require('../agents/config')
  config.aitable.getRecords = async () => ({ data: { records: [] } })
  config.aitable.createRecord = async (t, f) => ({ data: { records: [{ recordId: 'rec_test', fields: f }] } })
  config.aitable.updateRecord = async (t, id, f) => ({ data: { records: [{ recordId: id, fields: f }] } })

  let failed = 0
  function pass(name) {
    console.log(`PASS  ${name}`)
  }
  function fail(name, msg) {
    console.log(`FAIL  ${name} — ${msg}`)
    failed++
  }

  const lq = require('../agents/lead-qualification')
  const hotResult = await lq.scoreLoad({
    urgency: 'Emergency',
    budget: 'Premium',
    in_primary_area: true,
    team_size: 60,
    name: 'Test',
    email: 'test@test.com',
    phone: '555-0100',
    service_type: 'Commercial'
  })
  if (hotResult.score >= 80 && hotResult.priority === 'hot') pass('lead hot')
  else fail('lead hot', JSON.stringify(hotResult))

  const coldResult = await lq.scoreLoad({
    urgency: 'No Rush',
    budget: 'Budget',
    in_primary_area: false,
    team_size: 1,
    name: 'Cold',
    email: 'cold@test.com'
  })
  if (coldResult.score < 50 && coldResult.priority !== 'hot') pass('lead cold')
  else fail('lead cold', JSON.stringify(coldResult))

  delete require.cache[require.resolve('../agents/orchestrator')]
  const orch = require('../agents/orchestrator')
  const result = await orch.handleEvent({
    event_type: 'kickoff_form_submitted',
    payload: {
      urgency: 'Emergency',
      budget: 'Premium',
      in_primary_area: true,
      team_size: 60,
      name: 'Test',
      email: 'test@test.com',
      phone: '555-0100',
      service_type: 'Commercial'
    },
    source: 'test'
  })
  if (String(result.routed_to || '').toLowerCase().includes('lead')) pass('orchestrator route')
  else fail('orchestrator route', JSON.stringify(result))

  config.aitable.getRecords = async () => ({
    data: {
      records: [{ fields: { client_id: 'test_contact', sent_at: new Date().toISOString() } }]
    }
  })
  delete require.cache[require.resolve('../agents/client-communication')]
  const comm = require('../agents/client-communication')
  const throttled = await comm.sendCommunication('test_contact', 'welcome', {})
  if (throttled.sent === false) pass('comm throttle')
  else fail('comm throttle', JSON.stringify(throttled))

  if (failed > 0) {
    console.error(`\n${failed} test(s) failed`)
    process.exit(1)
  }
  console.log('\nAll agent tests OK')
  process.exit(0)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
