#!/usr/bin/env node
// tests/test-niche-configs.js
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'suitedash', 'niche_configs')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))

function checkConfig(c, fname) {
  if (typeof c.niche_id !== 'string' || !c.niche_id) return 'niche_id'
  if (typeof c.display_name !== 'string' || !c.display_name) return 'display_name'
  const o = c.offer_structure
  if (!o || typeof o.setup_fee !== 'number' || typeof o.basic_monthly !== 'number' || typeof o.premium_monthly !== 'number')
    return 'offer_structure'
  if (!Array.isArray(c.custom_fields) || c.custom_fields.length === 0) return 'custom_fields'
  const sp = c.sales_pipeline
  if (!sp || !Array.isArray(sp.stages) || sp.stages.length === 0) return 'sales_pipeline.stages'
  const svc = c.service_pipeline
  if (!svc || !Array.isArray(svc.stages) || svc.stages.length === 0) return 'service_pipeline.stages'
  if (!Array.isArray(c.circles) || c.circles.length !== 5) return 'circles'
  const kf = c.kickoff_form
  if (!kf || !Array.isArray(kf.fields) || kf.fields.length === 0) return 'kickoff_form.fields'
  const pt = c.project_template
  if (!pt || !Array.isArray(pt.tasks) || pt.tasks.length === 0) return 'project_template.tasks'
  return null
}

let failed = 0
for (const f of files) {
  const fp = path.join(dir, f)
  let err = null
  try {
    const c = JSON.parse(fs.readFileSync(fp, 'utf8'))
    err = checkConfig(c, f)
  } catch (e) {
    err = e.message
  }
  if (!err) console.log(`PASS  ${f}`)
  else {
    console.log(`FAIL  ${f} — ${err}`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n${failed} niche config(s) failed`)
  process.exit(1)
}
console.log('\nAll niche configs OK')
process.exit(0)
