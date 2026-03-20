# SuiteDash Importable Deployment Assets
## Dynasty Empire — portal.yourdeputy.com

**Date:** March 19, 2026 (Updated with Master Event Router, Emergency Stop, QA Audit schemas)
**Purpose:** Plug-and-play assets for the deployment system — folder structure, environment config, data schemas, n8n workflow JSONs, and deployment instructions.
**Gap covered:** Gap 8 (Actual importable files) from the original analysis.

---

# 1. DEPLOYMENT PACKAGE FOLDER STRUCTURE

Create this structure locally or in a private GitHub repository:

```
dynasty-suitedash-deployment/
│
├── env/
│   └── .env.example                    ← All connection variables
│
├── data/
│   ├── clients.csv                     ← AiTable: Clients table schema
│   ├── projects.csv                    ← AiTable: Projects table schema
│   ├── tasks.csv                       ← AiTable: Tasks table schema
│   ├── engagement_scores.csv           ← AiTable: Engagement tracking
│   ├── lead_scores.csv                 ← AiTable: Agent lead scoring
│   ├── communication_log.csv           ← AiTable: Email/message tracking
│   ├── workflow_state.csv              ← AiTable: Active workflow tracker
│   ├── dlq.csv                         ← AiTable: Dead Letter Queue
│   ├── daily_analytics.csv            ← AiTable: Dashboard metrics
│   ├── audit_log.csv                  ← AiTable: QA Agent audit results
│   ├── event_log.csv                  ← AiTable: Master Router event trace
│   └── system_config.csv              ← AiTable: Emergency Stop control
│
├── n8n/
│   ├── 01_onboarding.json             ← Pack 1: Onboarding automation
│   ├── 02_engagement_scoring.json     ← Pack 2: Daily engagement calc
│   ├── 03_renewal.json                ← Pack 3: 90-day renewal sequence
│   ├── 04_winback.json                ← Pack 4: Churned member recovery
│   ├── 05_failure_handler.json        ← Pack 5: DLQ and retry logic
│   ├── 06_data_sync.json             ← Pack 6: SuiteDash ↔ AiTable sync
│   ├── 07_agent_router.json          ← Agent Layer: Lead qualification + routing
│   ├── 08_master_event_router.json   ← Central event routing (replaces per-pack webhooks)
│   └── 09_qa_audit.json              ← QA/Audit Agent: Daily system integrity checks
│
├── suitedash/
│   ├── custom_fields.json             ← All custom field definitions
│   ├── pipelines.json                 ← Pipeline stage definitions
│   ├── circles.json                   ← Circle naming conventions
│   ├── folder_structure.json          ← Folder Generator template
│   ├── onboarding_flow.json           ← FLOW step definitions
│   └── niche_configs/
│       ├── plumbing.json
│       ├── hvac.json
│       ├── pest_control.json
│       ├── roofing.json
│       ├── real_estate.json
│       ├── property_management.json
│       ├── immigration_legal.json
│       ├── tax_accounting.json
│       ├── medical_billing.json
│       ├── home_cleaning.json
│       ├── landscaping.json
│       ├── auto_repair.json
│       ├── childcare.json
│       ├── fitness_coaches.json
│       ├── digital_marketing.json
│       └── construction.json
│
└── README.md                           ← Deployment instructions
```

---

# 2. ENVIRONMENT CONFIGURATION

## File: `env/.env.example`

```bash
# ============================================
# DYNASTY EMPIRE - SUITEDASH DEPLOYMENT CONFIG
# ============================================

# --- SuiteDash API ---
SUITEDASH_API_KEY=your_suitedash_api_secret_key
SUITEDASH_BASE_URL=https://portal.yourdeputy.com/secure-api
SUITEDASH_PORTAL_URL=https://portal.yourdeputy.com

# --- AiTable (Data Layer) ---
AITABLE_API_KEY=your_aitable_personal_access_token
AITABLE_BASE_ID=your_base_id
# Table IDs (set after creating base)
AITABLE_CLIENTS_TABLE=tbl_clients
AITABLE_PROJECTS_TABLE=tbl_projects
AITABLE_TASKS_TABLE=tbl_tasks
AITABLE_ENGAGEMENT_TABLE=tbl_engagement_scores
AITABLE_LEAD_SCORES_TABLE=tbl_lead_scores
AITABLE_COMMS_LOG_TABLE=tbl_communication_log
AITABLE_WORKFLOW_STATE_TABLE=tbl_workflow_state
AITABLE_DLQ_TABLE=tbl_dlq
AITABLE_ANALYTICS_TABLE=tbl_daily_analytics
AITABLE_AUDIT_LOG_TABLE=tbl_audit_log
AITABLE_EVENT_LOG_TABLE=tbl_event_log
AITABLE_SYSTEM_CONFIG_TABLE=tbl_system_config
# Record ID for the system_active flag (set after creating the record)
AITABLE_SYSTEM_ACTIVE_RECORD=rec_system_active

# --- Stripe (Payment Layer) ---
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_signing_secret
STRIPE_PUBLISHABLE_KEY=pk_live_your_publishable_key

# --- Email (SMTP) ---
SMTP_HOST=smtp.yourdomain.com
SMTP_PORT=587
SMTP_USER=notifications@yourdeputy.com
SMTP_PASS=your_smtp_password
SMTP_FROM_NAME=Your Deputy
SMTP_FROM_EMAIL=notifications@yourdeputy.com

# --- n8n (Automation Layer) ---
N8N_BASE_URL=https://your-n8n-instance.com
N8N_WEBHOOK_BASE=https://your-n8n-instance.com/webhook
N8N_API_KEY=your_n8n_api_key

# --- OpenAI (Agent Intelligence) ---
OPENAI_API_KEY=sk-your_openai_api_key
OPENAI_MODEL=gpt-4
OPENAI_MAX_TOKENS=1000

# --- Slack (Optional Alerts) ---
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/your/webhook/url
SLACK_ALERT_CHANNEL=#dynasty-alerts

# --- Google Calendar (Appointments) ---
GOOGLE_CALENDAR_CLIENT_ID=your_client_id
GOOGLE_CALENDAR_CLIENT_SECRET=your_client_secret

# --- Twilio (SMS — Optional) ---
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# --- Application Settings ---
DEFAULT_TIMEZONE=America/New_York
DEFAULT_CURRENCY=USD
API_RATE_LIMIT_BUFFER=0.8
# Set to your SuiteDash plan: 80 (free), 400 (start), 2000 (thrive), 20000 (pinnacle)
SUITEDASH_MONTHLY_API_LIMIT=2000
```

---

# 3. AITABLE DATA SCHEMAS (CSV Import Templates)

## File: `data/clients.csv`

```csv
client_id,suitedash_id,name,email,company,niche,membership_tier,lifecycle_stage,engagement_score,churn_risk,ltv,acquisition_channel,onboarding_complete,days_since_login,signup_date,renewal_date,stripe_customer_id,coordinator,directory_source,nps_score
CLI001,,Test Plumber,test@plumbco.com,PlumbCo Inc,plumbing,basic,active,45,low,1164,organic,true,2,2026-01-01,2027-01-01,cus_xxx,staff_1,Plumbing Directory,8
```

## File: `data/engagement_scores.csv`

```csv
record_id,client_id,date,logins,profile_updates,features_used,community_posts,support_tickets,days_since_login,calculated_score,previous_score,score_change,risk_level,action_triggered
ENG001,CLI001,2026-03-19,3,1,2,0,1,2,14,18,-4,medium,re_engagement_email
```

## File: `data/lead_scores.csv`

```csv
record_id,contact_id,form_source,niche,urgency_score,budget_score,location_score,size_score,completeness_score,total_score,priority,recommended_tier,routing_action,timestamp,outcome,conversion_days
LS001,,plumbing_kickoff,plumbing,25,20,20,12,5,82,hot,premium,assign_senior,2026-03-19T10:00:00Z,,
```

## File: `data/communication_log.csv`

```csv
record_id,client_id,message_type,channel,subject,sent_at,opened,opened_at,clicked,clicked_at,replied,agent_generated,sequence_name
COM001,CLI001,onboarding_welcome,email,Welcome to Plumbing Directory,2026-01-01T10:00:00Z,true,2026-01-01T14:30:00Z,true,2026-01-01T14:32:00Z,false,false,onboarding_30day
```

## File: `data/workflow_state.csv`

```csv
record_id,client_id,workflow_name,status,started_at,current_step,total_steps,last_step_at,next_step_at,priority,conflict_check
WF001,CLI001,onboarding_30day,active,2026-01-01T10:00:00Z,4,8,2026-01-07T10:00:00Z,2026-01-14T10:00:00Z,high,none
```

## File: `data/dlq.csv`

```csv
record_id,workflow_name,node_name,error_type,error_message,contact_id,payload_summary,retry_count,max_retries,first_failure,last_retry,status,resolved_at,resolved_by,resolution_notes
DLQ001,onboarding,create_contact,api_timeout,SuiteDash API 504,CLI001,kickoff form data,2,3,2026-03-19T10:00:00Z,2026-03-19T10:35:00Z,retrying,,,
```

## File: `data/daily_analytics.csv`

```csv
date,total_mrr,new_members,churned_members,churn_rate_30d,total_active,avg_engagement_score,dlq_items_open,failed_payments_24h,onboarding_completion_rate,support_tickets_open,top_niche,worst_niche,api_calls_used,api_calls_limit
2026-03-19,12450,3,1,3.2,287,42,2,0,68,5,plumbing,childcare,847,2000
```

## File: `data/projects.csv`

```csv
project_id,suitedash_id,client_id,name,niche,status,template_used,start_date,target_end_date,actual_end_date,progress_pct,assigned_to
PRJ001,,CLI001,PlumbCo Onboarding,plumbing,in_progress,plumbing_onboarding,2026-01-02,,null,60,staff_1
```

## File: `data/tasks.csv`

```csv
task_id,project_id,client_id,name,status,assigned_to,due_date,completed_date,order,phase
TSK001,PRJ001,CLI001,License & Insurance Verification,completed,staff_1,2026-01-04,2026-01-03,1,onboarding
TSK002,PRJ001,CLI001,Profile & Listing Setup,in_progress,staff_1,2026-01-07,,2,onboarding
```

## File: `data/audit_log.csv`

```csv
audit_id,date,checks_run,checks_passed,checks_failed,anomalies_found,auto_fixed_count,escalated_count,system_integrity_score,run_duration_seconds,notes
AUD001,2026-03-19,11,10,1,1,0,1,91,12,Contact count mismatch SuiteDash vs AiTable
```

## File: `data/event_log.csv`

```csv
event_id,event_type,contact_id,timestamp,status,routed_to,replayed_at,source
EVT001,kickoff_form_submitted,CLI001,2026-03-19T10:00:00Z,routed,onboarding,,suitedash_webhook
EVT002,engagement_score_dropped,,2026-03-19T02:15:00Z,routed,agent_communication,,n8n_cron
```

## File: `data/system_config.csv`

```csv
config_key,value,updated_at,updated_by,notes
system_active,true,2026-03-19T00:00:00Z,admin,System is running normally
pause_reason,,,,
auto_resume_at,,,,
api_calls_this_month,847,2026-03-19T06:00:00Z,n8n_sync,Updated by data sync workflow
api_calls_limit,2000,2026-03-01T00:00:00Z,admin,Thrive plan limit
```

---

# 4. N8N WORKFLOW JSONs (Importable)

## File: `n8n/01_onboarding.json`

```json
{
  "name": "Dynasty - Pack 1: Onboarding Automation",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "suitedash-onboarding",
        "responseMode": "responseNode",
        "options": {}
      },
      "name": "Webhook: Kickoff Form",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "webhookId": "onboarding-trigger"
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contact",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "first_name", "value": "={{$json.first_name}}"},
            {"name": "last_name", "value": "={{$json.last_name}}"},
            {"name": "email", "value": "={{$json.email}}"},
            {"name": "phone", "value": "={{$json.phone}}"},
            {"name": "role", "value": "lead"}
          ]
        },
        "options": {
          "timeout": 30000
        }
      },
      "name": "Create SuiteDash Contact",
      "type": "n8n-nodes-base.httpRequest",
      "position": [480, 300]
    },
    {
      "parameters": {
        "url": "={{$env.AITABLE_BASE_URL}}/{{$env.AITABLE_CLIENTS_TABLE}}",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "fields", "value": "={\"client_id\": \"{{$json.contact_id}}\", \"name\": \"{{$json.first_name}} {{$json.last_name}}\", \"email\": \"{{$json.email}}\", \"niche\": \"{{$json.niche}}\", \"membership_tier\": \"free\", \"lifecycle_stage\": \"onboarding\", \"engagement_score\": 0, \"signup_date\": \"{{$now.toISO()}}\"}"}
          ]
        }
      },
      "name": "Create AiTable Record",
      "type": "n8n-nodes-base.httpRequest",
      "position": [710, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SMTP_HOST}}",
        "fromEmail": "={{$env.SMTP_FROM_EMAIL}}",
        "toEmail": "={{$json.email}}",
        "subject": "Welcome to {{$json.directory_name}} — Your account is ready!",
        "text": "Hi {{$json.first_name}},\n\nWelcome! Your listing portal is ready.\n\nHere are your next 3 steps:\n1. Complete your profile\n2. Upload your business photos\n3. Set your service area\n\nLogin here: {{$env.SUITEDASH_PORTAL_URL}}\n\nQuestions? Just reply to this email.\n\n— The {{$json.directory_name}} Team"
      },
      "name": "Send Welcome Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [940, 300]
    },
    {
      "parameters": {
        "amount": 1,
        "unit": "days"
      },
      "name": "Wait 1 Day",
      "type": "n8n-nodes-base.wait",
      "position": [1170, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SMTP_HOST}}",
        "toEmail": "={{$json.email}}",
        "subject": "Complete your profile in 5 minutes",
        "text": "Hi {{$json.first_name}},\n\nPlumbers with complete profiles get 3x more inquiries.\n\nHere's your checklist:\n- Business description (keyword-rich)\n- High-quality photos\n- Service area\n- Credentials & licenses\n\nComplete it now: {{$env.SUITEDASH_PORTAL_URL}}\n\nNeed help? Reply to this email."
      },
      "name": "Day 1: Profile Completion",
      "type": "n8n-nodes-base.emailSend",
      "position": [1400, 300]
    },
    {
      "parameters": {
        "amount": 2,
        "unit": "days"
      },
      "name": "Wait 2 More Days",
      "type": "n8n-nodes-base.wait",
      "position": [1630, 300]
    },
    {
      "parameters": {
        "toEmail": "={{$json.email}}",
        "subject": "5 ways to make your listing stand out",
        "text": "Hi {{$json.first_name}},\n\n5 tips from our top-performing members:\n1. Use keywords clients search for\n2. Upload 5+ high-quality photos\n3. Fill out every optional field\n4. Add all certifications\n5. Ask past clients for reviews\n\nOptimize your listing: {{$env.SUITEDASH_PORTAL_URL}}"
      },
      "name": "Day 3: Optimization Tips",
      "type": "n8n-nodes-base.emailSend",
      "position": [1860, 300]
    }
  ],
  "connections": {
    "Webhook: Kickoff Form": {"main": [[{"node": "Create SuiteDash Contact", "type": "main", "index": 0}]]},
    "Create SuiteDash Contact": {"main": [[{"node": "Create AiTable Record", "type": "main", "index": 0}]]},
    "Create AiTable Record": {"main": [[{"node": "Send Welcome Email", "type": "main", "index": 0}]]},
    "Send Welcome Email": {"main": [[{"node": "Wait 1 Day", "type": "main", "index": 0}]]},
    "Wait 1 Day": {"main": [[{"node": "Day 1: Profile Completion", "type": "main", "index": 0}]]},
    "Day 1: Profile Completion": {"main": [[{"node": "Wait 2 More Days", "type": "main", "index": 0}]]},
    "Wait 2 More Days": {"main": [[{"node": "Day 3: Optimization Tips", "type": "main", "index": 0}]]}
  },
  "settings": {
    "executionOrder": "v1",
    "errorWorkflow": "dynasty-failure-handler"
  },
  "tags": [{"name": "dynasty"}, {"name": "onboarding"}, {"name": "pack-1"}]
}
```

## File: `n8n/02_engagement_scoring.json`

```json
{
  "name": "Dynasty - Pack 2: Engagement Scoring",
  "nodes": [
    {
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 2 * * *"}]
        }
      },
      "name": "Daily Cron 2AM",
      "type": "n8n-nodes-base.scheduleTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contacts",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "options": {"timeout": 60000}
      },
      "name": "GET All Contacts",
      "type": "n8n-nodes-base.httpRequest",
      "position": [480, 300]
    },
    {
      "parameters": {
        "jsCode": "const contacts = $input.all();\nconst results = [];\n\nfor (const item of contacts) {\n  const c = item.json;\n  const logins = (c.logins_30d || 0) * 2;\n  const profileUpdates = (c.profile_updates_30d || 0) * 3;\n  const features = (c.features_used_30d || 0) * 1;\n  const communityPosts = (c.community_posts_30d || 0) * 2;\n  const tickets = (c.support_tickets_30d || 0) * 5;\n  const daysSinceLogin = (c.days_since_login || 30) * 1;\n  \n  const score = logins + profileUpdates + features + communityPosts + tickets - daysSinceLogin;\n  \n  let riskLevel = 'healthy';\n  if (score < 20) riskLevel = 'high';\n  else if (score < 40) riskLevel = 'medium';\n  else if (score >= 60) riskLevel = 'highly_engaged';\n  \n  results.push({\n    json: {\n      contact_id: c.id,\n      score: Math.max(0, score),\n      previous_score: c.engagement_score || 0,\n      score_change: score - (c.engagement_score || 0),\n      risk_level: riskLevel,\n      needs_alert: score < 20 || (score - (c.engagement_score || 0)) < -20\n    }\n  });\n}\n\nreturn results;"
      },
      "name": "Calculate Scores",
      "type": "n8n-nodes-base.code",
      "position": [710, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contact/{{$json.contact_id}}",
        "method": "PUT",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "custom_engagement_score", "value": "={{$json.score}}"},
            {"name": "custom_churn_risk", "value": "={{$json.risk_level}}"},
            {"name": "custom_days_since_login", "value": "={{$json.days_since_login}}"}
          ]
        }
      },
      "name": "Update SuiteDash Contact",
      "type": "n8n-nodes-base.httpRequest",
      "position": [940, 300]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [{"value1": "={{$json.needs_alert}}", "value2": true}]
        }
      },
      "name": "Needs Alert?",
      "type": "n8n-nodes-base.if",
      "position": [1170, 300]
    },
    {
      "parameters": {
        "toEmail": "={{$env.SMTP_FROM_EMAIL}}",
        "subject": "ALERT: {{$json.contact_id}} engagement dropped to {{$json.score}}",
        "text": "Contact {{$json.contact_id}} engagement score: {{$json.score}} (was {{$json.previous_score}})\nRisk level: {{$json.risk_level}}\nChange: {{$json.score_change}}\n\nAction needed: Review and re-engage."
      },
      "name": "Send Alert Email",
      "type": "n8n-nodes-base.emailSend",
      "position": [1400, 200]
    }
  ],
  "connections": {
    "Daily Cron 2AM": {"main": [[{"node": "GET All Contacts", "type": "main", "index": 0}]]},
    "GET All Contacts": {"main": [[{"node": "Calculate Scores", "type": "main", "index": 0}]]},
    "Calculate Scores": {"main": [[{"node": "Update SuiteDash Contact", "type": "main", "index": 0}]]},
    "Update SuiteDash Contact": {"main": [[{"node": "Needs Alert?", "type": "main", "index": 0}]]},
    "Needs Alert?": {"main": [[{"node": "Send Alert Email", "type": "main", "index": 0}], []]}
  },
  "settings": {"executionOrder": "v1", "errorWorkflow": "dynasty-failure-handler"},
  "tags": [{"name": "dynasty"}, {"name": "engagement"}, {"name": "pack-2"}]
}
```

## File: `n8n/05_failure_handler.json`

```json
{
  "name": "Dynasty - Pack 5: Failure Handler (DLQ)",
  "nodes": [
    {
      "parameters": {},
      "name": "Error Trigger",
      "type": "n8n-nodes-base.errorTrigger",
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "const error = $input.first().json;\nconst retryCount = error.retry_count || 0;\nconst maxRetries = 3;\nconst backoffMinutes = [1, 5, 30];\n\nreturn [{\n  json: {\n    workflow_name: error.workflow?.name || 'unknown',\n    node_name: error.execution?.lastNodeExecuted || 'unknown',\n    error_type: error.execution?.error?.name || 'unknown',\n    error_message: error.execution?.error?.message || 'No message',\n    contact_id: error.execution?.data?.contact_id || '',\n    retry_count: retryCount,\n    max_retries: maxRetries,\n    should_retry: retryCount < maxRetries,\n    backoff_minutes: backoffMinutes[retryCount] || 30,\n    timestamp: new Date().toISOString(),\n    status: retryCount >= maxRetries ? 'needs_manual_review' : 'retrying'\n  }\n}];"
      },
      "name": "Parse Error Context",
      "type": "n8n-nodes-base.code",
      "position": [480, 300]
    },
    {
      "parameters": {
        "url": "https://api.aitable.com/v0/{{$env.AITABLE_BASE_ID}}/{{$env.AITABLE_DLQ_TABLE}}",
        "method": "POST",
        "authentication": "genericCredentialType",
        "genericAuthType": "httpHeaderAuth",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "fields", "value": "={{JSON.stringify({workflow_name: $json.workflow_name, node_name: $json.node_name, error_type: $json.error_type, error_message: $json.error_message, contact_id: $json.contact_id, retry_count: $json.retry_count, status: $json.status, timestamp: $json.timestamp})}}"}
          ]
        }
      },
      "name": "Log to AiTable DLQ",
      "type": "n8n-nodes-base.httpRequest",
      "position": [710, 300]
    },
    {
      "parameters": {
        "conditions": {
          "boolean": [{"value1": "={{$json.should_retry}}", "value2": true}]
        }
      },
      "name": "Should Retry?",
      "type": "n8n-nodes-base.if",
      "position": [940, 300]
    },
    {
      "parameters": {
        "amount": "={{$json.backoff_minutes}}",
        "unit": "minutes"
      },
      "name": "Backoff Wait",
      "type": "n8n-nodes-base.wait",
      "position": [1170, 200]
    },
    {
      "parameters": {
        "toEmail": "={{$env.SMTP_FROM_EMAIL}}",
        "subject": "CRITICAL: Workflow {{$json.workflow_name}} failed after 3 retries",
        "text": "Workflow: {{$json.workflow_name}}\nNode: {{$json.node_name}}\nError: {{$json.error_message}}\nContact: {{$json.contact_id}}\nRetries exhausted: {{$json.retry_count}}/{{$json.max_retries}}\n\nManual review required. Check AiTable DLQ table."
      },
      "name": "Send Critical Alert",
      "type": "n8n-nodes-base.emailSend",
      "position": [1170, 400]
    }
  ],
  "connections": {
    "Error Trigger": {"main": [[{"node": "Parse Error Context", "type": "main", "index": 0}]]},
    "Parse Error Context": {"main": [[{"node": "Log to AiTable DLQ", "type": "main", "index": 0}]]},
    "Log to AiTable DLQ": {"main": [[{"node": "Should Retry?", "type": "main", "index": 0}]]},
    "Should Retry?": {"main": [[{"node": "Backoff Wait", "type": "main", "index": 0}], [{"node": "Send Critical Alert", "type": "main", "index": 0}]]}
  },
  "settings": {"executionOrder": "v1"},
  "tags": [{"name": "dynasty"}, {"name": "dlq"}, {"name": "pack-5"}]
}
```

## File: `n8n/07_agent_router.json`

```json
{
  "name": "Dynasty - Agent Router: Lead Qualification",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "lead-qualification",
        "responseMode": "lastNode",
        "options": {}
      },
      "name": "Webhook: New Lead",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300]
    },
    {
      "parameters": {
        "jsCode": "const lead = $input.first().json;\n\nlet urgency = 5;\nif (lead.urgency === 'Emergency') urgency = 25;\nelse if (lead.urgency === 'This Week') urgency = 15;\nelse if (lead.urgency === 'This Month') urgency = 10;\n\nlet budget = 5;\nif (lead.service_type === 'Commercial' || lead.budget === 'Premium') budget = 25;\nelse if (lead.budget === 'Standard') budget = 15;\n\nlet location = 5;\nif (lead.in_primary_area) location = 20;\nelse if (lead.in_adjacent_area) location = 10;\n\nlet size = 3;\nif ((lead.team_size || 0) > 50) size = 15;\nelse if ((lead.team_size || 0) > 10) size = 12;\nelse if ((lead.team_size || 0) > 2) size = 7;\n\nconst requiredFields = ['name', 'email', 'phone', 'service_type'];\nconst filled = requiredFields.filter(f => lead[f]).length;\nconst completeness = Math.round((filled / requiredFields.length) * 15);\n\nconst totalScore = urgency + budget + location + size + completeness;\n\nlet priority = 'cold';\nlet tier = 'free';\nlet action = 'nurture_only';\n\nif (totalScore >= 80) { priority = 'hot'; tier = 'premium'; action = 'assign_senior'; }\nelse if (totalScore >= 50) { priority = 'warm'; tier = 'basic'; action = 'standard_onboarding'; }\nelse if (totalScore >= 25) { priority = 'cold'; tier = 'free'; action = 'nurture_only'; }\n\nreturn [{ json: { ...lead, score: totalScore, priority, recommended_tier: tier, routing_action: action, scored_at: new Date().toISOString() } }];"
      },
      "name": "Score Lead",
      "type": "n8n-nodes-base.code",
      "position": [480, 300]
    },
    {
      "parameters": {
        "url": "https://api.aitable.com/v0/{{$env.AITABLE_BASE_ID}}/{{$env.AITABLE_LEAD_SCORES_TABLE}}",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "fields", "value": "={{JSON.stringify({contact_email: $json.email, niche: $json.niche, total_score: $json.score, priority: $json.priority, recommended_tier: $json.recommended_tier, routing_action: $json.routing_action, timestamp: $json.scored_at})}}"}
          ]
        }
      },
      "name": "Log Score to AiTable",
      "type": "n8n-nodes-base.httpRequest",
      "position": [710, 300]
    },
    {
      "parameters": {
        "rules": {
          "rules": [
            {"output": 0, "conditions": {"conditions": [{"leftValue": "={{$json.priority}}", "rightValue": "hot", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 1, "conditions": {"conditions": [{"leftValue": "={{$json.priority}}", "rightValue": "warm", "operator": {"type": "string", "operation": "equals"}}]}},
            {"output": 2}
          ]
        }
      },
      "name": "Route by Priority",
      "type": "n8n-nodes-base.switch",
      "position": [940, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contact",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "first_name", "value": "={{$json.first_name}}"},
            {"name": "last_name", "value": "={{$json.last_name}}"},
            {"name": "email", "value": "={{$json.email}}"},
            {"name": "role", "value": "lead"},
            {"name": "custom_membership_tier", "value": "premium"},
            {"name": "custom_lifecycle_stage", "value": "onboarding"}
          ]
        }
      },
      "name": "Create Premium Lead",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1200, 150]
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contact",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "first_name", "value": "={{$json.first_name}}"},
            {"name": "last_name", "value": "={{$json.last_name}}"},
            {"name": "email", "value": "={{$json.email}}"},
            {"name": "role", "value": "lead"},
            {"name": "custom_membership_tier", "value": "basic"},
            {"name": "custom_lifecycle_stage", "value": "onboarding"}
          ]
        }
      },
      "name": "Create Standard Lead",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1200, 300]
    },
    {
      "parameters": {
        "url": "={{$env.SUITEDASH_BASE_URL}}/contact",
        "method": "POST",
        "sendBody": true,
        "bodyParameters": {
          "parameters": [
            {"name": "first_name", "value": "={{$json.first_name}}"},
            {"name": "last_name", "value": "={{$json.last_name}}"},
            {"name": "email", "value": "={{$json.email}}"},
            {"name": "role", "value": "lead"},
            {"name": "custom_membership_tier", "value": "free"}
          ]
        }
      },
      "name": "Create Free Lead",
      "type": "n8n-nodes-base.httpRequest",
      "position": [1200, 450]
    }
  ],
  "connections": {
    "Webhook: New Lead": {"main": [[{"node": "Score Lead", "type": "main", "index": 0}]]},
    "Score Lead": {"main": [[{"node": "Log Score to AiTable", "type": "main", "index": 0}]]},
    "Log Score to AiTable": {"main": [[{"node": "Route by Priority", "type": "main", "index": 0}]]},
    "Route by Priority": {"main": [[{"node": "Create Premium Lead", "type": "main", "index": 0}], [{"node": "Create Standard Lead", "type": "main", "index": 0}], [{"node": "Create Free Lead", "type": "main", "index": 0}]]}
  },
  "settings": {"executionOrder": "v1", "errorWorkflow": "dynasty-failure-handler"},
  "tags": [{"name": "dynasty"}, {"name": "agents"}, {"name": "lead-qualification"}]
}
```

---

# 5. SUITEDASH CONFIGURATION JSONs

## File: `suitedash/custom_fields.json`

```json
{
  "target_fields": [
    {"name": "Directory Source", "type": "dropdown", "options": ["Plumbing", "HVAC", "Pest Control", "Roofing", "Real Estate", "Property Mgmt", "Immigration", "Tax/Accounting", "Medical Billing", "Cleaning", "Landscaping", "Auto Repair", "Childcare", "Fitness", "Digital Marketing", "Construction"]},
    {"name": "Membership Tier", "type": "dropdown", "options": ["Free", "Basic", "Premium"]},
    {"name": "Engagement Score", "type": "number", "default": 0},
    {"name": "Lifecycle Stage", "type": "dropdown", "options": ["Onboarding", "Active", "At-Risk", "Churned"]},
    {"name": "Onboarding Complete", "type": "checkbox", "default": false},
    {"name": "Days Since Last Login", "type": "number", "default": 0},
    {"name": "LTV", "type": "currency", "default": 0},
    {"name": "Acquisition Channel", "type": "dropdown", "options": ["Organic", "Paid", "Referral", "Outreach", "Trade Association"]},
    {"name": "NPS Score", "type": "number", "default": 0},
    {"name": "Churn Risk", "type": "dropdown", "options": ["Low", "Medium", "High"]}
  ],
  "contact_fields": [
    {"name": "LinkedIn URL", "type": "url"},
    {"name": "Professional Title", "type": "text"},
    {"name": "Company Size", "type": "dropdown", "options": ["Solo", "2-10", "11-50", "51+"]}
  ],
  "company_public_fields": [
    {"name": "Industry", "type": "dropdown", "options": ["Plumbing", "HVAC", "Pest Control", "Roofing", "Real Estate", "Property Management", "Immigration Law", "Accounting", "Medical Billing", "Cleaning", "Landscaping", "Auto Repair", "Childcare", "Fitness", "Digital Marketing", "Construction"]},
    {"name": "Website", "type": "url"},
    {"name": "Years in Business", "type": "number"}
  ],
  "company_private_fields": [
    {"name": "Internal Notes", "type": "textarea"},
    {"name": "Revenue Tier", "type": "dropdown", "options": ["$0-1K", "$1K-5K", "$5K-25K", "$25K+"]},
    {"name": "Strategic Priority", "type": "dropdown", "options": ["Standard", "VIP", "Whale"]}
  ]
}
```

## File: `suitedash/pipelines.json`

```json
{
  "pipelines": [
    {
      "name": "Directory Member Acquisition",
      "stages": [
        {"name": "Lead Captured", "probability": 10, "order": 1},
        {"name": "Contacted", "probability": 25, "order": 2},
        {"name": "Demo Booked", "probability": 50, "order": 3},
        {"name": "Proposal Sent", "probability": 65, "order": 4},
        {"name": "Negotiation", "probability": 80, "order": 5},
        {"name": "Won", "probability": 100, "order": 6},
        {"name": "Lost", "probability": 0, "order": 7}
      ]
    },
    {
      "name": "Renewal & Upsell",
      "stages": [
        {"name": "Active Member", "probability": 0, "order": 1},
        {"name": "Renewal Approaching", "probability": 70, "order": 2},
        {"name": "Upsell Opportunity", "probability": 50, "order": 3},
        {"name": "At Risk", "probability": 30, "order": 4},
        {"name": "Renewed", "probability": 100, "order": 5},
        {"name": "Churned", "probability": 0, "order": 6}
      ]
    }
  ]
}
```

## File: `suitedash/circles.json`

```json
{
  "circle_naming_convention": "[Niche]-[Tier]",
  "template_per_niche": [
    {"suffix": "Free", "marketing_sync": true, "purpose": "Free tier members"},
    {"suffix": "Basic", "marketing_sync": true, "purpose": "Basic paid members"},
    {"suffix": "Premium", "marketing_sync": true, "purpose": "Premium paid members"},
    {"suffix": "Churned", "marketing_sync": true, "purpose": "Lost members for win-back"},
    {"suffix": "VIP", "marketing_sync": true, "purpose": "High-value strategic accounts"}
  ],
  "global_circles": [
    {"name": "All-Onboarding", "marketing_sync": false, "purpose": "Currently in onboarding FLOW"},
    {"name": "All-At-Risk", "marketing_sync": false, "purpose": "Engagement score <20"}
  ],
  "example_for_plumbing": [
    "Plumbing-Free",
    "Plumbing-Basic",
    "Plumbing-Premium",
    "Plumbing-Churned",
    "Plumbing-VIP"
  ]
}
```

## File: `suitedash/folder_structure.json`

```json
{
  "folder_generator_template": {
    "root": "[CompanyName]",
    "children": [
      {
        "name": "Private",
        "visibility": "staff_only",
        "children": [
          {"name": "Internal-Notes", "purpose": "Staff-only account notes"},
          {"name": "Contracts", "purpose": "Signed agreements, ToS"},
          {"name": "Compliance", "purpose": "Licenses, verification docs"}
        ]
      },
      {
        "name": "Shared",
        "visibility": "client_and_staff",
        "children": [
          {"name": "Onboarding", "purpose": "Welcome package, guides"},
          {"name": "Resources", "purpose": "Templates, marketing assets"},
          {"name": "Communication", "purpose": "Meeting notes, follow-ups"}
        ]
      },
      {
        "name": "Deliverables",
        "visibility": "client_and_staff",
        "children": [
          {"name": "Reports", "purpose": "Performance reports"},
          {"name": "Assets", "purpose": "Logos, images, content"},
          {"name": "Exports", "purpose": "Data exports, backups"}
        ]
      }
    ]
  }
}
```

---

# 6. DEPLOYMENT INSTRUCTIONS (README)

## Step-by-Step Deployment Order

### Pre-Requisites
1. SuiteDash account on Thrive or Pinnacle plan (for API rate limits)
2. AiTable Pro account
3. n8n instance (cloud or self-hosted)
4. Stripe account with API keys
5. SMTP provider (SendGrid, Postmark, or SuiteDash built-in)
6. OpenAI API key (for Agent Layer — Phase 4)

### Step 1: Environment Setup (30 minutes)
1. Copy `env/.env.example` to `env/.env`
2. Fill in all API keys and credentials
3. Verify SuiteDash API key works: `curl -H "X-API-KEY: your_key" https://portal.yourdeputy.com/secure-api/contacts`
4. Verify AiTable access
5. Verify n8n webhook endpoint is reachable

### Step 2: AiTable Base Setup (1 hour)
1. Create new AiTable Base: "Dynasty Empire Operations"
2. Import each CSV from `data/` as a new table (12 tables total: clients, projects, tasks, engagement_scores, lead_scores, communication_log, workflow_state, dlq, daily_analytics, audit_log, event_log, system_config)
3. Set field types to match CSV headers (number, date, dropdown, etc.)
4. Create Views: "Active Clients," "At Risk," "DLQ Unresolved," "Daily Dashboard," "Paused Events," "Audit Failures"
5. In `system_config` table: create one record with `config_key = system_active`, `value = true` — note the record ID
6. Update `.env` with actual table IDs and the system_active record ID

### Step 3: SuiteDash Core Setup (Phase 1 — 2 weeks)
Follow the Full Deployment System document, Steps 1.1 through 1.14, using the configurations in `suitedash/`:
1. Organization + Branding (1.1, 1.2)
2. Staff + Teams (1.3)
3. CRM Custom Fields from `custom_fields.json` (1.4)
4. Pipelines from `pipelines.json` (1.5)
5. Circles from `circles.json` (1.6)
6. Office + Items + Plans (1.7)
7. Forms using niche pack Kickoff Form definitions (1.8)
8. FLOWs (1.9)
9. Support Tickets (1.10)
10. Dashboards (1.11)
11. Email Templates (1.12)
12. Integrations + API Key (1.13)
13. Custom Menus (1.14)

### Step 4: n8n Workflow Import (1 week)
1. Import `n8n/05_failure_handler.json` → Activate FIRST (this must be active before all others)
2. Import `n8n/08_master_event_router.json` → Activate (this is your single SuiteDash webhook endpoint)
3. Import `n8n/01_onboarding.json` → Activate
4. Import `n8n/02_engagement_scoring.json` → Activate
5. Set Pack 5 as the error workflow for all other workflows
6. Import remaining packs (03, 04, 06)
7. Import `n8n/07_agent_router.json` (activate in Phase 4)
8. Import `n8n/09_qa_audit.json` (activate in Phase 4)
9. Configure SuiteDash webhook to point to Master Event Router: `{N8N_WEBHOOK_BASE}/dynasty-events`
10. Create AiTable `system_config` record with `system_active = true` (Emergency Stop)

### Step 5: First Niche Deployment (1 week)
1. Choose first niche (recommended: Plumbing)
2. Load niche config from `suitedash/niche_configs/plumbing.json`
3. Create niche-specific custom fields
4. Create niche circles
5. Create niche Kickoff Form
6. Create niche Project Template
7. Test: Submit test lead → Verify full lifecycle

### Step 6: Scale to All 16 Niches (3 weeks)
Repeat Step 5 for each niche, following the deployment order in the 16 Niche Packs document.

### Step 7: Agent Layer (2 weeks)
1. Activate `n8n/07_agent_router.json`
2. Configure OpenAI API credentials in n8n
3. Test lead scoring with sample submissions
4. Monitor decisions in AiTable `lead_scores` table
5. Gradually expand agent capabilities (Service Matching → Communication → Analytics)

### Step 8: Monitoring Dashboard (1 week)
1. Create AiTable Interface from `daily_analytics` table
2. Set up alert automations (email on threshold breach)
3. Configure weekly and monthly report generation

---

## Total Deployment Timeline: 10 Weeks

| Week | Focus | Key Deliverable |
|------|-------|----------------|
| 1 | Environment + AiTable (12 tables) | All infrastructure connected, Emergency Stop ready |
| 2-3 | SuiteDash Phase 1 | Portal fully configured |
| 4 | n8n: Failure Handler + Master Event Router + Packs 1-3 | Core routing + Onboarding, Engagement, Renewal live |
| 5 | n8n Packs 4-6 + Testing | Win-back, DLQ, Sync live |
| 6 | First niche (Plumbing) | Full lifecycle tested end-to-end |
| 7-8 | Remaining 15 niches | All directories operational |
| 9 | Agent Layer + QA/Audit Agent | Lead qualification + system integrity checks automated |
| 10 | Monitoring + Polish | Dashboard live, system tuned, Emergency Stop tested |

---

*These assets are designed to be imported directly into their respective tools. The n8n JSONs (9 workflows including Master Event Router and QA/Audit) can be pasted into n8n's workflow import. The CSVs (12 tables including audit_log, event_log, and system_config for Emergency Stop) can be imported into AiTable. The SuiteDash JSONs serve as configuration references for manual setup (SuiteDash does not have a bulk import API for settings).*
