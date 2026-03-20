// dashboard/server.js — static dashboard + AiTable proxy
const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '..', '.env') })
const express = require('express')
const cors = require('cors')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname)))

app.get('/api/health', (req, res) => {
  const checks = {
    aitableApiKey: Boolean(String(process.env.AITABLE_API_KEY || '').trim()),
    tables: {
      analytics: Boolean(process.env.AITABLE_ANALYTICS_TABLE),
      systemConfig: Boolean(process.env.AITABLE_SYSTEM_CONFIG_TABLE),
      dlq: Boolean(process.env.AITABLE_DLQ_TABLE),
      auditLog: Boolean(process.env.AITABLE_AUDIT_LOG_TABLE)
    },
    n8nWebhook: Boolean(String(process.env.N8N_WEBHOOK_BASE || '').trim())
  }
  const liveCapable =
    checks.aitableApiKey && checks.tables.analytics && checks.tables.systemConfig
  res.json({
    ok: true,
    mode: liveCapable ? 'live' : 'degraded',
    checks,
    time: new Date().toISOString()
  })
})

const AITABLE = 'https://aitable.ai/fusion/v1/datasheets'
const key = process.env.AITABLE_API_KEY

function aitableHeaders() {
  return {
    Authorization: `Bearer ${key}`,
    'Content-Type': 'application/json'
  }
}

function recordsFrom(data) {
  if (!data) return []
  const d = data.data
  if (d && Array.isArray(d.records)) return d.records
  if (Array.isArray(data.records)) return data.records
  return []
}

app.get('/api/analytics', async (req, res) => {
  try {
    const tableId = process.env.AITABLE_ANALYTICS_TABLE
    const { data } = await axios.get(`${AITABLE}/${tableId}/records`, {
      headers: aitableHeaders(),
      params: { pageSize: 100 },
      timeout: 25000
    })
    res.json(data)
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'Analytics fetch failed' })
  }
})

app.get('/api/system-status', async (req, res) => {
  try {
    const tableId = process.env.AITABLE_SYSTEM_CONFIG_TABLE
    const { data } = await axios.get(`${AITABLE}/${tableId}/records`, {
      headers: aitableHeaders(),
      params: { pageSize: 200 },
      timeout: 25000
    })
    res.json(data)
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'System status fetch failed' })
  }
})

app.get('/api/dlq', async (req, res) => {
  try {
    const tableId = process.env.AITABLE_DLQ_TABLE
    const { data } = await axios.get(`${AITABLE}/${tableId}/records`, {
      headers: aitableHeaders(),
      params: { pageSize: 500 },
      timeout: 25000
    })
    const recs = recordsFrom(data)
    const open = recs.filter((r) => String(r.fields?.status || '').toLowerCase() !== 'resolved')
    res.json({ ...data, data: { ...(data.data || {}), records: open } })
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'DLQ fetch failed' })
  }
})

app.get('/api/audit', async (req, res) => {
  try {
    const tableId = process.env.AITABLE_AUDIT_LOG_TABLE
    const { data } = await axios.get(`${AITABLE}/${tableId}/records`, {
      headers: aitableHeaders(),
      params: { pageSize: 100 },
      timeout: 25000
    })
    const recs = recordsFrom(data)
    recs.sort((a, b) => {
      const da = new Date(a.fields?.date || 0).getTime()
      const db = new Date(b.fields?.date || 0).getTime()
      return db - da
    })
    const latest = recs[0] ? [recs[0]] : []
    res.json({ data: { ...(data.data || {}), records: latest } })
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'Audit fetch failed' })
  }
})

app.post('/api/emergency-stop', async (req, res) => {
  try {
    const action = req.body?.action
    if (action !== 'pause' && action !== 'resume') {
      return res.status(400).json({ error: 'body.action must be pause or resume' })
    }
    const tableId = process.env.AITABLE_SYSTEM_CONFIG_TABLE
    const listRes = await axios.get(`${AITABLE}/${tableId}/records`, {
      headers: aitableHeaders(),
      params: { pageSize: 200 },
      timeout: 25000
    })
    const recs = recordsFrom(listRes.data)
    const row = recs.find((r) => String(r.fields?.config_key) === 'system_active')
    if (!row) return res.status(404).json({ error: 'system_active record not found' })
    const recordId = row.recordId || row.id
    const value = action === 'pause' ? 'false' : 'true'
    const { data } = await axios.patch(
      `${AITABLE}/${tableId}/records`,
      {
        records: [
          {
            recordId,
            fields: {
              value,
              updated_at: new Date().toISOString(),
              updated_by: 'dashboard',
              notes: action === 'pause' ? 'Paused via dashboard' : 'Resumed via dashboard'
            }
          }
        ]
      },
      { headers: aitableHeaders(), timeout: 25000 }
    )
    res.json({ ok: true, action, data })
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'Emergency stop failed' })
  }
})

app.post('/api/run-qa-audit', async (req, res) => {
  try {
    const base = process.env.N8N_WEBHOOK_BASE || ''
    const url = `${base.replace(/\/$/, '')}/qa-audit-manual`
    const { data } = await axios.post(url, req.body || {}, { timeout: 30000, validateStatus: () => true })
    res.status(200).json({ ok: true, webhook: url, response: data })
  } catch (e) {
    console.error(e.message)
    res.status(500).json({ error: e.message || 'QA audit webhook failed' })
  }
})

app.listen(3000, () => {
  console.log('Dashboard running on http://localhost:3000')
})
