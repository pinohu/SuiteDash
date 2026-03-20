# DYNASTY EMPIRE — STEP-BY-STEP RUNBOOK
## 4 Steps. Copy-paste each one. Wait for it to finish. Move to the next.

---

# STEP 1: BOOTSTRAP (Run in your terminal — NOT in Cursor)

Open a terminal/PowerShell in `C:\Users\ohu001\Desktop\SuiteDash\dynasty-suitedash-deployment` and run these commands one by one:

```
npm install
```

```
copy env\.env .env
```

```
mkdir agents\prompts tests data
```

```
git init
git add -A
git commit -m "Initial state before build"
```

When all 4 succeed, open the folder in Cursor and move to Step 2.

---

# STEP 2: CURSOR PROMPT — Agent Layer (paste into Cursor Agent/Composer)

```
You are building Node.js agent modules for a directory business system. Do not ask me anything. Create every file listed below. Use require('dotenv').config() at the top of config.js. Use require('axios') for HTTP calls. Use require('openai') for AI calls. All credentials are in .env at the project root.

READ .cursorrules for architecture context. Then create these files:

FILE 1: agents/config.js
Shared utility module. Must export: { aitable, suitedash, openai, log, askAgent }

- aitable object with methods:
  - getRecords(tableId, params) — GET https://aitable.ai/fusion/v1/datasheets/{tableId}/records with Authorization Bearer header using process.env.AITABLE_API_KEY
  - createRecord(tableId, fields) — POST to same URL, body: { records: [{ fields }] }
  - updateRecord(tableId, recordId, fields) — PATCH to same URL, body: { records: [{ recordId, fields }] }

- suitedash object with methods:
  - get(endpoint) — GET to process.env.SUITEDASH_BASE_URL + endpoint, header X-API-KEY: process.env.SUITEDASH_API_SECRET
  - post(endpoint, body) — POST same pattern

- openai: initialized OpenAI client using process.env.OPENAI_API_KEY

- log(phase, message): prints timestamped message and appends to BUILD_LOG.md

- askAgent(systemPrompt, userMessage): calls openai.chat.completions.create with gpt-4, returns the message content

Wrap all HTTP calls in try/catch. On error, log the error and return null (don't throw).

FILE 2: agents/lead-qualification.js
Export async function scoreLoad(leadData).
Score formula — all pure JS math, no AI call needed:
  Urgency: Emergency=25, This Week=15, This Month=10, No Rush=5, default=5
  Budget: Premium or Commercial=25, Standard=15, Budget=10, default=5
  Location: in_primary_area=true → 20, in_adjacent_area=true → 10, default=5
  Size: team_size>50 → 15, >10 → 12, >2 → 7, default=3
  Completeness: count how many of [name, email, phone, service_type] are truthy, divide by 4, multiply by 15, round

  totalScore = urgency + budget + location + size + completeness

  priority: >=80 'hot', >=50 'warm', >=25 'cold', else 'low_quality'
  tier: hot→'premium', warm→'basic', cold→'free', low→'archive'
  action: hot→'assign_senior', warm→'standard_onboarding', cold→'nurture_only', low→'archive'

  Log to AiTable using config.aitable.createRecord(process.env.AITABLE_LEAD_SCORES_TABLE, { contact_email, niche, total_score, priority, recommended_tier, routing_action, timestamp })

  Return { score: totalScore, priority, recommended_tier, routing_action, scored_at }

FILE 3: agents/service-matching.js
Export async function matchService(leadProfile, nicheId).
  Load niche config from suitedash/niche_configs/{nicheId}.json using fs.readFileSync + JSON.parse
  Get the niche's custom_fields array
  Count how many custom_fields the lead has data for → match_score = (matched / total) * 100
  Recommend tier: match_score >= 80 → premium, >= 50 → basic, else → free
  Find missing_fields = custom fields the lead didn't provide
  Return { match_score, recommended_tier, missing_fields, reasoning: string explaining the match }

FILE 4: agents/workflow-orchestrator.js
Export async function manageWorkflow(contactId, workflowName, action).
  action can be 'start', 'complete', or 'fail'
  On 'start': query AiTable workflow_state table for active workflows where client_id = contactId. If any active workflow exists with same name, return { allowed: false, reason: 'Duplicate workflow' }. Otherwise create a new record with status='active', return { allowed: true, workflow_id: newRecord.recordId }
  On 'complete': find the record, update status to 'completed', set completed timestamp
  On 'fail': find the record, update status to 'failed'

FILE 5: agents/client-communication.js
Export async function sendCommunication(contactId, trigger, context).
  trigger is one of: welcome, profile_incomplete, engagement_drop, milestone, renewal_approaching, renewal_overdue, win_back, re_engagement

  Step 1: Check throttle — query AiTable communication_log where client_id = contactId, sort by sent_at desc, get latest. If sent within last 24 hours, return { sent: false, reason: 'throttled' }

  Step 2: Check time window — get current hour in process.env.DEFAULT_TIMEZONE (use Intl.DateTimeFormat). If before 8 or after 20, return { sent: false, reason: 'outside_send_window' }

  Step 3: Select template — map trigger to a subject line and message type string

  Step 4: Log to AiTable communication_log: { client_id: contactId, message_type: trigger, channel: 'email', subject, sent_at: new Date().toISOString(), agent_generated: true }

  Return { sent: true, message_type: trigger, channel: 'email' }

FILE 6: agents/performance-analytics.js
Export async function calculateMetrics().
  Query AiTable clients table — count total, count where lifecycle_stage='active', count where lifecycle_stage='churned'
  Calculate churn_rate = churned / (active + churned) * 100
  Query engagement_scores table — calculate average of calculated_score field
  Query dlq table — count where status != 'resolved'
  Query system_config — get api_calls_this_month value
  Build metrics object: { date, total_active, churned_members, churn_rate_30d, avg_engagement_score, dlq_items_open, api_calls_used, api_calls_limit: 2000 }
  Create record in AiTable daily_analytics table
  Return metrics

FILE 7: agents/failure-detection.js
Export async function handleFailure(context).
  context: { workflow_name, node_name, error_type, error_message, contact_id, retry_count }
  If retry_count < 3: return { resolved: false, status: 'retrying', retry_count: retry_count + 1, backoff_minutes: [1, 5, 30][retry_count] }
  If retry_count >= 3: log to AiTable dlq table with status 'needs_manual_review', return { resolved: false, status: 'needs_manual_review', retry_count }

FILE 8: agents/qa-audit.js
Export async function runAudit().
  Run 5 checks, collect results:
  Check 1: SuiteDash contact count vs AiTable client count — pass if difference <= 2
  Check 2: Query engagement_scores for records with no calculated_score on active clients — pass if count = 0
  Check 3: Query dlq for unresolved items — pass if count = 0
  Check 4: Query workflow_state for active workflows with no update in 14+ days — pass if count = 0
  Check 5: Get api_calls_this_month from system_config, compare to limit — pass if under 80%
  Calculate integrity_score = (passed / total_checks) * 100
  Log to AiTable audit_log table
  Return { checks_run: 5, passed, failed, integrity_score, details: array of check results }

FILE 9: agents/orchestrator.js
Export async function handleEvent(event).
  event: { event_type, payload, source }
  Routing table:
    kickoff_form_submitted → require('./lead-qualification').scoreLoad(event.payload)
    lead_form_submitted → require('./lead-qualification').scoreLoad(event.payload)
    engagement_score_dropped → require('./client-communication').sendCommunication(event.payload.contact_id, 'engagement_drop', event.payload)
    milestone_reached → require('./client-communication').sendCommunication(event.payload.contact_id, 'milestone', event.payload)
    subscription_cancelled → require('./client-communication').sendCommunication(event.payload.contact_id, 'win_back', event.payload)
    workflow_failed → require('./failure-detection').handleFailure(event.payload)
    payment_failed → require('./failure-detection').handleFailure(event.payload)
    daily_audit → require('./qa-audit').runAudit()
    daily_analytics → require('./performance-analytics').calculateMetrics()
    default → log('orchestrator', 'Unknown event type: ' + event.event_type)

  Log the routing decision to AiTable event_log table: { event_type, routed_to: agentName, timestamp, status: 'routed', source: event.source }
  Return { event_type: event.event_type, routed_to: agentName, result, timestamp }

FILE 10: agents/prompts/master-prompt.txt
Content:
"You are an AI agent in the Dynasty Empire autonomous business system. Your role: make operational decisions for a multi-niche directory business. You manage 16 niches across SuiteDash (CRM), AiTable (data), n8n (automation), and Stripe (payments). Rules: Never leave a task incomplete. Always verify outcomes. Retry failures up to 3 times. Escalate only after all retries exhausted. Optimize for speed, revenue, and reliability. Engagement Score formula: (Logins*2)+(ProfileUpdates*3)+(Features*1)+(CommunityPosts*2)+(Tickets*5)-(DaysSinceLogin*1). Tiers: Free ($0), Basic ($97/mo), Premium ($297/mo). Always respond with structured JSON."

After creating all 10 files, run: node --check agents/config.js agents/lead-qualification.js agents/service-matching.js agents/workflow-orchestrator.js agents/client-communication.js agents/performance-analytics.js agents/failure-detection.js agents/qa-audit.js agents/orchestrator.js

Fix any syntax errors. Then git add -A && git commit -m "Phase: Agent layer complete"
```

---

# STEP 3: CURSOR PROMPT — Workflows, Data, Dashboard (paste into Cursor Agent/Composer)

```
You are continuing a build. Do not ask me anything. Read .cursorrules for context. Create every file listed below.

TASK A: Fix AiTable URLs in all n8n workflow JSONs

Read every JSON file in the n8n/ directory. Find and replace any incorrect AiTable API URLs:
- WRONG: https://api.aitable.com/v0/{baseId}/{tableId}
- WRONG: any URL with "aitable.com"
- RIGHT: https://aitable.ai/fusion/v1/datasheets/{{$env.AITABLE_xxx_TABLE}}/records

Also ensure AiTable authentication in n8n HTTP Request nodes uses:
- Header name: Authorization
- Header value: Bearer {{$env.AITABLE_API_KEY}}
NOT X-API-KEY.

After fixing, verify every JSON file parses correctly with JSON.parse. Fix any broken JSON.

TASK B: Create 12 CSV files in data/

Each file has headers matching the AiTable table schema and 2 sample rows. Create these files:

data/clients.csv — columns: client_id,suitedash_id,name,email,company,niche,membership_tier,lifecycle_stage,engagement_score,churn_risk,ltv,acquisition_channel,onboarding_complete,days_since_login,signup_date,renewal_date,stripe_customer_id,coordinator,directory_source,nps_score

data/projects.csv — columns: project_id,suitedash_id,client_id,name,niche,status,template_used,start_date,target_end_date,actual_end_date,progress_pct,assigned_to

data/tasks.csv — columns: task_id,project_id,client_id,name,status,assigned_to,due_date,completed_date,order,phase

data/engagement_scores.csv — columns: record_id,client_id,date,logins,profile_updates,features_used,community_posts,support_tickets,days_since_login,calculated_score,previous_score,score_change,risk_level,action_triggered

data/lead_scores.csv — columns: record_id,contact_id,form_source,niche,urgency_score,budget_score,location_score,size_score,completeness_score,total_score,priority,recommended_tier,routing_action,timestamp,outcome,conversion_days

data/communication_log.csv — columns: record_id,client_id,message_type,channel,subject,sent_at,opened,opened_at,clicked,clicked_at,replied,agent_generated,sequence_name

data/workflow_state.csv — columns: record_id,client_id,workflow_name,status,started_at,current_step,total_steps,last_step_at,next_step_at,priority,conflict_check

data/dlq.csv — columns: record_id,workflow_name,node_name,error_type,error_message,contact_id,payload_summary,retry_count,max_retries,first_failure,last_retry,status,resolved_at,resolved_by,resolution_notes

data/daily_analytics.csv — columns: date,total_mrr,new_members,churned_members,churn_rate_30d,total_active,avg_engagement_score,dlq_items_open,failed_payments_24h,onboarding_completion_rate,support_tickets_open,top_niche,worst_niche,api_calls_used,api_calls_limit

data/audit_log.csv — columns: audit_id,date,checks_run,checks_passed,checks_failed,anomalies_found,auto_fixed_count,escalated_count,system_integrity_score,run_duration_seconds,notes

data/event_log.csv — columns: event_id,event_type,contact_id,timestamp,status,routed_to,replayed_at,source

data/system_config.csv — columns: config_key,value,updated_at,updated_by,notes

Add 2 realistic sample rows per file with plumbing niche test data.

TASK C: Create suitedash/onboarding_flow.json

Create this file:
{
  "name": "Standard Onboarding FLOW",
  "steps": [
    {"order": 1, "type": "form", "name": "Kickoff Form", "description": "Niche-specific registration form"},
    {"order": 2, "type": "file_upload", "name": "Upload Business Documents", "description": "License, insurance, certifications"},
    {"order": 3, "type": "file_download", "name": "Download Welcome Package", "description": "Guides, templates, brand assets"},
    {"order": 4, "type": "esigning", "name": "Sign Service Agreement", "description": "Terms of service and membership agreement"},
    {"order": 5, "type": "appointment", "name": "Schedule Portal Training", "description": "30-minute walkthrough of the portal"},
    {"order": 6, "type": "checklist", "name": "Go-Live Checklist", "description": "Profile complete, photos uploaded, listing active"}
  ],
  "triggers_on_complete": ["Move to Active circle", "Start engagement scoring", "Fire n8n onboarding webhook"]
}

TASK D: Create dashboard/server.js

A lightweight Express server that proxies AiTable API calls. Must:
- require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') })
- Create Express app on port 3000
- Serve dashboard/ directory as static files
- Routes:
  GET /api/analytics → proxy to AiTable daily_analytics table
  GET /api/system-status → proxy to AiTable system_config table
  GET /api/dlq → proxy to AiTable dlq table (filter: status != resolved)
  GET /api/audit → proxy to AiTable audit_log table (sort by date desc, limit 1)
  POST /api/emergency-stop → read body.action ('pause' or 'resume'), find system_active record, PATCH it to 'false' or 'true'
- All AiTable calls use: base URL https://aitable.ai/fusion/v1/datasheets/{TABLE_ID}/records, Authorization Bearer header
- Handle errors: return { error: message } with status 500
- Console.log "Dashboard running on http://localhost:3000" on startup

TASK E: Create dashboard/package.json

{ "name": "dynasty-dashboard", "private": true, "dependencies": { "express": "^4.19.0", "axios": "^1.7.0", "cors": "^2.8.5", "dotenv": "^16.4.0" } }

TASK F: Update dashboard/index.html

Replace the generateDemoData() function. Instead:
- On page load, call fetch('/api/analytics'), fetch('/api/system-status'), fetch('/api/dlq')
- If any fetch fails, fall back to demo data (keep generateDemoData as fallback)
- Add an Emergency Stop toggle button in the header:
  - Green when system is active, red when paused
  - On click: POST /api/emergency-stop with action 'pause' or 'resume'
  - Update the status dot and text
- Add a "Run QA Audit" button that POST to the n8n webhook URL for qa-audit

After creating all files, run: node --check dashboard/server.js
Fix any syntax errors. Then git add -A && git commit -m "Phase: Workflows, data, and dashboard complete"
```

---

# STEP 4: CURSOR PROMPT — Tests, README, Final (paste into Cursor Agent/Composer)

```
You are finishing a build. Do not ask me anything. Read .cursorrules for context. Create every file listed below.

TASK A: Create tests/test-workflows.js

Load every .json file in n8n/ directory using fs.readdirSync + JSON.parse. For each file verify:
- Has 'name' property (string)
- Has 'nodes' property (array with length > 0)
- Has 'connections' property (object)
- Has 'settings' property (object)
Print pass/fail per file. Exit 0 if all pass, exit 1 if any fail.

TASK B: Create tests/test-niche-configs.js

Load every .json file in suitedash/niche_configs/ directory. For each verify:
- Has niche_id (string)
- Has display_name (string)
- Has offer_structure with setup_fee (number) and basic_monthly (number) and premium_monthly (number)
- Has custom_fields (array, length > 0)
- Has sales_pipeline with stages (array)
- Has service_pipeline with stages (array)
- Has circles (array, length === 5)
- Has kickoff_form with fields (array)
- Has project_template with tasks (array)
Print pass/fail per file. Exit 0 if all pass, exit 1 if any fail.

TASK C: Create tests/test-agents.js

Require each agent module. Test with mock data (do NOT call live APIs — mock the config.aitable methods):

Before tests, monkey-patch config.aitable to return fake data:
const config = require('../agents/config');
config.aitable.getRecords = async () => [];
config.aitable.createRecord = async (t, f) => ({ recordId: 'rec_test', fields: f });
config.aitable.updateRecord = async (t, id, f) => ({ recordId: id, fields: f });

Test 1: Lead qualification with hot lead
const lq = require('../agents/lead-qualification');
const hotResult = await lq.scoreLoad({ urgency: 'Emergency', budget: 'Premium', in_primary_area: true, team_size: 60, name: 'Test', email: 'test@test.com', phone: '555-0100', service_type: 'Commercial' });
Assert hotResult.score >= 80 and hotResult.priority === 'hot'

Test 2: Lead qualification with cold lead
const coldResult = await lq.scoreLoad({ urgency: 'No Rush', budget: 'Budget', in_primary_area: false, team_size: 1, name: 'Cold', email: 'cold@test.com' });
Assert coldResult.score < 50 and coldResult.priority !== 'hot'

Test 3: Orchestrator routing
const orch = require('../agents/orchestrator');
const result = await orch.handleEvent({ event_type: 'kickoff_form_submitted', payload: { urgency: 'Emergency', budget: 'Premium', in_primary_area: true, team_size: 60, name: 'Test', email: 'test@test.com', phone: '555-0100', service_type: 'Commercial' }, source: 'test' });
Assert result.routed_to includes 'lead' (the string, case insensitive)

Test 4: Client communication throttle
config.aitable.getRecords = async () => [{ fields: { sent_at: new Date().toISOString() }}]; // Last sent just now
const comm = require('../agents/client-communication');
const throttled = await comm.sendCommunication('test_contact', 'welcome', {});
Assert throttled.sent === false

Print pass/fail per test. Exit 0 if all pass, exit 1 if any fail.

TASK D: Create tests/test-connections.js

Test each API with read-only calls, 5 second timeout, wrapped in try/catch:
- SuiteDash: axios.get(process.env.SUITEDASH_BASE_URL + '/contacts', { headers: { 'X-API-KEY': process.env.SUITEDASH_API_SECRET }, timeout: 5000, params: { limit: 1 }})
- AiTable: axios.get('https://aitable.ai/fusion/v1/spaces', { headers: { 'Authorization': 'Bearer ' + process.env.AITABLE_API_KEY }, timeout: 5000 })
- OpenAI: axios.get('https://api.openai.com/v1/models', { headers: { 'Authorization': 'Bearer ' + process.env.OPENAI_API_KEY }, timeout: 5000 })
- Stripe: require('stripe')(process.env.STRIPE_SECRET_KEY).balance.retrieve()
- n8n: axios.get(process.env.N8N_BASE_URL + '/api/v1/workflows', { headers: { 'X-N8N-API-KEY': process.env.N8N_API_KEY, 'CF-Access-Client-Id': process.env.N8N_CF_ACCESS_CLIENT_ID, 'CF-Access-Client-Secret': process.env.N8N_CF_ACCESS_CLIENT_SECRET }, timeout: 5000 })

Print CONNECTED or FAILED per service. Always exit 0 (connection tests are informational, not blocking).

TASK E: Update package.json scripts

Add these scripts to the root package.json:
"test": "node tests/test-workflows.js && node tests/test-niche-configs.js",
"test:agents": "node tests/test-agents.js",
"test:api": "node tests/test-connections.js",
"test:all": "npm test && npm run test:agents",
"dashboard:dev": "cd dashboard && node server.js"

TASK F: Create README.md

# Dynasty Empire — SuiteDash Deployment System

Multi-niche directory business factory. 16 niches, 7 AI agents, 9 n8n workflows, 12 AiTable tables, operations dashboard.

## Architecture
(Include a Mermaid diagram showing: User → SuiteDash Portal → n8n Master Router → Agents → AiTable, with Stripe for payments)

## Quick Start
1. Clone this repo
2. npm install
3. Copy env/.env to .env and fill in your credentials
4. Run tests: npm test
5. Start dashboard: npm run dashboard:dev

## File Structure
Explain each directory: agents/, n8n/, scripts/, suitedash/, dashboard/, data/, tests/

## Deploy a Niche
node scripts/deploy-niche.js plumbing

## Emergency Stop
node scripts/emergency-stop.js pause
node scripts/emergency-stop.js resume
node scripts/emergency-stop.js status

## 16 Niches
List all 16 with pack numbers

## API Reference
Brief explanation of SuiteDash, AiTable, and n8n API patterns used

TASK G: Run tests and finalize

Run: npm test
If any test fails, fix the issue and re-run.
Run: node --check agents/*.js scripts/*.js tests/*.js
If any syntax check fails, fix and re-run.
Run: git add -A && git commit -m "BUILD COMPLETE: Tests, README, and documentation"

Create BUILD_COMPLETE.md listing:
- Total files created
- All tests passed or failed
- Any known issues
- Recommended next steps: 1) Run npm run test:api to check live connections, 2) Run bootstrap on AiTable (create tables manually or via script), 3) Import n8n workflows, 4) Deploy first niche (plumbing), 5) Start dashboard
```

---
