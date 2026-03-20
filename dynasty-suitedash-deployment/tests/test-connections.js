#!/usr/bin/env node
// tests/test-connections.js — connectivity checks for go-live
// Default: exit 0 (informational). Use --strict for CI (exit 1 if any check fails).
// TEST_ALLOW_INSECURE_TLS=1 or --insecure-tls: relax TLS for n8n (debug only).
const path = require('path')
const https = require('https')
const root = path.join(__dirname, '..')
require('dotenv').config({ path: path.join(root, '.env') })
require('dotenv').config({ path: path.join(root, 'env', '.env') })
const axios = require('axios')

const args = process.argv.slice(2)
const strict = args.includes('--strict')
const skipTlsVerify =
  process.env.TEST_ALLOW_INSECURE_TLS === '1' ||
  process.env.TEST_ALLOW_INSECURE_TLS === 'true' ||
  args.includes('--insecure-tls')

const httpsAgent = skipTlsVerify ? new https.Agent({ rejectUnauthorized: false }) : undefined
const t = { timeout: 12000, httpsAgent }

const results = []

function envTierA() {
  const pairs = [
    ['SUITEDASH_BASE_URL', process.env.SUITEDASH_BASE_URL],
    ['SUITEDASH_API_ID', process.env.SUITEDASH_API_ID],
    ['SUITEDASH_API_SECRET', process.env.SUITEDASH_API_SECRET],
    ['AITABLE_API_KEY', process.env.AITABLE_API_KEY],
    ['OPENAI_API_KEY', process.env.OPENAI_API_KEY],
    ['STRIPE_SECRET_KEY', process.env.STRIPE_SECRET_KEY],
    ['N8N_BASE_URL', process.env.N8N_BASE_URL],
    ['N8N_API_KEY', process.env.N8N_API_KEY]
  ]
  const missing = pairs.filter(([, v]) => !String(v || '').trim()).map(([k]) => k)
  return { missing, pairs }
}

function logCheck(name, ok, detail = '') {
  results.push({ name, ok })
  const tag = ok ? 'OK' : 'FAIL'
  console.log(`${name}: ${tag}${detail ? ` — ${detail}` : ''}`)
}

async function run() {
  console.log('--- Connection check (dynasty-suitedash-deployment) ---')
  if (skipTlsVerify) {
    console.log('WARNING: TLS verification disabled (TEST_ALLOW_INSECURE_TLS or --insecure-tls)\n')
  }

  const { missing, pairs } = envTierA()
  if (missing.length) {
    logCheck('Env (Tier A keys present)', false, `missing: ${missing.join(', ')}`)
  } else {
    logCheck('Env (Tier A keys present)', true, `${pairs.length} variables set`)
  }

  const sdBase = String(process.env.SUITEDASH_BASE_URL || '').replace(/\/$/, '')
  const sdId = String(process.env.SUITEDASH_API_ID || '').trim()
  const sdSecret = String(process.env.SUITEDASH_API_SECRET || '').trim()
  if (sdBase && sdId && sdSecret) {
    try {
      const res = await axios.get(`${sdBase}/contacts`, {
        headers: { 'X-Public-ID': sdId, 'X-Secret-Key': sdSecret },
        params: { limit: 1 },
        validateStatus: () => true,
        ...t
      })
      const ok = res.status === 200
      logCheck('SuiteDash', ok, ok ? `HTTP ${res.status}` : `HTTP ${res.status} ${truncate(res.data)}`)
    } catch (e) {
      logCheck('SuiteDash', false, e.message)
    }
  } else {
    logCheck('SuiteDash', false, 'skipped (incomplete env)')
  }

  const atKey = process.env.AITABLE_API_KEY
  if (atKey) {
    try {
      const res = await axios.get('https://aitable.ai/fusion/v1/spaces', {
        headers: { Authorization: `Bearer ${atKey}` },
        validateStatus: () => true,
        ...t
      })
      const ok = res.status === 200 && res.data?.success !== false
      logCheck('AiTable', ok, ok ? `HTTP ${res.status}` : `HTTP ${res.status} ${truncate(res.data)}`)
    } catch (e) {
      logCheck('AiTable', false, e.message)
    }
  } else {
    logCheck('AiTable', false, 'skipped (no AITABLE_API_KEY)')
  }

  const oa = String(process.env.OPENAI_API_KEY || '').trim()
  if (oa) {
    try {
      const res = await axios.get('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${oa}` },
        params: { limit: 1 },
        validateStatus: () => true,
        ...t
      })
      const ok = res.status === 200
      logCheck('OpenAI', ok, ok ? `HTTP ${res.status}` : `HTTP ${res.status}`)
    } catch (e) {
      logCheck('OpenAI', false, e.message)
    }
  } else {
    logCheck('OpenAI', false, 'skipped (no OPENAI_API_KEY)')
  }

  const sk = process.env.STRIPE_SECRET_KEY
  if (sk) {
    try {
      const stripe = require('stripe')(sk)
      await stripe.balance.retrieve()
      logCheck('Stripe', true, 'balance.retrieve OK')
    } catch (e) {
      logCheck('Stripe', false, e.message)
    }
  } else {
    logCheck('Stripe', false, 'skipped (no STRIPE_SECRET_KEY)')
  }

  const n8nUrl = String(process.env.N8N_BASE_URL || '').replace(/\/$/, '')
  const n8nKey = process.env.N8N_API_KEY
  if (n8nUrl && n8nKey) {
    try {
      const headers = {
        'X-N8N-API-KEY': n8nKey,
        'CF-Access-Client-Id': process.env.N8N_CF_ACCESS_CLIENT_ID || '',
        'CF-Access-Client-Secret': process.env.N8N_CF_ACCESS_CLIENT_SECRET || ''
      }
      const res = await axios.get(`${n8nUrl}/api/v1/workflows`, {
        headers,
        validateStatus: () => true,
        ...t
      })
      const ok = res.status === 200
      logCheck('n8n', ok, ok ? `HTTP ${res.status}` : `HTTP ${res.status} ${truncate(res.data)}`)
    } catch (e) {
      logCheck('n8n', false, e.message)
    }
  } else {
    logCheck('n8n', false, 'skipped (incomplete N8N_* env)')
  }

  const failed = results.filter((r) => !r.ok).length
  const envOk = missing.length === 0
  console.log('---')
  console.log(`Summary: ${results.length - failed}/${results.length} checks passed${!envOk ? ' (env incomplete)' : ''}`)
  if (strict && (failed > 0 || !envOk)) {
    console.error('Strict mode: exiting with code 1')
    process.exit(1)
  }
  process.exit(0)
}

function truncate(x) {
  if (x == null) return ''
  const s = typeof x === 'string' ? x : JSON.stringify(x)
  return s.length > 120 ? `${s.slice(0, 117)}...` : s
}

run().catch((e) => {
  console.error('test-connections fatal:', e.message)
  process.exit(strict ? 1 : 0)
})
