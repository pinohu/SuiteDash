# SuiteDash Strategic Guardrails & Operational Protections
## Dynasty Empire — portal.yourdeputy.com

**Date:** March 19, 2026
**Purpose:** Fill every strategic gap missing from the Deployment System — capability reality checks, decision engine, constraint layer, RBAC protections, client experience design, scaling strategy, and module-level boundaries.

**This document is the "WHY and WHEN" companion to the Deployment System's "HOW."**

---

# 1. FULL CAPABILITY MATRIX (Production Reality)

Every SuiteDash module assessed for what it actually does in production — not marketing claims.

## 1.1 CRM (Contacts, Companies, Circles)

**What it really is:** A relationship registry and identity layer, not a full relational CRM.

**Use for:**
- Client identity and contact records
- Company grouping and hierarchy
- Lifecycle tagging (Lead → Prospect → Client)
- Circle-based isolation (one Circle = one data boundary)

**Limitations:**
- No deep relational linking between records (no parent-child queries, no junction tables)
- Weak querying and filtering at scale (no SQL-like operations, no compound filters beyond basic search)
- No native lead scoring — must be calculated externally (n8n + AiTable)
- Custom field types are adequate but not programmable

**Best Practice:**
- Treat CRM as identity layer ONLY
- Store all operational data, analytics, and computed fields externally (AiTable or PostgreSQL)
- Use Tags for dynamic behavior, not new Roles
- Use Circles as the primary isolation boundary between clients/directories

---

## 1.2 Projects + Tasks

**What it really is:** A container system for tracking deliverables, not a workflow engine.

**Use for:**
- Client deliverables tracking
- Internal lightweight workflows (intake → setup → delivery → QA)
- Time tracking via Timers
- Template-based project creation via Generators

**Limitations:**
- Task dependencies are shallow (no critical path, no Gantt logic, no auto-scheduling)
- Task automation is limited to basic triggers (complete → notify)
- No subtask nesting beyond one level
- Kanban view exists but lacks swimlanes and WIP limits
- Project progress calculation has three modes (% complete, phase-based, manual) but none auto-calculate from task completion accurately

**Do NOT use for:**
- Complex workflow orchestration (use n8n)
- Multi-stage approval chains (use external logic)
- Resource management or capacity planning

---

## 1.3 Pipelines (Deals)

**What it really is:** Kanban-style stage tracking for sales visualization, not a full CRM pipeline engine.

**Use for:**
- Lead → Client conversion tracking
- Status visualization (stage, probability, expected value)
- Forecast views for revenue projection
- Triggering automations on stage change

**Limitations:**
- No advanced branching logic (a deal can only be in one stage, cannot fork)
- No built-in lead routing rules
- No automatic stage progression based on conditions
- Pipeline reports are basic (no cohort analysis, no conversion funnel metrics)
- No native pipeline-to-pipeline linking

**Best Practice:**
- Keep pipelines simple (5-7 stages max)
- Use stage-change triggers to fire n8n webhooks for complex logic
- Store pipeline analytics in AiTable for real reporting

---

## 1.4 Invoicing + Subscriptions

**What it really is:** Adequate for simple recurring billing, weak for complex SaaS pricing.

**Use for:**
- Fixed monthly/annual service billing
- Setup fees (one-time invoices)
- Basic subscription plans with Items, Packages, Add-ons, Price Bumps
- Payment gateway integration (Stripe primary)
- Invoice PDF generation and delivery
- Accumulating invoices (usage-based aggregation — basic)

**Limitations:**
- No native dunning sophistication (failed payment retry is basic — email only, no smart retry scheduling)
- Limited proration logic (no mid-cycle plan changes with automatic credit/debit)
- No tiered pricing engine (e.g., $10/user for 1-10, $8/user for 11-50)
- No usage-based billing (metered billing must be handled externally)
- No multi-currency per subscription (one currency per invoice)
- Tax handling is basic (flat rates, no jurisdiction-aware tax calculation)

**Offload to Stripe when:**
- Tiered or usage-based pricing
- Multi-product bundle billing
- Advanced dunning (Stripe has smart retry)
- Revenue recognition requirements
- Multi-currency subscriptions

**Best Practice:**
- SuiteDash = invoice delivery and client visibility
- Stripe = payment processing and subscription intelligence
- AiTable = revenue analytics and LTV calculation

---

## 1.5 File Sharing

**What it really is:** Strong but dangerous if misconfigured.

**Critical behavior:**
- Folder permissions CAN leak across clients if folders are not properly isolated
- Shared folders grant access to ALL contents — no per-file permissions within a shared folder
- File Transfer Packages are the safest way to send files externally

**Mandatory per-client folder structure:**

```
/[ClientName]/
    /Private/       ← Staff-only documents, internal notes
    /Shared/        ← Client-visible files, collaboration
    /Deliverables/  ← Final outputs for client download
```

**Rules:**
- ALWAYS create this structure via Folder Generator on client creation
- NEVER create shared folders at the root level
- NEVER allow clients to browse above their own folder
- Use the Folder Generator automation action in Kickoff Forms to auto-create on signup

---

## 1.6 Forms

**What it really is:** Underestimated for intake, limited for complex logic.

**Use for:**
- Onboarding and intake (Kickoff Forms — create contacts automatically)
- Profile updates (Update Forms — modify existing records)
- Payment collection (Checkout Forms — process transactions)
- Appointment scheduling (Booking Forms)
- Support intake (Support Ticket Forms)
- Email collection (Subscriber Forms)

**Limitations:**
- No deep conditional branching (show/hide logic is basic — no multi-level dependencies)
- No reusable schema logic (each form is standalone, no shared field definitions)
- No calculated fields within forms
- No multi-page forms with progress indicators (use FLOWs for multi-step)
- Form embed styling options are limited

**Offload to external forms when:**
- Complex conditional logic with multi-level dependencies → GoZen Forms, Formaloo
- Dynamic workflows that change based on previous answers
- Multi-page survey-style forms with branching
- Forms that need to write to multiple systems simultaneously

**Best Practice:**
- Use SuiteDash forms for anything that creates/updates a SuiteDash record
- Use external forms for complex data collection, then sync via n8n webhook

---

## 1.7 Flow (Native Automation Engine — Auto-Templates + Schedules)

**What it really is:** Your biggest underused asset, but with clear boundaries.

**What it can do:**
- Trigger actions on: Form submission, Pipeline stage change, Invoice events, Role conversion, Circle assignment, Document signing, Appointment booking, FLOW completion, Support ticket events
- Execute 30+ action types (email, create project, move deal, generate invoice, assign FLOW, add to Circle, etc.)
- Conditional logic via IF/THEN on Custom Field values
- Scheduled recurring actions (daily/weekly/monthly/yearly)
- Form Cannon (fire forms to multiple recipients — PLUS bundle feature)

**Limitations:**
- No complex branching (IF/THEN is single-level, no nested conditions, no AND/OR combinators)
- No retry logic (if an action fails, it fails silently)
- No delay nodes (cannot say "wait 3 days, then do X" — must use Schedules or external n8n)
- No loop/iteration (cannot "for each contact in Circle, do X")
- No error handling or fallback actions
- No execution logging (you cannot see what ran, when, or whether it succeeded)

**Use ONLY for:**
- Lightweight, immediate, UI-driven actions
- Single-trigger → single-action-chain automations
- Actions that must stay inside SuiteDash (Circle management, Portal access, FLOW assignment)

**Use n8n instead for:**
- Multi-step sequences with delays
- Conditional branching with multiple paths
- Retry logic and error handling
- Any workflow that touches external systems
- Anything requiring execution logging

---

# 2. SUITEDASH vs EXTERNAL TOOLS DECISION ENGINE

**Golden Rule:** SuiteDash = Interface + Coordination. External = Logic + Intelligence.

## Decision Table

| Use Case | Use SuiteDash | Use External | Why |
|----------|:---:|:---:|-----|
| Client portal / dashboard | ✅ | ❌ | SuiteDash's core strength |
| Contact/company identity | ✅ | ❌ | CRM is the identity layer |
| Simple billing (fixed monthly) | ✅ | ❌ | Adequate for simple plans |
| File sharing (per-client) | ✅ | ❌ | Good with proper isolation |
| Onboarding FLOWs | ✅ | ❌ | Multi-step native feature |
| Email templates (transactional) | ✅ | ❌ | 138 customizable templates |
| Support tickets | ✅ | ❌ | Built-in with inboxes |
| Simple automation (single trigger→action) | ✅ | ❌ | Auto-Templates work fine |
| Complex workflows (multi-step, branching) | ❌ | ✅ n8n | SuiteDash can't branch or retry |
| Billing (tiered, usage-based, dunning) | ❌ | ✅ Stripe | SuiteDash billing is basic |
| Data storage / querying | ❌ | ✅ AiTable/PG | No relational DB in SuiteDash |
| Reporting / analytics | ❌ | ✅ AiTable/Metabase | SuiteDash reporting is minimal |
| Email sequences (drip campaigns) | ❌ | ✅ n8n + SMTP | SuiteDash Marketing lacks drip logic |
| Lead scoring / engagement calc | ❌ | ✅ n8n + AiTable | Must be computed externally |
| Complex forms (conditional) | ❌ | ✅ GoZen/Formaloo | SuiteDash forms lack branching |
| Webhook orchestration | ❌ | ✅ n8n | SuiteDash can send webhooks, not receive/route them |

## When in Doubt

Ask these three questions:
1. Does this need to be visible in the client portal? → SuiteDash
2. Does this need logic, retry, or branching? → External (n8n)
3. Does this need queryable data? → External (AiTable/DB)

---

# 3. CONSTRAINT LAYER (Hard Limits)

Design WITH these constraints, not against them.

## Hard Limits

| Constraint | Impact | Design Response |
|------------|--------|-----------------|
| No real database relationships | Cannot join tables, no foreign keys, no complex queries | Use AiTable as relational data layer; SuiteDash stores identity only |
| Limited automation branching | IF/THEN is single-level only, no nested logic | All complex logic lives in n8n; SuiteDash fires webhooks to n8n |
| UI-driven workflows | All configuration is click-based, no scripting, no bulk operations | Accept manual setup for initial config; automate via API for scale |
| Performance slows with scale | Large contact lists (5000+) may slow CRM views and searches | Paginate API calls; archive inactive contacts; use AiTable for heavy queries |
| API rate limits | Free=80/mo, Start=400/mo, Thrive=2K/mo, Pinnacle=20K/mo | Batch API calls; cache responses in AiTable; use webhooks over polling |
| No native multi-tenancy | Cannot create true isolated tenants within one SuiteDash instance | Simulate via Circles + Tags + Custom Fields; never rely on SuiteDash for data isolation guarantees |
| Silent automation failures | Auto-Templates do not log failures or send error notifications | All critical automations go through n8n with DLQ; use SuiteDash only for non-critical UI actions |
| No execution audit trail | Cannot see which automations ran, when, or for whom | Log all n8n executions to AiTable; build monitoring dashboard |

## Use SuiteDash As

- Portal (client-facing UI)
- CRM-lite (identity + lifecycle tags)
- Billing-lite (simple subscriptions + invoice delivery)
- File vault (with proper isolation)
- Onboarding orchestrator (FLOWs)

## Do NOT Use SuiteDash As

- Data engine (no queryable storage)
- Logic engine (no branching, no retry, no error handling)
- Analytics platform (no dashboards, no charts beyond basic reporting block)
- Marketing automation platform (no drip sequences, no A/B testing, no behavioral triggers)

---

# 4. RBAC + MULTI-TENANT PROTECTIONS

## Golden Rule

**One Client = One Data Universe**

Every client must exist within an isolated boundary where they cannot see, access, or infer the existence of other clients.

## Isolation Structure

```
Client A (Circle: "DirectoryX-ClientA")
 ├── CRM Record (Contact + Company)
 ├── Project(s) (assigned only to Client A)
 ├── Files (/ClientA/Private/, /ClientA/Shared/, /ClientA/Deliverables/)
 ├── Portal View (Dashboard assigned to their Circle/Role)
 ├── Invoices (visible only to them)
 └── Support Tickets (visible only to them + assigned staff)

Client B (Circle: "DirectoryX-ClientB")
 ├── Completely separate universe
 └── ZERO visibility into Client A's data
```

## Required Roles (Fixed — Do NOT Add More)

| Role | Purpose | Access Level |
|------|---------|-------------|
| Super Admin | You (Ike) only | Everything — never delegate |
| Admin | Internal management | Full access except Manage Account |
| Project Manager | Operations staff | CRM + Projects + limited Office |
| Salesperson | Sales team | CRM + Deals focused |
| Teammate | Task executors | Projects only |
| Lead | Inbound prospect | Minimal portal — pre-qualification |
| Prospect | Qualified lead | Limited portal |
| Client | Active paying member | Full portal experience |
| Sub-Client | Client's team members | Scoped by parent client |
| Contractor | External limited execution | Specific project access only |

## Three Critical Protections

**1. NO shared folders across clients**
Every folder must be scoped to a single client. The Folder Generator creates the `/ClientName/Private/Shared/Deliverables/` structure automatically on signup. There is no global shared folder visible to clients.

**2. NO global task visibility**
Clients see ONLY tasks assigned to them within their projects. Project Settings → Global Project Settings must have "Client View — See All Tasks" set to OFF. Only Admin/PM roles see all tasks.

**3. NO mixed pipelines (unless intentional)**
Each directory niche gets its own pipeline. Do not put plumbing leads and HVAC leads in the same pipeline unless you are intentionally tracking cross-niche performance.

## Role Explosion Prevention

**The Problem:** As you add niches and directories, the temptation is to create new roles (PlumbingClient, HVACClient, LegalClient). This is a trap — SuiteDash has a fixed role set and adding roles increases complexity exponentially.

**The Solution:**
- Keep roles FIXED (the 10 above — never add more)
- Make behavior DYNAMIC via:
  - **Tags:** `plumbing`, `hvac`, `legal`, `premium`, `at-risk`
  - **Custom Fields:** `Directory Source`, `Membership Tier`, `Industry`
  - **Circles:** `Plumbing-Free`, `Plumbing-Premium`, `HVAC-Free`, `HVAC-Premium`
  - **Automation:** Tag-based triggers in Auto-Templates, Circle-based targeting in Marketing

**Rule:** If you're about to create a new Role, STOP. Use a Tag or Circle instead.

---

# 5. CLIENT EXPERIENCE LAYER

This is what makes money. Infrastructure is invisible to clients — experience is everything.

## Ideal Client Journey (8 Steps)

```
1. Lead Capture      → Kickoff Form / Public Page / Landing Page
2. Qualification     → Lead scoring (n8n) + Pipeline stage
3. Onboarding        → FLOW (Form → Upload → Download → eSigning → Appointment → Checklist)
4. Service Delivery  → Project tracking + task completion
5. Communication     → Messaging + Support Tickets + Email sequences
6. Billing           → Automated invoicing + subscription management
7. Retention         → Engagement scoring + renewal sequences + value reporting
8. Upsell            → Upgrade sequences triggered by high engagement
```

Every touchpoint must be designed from the client's perspective, not the admin's.

## Portal Dashboard Design (Client View)

The client dashboard must show — and ONLY show — what matters to them:

| Element | Purpose | Block Type |
|---------|---------|------------|
| Personalized welcome | "Welcome back, [Name]" | Welcome Block with DDPs |
| Active services/projects | What's happening right now | Projects Block |
| Tasks/action items | What they need to do | My Tasks Block |
| Files | Easy upload and download | Upload + Download Blocks |
| Messages | Communication hub | Button Block → Messaging |
| Billing | Invoice status, payment | My Invoices Block |
| Progress | Onboarding completion, milestones | Progress Bar Block |
| Quick actions | Support, Profile, Upgrade | Button Block |

## Experience Principles

**Zero confusion:** Every element on the portal has a clear purpose. No admin jargon, no SuiteDash branding (white-labeled), no features they don't need.

**One-click navigation:** The Custom Menu for clients hides everything irrelevant. Dashboard → Files → Support → Messaging → Calendar. That's it. No CRM, no Projects menu, no Automations, no Settings.

**No clutter:** Use the Dashboard Priority System. Clients see ONLY the dashboard assigned to their Circle/Role. Admin dashboards are never exposed to clients.

**Clear progress visibility:** Progress Bar blocks show onboarding completion %. Project blocks show deliverable status. My Tasks blocks show pending action items. The client always knows where they stand.

## Retention Hooks

| Hook | Implementation | Impact |
|------|---------------|--------|
| Progress tracking | Progress Bar Block on dashboard showing onboarding/FLOW completion | Creates commitment bias — they want to finish |
| Milestones | Auto-Template sends congratulatory email at 25%, 50%, 75%, 100% completion | Positive reinforcement |
| Notifications | Email + in-portal notifications for new messages, task updates, invoice receipts | Keeps them coming back |
| Value reporting | Monthly email (n8n) showing "Your listing was viewed X times, you received Y inquiries" | Proves ROI, prevents churn |

---

# 6. SCALING STRATEGY

## Stage 1: 0–50 Clients

**Architecture:** All inside SuiteDash + basic n8n
- Single SuiteDash instance handles everything
- 1-2 n8n workflows (onboarding + engagement scoring)
- Manual monitoring via SuiteDash admin views
- AiTable for basic analytics

**Focus:** Get the client experience right. Perfect the onboarding FLOW. Nail the portal design.

## Stage 2: 50–300 Clients

**Architecture:** SuiteDash + full n8n automation + AiTable analytics
- All 6 n8n packs deployed (Onboarding, Engagement, Renewal, Win-back, DLQ, Data Sync)
- AiTable becomes primary analytics layer
- Monitoring dashboard live
- API rate limits become a concern — upgrade to Thrive (2K/mo) or Pinnacle (20K/mo)
- Consider batching API calls and caching responses

**Focus:** Automation reliability. DLQ must be working. Engagement scoring must be accurate. Churn prevention must be active.

## Stage 3: 300+ Clients

**Architecture:** SuiteDash + n8n + PostgreSQL + AI agents
- Migrate AiTable to PostgreSQL for query performance
- Deploy AI agents (Lead Qualification, Workflow Optimizer, Failure Detection)
- Add pgvector for agent memory
- Consider multiple SuiteDash instances for true isolation if needed
- Revenue optimization layer (dynamic pricing, automated upsell triggers)

**Focus:** Intelligence. The system should be making decisions, not just executing rules. Agents optimize lead routing, predict churn, and identify upsell opportunities before humans notice.

## Scaling Triggers

| Metric | Threshold | Action |
|--------|-----------|--------|
| API calls/month | >80% of plan limit | Upgrade SuiteDash plan |
| CRM page load time | >3 seconds | Archive inactive contacts, optimize queries |
| n8n execution failures | >5% | Add more error handling, increase retry attempts |
| Support ticket volume | >50/week | Add self-service knowledge base, chatbot |
| Client count per niche | >100 | Consider dedicated SuiteDash instance for that niche |

---

# 7. PER-CLIENT FILE STRUCTURE TEMPLATE

## Folder Generator Configuration

Create this Folder Generator in SuiteDash (`/files/home`) and attach it to every Kickoff Form:

```
/[CompanyName]/
    /Private/
        /Internal-Notes/       ← Staff-only: account notes, strategy docs
        /Contracts/             ← Signed agreements, terms of service
        /Compliance/            ← Verification documents, licenses
    /Shared/
        /Onboarding/           ← Welcome package, getting-started guides
        /Resources/            ← Templates, guides, marketing assets
        /Communication/        ← Meeting notes, follow-up documents
    /Deliverables/
        /Reports/              ← Performance reports, analytics
        /Assets/               ← Logos, images, content delivered
        /Exports/              ← Data exports, backups
```

## Access Rules

| Folder | Client Sees | Staff Sees |
|--------|:-----------:|:----------:|
| /Private/ | ❌ | ✅ |
| /Shared/ | ✅ | ✅ |
| /Deliverables/ | ✅ | ✅ |

---

# GAP COVERAGE MAP

This document fills the following gaps from the original analysis:

| Gap # | Gap Description | Section in This Document |
|-------|----------------|------------------------|
| 1 | Capability Matrix with "Reality" assessments | §1 (all 7 modules) |
| 2 | Decision Engine table | §2 |
| 3 | Constraint Layer | §3 |
| 4 | RBAC Critical Protections | §4 |
| 5 | Per-Client File Structure | §7 |
| 6 | Client Experience Layer | §5 |
| 7 | Scaling Strategy | §6 |
| 10 | Forms external tool offload guidance | §1.6 |
| 11 | Flow strategic limitations | §1.7 |

Remaining gaps (8, 9) are covered in the companion documents:
- **Gap 8 (Importable Assets):** → `SuiteDash_Importable_Assets.md`
- **Gap 9 (Agent/Intelligence Layer):** → `SuiteDash_AI_Agent_Layer.md`

---

*This document is the strategic companion to the Full Deployment System. Read the Deployment System for HOW to configure. Read this document for WHY, WHEN, and WHEN NOT TO.*
