# CURSOR: AUTONOMOUS BUILD — DO NOT STOP, DO NOT ASK

You are building a directory business system. Dependencies are installed. Git is initialized. .env has real credentials. All JSON configs are validated.

**RULES: Never ask the user anything. Never stop for permission. If something fails, fix it and keep going. Log what you do to BUILD_LOG.md. When done, write BUILD_COMPLETE.md.**

Read `.cursorrules` for architecture context. Then execute every task below in order.

---

## TASK 1: Create agents/config.js

This is the shared utility module all agents use. Create it with this exact structure:

```javascript
// agents/config.js
require('dotenv').config();
const axios = require('axios');
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// AiTable client
const aitable = {
  base: 'https://aitable.ai/fusion/v1/datasheets',
  headers: { 'Authorization': `Bearer ${process.env.AITABLE_API_KEY}`, 'Content-Type': 'application/json' },

  async getRecords(tableId, params = {}) {
    const res = await axios.get(`${this.base}/${tableId}/records`, { headers: this.headers, params });
    return res.data?.data?.records || [];
  },

  async createRecord(tableId, fields) {
    const res = await axios.post(`${this.base}/${tableId}/records`, {
      records: [{ fields }]
    }, { headers: this.headers });
    return res.data?.data?.records?.[0];
  },

  async updateRecord(tableId, recordId, fields) {
    const res = await axios.patch(`${this.base}/${tableId}/records`, {
      records: [{ recordId, fields }]
    }, { headers: this.headers });
    return res.data?.data?.records?.[0];
  }
};

// SuiteDash client
const suitedash = {
  base: process.env.SUITEDASH_BASE_URL,
  headers: { 'X-Public-ID': process.env.SUITEDASH_API_ID, 'X-Secret-Key': process.env.SUITEDASH_API_SECRET, 'Content-Type': 'application/json' },

  async get(endpoint) {
    const res = await axios.get(`${this.base}${endpoint}`, { headers: this.headers, timeout: 15000 });
    return res.data;
  },

  async post(endpoint, body) {
    const res = await axios.post(`${this.base}${endpoint}`, body, { headers: this.headers, timeout: 15000 });
    return res.data;
  }
};

// Logger - writes to console and appends to BUILD_LOG.md
const fs = require('fs');
function log(phase, message) {
  const line = `[${new Date().toISOString()}] Phase ${phase}: ${message}`;
  console.log(line);
  fs.appendFileSync('BUILD_LOG.md', line + '\n');
}

// OpenAI helper
async function askAgent(systemPrompt, userMessage, functions = null) {
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userMessage }
  ];
  const params = { model: process.env.OPENAI_MODEL || 'gpt-4', messages, max_tokens: 1000 };
  if (functions) params.functions = functions;
  const res = await openai.chat.completions.create(params);
  return res.choices[0].message;
}

module.exports = { openai, aitable, suitedash, log, askAgent };
```

Adapt and improve this code as needed. Add error handling (try/catch with retries). Make sure dotenv loads from the project root.

---

## TASK 2: Create agents/lead-qualification.js

The lead scoring agent. It must:
- Export an async function `scoreLoad(leadData)`
- Calculate: Urgency(max 25) + Budget(max 25) + Location(max 20) + Size(max 15) + Completeness(max 15) = 100
- Return `{ score, priority, recommended_tier, routing_action }`
- Priority: hot (80+), warm (50-79), cold (25-49), low_quality (<25)
- Tier: hot→premium, warm→basic, cold→free, low→archive
- Log the decision to AiTable lead_scores table via config.aitable
- Include the full scoring logic inline — do NOT call OpenAI for basic math

Scoring rules:
```
Urgency: Emergency=25, This Week=15, This Month=10, No Rush=5
Budget: Premium/Commercial=25, Standard=15, Budget=10, Unknown=5
Location: Primary Area=20, Adjacent=10, Out of Area=5
Size: 50+ employees=15, 10-50=12, 2-10=7, Solo=3
Completeness: (filled_required_fields / total_required_fields) * 15
```

---

## TASK 3: Create agents/service-matching.js

Must export async `matchService(leadProfile, nicheId)`:
- Load the niche config from `suitedash/niche_configs/{nicheId}.json`
- Compare lead profile fields against the niche's custom_fields
- Calculate a match score based on field completeness
- Recommend a tier based on score + budget signals
- Return `{ match_score, recommended_tier, missing_fields, reasoning }`
- Log to AiTable via config

---

## TASK 4: Create agents/workflow-orchestrator.js

Must export async `manageWorkflow(contactId, workflowName, action)`:
- Check AiTable workflow_state table for active workflows on this contact
- If action='start': verify no conflicts, create workflow_state record
- If action='complete': update status to completed
- If action='fail': update status to failed, trigger failure-detection
- Prevent duplicate workflows (no two onboarding workflows simultaneously)
- Return `{ allowed, reason, workflow_id }`

---

## TASK 5: Create agents/client-communication.js

Must export async `sendCommunication(contactId, trigger, context)`:
- Check 24h throttle: query AiTable communication_log for last message to this contact
- If sent within 24h, skip (return `{ sent: false, reason: 'throttled' }`)
- Check time window: only send between 8am-8pm in DEFAULT_TIMEZONE
- Select email template based on trigger type (welcome, profile_incomplete, engagement_drop, milestone, renewal_approaching, renewal_overdue, win_back, re_engagement)
- Log to AiTable communication_log
- Return `{ sent: true, message_type, channel }`
- Do NOT actually send email (that's n8n's job) — just log the decision and return the template selection

---

## TASK 6: Create agents/performance-analytics.js

Must export async `calculateMetrics()`:
- Query AiTable clients table for active count, churn count, tier distribution
- Calculate: MRR (sum of tier prices), 30-day churn rate, avg engagement score, onboarding completion rate
- Query DLQ table for open items count
- Query system_config for API usage
- Write summary record to AiTable daily_analytics
- Return the metrics object
- Alert thresholds: churn >5%, engagement <30, DLQ >5, API >80%

---

## TASK 7: Create agents/failure-detection.js

Must export async `handleFailure(failureContext)`:
- Accepts: `{ workflow_name, node_name, error_type, error_message, contact_id }`
- Implements 3x retry with exponential backoff (1min, 5min, 30min)
- If all retries exhausted: log to AiTable DLQ with status 'needs_manual_review'
- Calculate System Health Score: (successful_operations / total_operations) * 100
- Return `{ resolved, retry_count, status, health_score }`

---

## TASK 8: Create agents/qa-audit.js

Must export async `runAudit()`:
- Run these checks:
  1. Contact count match: compare SuiteDash contact count vs AiTable client count (allow 2 variance)
  2. Null engagement scores: count active clients with no score
  3. Stale DLQ: count unresolved items older than 72 hours
  4. Stale workflows: count active workflows with no progress in 14 days
  5. API usage: check if over 80% of monthly limit
- For each: record pass/warn/fail with details
- Auto-fix safe issues (trigger engagement recalc, escalate stale DLQ)
- Write results to AiTable audit_log
- Return `{ checks_run, passed, failed, integrity_score, auto_fixed }`

---

## TASK 9: Create agents/orchestrator.js

The master router. Must export async `handleEvent(event)`:
- Accept: `{ event_type, payload, source }`
- Route to the correct agent based on event_type:
  ```
  kickoff_form_submitted → lead-qualification.scoreLoad
  lead_form_submitted → lead-qualification.scoreLoad
  engagement_score_dropped → client-communication.sendCommunication
  milestone_reached → client-communication.sendCommunication
  subscription_approaching_renewal → client-communication.sendCommunication
  subscription_cancelled → client-communication.sendCommunication (win_back trigger)
  workflow_failed → failure-detection.handleFailure
  payment_failed → failure-detection.handleFailure
  daily_audit → qa-audit.runAudit
  daily_analytics → performance-analytics.calculateMetrics
  ```
- Log every routing decision to AiTable (use the event_log table)
- Return `{ event_type, routed_to, result, timestamp }`

---

## TASK 10: Create agent prompt files

Create these files in `agents/prompts/`:

**agents/prompts/master-prompt.txt:**
```
You are an AI agent in the Dynasty Empire autonomous business system.
Your role: make operational decisions for a multi-niche directory business.
You manage 16 niches across SuiteDash (CRM), AiTable (data), n8n (automation), and Stripe (payments).
Rules: Never leave a task incomplete. Always verify outcomes. Retry failures. Escalate only if necessary.
Optimize for: speed, revenue, reliability.
Context: Engagement Score = (Logins×2)+(ProfileUpdates×3)+(Features×1)+(CommunityPosts×2)+(Tickets×5)-(DaysSinceLogin×1)
Tiers: Free ($0), Basic ($97/mo), Premium ($297/mo).
Always respond with structured JSON.
```

**agents/prompts/lead-scoring.txt:**
Write a prompt that instructs the AI to evaluate a lead and return a JSON score breakdown.

**agents/prompts/communication.txt:**
Write a prompt that instructs the AI to select the appropriate email template and tone based on the trigger type and client context.

---

## TASK 11: Fix AiTable URLs in all n8n workflow JSONs

Scan every file in `n8n/*.json`. Find any URL that contains `api.aitable.com/v0/` or any incorrect AiTable URL pattern. Replace with the correct pattern:

**Correct AiTable API pattern:**
- URL: `https://aitable.ai/fusion/v1/datasheets/{{TABLE_ID}}/records`
- Auth header: `Authorization: Bearer {{AITABLE_API_KEY}}`

Also check that AiTable auth uses `Authorization` header, not `X-API-KEY`. Fix any n8n HTTP Request nodes that use the wrong auth method for AiTable.

After fixing, validate every JSON file still parses correctly.

---

## TASK 12: Create data/ CSV files

Create 12 CSV files in `data/` — one per AiTable table. Each file should have the correct column headers and 1-2 sample rows. Use the schemas from `scripts/setup-aitable.js` (the TABLES array) for the column names.

Files to create:
- data/clients.csv
- data/projects.csv
- data/tasks.csv
- data/engagement_scores.csv
- data/lead_scores.csv
- data/communication_log.csv
- data/workflow_state.csv
- data/dlq.csv
- data/daily_analytics.csv
- data/audit_log.csv
- data/event_log.csv
- data/system_config.csv

---

## TASK 13: Create suitedash/onboarding_flow.json

```json
{
  "name": "Standard Onboarding FLOW",
  "steps": [
    {"order": 1, "type": "form", "name": "Kickoff Form", "description": "Lead fills out niche-specific registration form"},
    {"order": 2, "type": "file_upload", "name": "Upload Business Documents", "description": "License, insurance, certifications"},
    {"order": 3, "type": "file_download", "name": "Download Welcome Package", "description": "Guides, templates, brand assets"},
    {"order": 4, "type": "esigning", "name": "Sign Service Agreement", "description": "Terms of service + membership agreement"},
    {"order": 5, "type": "appointment", "name": "Schedule Portal Training", "description": "30-min walkthrough of the portal"},
    {"order": 6, "type": "checklist", "name": "Go-Live Checklist", "description": "Profile complete, photos uploaded, listing active"}
  ],
  "triggers_on_complete": ["Move to Active circle", "Start engagement scoring", "Fire n8n onboarding webhook"],
  "per_niche_customization": "Replace Kickoff Form fields with niche-specific fields from niche_configs/{niche}.json"
}
```

---

## TASK 14: Upgrade dashboard to use real data

Open `dashboard/index.html`. Create a companion file `dashboard/server.js` — a lightweight Express server:

```javascript
// dashboard/server.js
require('dotenv').config({ path: '../env/.env' });
const express = require('express');
const axios = require('axios');
const path = require('path');
const app = express();

const AITABLE_BASE = 'https://aitable.ai/fusion/v1/datasheets';
const headers = { 'Authorization': `Bearer ${process.env.AITABLE_API_KEY}` };

app.use(express.static(__dirname));
app.use(express.json());

app.get('/api/analytics', async (req, res) => {
  try {
    const r = await axios.get(`${AITABLE_BASE}/${process.env.AITABLE_ANALYTICS_TABLE}/records`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.get('/api/system-status', async (req, res) => {
  try {
    const r = await axios.get(`${AITABLE_BASE}/${process.env.AITABLE_SYSTEM_CONFIG_TABLE}/records`, { headers });
    res.json(r.data);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.post('/api/emergency-stop', async (req, res) => {
  try {
    const { action } = req.body; // 'pause' or 'resume'
    // Get the system_active record, then update it
    const records = await axios.get(`${AITABLE_BASE}/${process.env.AITABLE_SYSTEM_CONFIG_TABLE}/records`, { headers });
    const record = records.data?.data?.records?.find(r => r.fields.config_key === 'system_active');
    if (record) {
      await axios.patch(`${AITABLE_BASE}/${process.env.AITABLE_SYSTEM_CONFIG_TABLE}/records`, {
        records: [{ recordId: record.recordId, fields: { value: action === 'pause' ? 'false' : 'true', updated_at: new Date().toISOString() }}]
      }, { headers: { ...headers, 'Content-Type': 'application/json' }});
    }
    res.json({ success: true, action });
  } catch (e) { res.status(500).json({ error: e.message }); }
});

app.listen(3000, () => console.log('Dashboard running on http://localhost:3000'));
```

Create `dashboard/package.json`:
```json
{"name": "dynasty-dashboard", "dependencies": {"express": "^4.19.0", "axios": "^1.7.0", "dotenv": "^16.4.0"}}
```

Then update `dashboard/index.html` to fetch from `/api/analytics` and `/api/system-status` instead of using `generateDemoData()`. Keep the demo data as a fallback if the API calls fail.

Add an Emergency Stop toggle button that calls `/api/emergency-stop`.

---

## TASK 15: Create the test suite

Create `tests/test-workflows.js`:
- Load all 9 files from n8n/*.json
- Parse each, verify it has: name, nodes (array with length > 0), connections (object), settings
- Exit 0 if all pass, exit 1 if any fail

Create `tests/test-niche-configs.js`:
- Load all 16 files from suitedash/niche_configs/*.json
- Verify each has: niche_id, display_name, offer_structure, custom_fields, sales_pipeline, service_pipeline, circles (length 5), kickoff_form, project_template
- Exit 0/1

Create `tests/test-agents.js`:
- Require each agent module from agents/
- Call lead-qualification with a mock hot lead: `{ urgency: 'Emergency', budget: 'Premium', in_primary_area: true, team_size: 60, name: 'Test', email: 'test@test.com', phone: '555-0100', service_type: 'Commercial' }`
- Verify score >= 80 and priority === 'hot'
- Call with a cold lead and verify score < 50
- Test orchestrator routing: send a kickoff_form_submitted event, verify it routes to lead-qualification
- Exit 0/1

Create `tests/test-connections.js`:
- Test each API with a lightweight read call (wrapped in try/catch with 5s timeout)
- Report pass/fail per service
- Exit 0 if all pass, exit 1 if any fail (but don't exit 1 for unreachable services — just report them)

Update package.json scripts:
```json
"test": "node tests/test-workflows.js && node tests/test-niche-configs.js",
"test:agents": "node tests/test-agents.js",
"test:api": "node tests/test-connections.js",
"test:all": "npm test && npm run test:agents"
```

Run `npm test` after creating the files. Fix any failures.

---

## TASK 16: Create README.md

Write a README with:
- Project name and 1-paragraph description
- Architecture diagram using Mermaid showing: SuiteDash ↔ n8n ↔ AiTable ↔ Agents ↔ Stripe
- Quick start (5 steps: clone, npm install, configure .env, run bootstrap, run tests)
- File structure explanation
- How to deploy a niche: `node scripts/deploy-niche.js plumbing`
- How to use emergency stop: `node scripts/emergency-stop.js pause`
- How to run dashboard: `cd dashboard && npm install && node server.js`
- List of all 16 niches

---

## TASK 17: Git commit and write BUILD_COMPLETE.md

1. Run `npm test` one final time
2. Verify all files exist: `agents/config.js`, `agents/orchestrator.js`, `agents/lead-qualification.js`, `agents/service-matching.js`, `agents/workflow-orchestrator.js`, `agents/client-communication.js`, `agents/performance-analytics.js`, `agents/failure-detection.js`, `agents/qa-audit.js`, `dashboard/server.js`, `dashboard/package.json`, 12 CSV files in `data/`, `suitedash/onboarding_flow.json`, `tests/` directory with 4 test files, `README.md`
3. Run `node --check` on every .js file in agents/ and scripts/ and tests/ to verify no syntax errors
4. Git add and commit: `git add -A && git commit -m "BUILD COMPLETE: Full Dynasty Empire deployment system"`
5. Write BUILD_COMPLETE.md with:
   - Total files created
   - Tests passed/failed
   - List of any issues or manual steps needed
   - Recommended next actions

---

**START NOW. DO NOT STOP UNTIL TASK 17 IS COMPLETE.**
