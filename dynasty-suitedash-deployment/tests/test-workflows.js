#!/usr/bin/env node
// tests/test-workflows.js
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'n8n')
const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'))

let failed = 0
for (const f of files) {
  const fp = path.join(dir, f)
  let ok = true
  let reason = ''
  try {
    const w = JSON.parse(fs.readFileSync(fp, 'utf8'))
    if (typeof w.name !== 'string' || !w.name) {
      ok = false
      reason = 'missing name'
    } else if (!Array.isArray(w.nodes) || w.nodes.length === 0) {
      ok = false
      reason = 'nodes invalid'
    } else if (!w.connections || typeof w.connections !== 'object') {
      ok = false
      reason = 'connections invalid'
    } else if (!w.settings || typeof w.settings !== 'object') {
      ok = false
      reason = 'settings invalid'
    }
  } catch (e) {
    ok = false
    reason = e.message
  }
  if (ok) console.log(`PASS  ${f}`)
  else {
    console.log(`FAIL  ${f} — ${reason}`)
    failed++
  }
}

if (failed > 0) {
  console.error(`\n${failed} workflow file(s) failed validation`)
  process.exit(1)
}
console.log('\nAll workflow JSONs OK')
process.exit(0)
