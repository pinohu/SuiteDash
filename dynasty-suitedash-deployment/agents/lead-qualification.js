// agents/lead-qualification.js — rule-based lead scoring
const { aitable } = require('./config')

function scoreUrgency(u) {
  const s = String(u || '').toLowerCase()
  if (s.includes('emergency')) return 25
  if (s.includes('this week') || s.includes('this-week')) return 15
  if (s.includes('this month') || s.includes('this-month')) return 10
  if (s.includes('no rush') || s.includes('research')) return 5
  return 5
}

function scoreBudget(b) {
  const s = String(b || '').toLowerCase()
  if (s.includes('premium') || s.includes('commercial')) return 25
  if (s.includes('standard')) return 15
  if (s.includes('budget')) return 10
  return 5
}

function scoreLocation(leadData) {
  if (leadData.in_primary_area === true) return 20
  if (leadData.in_adjacent_area === true) return 10
  return 5
}

function scoreSize(teamSize) {
  const n = Number(teamSize)
  if (n > 50) return 15
  if (n > 10) return 12
  if (n > 2) return 7
  return 3
}

function scoreCompleteness(leadData) {
  const keys = ['name', 'email', 'phone', 'service_type']
  const filled = keys.filter((k) => Boolean(leadData[k])).length
  return Math.round((filled / 4) * 15)
}

async function scoreLoad(leadData) {
  const urgency = scoreUrgency(leadData.urgency)
  const budget = scoreBudget(leadData.budget)
  const location = scoreLocation(leadData)
  const size = scoreSize(leadData.team_size)
  const completeness = scoreCompleteness(leadData)
  const totalScore = urgency + budget + location + size + completeness

  let priority
  if (totalScore >= 80) priority = 'hot'
  else if (totalScore >= 50) priority = 'warm'
  else if (totalScore >= 25) priority = 'cold'
  else priority = 'low_quality'

  let recommended_tier
  let routing_action
  if (priority === 'hot') {
    recommended_tier = 'premium'
    routing_action = 'assign_senior'
  } else if (priority === 'warm') {
    recommended_tier = 'basic'
    routing_action = 'standard_onboarding'
  } else if (priority === 'cold') {
    recommended_tier = 'free'
    routing_action = 'nurture_only'
  } else {
    recommended_tier = 'archive'
    routing_action = 'archive'
  }

  const tableId = process.env.AITABLE_LEAD_SCORES_TABLE
  const contact_email = leadData.email || leadData.contact_email || ''
  const niche = leadData.niche || ''

  await aitable.createRecord(tableId, {
    contact_email,
    niche,
    total_score: totalScore,
    priority,
    recommended_tier,
    routing_action,
    timestamp: new Date().toISOString()
  })

  return {
    score: totalScore,
    priority,
    recommended_tier,
    routing_action,
    scored_at: new Date().toISOString()
  }
}

module.exports = { scoreLoad }
