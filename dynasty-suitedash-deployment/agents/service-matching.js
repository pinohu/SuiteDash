// agents/service-matching.js — niche config vs lead profile coverage
const fs = require('fs')
const path = require('path')

function fieldKey(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
}

function leadHasField(leadProfile, fieldName) {
  const keys = [fieldName, fieldKey(fieldName)]
  for (const k of Object.keys(leadProfile || {})) {
    if (keys.includes(k)) return Boolean(leadProfile[k])
    if (fieldKey(k) === fieldKey(fieldName)) return Boolean(leadProfile[k])
  }
  for (const key of keys) {
    if (leadProfile && leadProfile[key] != null && leadProfile[key] !== '') return true
  }
  return false
}

async function matchService(leadProfile, nicheId) {
  const filepath = path.join(__dirname, '..', 'suitedash', 'niche_configs', `${nicheId}.json`)
  if (!fs.existsSync(filepath)) {
    return {
      match_score: 0,
      recommended_tier: 'free',
      missing_fields: [],
      reasoning: `Niche config not found for "${nicheId}".`
    }
  }

  const config = JSON.parse(fs.readFileSync(filepath, 'utf8'))
  const customFields = Array.isArray(config.custom_fields) ? config.custom_fields : []
  const total = customFields.length
  if (total === 0) {
    return {
      match_score: 100,
      recommended_tier: 'premium',
      missing_fields: [],
      reasoning: 'No custom fields defined for this niche; full match by definition.'
    }
  }

  let matched = 0
  const missing_fields = []
  for (const f of customFields) {
    const name = f.name
    if (leadHasField(leadProfile, name)) matched++
    else missing_fields.push(name)
  }

  const match_score = Math.round((matched / total) * 100)
  let recommended_tier = 'free'
  if (match_score >= 80) recommended_tier = 'premium'
  else if (match_score >= 50) recommended_tier = 'basic'

  const reasoning = `Matched ${matched} of ${total} niche custom fields (${match_score}%). Missing: ${missing_fields.length ? missing_fields.join(', ') : 'none'}.`

  return { match_score, recommended_tier, missing_fields, reasoning }
}

module.exports = { matchService }
