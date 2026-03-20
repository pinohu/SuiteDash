#!/usr/bin/env node
// tests/test-connections.js — informational connectivity checks (always exit 0)
const path = require('path')
const root = path.join(__dirname, '..')
require('dotenv').config({ path: path.join(root, '.env') })
require('dotenv').config({ path: path.join(root, 'env', '.env') })
const axios = require('axios')

async function run() {
  const t = { timeout: 5000 }

  try {
    await axios.get(`${process.env.SUITEDASH_BASE_URL}/contacts`, {
      headers: {
        'X-Public-ID': (process.env.SUITEDASH_API_ID || '').trim(),
        'X-Secret-Key': (process.env.SUITEDASH_API_SECRET || '').trim()
      },
      params: { limit: 1 },
      ...t
    })
    console.log('SuiteDash: CONNECTED')
  } catch (e) {
    console.log('SuiteDash: FAILED', e.message)
  }

  try {
    await axios.get('https://aitable.ai/fusion/v1/spaces', {
      headers: { Authorization: `Bearer ${process.env.AITABLE_API_KEY}` },
      ...t
    })
    console.log('AiTable: CONNECTED')
  } catch (e) {
    console.log('AiTable: FAILED', e.message)
  }

  try {
    const oa = (process.env.OPENAI_API_KEY || '').trim()
    await axios.get('https://api.openai.com/v1/models', {
      headers: { Authorization: `Bearer ${oa}` },
      ...t
    })
    console.log('OpenAI: CONNECTED')
  } catch (e) {
    console.log('OpenAI: FAILED', e.message)
  }

  try {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    await stripe.balance.retrieve()
    console.log('Stripe: CONNECTED')
  } catch (e) {
    console.log('Stripe: FAILED', e.message)
  }

  try {
    await axios.get(`${process.env.N8N_BASE_URL}/api/v1/workflows`, {
      headers: {
        'X-N8N-API-KEY': process.env.N8N_API_KEY,
        'CF-Access-Client-Id': process.env.N8N_CF_ACCESS_CLIENT_ID,
        'CF-Access-Client-Secret': process.env.N8N_CF_ACCESS_CLIENT_SECRET
      },
      ...t
    })
    console.log('n8n: CONNECTED')
  } catch (e) {
    console.log('n8n: FAILED', e.message)
  }
}

run().then(() => process.exit(0))
