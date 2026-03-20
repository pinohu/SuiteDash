// agents/workflow-orchestrator.js — duplicate detection and workflow state
const { aitable, recordsFromResponse } = require('./config')

function firstRecordId(data) {
  const recs = recordsFromResponse(data)
  return recs[0]?.recordId || recs[0]?.id || null
}

async function listWorkflowRows() {
  const tableId = process.env.AITABLE_WORKFLOW_STATE_TABLE
  const data = await aitable.getRecords(tableId, { pageSize: 500 })
  return recordsFromResponse(data)
}

async function manageWorkflow(contactId, workflowName, action) {
  const tableId = process.env.AITABLE_WORKFLOW_STATE_TABLE
  const now = new Date().toISOString()

  if (action === 'start') {
    const rows = await listWorkflowRows()
    const dup = rows.find(
      (r) =>
        String(r.fields?.client_id) === String(contactId) &&
        String(r.fields?.workflow_name) === String(workflowName) &&
        String(r.fields?.status) === 'active'
    )
    if (dup) return { allowed: false, reason: 'Duplicate workflow' }

    const created = await aitable.createRecord(tableId, {
      client_id: String(contactId),
      workflow_name: String(workflowName),
      status: 'active',
      started_at: now,
      current_step: 1,
      total_steps: 1,
      last_step_at: now
    })
    const newId = firstRecordId(created)
    return { allowed: true, workflow_id: newId }
  }

  if (action === 'complete' || action === 'fail') {
    const rows = await listWorkflowRows()
    const row = rows.find(
      (r) =>
        String(r.fields?.client_id) === String(contactId) &&
        String(r.fields?.workflow_name) === String(workflowName) &&
        String(r.fields?.status) === 'active'
    )
    if (!row) return { allowed: false, reason: 'No active workflow found' }

    const recordId = row.recordId || row.id
    const status = action === 'complete' ? 'completed' : 'failed'
    await aitable.updateRecord(tableId, recordId, {
      status,
      last_step_at: now
    })
    return { allowed: true, workflow_id: recordId, status }
  }

  return { allowed: false, reason: 'Invalid action' }
}

module.exports = { manageWorkflow }
