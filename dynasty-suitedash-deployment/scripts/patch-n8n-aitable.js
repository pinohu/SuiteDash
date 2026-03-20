#!/usr/bin/env node
// scripts/patch-n8n-aitable.js — normalize AiTable URLs and Bearer auth in n8n workflow JSON
const fs = require('fs')
const path = require('path')

const dir = path.join(__dirname, '..', 'n8n')

function patchAitableHttpNodes(obj) {
  if (!obj.nodes) return
  for (const node of obj.nodes) {
    if (node.type !== 'n8n-nodes-base.httpRequest') continue
    const url = node.parameters?.url
    if (typeof url !== 'string' || !url.includes('aitable.ai')) continue
    node.parameters.authentication = 'none'
    delete node.parameters.genericAuthType
    node.parameters.sendHeaders = true
    node.parameters.headerParameters = {
      parameters: [{ name: 'Authorization', value: '=Bearer {{$env.AITABLE_API_KEY}}' }]
    }
  }
}

for (const f of fs.readdirSync(dir)) {
  if (!f.endsWith('.json')) continue
  const fp = path.join(dir, f)
  let text = fs.readFileSync(fp, 'utf8')
  text = text.replace(
    /=\{\{\$env\.AITABLE_BASE_URL\}\}\/\{\{\$env\.(AITABLE_[A-Z_]+)\}\}/g,
    '=https://aitable.ai/fusion/v1/datasheets/{{$env.$1}}/records'
  )
  text = text.replace(
    /https:\/\/api\.aitable\.com\/v0\/\{\{\$env\.AITABLE_BASE_ID\}\}\/\{\{\$env\.(AITABLE_[A-Z_]+)\}\}/g,
    '=https://aitable.ai/fusion/v1/datasheets/{{$env.$1}}/records'
  )
  const obj = JSON.parse(text)
  patchAitableHttpNodes(obj)
  fs.writeFileSync(fp, JSON.stringify(obj, null, 2) + '\n', 'utf8')
  JSON.parse(fs.readFileSync(fp, 'utf8'))
  console.log('patched', f)
}
