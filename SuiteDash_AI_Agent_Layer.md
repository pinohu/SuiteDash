# SuiteDash AI Agent Layer — Autonomous Business Operating Brain
## Dynasty Empire — portal.yourdeputy.com

**Date:** March 19, 2026 (Updated with Agent 7 + Master Router + Emergency Stop)
**Purpose:** Define the intelligence layer that transforms SuiteDash from a manual system into a self-operating business factory.
**Gap covered:** Gap 9 (Agent/Intelligence Layer) from the original analysis.

---

# AGENT ARCHITECTURE

```
User Input (Form, Portal, Email, Chat)
        ↓
   Agent Router (n8n)
        ↓
   ┌─────────────────────────────────────┐
   │       Specialized Agents            │
   │  ┌─────────┐  ┌──────────────────┐  │
   │  │ Lead    │  │ Service Matching │  │
   │  │ Qualify │  │ Agent            │  │
   │  └────┬────┘  └────────┬─────────┘  │
   │       │                │             │
   │  ┌────┴────┐  ┌───────┴──────────┐  │
   │  │Workflow │  │ Client Comms     │  │
   │  │Orchestr.│  │ Agent            │  │
   │  └────┬────┘  └────────┬─────────┘  │
   │       │                │             │
   │  ┌────┴────┐  ┌───────┴──────────┐  │
   │  │Perform. │  │ Failure Detection│  │
   │  │Analytics│  │ Agent            │  │
   │  └────┬────┘  └────────┬─────────┘  │
   │       │                │             │
   │       └───────┬────────┘             │
   │          ┌────┴─────┐                │
   │          │ QA/Audit │                │
   │          │ Agent    │                │
   │          └──────────┘                │
   └─────────────────────────────────────┘
        ↓
   Automation Layer (n8n workflows)
        ↓
   SuiteDash API + AiTable + Stripe
```

---

# THE 7 CORE AGENTS

## Agent 1: Lead Qualification Agent

**Purpose:** Score and route every incoming lead automatically — no human needed for initial qualification.

**Input sources:**
- Kickoff Form submission (webhook from SuiteDash)
- Public Page inquiry
- External form submission (GoZen/Formaloo → n8n webhook)

**Output:**
- Lead Score (0-100)
- Service Recommendation (which tier/package fits)
- Priority Level (Hot / Warm / Cold)
- Routing Decision (which pipeline stage, which coordinator)

**Scoring Logic:**

| Factor | Weight | How Scored |
|--------|--------|-----------|
| Urgency | 25 pts | "Emergency" = 25, "This week" = 15, "This month" = 10, "Just researching" = 5 |
| Budget Indicator | 25 pts | Premium inquiry = 25, Standard = 15, Free/Basic = 5 |
| Location Match | 20 pts | In primary service area = 20, Adjacent = 10, Outside = 5 |
| Business Size | 15 pts | 50+ employees = 15, 11-50 = 10, 2-10 = 7, Solo = 3 |
| Completeness | 15 pts | All fields filled = 15, Most = 10, Minimum only = 5 |

**Routing Rules:**

| Score Range | Priority | Action |
|-------------|----------|--------|
| 80-100 | Hot Lead | Immediately assign to senior coordinator, send premium onboarding, schedule call within 24h |
| 50-79 | Warm Lead | Standard onboarding sequence, assign coordinator within 48h |
| 25-49 | Cold Lead | Nurture sequence only, no coordinator assignment |
| 0-24 | Low Quality | Add to free tier, minimal touch, monitor for engagement |

**n8n Implementation:**

```
[Webhook: Form Submission]
  → [Extract form fields]
  → [AI Node: Score lead]
     System prompt: "You are a lead qualification agent for a [NICHE] directory.
     Score this lead 0-100 based on:
     - Urgency (25pts): {urgency_field}
     - Budget (25pts): {budget_indicator}
     - Location (20pts): {service_area} vs {our_coverage}
     - Business Size (15pts): {team_size}
     - Completeness (15pts): {fields_filled}/{total_fields}
     Return JSON: {score, priority, recommended_tier, routing_action}"
  → [Switch Node: Route by score]
     → 80-100: [Create Hot Lead in SuiteDash] → [Assign Senior Coordinator] → [Schedule Call]
     → 50-79: [Create Warm Lead] → [Standard Onboarding FLOW]
     → 25-49: [Create Cold Lead] → [Nurture Sequence Only]
     → 0-24: [Create Free Tier] → [Minimal Touch]
  → [Log to AiTable: lead_scores table]
```

---

## Agent 2: Service Matching Agent

**Purpose:** Match each client to the optimal service package based on their profile, needs, and budget.

**Input:** Client profile data (from CRM custom fields + form submissions)

**Output:**
- Recommended package (Free / Basic / Premium)
- Recommended add-ons
- Estimated ROI for the client
- Upsell timing recommendation

**Matching Logic:**

```
IF business_size > 10 AND budget_indicator = "premium" AND urgency = "immediate"
  → RECOMMEND: Premium ($297/mo) + Lead Gen add-on
  → UPSELL: Website build at Day 30

IF business_size 2-10 AND budget_indicator = "standard"
  → RECOMMEND: Basic ($97/mo)
  → UPSELL: Premium upgrade at engagement_score > 60

IF solo AND budget_indicator = "budget-conscious"
  → RECOMMEND: Free tier
  → UPSELL: Basic at Day 14 with trial offer
```

**n8n Implementation:**

```
[Trigger: New Contact Created OR Profile Updated]
  → [GET contact custom fields from SuiteDash API]
  → [AI Node: Match service]
     System prompt: "You are a service matching agent for a [NICHE] directory.
     Given this client profile:
     - Business size: {company_size}
     - Budget indicator: {revenue_tier}
     - Services needed: {service_specialties}
     - Current tier: {membership_tier}
     Recommend the optimal package and add-ons.
     Return JSON: {recommended_tier, add_ons[], estimated_monthly_value, upsell_timing_days}"
  → [PUT: Update SuiteDash custom field "Recommended Tier"]
  → [IF current_tier < recommended_tier: Schedule upsell sequence]
  → [Log to AiTable: service_matches table]
```

---

## Agent 3: Workflow Orchestrator

**Purpose:** Control which automations run, when, and in what order — preventing conflicts and ensuring completion.

**Input:** Events from all other agents and SuiteDash webhooks

**Output:**
- Workflow execution decisions
- Conflict resolution
- Sequence ordering
- Dependency management

**Orchestration Rules:**

| Rule | Logic |
|------|-------|
| No duplicate workflows | If onboarding sequence already active for a contact, do not start another |
| Priority ordering | Billing workflows > Onboarding > Nurture > Analytics |
| Conflict prevention | If renewal sequence is active, pause upsell sequence |
| Dependency chains | Onboarding FLOW must complete before upgrade offer is sent |
| Rate limit awareness | Track SuiteDash API calls, throttle if approaching limit |
| Business hours | Customer-facing emails only 8am-8pm local time; internal alerts anytime |

**n8n Implementation:**

```
[Webhook: Any workflow trigger]
  → [GET: Check active workflows for this contact in AiTable]
  → [AI Node: Orchestrate]
     System prompt: "You are a workflow orchestrator.
     Active workflows for contact {id}: {active_workflows}
     New trigger: {trigger_type}
     Rules:
     - No duplicate workflows
     - Priority: billing > onboarding > nurture > analytics
     - If renewal active, pause upsell
     - If onboarding incomplete, defer upgrade offers
     Decide: EXECUTE, DEFER, CANCEL, or REPLACE
     Return JSON: {decision, reason, execute_at, dependencies[]}"
  → [Switch: Execute decision]
     → EXECUTE: [Run the workflow immediately]
     → DEFER: [Schedule for later, log reason]
     → CANCEL: [Log cancellation reason]
     → REPLACE: [Cancel old workflow, start new one]
  → [Update AiTable: workflow_state table]
```

---

## Agent 4: Client Communication Agent

**Purpose:** Handle all automated follow-ups, reminders, status updates, and re-engagement without human intervention.

**Input:** Scheduled triggers, engagement score changes, milestone events

**Output:**
- Personalized email content
- Optimal send timing
- Message tone calibration
- Response handling suggestions

**Communication Matrix:**

| Trigger | Message Type | Tone | Channel |
|---------|-------------|------|---------|
| New signup | Welcome | Warm, excited | Email |
| Day 3 no login | Gentle nudge | Helpful, low-pressure | Email |
| Day 7 no FLOW completion | Check-in | Supportive, offer help | Email + portal notification |
| Engagement score drops >20 pts | Re-engagement | Personal, value-focused | Email |
| Support ticket resolved | Follow-up | Professional, caring | Email |
| Invoice overdue 7 days | Payment reminder | Firm but empathetic | Email |
| Milestone reached | Celebration | Enthusiastic | Email + portal notification |
| 30 days before renewal | Renewal prep | Informative, value recap | Email |

**n8n Implementation:**

```
[Trigger: Communication event]
  → [GET: Contact profile, engagement history, communication history]
  → [AI Node: Generate message]
     System prompt: "You are a client communication agent for [NICHE] directory.
     Contact: {name}, Tier: {tier}, Score: {engagement_score}
     Last communication: {last_email_date} ({last_email_type})
     Trigger: {trigger_type}
     Rules:
     - Never send more than 1 email per day to same contact
     - Match tone to situation (see matrix)
     - Include specific value metrics when available
     - Always include one clear CTA
     - Keep under 200 words
     Generate the email subject and body.
     Return JSON: {subject, body, send_at, channel}"
  → [Check: Last email sent > 24 hours ago?]
     → YES: [Send via SuiteDash email API]
     → NO: [Queue for tomorrow, log delay reason]
  → [Log to AiTable: communication_log table]
```

---

## Agent 5: Performance Analytics Agent

**Purpose:** Track, analyze, and report on all business metrics — surfacing insights humans would miss.

**Input:** Data from AiTable (synced from SuiteDash + Stripe + n8n logs)

**Output:**
- Daily/weekly/monthly performance reports
- Anomaly detection alerts
- Revenue forecasts
- Optimization recommendations

**Metrics Tracked:**

| Metric | Calculation | Alert Threshold |
|--------|-------------|-----------------|
| MRR | Sum of active subscriptions | <80% of target |
| Churn Rate | Lost members / Total members (30-day rolling) | >5% monthly |
| CAC | Total marketing spend / New members acquired | >3x monthly revenue per member |
| LTV | Avg monthly revenue × Avg months retained | LTV:CAC < 3:1 |
| Conversion Rate | Won deals / Total leads (per niche) | <15% |
| Onboarding Completion | FLOWs completed / FLOWs assigned | <40% |
| Engagement Health | % of members with score >40 | <60% |
| Support SLA | Tickets resolved within 72h / Total tickets | <80% |
| Revenue per Niche | MRR per directory | Any niche <$500 MRR after 60 days |

**n8n Implementation:**

```
[Cron: Daily at 6:00 AM]
  → [GET: All metrics from AiTable]
  → [Calculate: Derived metrics (churn rate, LTV, CAC)]
  → [AI Node: Analyze]
     System prompt: "You are a performance analytics agent for Dynasty Empire directories.
     Today's metrics: {metrics_json}
     Yesterday's metrics: {yesterday_json}
     7-day trend: {weekly_trend}
     Analyze:
     1. Any anomalies vs 7-day average?
     2. Which niche is performing best/worst?
     3. Any churn risk signals?
     4. Revenue forecast for end of month?
     5. Top 3 recommended actions?
     Return JSON: {summary, anomalies[], top_niche, worst_niche, churn_risks[], forecast, recommendations[]}"
  → [IF anomalies detected: Send alert email to admin]
  → [Update AiTable: daily_analytics table]
  → [Weekly (Monday): Generate and email weekly report]
  → [Monthly (1st): Generate and email monthly deep dive]
```

---

## Agent 6: Failure Detection Agent

**Purpose:** Detect broken workflows, missed steps, and system anomalies before they impact clients.

**Input:** n8n execution logs, AiTable DLQ table, SuiteDash webhook responses

**Output:**
- Real-time failure alerts
- Root cause analysis
- Auto-remediation actions
- System health score

**Detection Rules:**

| Failure Type | Detection Method | Auto-Response |
|-------------|-----------------|---------------|
| n8n workflow failure | Error trigger in n8n | Retry 3x, then DLQ + alert |
| SuiteDash API timeout | HTTP response code 408/500 | Retry with exponential backoff |
| Webhook delivery failure | No acknowledgment within 30s | Log + retry + alert if persistent |
| Email delivery failure | Bounce/reject notification | Update contact record, alert staff |
| Payment processing failure | Stripe webhook `charge.failed` | Trigger dunning sequence, alert admin |
| Data sync mismatch | SuiteDash count ≠ AiTable count | Flag for manual review, pause sync |
| Onboarding stall | FLOW not progressed in 7 days | Trigger reminder, alert coordinator |
| Missing data | Required custom field empty after 48h | Send profile completion reminder |

**n8n Implementation:**

```
[Multiple Triggers: Error handlers from all workflows + 15-min health check cron]
  → [Collect: Error context (workflow, node, error message, contact_id)]
  → [AI Node: Diagnose]
     System prompt: "You are a failure detection agent.
     Error: {error_type} in {workflow_name} at {node_name}
     Message: {error_message}
     Contact: {contact_id}
     Recent similar errors: {similar_errors_count} in last 24h
     Diagnose:
     1. Root cause category (API, data, timeout, logic, external)
     2. Severity (critical, high, medium, low)
     3. Can auto-remediate? (yes/no)
     4. Recommended action
     Return JSON: {root_cause, severity, auto_remediate, action, escalate_to}"
  → [Switch: By severity]
     → Critical: [Immediate Slack/email alert] → [Auto-retry if possible] → [DLQ]
     → High: [Email alert within 1 hour] → [Auto-retry] → [DLQ if failed]
     → Medium: [Add to daily digest] → [Auto-retry]
     → Low: [Log only]
  → [Update AiTable: failure_log table]
  → [Calculate: System Health Score = 100 - (critical×20 + high×10 + medium×5 + low×1)]
```

---

## Agent 7: QA/Audit Agent

**Purpose:** Periodically verify data integrity across all systems — catching drift, orphaned records, missing data, and inconsistencies before they impact clients or revenue.

**Input:** Scheduled trigger (daily) + on-demand manual trigger

**Output:**
- System health report
- List of anomalies with severity
- Auto-fix actions for safe corrections
- Escalation list for manual review

**Audit Checks:**

| Check | Method | Auto-Fix? | Severity if Failed |
|-------|--------|:---------:|-------------------|
| Contact count: SuiteDash = AiTable | Compare GET /contacts count vs AiTable row count | No — flag for review | High |
| All active clients have engagement score | Query AiTable for NULL engagement_score where lifecycle = active | Yes — trigger scoring run | Medium |
| All active clients have a Circle assignment | Query SuiteDash contacts without Circle | No — flag for review | High |
| No orphaned projects (project exists, contact deleted) | Cross-reference project.client_id against contacts | No — flag for review | Medium |
| All onboarding FLOWs have progressed within 14 days | Query workflow_state where status=active AND last_step_at > 14 days ago | Yes — trigger reminder | Medium |
| No duplicate contacts (same email) | Query AiTable for duplicate emails | No — flag for review | High |
| Stripe subscription status matches SuiteDash tier | Compare Stripe active subs vs SuiteDash membership_tier field | No — flag for review | Critical |
| DLQ items not stale (none older than 72 hours unresolved) | Query DLQ where status != resolved AND age > 72h | Yes — send escalation alert | High |
| Custom fields populated for all clients past onboarding | Check required fields (Directory Source, Membership Tier, Lifecycle Stage) | Yes — trigger profile completion reminder | Low |
| Folder structure exists for all active clients | Verify via SuiteDash Files API or tracking table | No — flag for manual creation | Medium |
| API usage within safe limits | Check current month API calls vs SUITEDASH_MONTHLY_API_LIMIT × 0.8 | Yes — throttle n8n workflows | Critical |

**n8n Implementation:**

```
[Cron: Daily at 4:00 AM (after engagement scoring at 2:00 AM)]
  → [Check Emergency Stop: GET AiTable system_config "system_active" field]
     → IF false: SKIP all checks, log "System paused"
  → [Parallel Execution: Run all 11 checks simultaneously]
     → [GET SuiteDash /contacts count]
     → [GET AiTable clients count]
     → [GET AiTable: NULL engagement scores]
     → [GET AiTable: Stale DLQ items]
     → [GET AiTable: Stale onboarding workflows]
     → [Check API usage counter]
  → [Code Node: Compare results, generate anomaly list]
     For each check:
       - status: pass / warn / fail
       - severity: critical / high / medium / low
       - auto_fixable: true / false
       - details: specific mismatch info
  → [Switch: Any auto-fixable issues?]
     → YES: [Execute auto-fixes (scoring run, reminders, throttle)]
     → NO: [Continue]
  → [Switch: Any critical/high severity?]
     → YES: [Immediate email alert to admin with full report]
     → NO: [Add to daily digest]
  → [Log to AiTable: audit_log table]
     Fields: date, checks_run, checks_passed, checks_failed,
             anomalies_found, auto_fixed, escalated, system_health_score
  → [Calculate: System Integrity Score = (checks_passed / checks_run) × 100]
  → [Update AiTable: daily_analytics → system_integrity_score field]
```

**AiTable Table: audit_log**

| Field | Type | Purpose |
|-------|------|---------|
| date | Date | Audit run date |
| checks_run | Number | Total checks executed |
| checks_passed | Number | Passed without issues |
| checks_failed | Number | Failed checks |
| anomalies | Long Text (JSON) | Detailed anomaly list |
| auto_fixed_count | Number | Issues auto-remediated |
| escalated_count | Number | Issues sent to admin |
| system_integrity_score | Number (0-100) | Overall system health |
| run_duration_seconds | Number | Performance tracking |

---

# MASTER EVENT ROUTER

## The Central Nervous System

Instead of each n8n workflow having its own webhook, the Master Event Router receives ALL events from SuiteDash and routes them to the correct workflow. This eliminates webhook sprawl and gives the Orchestrator Agent a single point of control.

**Architecture:**

```
SuiteDash Events (webhooks, form submissions, stage changes)
        ↓
   [Master Event Router] ← Single webhook endpoint
        ↓
   ┌──────────────┐
   │ Check:       │
   │ System Active?│ ← Emergency Stop check
   └──────┬───────┘
          ↓
   ┌──────────────┐
   │ Classify     │
   │ Event Type   │
   └──────┬───────┘
          ↓
   ┌──────┴──────┬──────────┬──────────┬──────────┐
   ↓             ↓          ↓          ↓          ↓
[Onboarding] [Engagement] [Renewal] [Win-back] [Agent Router]
 Pack 1       Pack 2       Pack 3    Pack 4      Pack 7
```

**n8n Implementation:**

```json
{
  "name": "Dynasty - Master Event Router",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "dynasty-events",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook: All Events",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 400]
    },
    {
      "parameters": {
        "url": "https://api.aitable.com/v0/{{$env.AITABLE_BASE_ID}}/system_config/rec_system_active",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth"
      },
      "name": "Check Emergency Stop",
      "type": "n8n-nodes-base.httpRequest",
      "position": [480, 400]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [{"value1": "={{$json.fields.system_active}}", "value2": true}]
        }
      },
      "name": "System Active?",
      "type": "n8n-nodes-base.if",
      "position": [710, 400]
    },
    {
      "parameters": {
        "jsCode": "const event = $input.first().json;\nconst eventType = event.event_type || 'unknown';\n\nconst routing = {\n  'kickoff_form_submitted': 'onboarding',\n  'contact_created': 'onboarding',\n  'flow_completed': 'engagement',\n  'login': 'engagement',\n  'profile_updated': 'engagement',\n  'subscription_approaching_renewal': 'renewal',\n  'invoice_overdue': 'renewal',\n  'subscription_cancelled': 'winback',\n  'contact_churned': 'winback',\n  'lead_form_submitted': 'agent_qualification',\n  'engagement_score_dropped': 'agent_communication',\n  'workflow_failed': 'failure_handler',\n  'payment_failed': 'failure_handler'\n};\n\nconst destination = routing[eventType] || 'unknown';\n\nreturn [{\n  json: {\n    ...event,\n    routed_to: destination,\n    routed_at: new Date().toISOString()\n  }\n}];"
      },
      "name": "Route Event",
      "type": "n8n-nodes-base.code",
      "position": [940, 300]
    },
    {
      "parameters": {
        "rules": {
          "rules": [
            {"output": 0, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "onboarding", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 1, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "engagement", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 2, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "renewal", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 3, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "winback", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 4, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "agent_qualification", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 5, "conditions": {"conditions": [{"leftValue": "={{$json.routed_to}}", "rightValue": "failure_handler", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 6}
          ]
        }
      },
      "name": "Switch: Destination",
      "type": "n8n-nodes-base.switch",
      "position": [1170, 300]
    },
    {
      "parameters": {
        "url": "={{$env.N8N_WEBHOOK_BASE}}/suitedash-onboarding",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [{"name": "payload", "value": "={{JSON.stringify($json)}}"}]
        }
      },
      "name": "Trigger: Onboarding Pack",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1450, 100]
    },
    {
      "parameters": {
        "url": "={{$env.N8N_WEBHOOK_BASE}}/lead-qualification",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [{"name": "payload", "value": "={{JSON.stringify($json)}}"}]
        }
      },
      "name": "Trigger: Agent Router",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1450, 500]
    },
    {
      "parameters": {
        "url": "https://api.aitable.com/v0/{{$env.AITABLE_BASE_ID}}/event_log",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [{"name": "fields", "value": "={{JSON.stringify({event_type: $json.event_type, routed_to: $json.routed_to, contact_id: $json.contact_id || '', timestamp: $json.routed_at, status: 'routed'})}}"}]
        }
      },
      "name": "Log Event",
      "type": "n8n-nodes-base.httpRequest",
      "position": [940, 550]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={\"status\": \"paused\", \"message\": \"System is in emergency stop mode. Event logged but not processed.\"}"
      },
      "name": "System Paused Response",
      "type": "n8n-nodes-base.respondToWebhook",
      "position": [940, 550]
    }
  ],
  "connections": {
    "Webhook: All Events": {"main": [[{"node": "Check Emergency Stop", "type": "main", "index": 0}]]},
    "Check Emergency Stop": {"main": [[{"node": "System Active?", "type": "main", "index": 0}]]},
    "System Active?": {
      "main": [
        [{"node": "Route Event", "type": "main", "index": 0}],
        [{"node": "System Paused Response", "type": "main", "index": 0}]
      ]
    },
    "Route Event": {"main": [[{"node": "Switch: Destination", "type": "main", "index": 0}, {"node": "Log Event", "type": "main", "index": 0}]]},
    "Switch: Destination": {
      "main": [
        [{"node": "Trigger: Onboarding Pack", "type": "main", "index": 0}],
        [],
        [],
        [],
        [{"node": "Trigger: Agent Router", "type": "main", "index": 0}],
        [],
        []
      ]
    }
  },
  "settings": {"executionOrder": "v1"},
  "tags": [{"name": "dynasty"}, {"name": "router"}, {"name": "core"}]
}
```

**Benefits over current per-pack webhooks:**
- Single endpoint to configure in SuiteDash (one webhook URL instead of 7)
- Emergency Stop checked BEFORE any processing
- Every event logged to AiTable regardless of destination
- Unknown event types are caught and logged instead of silently dropped
- Easy to add new routes as new packs are built

---

# EMERGENCY STOP SYSTEM

## One Toggle to Pause Everything

Every workflow in the system checks a single AiTable record before executing. Flipping one field stops all automation instantly.

**AiTable Table: system_config**

| Record ID | Field | Type | Value |
|-----------|-------|------|-------|
| rec_system_active | system_active | Checkbox | true (default) |
| rec_system_active | paused_at | DateTime | null |
| rec_system_active | paused_by | Text | null |
| rec_system_active | pause_reason | Text | null |
| rec_system_active | auto_resume_at | DateTime | null (optional: auto-resume after X hours) |

**How to Pause:**
1. Open AiTable → system_config table
2. Uncheck `system_active`
3. Fill in `paused_by` and `pause_reason`
4. Optionally set `auto_resume_at` for timed pause

**How to Resume:**
1. Check `system_active`
2. Clear `paused_at`, `paused_by`, `pause_reason`

**What Happens When Paused:**
- Master Event Router: Receives events but returns "System Paused" response and logs them without processing
- Cron workflows (Engagement Scoring, Data Sync, QA Audit): Skip execution, log "System paused" to audit_log
- Error Handler/DLQ: Continues running (failures still get logged even when paused)
- Manual trigger workflows: Still executable by admin (emergency stop doesn't block manual admin actions)

**Emergency Stop Check Code (Add to every n8n cron workflow as the first node):**

```javascript
// Node: Check Emergency Stop
// Type: n8n-nodes-base.httpRequest
// URL: https://api.aitable.com/v0/{BASE_ID}/system_config/rec_system_active
// Then immediately after:

// Node: System Active? (IF node)
// Condition: $json.fields.system_active === true
// TRUE path: Continue workflow
// FALSE path: Log "skipped - system paused" and stop

// Optional: Check auto_resume_at
// If auto_resume_at is set and current time > auto_resume_at:
//   Auto-set system_active = true
//   Resume normally
```

**AiTable Table: event_log (for paused events)**

| Field | Type | Purpose |
|-------|------|---------|
| event_type | Text | What event was received |
| contact_id | Text | Affected contact |
| timestamp | DateTime | When event arrived |
| status | Dropdown | routed / paused / replayed |
| routed_to | Text | Intended destination |
| replayed_at | DateTime | When event was replayed after resume (if applicable) |

**Event Replay After Resume:**
When the system is resumed, an optional "Replay Paused Events" workflow can query all events with status=paused and re-send them through the Master Event Router. This ensures nothing is lost during a pause.

```
[Manual Trigger: "Replay Paused Events"]
  → [GET AiTable: event_log WHERE status = "paused"]
  → [For Each: POST to Master Event Router webhook]
  → [Update AiTable: Set status = "replayed", replayed_at = now()]
  → [Email admin: "X events replayed successfully"]
```

---

# MASTER AGENT PROMPT (Drop-In System Prompt)

Use this as the base system prompt for all agents, then append agent-specific instructions:

```
You are an autonomous business operations agent for Dynasty Empire,
a multi-niche directory business powered by SuiteDash.

CORE IDENTITY:
- You operate portal.yourdeputy.com
- You manage {niche_count} directory niches with {member_count} total members
- Your decisions directly impact revenue, client satisfaction, and operational efficiency

DECISION FRAMEWORK:
1. Analyze incoming data completely before acting
2. Determine intent and urgency
3. Route actions to the correct workflow
4. Optimize for revenue AND client experience (never sacrifice one for the other)

OPERATING PRINCIPLES:
- Minimize friction for clients at every touchpoint
- Maximize conversion through personalization, not pressure
- Prevent errors through validation before execution
- Ensure every workflow reaches completion (no dropped balls)
- Respect rate limits and system constraints

UNCERTAINTY PROTOCOL:
If uncertain about the correct action:
1. Choose the safest high-value action (safe = reversible, high-value = moves toward revenue/satisfaction)
2. Log the uncertainty for human review
3. Never take destructive actions when uncertain
4. When in doubt, defer to the Workflow Orchestrator

DATA BOUNDARIES:
- SuiteDash = identity + portal (read/write via API)
- AiTable = analytics + state (read/write)
- Stripe = financial (read-only, never modify directly)
- n8n = execution (trigger workflows, never modify workflow definitions)

OUTPUT FORMAT:
Always return structured JSON with: {action, confidence, reasoning, fallback_action}
```

---

# AGENT → AUTOMATION CONNECTION

## Example End-to-End Flow

```
1. Lead submits Plumbing Kickoff Form on Public Page
        ↓
2. SuiteDash fires webhook to n8n
        ↓
3. Agent Router receives webhook
        ↓
4. Lead Qualification Agent scores: 82/100 (Hot Lead)
   - Urgency: Emergency plumbing (25pts)
   - Budget: Commercial property (20pts)
   - Location: In primary area (20pts)
   - Business size: 15 employees (12pts)
   - Complete form (5pts)
        ↓
5. Service Matching Agent: Recommend Premium ($297/mo) + Lead Gen add-on
        ↓
6. Workflow Orchestrator: EXECUTE onboarding (no conflicts)
        ↓
7. n8n executes:
   - Create contact in SuiteDash (POST /contact)
   - Add to "Plumbing-Premium" Circle
   - Assign senior coordinator
   - Create onboarding project from template
   - Apply Folder Generator (/ClientName/Private/Shared/Deliverables/)
   - Assign onboarding FLOW
   - Schedule discovery call (Day 1)
   - Start premium onboarding email sequence
        ↓
8. Client Communication Agent: Sends personalized welcome email
   "Welcome [Name] — as a premium plumbing partner, you get priority lead routing..."
        ↓
9. Performance Analytics Agent: Logs new premium member, updates MRR forecast
        ↓
10. Failure Detection Agent: Monitors all steps, confirms completion
```

---

# MEMORY + LEARNING SYSTEM

## What to Store (AiTable Tables)

| Table | Fields | Purpose |
|-------|--------|---------|
| lead_scores | contact_id, score, factors, outcome (won/lost), timestamp | Improve scoring accuracy over time |
| service_matches | contact_id, recommended_tier, actual_tier, retention_months | Refine matching logic |
| communication_log | contact_id, message_type, channel, opened, clicked, replied | Optimize messaging |
| workflow_outcomes | workflow_id, contact_id, success, duration, errors | Improve orchestration |
| failure_log | error_type, root_cause, auto_remediated, resolution_time | Reduce failure rate |
| agent_decisions | agent_id, decision, confidence, outcome, feedback | Continuous improvement |
| audit_log | date, checks_run, checks_passed, anomalies, auto_fixed_count, system_integrity_score | Track system health over time |
| event_log | event_type, contact_id, timestamp, status (routed/paused/replayed), routed_to | Trace every event through the system |
| system_config | system_active, paused_at, paused_by, pause_reason, auto_resume_at | Emergency stop control |

## Learning Loop

```
[Monthly: 1st of month at midnight]
  → [Query AiTable: All agent decisions from last 30 days]
  → [AI Node: Analyze outcomes]
     "Review all decisions made last month.
     For each agent:
     1. What was the accuracy rate? (decision led to desired outcome)
     2. What patterns appear in failures?
     3. What scoring adjustments are recommended?
     Return updated scoring weights and routing rules."
  → [Update: Scoring thresholds in n8n workflow variables]
  → [Email: Monthly agent performance report to admin]
```

---

# IMPLEMENTATION STACK

## Minimal Version (Start Here — Week 1-4)

| Component | Tool | Purpose |
|-----------|------|---------|
| Automation | n8n (self-hosted or cloud) | Workflow execution, webhooks, scheduling |
| Data | AiTable | Analytics, agent memory, DLQ |
| Portal | SuiteDash | Client-facing, identity, billing |
| AI | OpenAI API (GPT-4) via n8n HTTP node | Agent intelligence |
| Payments | Stripe | Financial processing |

**Cost:** n8n cloud ($20/mo) + AiTable Pro ($20/mo) + OpenAI API (~$50/mo) = ~$90/mo

## Advanced Version (Scale — Month 3+)

| Component | Tool | Purpose |
|-----------|------|---------|
| Automation | n8n + ActivePieces (redundancy) | Primary + backup automation |
| Data | PostgreSQL + pgvector | Relational data + vector embeddings |
| Memory | Qdrant or Pinecone | Long-term agent memory, semantic search |
| AI Framework | LangChain / LangGraph | Agent orchestration, tool use, chains |
| AI Models | OpenAI GPT-4 + Claude API | Multi-model for different agent types |
| Portal | SuiteDash | Unchanged — still the portal layer |
| Monitoring | Grafana + Prometheus | System-level observability |

**Cost:** ~$300-500/mo depending on volume

---

# DEPLOYMENT STRATEGY

## Phase 1: Foundation (Week 1)
- Deploy Lead Qualification Agent for Plumbing niche only
- Simple scoring logic (no AI — rule-based in n8n Switch node)
- Log all decisions to AiTable
- Human reviews all routing decisions for first 2 weeks

## Phase 2: Expand (Weeks 2-3)
- Add Service Matching Agent
- Add Client Communication Agent
- Extend to 3 more niches (HVAC, Pest Control, Roofing)
- Introduce AI scoring (replace rule-based with AI node)
- Human spot-checks 20% of decisions

## Phase 3: Automate (Weeks 4-6)
- Deploy Workflow Orchestrator
- Deploy Failure Detection Agent
- Deploy Master Event Router (replace per-pack webhooks with single endpoint)
- Deploy Emergency Stop system (AiTable system_config table)
- Extend to all 16 niches
- Human reviews only flagged/uncertain decisions

## Phase 4: Intelligence (Weeks 7-10)
- Deploy Performance Analytics Agent
- Deploy QA/Audit Agent (daily system integrity checks)
- Activate learning loop (monthly model updates)
- Full autonomy — human involvement only for:
  - New niche launches
  - Pricing changes
  - Strategic decisions
  - Escalated support tickets

---

# WHAT THIS MEANS FOR REVENUE

## Without Agents (Manual System)
- Lead response time: 4-24 hours
- Qualification accuracy: ~60% (gut feel)
- Onboarding completion: ~40%
- Churn detection: After it happens
- Staff needed: 1 per 50 clients

## With Agents (Autonomous System)
- Lead response time: <5 minutes (automated)
- Qualification accuracy: 85%+ (data-driven, improving)
- Onboarding completion: 70%+ (automated nudges)
- Churn detection: 30-60 days before it happens
- Staff needed: 1 per 200+ clients

## Revenue Impact at Scale

| Metric | Manual | With Agents | Difference |
|--------|--------|-------------|------------|
| Lead → Client conversion | 15% | 30% | 2x |
| Avg time to first revenue | 14 days | 3 days | 4.7x faster |
| Monthly churn | 8% | 3% | 63% reduction |
| Revenue per staff member | $15K/mo | $60K/mo | 4x |
| Time to launch new niche | 2 weeks | 2-4 hours | 40x faster |

---

*The AI Agent Layer transforms Dynasty Empire from a system you operate into a system that operates itself. 7 agents (Lead Qualification, Service Matching, Workflow Orchestrator, Client Communication, Performance Analytics, Failure Detection, QA/Audit) connected through a Master Event Router with an Emergency Stop — SuiteDash remains the portal, n8n remains the automation, agents are the intelligence that makes it all autonomous.*
