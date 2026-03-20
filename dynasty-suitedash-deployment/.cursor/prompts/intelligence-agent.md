# Intelligence Agent

You build the entire AI agent layer — 7 agents + orchestrator + prompts.

## Tasks
1. Read `../SuiteDash_AI_Agent_Layer.md` completely — it has full specs for all 7 agents
2. Create `agents/config.js`:
   - dotenv loading
   - OpenAI client (using `openai` package)
   - AiTable helper: `get(table, filter)`, `create(table, fields)`, `update(table, recordId, fields)`
   - SuiteDash helper: `get(endpoint)`, `post(endpoint, body)`, `put(endpoint, body)` with X-API-KEY auth
   - Rate limiter: Track API calls against monthly limit
   - Logger: Writes to console + AiTable audit_log

3. Create `agents/orchestrator.js`:
   - Receives `{ event_type, payload, source }`
   - Routes to correct agent based on event type mapping:
     - kickoff_form_submitted → lead-qualification
     - lead_form_submitted → lead-qualification
     - engagement_score_dropped → client-communication
     - milestone_reached → client-communication
     - subscription_approaching_renewal → workflow-orchestrator
     - subscription_cancelled → client-communication
     - workflow_failed → failure-detection
     - payment_failed → failure-detection
     - daily_cron_4am → qa-audit
     - daily_cron_2am → performance-analytics
   - Logs every decision to AiTable agent_decisions

4. Create each agent module (all in `agents/`):

   **lead-qualification.js**
   - Scoring: Urgency(25) + Budget(25) + Location(20) + Size(15) + Completeness(15) = 100
   - Hot (80+) → premium, assign_senior
   - Warm (50-79) → basic, standard_onboarding
   - Cold (25-49) → free, nurture_only
   - Low (<25) → archive
   - Logs to AiTable lead_scores table

   **service-matching.js**
   - Compares lead profile against niche config requirements
   - Recommends tier (Free/Basic/Premium) based on field completeness + budget
   - Logs to AiTable service_matches (use agent_decisions table)

   **workflow-orchestrator.js**
   - Checks AiTable workflow_state for active workflows on the contact
   - Prevents conflicts (no two onboarding workflows simultaneously)
   - Prioritizes: critical > high > medium > low
   - Creates workflow_state record when starting a new workflow

   **client-communication.js**
   - 8 triggers: welcome, profile_incomplete, engagement_drop, milestone, renewal_approaching, renewal_overdue, win_back, re_engagement
   - 24-hour throttle: check communication_log for last sent time
   - 8am-8pm send window (queue outside hours)
   - Logs to AiTable communication_log

   **performance-analytics.js**
   - Calculates: MRR, churn rate, avg engagement, onboarding completion rate, LTV, NPS, DLQ count, API usage, support tickets
   - Alert thresholds from AI Agent Layer doc
   - Writes daily summary to AiTable daily_analytics

   **failure-detection.js**
   - Monitors: API timeouts, webhook failures, payment failures, email bounces, workflow stalls, data sync drift, rate limit approach, auth failures
   - Auto-recovery: retry with backoff for transient errors
   - System Health Score = weighted average of all checks
   - Logs to AiTable dlq for persistent failures

   **qa-audit.js**
   - 11 checks (see AI Agent Layer doc): contact count match, engagement scores populated, DLQ not stale, onboarding flows progressing, API usage safe, revenue reconciliation, pipeline stage distribution, email delivery health, Circle membership accurate, workflow state consistency, data freshness
   - Auto-fix safe corrections (re-trigger engagement scoring, escalate stale DLQ)
   - Logs to AiTable audit_log

5. Create prompt files in `agents/prompts/`:
   - `master-prompt.txt` — Drop-in system prompt from AI Agent Layer doc
   - `lead-scoring.txt` — Specialized lead qualification prompt
   - `service-match.txt` — Service matching prompt
   - `communication.txt` — Communication agent prompt with tone guidelines

## Reference
- `../SuiteDash_AI_Agent_Layer.md` — FULL specifications for all agents
- `../SuiteDash_Strategic_Guardrails.md` — Capability matrix and constraints
- `../SuiteDash_16_Niche_Packs.md` — Niche-specific data for service matching

## Rules
- Every agent must be a real, functional module — not a stub
- Every agent must handle errors gracefully
- Every agent must log decisions to AiTable
- Use OpenAI's chat completions API with function calling where appropriate
- Use the prompts from `../SuiteDash_AI_Agent_Layer.md` as the base
