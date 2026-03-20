#!/usr/bin/env node
// scripts/patch-n8n-suitedash-auth.js — SuiteDash uses X-Public-ID + X-Secret-Key (not X-API-KEY)
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'n8n')
const SD_MARK = 'SUITEDASH_BASE_URL'

const suiteDashAuth = {
  authentication: 'none',
  sendHeaders: true,
  headerParameters: {
    parameters: [
      { name: 'X-Public-ID', value: '={{$env.SUITEDASH_API_ID}}' },
      { name: 'X-Secret-Key', value: '={{$env.SUITEDASH_API_SECRET}}' }
    ]
  }
}

function mergeSuiteDashAuth(params) {
  const url = params.url
  if (typeof url !== 'string' || !url.includes(SD_MARK)) return false
  delete params.genericAuthType
  Object.assign(params, suiteDashAuth)
  return true
}

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue
  const fp = path.join(dir, f)
  const wf = JSON.parse(fs.readFileSync(fp, 'utf8'))
  let n = 0
  for (const node of wf.nodes || []) {
    if (node.type !== 'n8n-nodes-base.httpRequest') continue
    if (mergeSuiteDashAuth(node.parameters)) n++
  }
  if (n > 0) {
    fs.writeFileSync(fp, JSON.stringify(wf, null, 2) + '\n', 'utf8')
    console.log(`patched ${f}: ${n} SuiteDash HTTP node(s)`)
  }
}
