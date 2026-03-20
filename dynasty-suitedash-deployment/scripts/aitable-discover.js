#!/usr/bin/env node
/**
 * scripts/aitable-discover.js — List AiTable datasheets (Fusion v2). Does NOT auto-edit .env
 * (generic names like "Tasks" would map to wrong tables). Use output to assign dst_* IDs manually.
 */
const fs = require('fs')
const path = require('path')
const axios = require('axios')

const root = path.join(__dirname, '..')
require('dotenv').config({ path: path.join(root, '.env') })
require('dotenv').config({ path: path.join(root, 'env', '.env') })

const key = process.env.AITABLE_API_KEY
const report = path.join(root, 'AUTOMATION_REPORT.md')

function appendReport(line) {
  fs.appendFileSync(report, line + '\n', 'utf8')
}

async function main() {
  fs.writeFileSync(
    report,
    `# Automation run — ${new Date().toISOString()}\n\n## AiTable datasheet discovery (read-only)\n\n`,
    'utf8'
  )
  if (!key) {
    appendReport('ERROR: AITABLE_API_KEY missing')
    process.exit(1)
  }
  appendReport(
    '_Env is not modified._ Create datasheets named e.g. `clients`, `system_config`, then set `AITABLE_*_TABLE` in `.env` manually.\n'
  )
  try {
    const spacesRes = await axios.get('https://aitable.ai/fusion/v1/spaces', {
      headers: { Authorization: `Bearer ${key}` },
      timeout: 20000
    })
    const spaces = spacesRes.data?.data?.spaces || spacesRes.data?.spaces || []
    appendReport(`Spaces: ${spaces.length}`)
    for (const sp of spaces) {
      const sid = sp.id || sp.spaceId
      if (!sid) continue
      appendReport(`- **${sp.name || sid}** (\`${sid}\`)`)
      const nRes = await axios.get(`https://aitable.ai/fusion/v2/spaces/${sid}/nodes`, {
        headers: { Authorization: `Bearer ${key}` },
        params: { type: 'Datasheet' },
        timeout: 30000
      })
      const nodes = nRes.data?.data?.nodes || []
      appendReport(`  - Datasheets: **${nodes.length}** (see full list in AiTable UI)`)
      const sample = nodes.slice(0, 8).map((d) => `\`${d.name}\` → \`${d.id}\``)
      appendReport(`  - Sample: ${sample.join('; ')}`)
    }
  } catch (e) {
    appendReport(`\nFAILED: ${e.message}`)
    process.exit(1)
  }
}

main()
