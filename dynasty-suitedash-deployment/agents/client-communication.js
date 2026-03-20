// agents/client-communication.js — throttle, send window, comms log
const { aitable, recordsFromResponse } = require('./config')

const TRIGGER_TEMPLATES = {
  welcome: { subject: 'Welcome to the directory', message_type: 'welcome' },
  profile_incomplete: { subject: 'Complete your profile', message_type: 'profile_incomplete' },
  engagement_drop: { subject: 'We miss you — re-engage your listing', message_type: 'engagement_drop' },
  milestone: { subject: 'You hit a milestone', message_type: 'milestone' },
  renewal_approaching: { subject: 'Your renewal is coming up', message_type: 'renewal_approaching' },
  renewal_overdue: { subject: 'Renewal overdue — let us help', message_type: 'renewal_overdue' },
  win_back: { subject: 'We would love you back', message_type: 'win_back' },
  re_engagement: { subject: 'Stay visible to new leads', message_type: 're_engagement' }
}

function hourInTimezone(tz) {
  const zone = tz || 'America/New_York'
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: zone,
    hour: 'numeric',
    hour12: false
  }).formatToParts(new Date())
  const h = parts.find((p) => p.type === 'hour')
  return h ? parseInt(h.value, 10) : 12
}

async function sendCommunication(contactId, trigger, context) {
  const tableId = process.env.AITABLE_COMMS_LOG_TABLE
  const data = await aitable.getRecords(tableId, { pageSize: 200 })
  const rows = recordsFromResponse(data)
  const forClient = rows.filter((r) => String(r.fields?.client_id) === String(contactId))
  forClient.sort((a, b) => {
    const ta = new Date(a.fields?.sent_at || 0).getTime()
    const tb = new Date(b.fields?.sent_at || 0).getTime()
    return tb - ta
  })
  const latest = forClient[0]
  if (latest?.fields?.sent_at) {
    const last = new Date(latest.fields.sent_at).getTime()
    if (Date.now() - last < 24 * 60 * 60 * 1000)
      return { sent: false, reason: 'throttled' }
  }

  const hour = hourInTimezone(process.env.DEFAULT_TIMEZONE)
  if (hour < 8 || hour > 20) return { sent: false, reason: 'outside_send_window' }

  const tmpl = TRIGGER_TEMPLATES[trigger] || {
    subject: `Notification: ${trigger}`,
    message_type: trigger
  }
  const subject = tmpl.subject

  await aitable.createRecord(tableId, {
    client_id: String(contactId),
    message_type: trigger,
    channel: 'email',
    subject,
    sent_at: new Date().toISOString(),
    agent_generated: true
  })

  return { sent: true, message_type: trigger, channel: 'email' }
}

module.exports = { sendCommunication }
