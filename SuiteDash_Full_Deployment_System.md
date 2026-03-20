# SuiteDash Full Deployment System
## Dynasty Empire — portal.yourdeputy.com

**Date:** March 19, 2026
**Architecture Layer:** Mastery Layer + Backend-Verified Architecture
**Deployment Model:** SuiteDash = Portal & Coordination | External = Logic & Intelligence

---

## DEPLOYMENT SEQUENCE

```
Phase 1: Perfect Setup Blueprint ─────── (SuiteDash internal config)
Phase 2: 16 CRM Niche Templates ──────── (Ready-to-deploy per directory)
Phase 3: n8n Automation Packs ─────────── (External logic layer)
Phase 4: Monitoring Dashboard ─────────── (Single pane of glass)
```

---

# PHASE 1: PERFECT SETUP BLUEPRINT

## Step-by-step configuration inside portal.yourdeputy.com

### 1.1 Organization Foundation (Do First)

**Navigate to:** Profile Avatar → My Account → Organization Settings (`/company/info`)

| Field | Set To |
|-------|--------|
| Company Name | Your Deputy (or primary brand) |
| Address | Business address (used in invoices + marketing compliance) |
| Phone | Business phone |
| Timezone | Your primary timezone |
| Logo | Upload primary logo (250px wide, 100px max height) |

**Navigate to:** Profile Avatar → My Account → Manage Account (`/user/subscription`)
- Confirm plan tier (affects API rate limits: Start=400/mo, Thrive=2K/mo, Pinnacle=20K/mo)
- Note: n8n automation packs in Phase 3 will consume API calls

### 1.2 White Label Branding

**Navigate to:** Profile Avatar → Your Branding → Platform Branding (`/company/customizeTheme`)

| Setting | Action |
|---------|--------|
| Color Scheme | Pick base scheme, then customize primary/accent/sidebar colors |
| Logo (sidebar) | Upload (appears in collapsed + expanded sidebar) |
| Favicon | Upload 32x32px icon |
| Font Theme | Select from Google Fonts — recommended: Inter or Poppins for headers, system font for body |
| Custom CSS | Leave blank for now — add per-directory overrides via Dashboard CSS later |

**Navigate to:** Profile Avatar → Your Branding → Custom URL & Login (`/domainSettings`)

| Setting | Action |
|---------|--------|
| Custom Domain | Map portal.yourdeputy.com (already done) |
| Login Page | Customize background image, logo, welcome text |

**Navigate to:** Profile Avatar → Your Branding → Email Branding (`/company/customizeEmailTemplate`)
- Upload email header logo
- Set footer branding
- Match colors to platform theme

### 1.3 Staff & Team Setup

**Navigate to:** Profile Avatar → Staff/Team → Manage Staff (`/user/admin`)

| Role | Who | Permissions |
|------|-----|-------------|
| Super Admin | You (Ikechukwu Ohu) | Everything — never share this |
| Admin | Key team members | Full access except Manage Account |
| Project Manager | Operations staff | CRM + Projects + limited elsewhere |
| Salesperson | Sales team | CRM + Deals focused |
| Teammate | Task executors | Projects menu only |

**Navigate to:** Profile Avatar → Staff/Team → Manage Teams (`/pm/teams/index`)
- Create teams: Operations, Sales, Support, Content
- Teams are used for Dashboard assignment (Medium Priority) and automation targeting

### 1.4 CRM Configuration

**Navigate to:** Settings → CRM (`/s/crm`)

**Tab: Company Settings**
- ✅ Enable "Create a Circle for each new Company" — this is your **isolation primitive**
- Set Company Match Value to 75% (default)
- Set Salesperson Claim Visibility to "Shared" (allows multiple salespeople per network)

**Tab: Custom Fields > Target** (shared across Contact + Company)

Create these fields for every directory client:

| Field Name | Type | Purpose |
|------------|------|---------|
| Directory Source | Dropdown | Which directory they came from |
| Membership Tier | Dropdown | Free / Basic / Premium |
| Engagement Score | Number | Updated by n8n automation |
| Lifecycle Stage | Dropdown | Onboarding / Active / At-Risk / Churned |
| Onboarding Complete | Checkbox | Tracks FLOW completion |
| Days Since Last Login | Number | Updated by n8n daily |
| LTV | Currency | Lifetime value calculation |
| Acquisition Channel | Dropdown | Organic / Paid / Referral / Outreach |
| NPS Score | Number | From feedback forms |
| Churn Risk | Dropdown | Low / Medium / High |

**Tab: Custom Fields > Contact**

| Field Name | Type | Purpose |
|------------|------|---------|
| LinkedIn URL | URL | Outreach and verification |
| Professional Title | Text | For personalization |
| Company Size | Dropdown | Solo / 2-10 / 11-50 / 51+ |

**Tab: Custom Fields > Company Public**

| Field Name | Type | Purpose |
|------------|------|---------|
| Industry | Dropdown | Directory vertical |
| Website | URL | Client's site |
| Years in Business | Number | Qualification |

**Tab: Custom Fields > Company Private**

| Field Name | Type | Purpose |
|------------|------|---------|
| Internal Notes | Text Area | Staff-only notes |
| Revenue Tier | Dropdown | $0-1K / $1K-5K / $5K-25K / $25K+ |
| Strategic Priority | Dropdown | Standard / VIP / Whale |

**Tab: Export CSV Permissions** — Restrict to Admin+ only

### 1.5 Deal Pipeline Configuration

**Navigate to:** CRM → Deals (`/crmGoalsVisibility/admin`)

**Create Pipeline: "Directory Member Acquisition"**

| Stage | Probability | Actions |
|-------|-------------|---------|
| Lead Captured | 10% | Auto-assign coordinator |
| Qualified | 25% | Schedule discovery call |
| Demo Completed | 50% | Send proposal |
| Proposal Sent | 65% | Follow-up sequence starts |
| Negotiation | 80% | Final offer |
| Closed Won | 100% | Trigger onboarding FLOW |
| Closed Lost | 0% | Trigger win-back sequence |

**Create Pipeline: "Renewal & Upsell"**

| Stage | Probability | Actions |
|-------|-------------|---------|
| Active Member | — | Monitoring only |
| Renewal Approaching | 70% | 90-day sequence starts |
| Upsell Opportunity | 50% | Engagement score >60 trigger |
| At Risk | 30% | Re-engagement sequence |
| Renewed | 100% | Reset for next cycle |
| Churned | 0% | Win-back sequence |

### 1.6 Circles Configuration

**Navigate to:** CRM → Circles (`/circle/manage`)

Create these Circles (each one is an **isolation boundary**):

| Circle | Purpose | Marketing Sync |
|--------|---------|---------------|
| [Directory]-Free | Free tier members per directory | ✅ Yes |
| [Directory]-Basic | Basic tier members per directory | ✅ Yes |
| [Directory]-Premium | Premium tier members per directory | ✅ Yes |
| [Directory]-Churned | Lost members per directory | ✅ Yes |
| [Directory]-VIP | High-value members | ✅ Yes |
| All-Onboarding | Currently in onboarding FLOW | ❌ No |
| All-At-Risk | Engagement score <20 | ❌ No |

**Critical Rule:** ✅ Check "Marketing" on each circle to auto-sync with Marketing Audiences for drip campaigns.

### 1.7 Office Configuration

**Navigate to:** Office → Settings (`/office/settings`)

**Tab: Invoices**
- Set Currency: USD (add NGN via `/currency/admin` if needed)
- Set Invoice Prefix: "YD-" (or per-directory prefix)
- ✅ Enable "Send thank you after payment"
- ✅ Enable "Payment Due Reminder" — Every 7 days, ends after 3 occurrences
- ✅ Enable "Due Date Approaching Reminder" — 3 days before
- ✅ Enable "Attach Invoice PDF on email"
- Set Terms & Conditions (standard payment terms)
- Configure Failed Payment Notification for both Client + Staff

**Tab: Items** — Create standard items:

| Item | Price | Type |
|------|-------|------|
| Directory Listing - Free | $0 | One-time |
| Directory Listing - Basic | $99/mo | Subscription |
| Directory Listing - Premium | $299/mo | Subscription |
| Directory Listing - Annual Basic | $999/yr | Subscription |
| Directory Listing - Annual Premium | $2,999/yr | Subscription |
| Setup Fee | $199 | One-time |
| Featured Listing Upgrade | $49/mo | Add-on |

**Tab: Plans** — Create subscription plans matching the items above

**Tab: Taxes** — Configure applicable tax rates

**Navigate to:** Office → Gateways (`/invoices/gateways`)
- Connect Stripe (primary gateway)
- Test payment flow with test card

### 1.8 Forms Configuration

**Navigate to:** Forms (`/forms`)

**Create these Forms:**

| Form Type | Name | Purpose |
|-----------|------|---------|
| Kickoff Form | "New Member Registration" | Public-facing signup, creates Contact with role "Lead" |
| Kickoff Form | "Free Listing Claim" | Public, creates Contact as "Prospect" |
| Update Form | "Profile Completion" | Portal, updates Contact custom fields |
| Update Form | "Feedback Survey" | Portal, captures NPS + satisfaction |
| Checkout Form | "Membership Upgrade" | Portal, processes tier upgrades |
| Booking Form | "Discovery Call" | Public + Portal, schedules appointments |
| Support Ticket Form | "Get Help" | Portal, creates support ticket |

**Kickoff Form "New Member Registration" — Configuration:**
- Role Assignment: Lead
- Coordinator: Auto-assign based on directory
- Circle: Add to "[Directory]-Free"
- Trigger: Apply Folder Generator + Assign On-Boarding FLOW
- Fields: First Name, Last Name, Email, Phone, Company, Industry (dropdown), How Did You Find Us (dropdown)

### 1.9 FLOWs (Onboarding) Configuration

**Navigate to:** Onboarding → FLOWs (`/flows`)

**Create FLOW: "New Member Onboarding"**

| Step | Type | Content |
|------|------|---------|
| 1 | Form | "Profile Completion" Update Form |
| 2 | File Upload | Business logo + profile photo |
| 3 | File Download | Member Welcome Package (PDF) |
| 4 | eSigning | Terms of Service + Service Agreement |
| 5 | Appointment | Schedule onboarding call (optional) |
| 6 | Checklist | "Getting Started" checklist |

**FLOW Assignment:** Auto-assign via Kickoff Form submission
**Automations on completion:** Set "Onboarding Complete" custom field to ✅, Convert Lead → Client, Move to "[Directory]-Basic" Circle, Generate first invoice

### 1.10 Support Ticket Configuration

**Navigate to:** Support (`/st/conversations`)

**Create Inboxes:**
- Technical Issues
- Billing Questions
- Profile Help
- Feature Requests
- Escalations (VIP only)

**Configure via Email Templates (`/emailTemplates/index` → Support Tickets section):**
- Customize "New Ticket Created" auto-reply with branded message
- Set "Ticket Reply (To Client)" to include branding
- Set "Ticket Assigned (To Staff)" to notify relevant team

### 1.11 Dashboard Configuration

**Navigate to:** Content → Dashboards (`/dashboard/admin`)

**Create Dashboard: "Member Dashboard"**
Priority: Lowest (Role-based) → Assign to Client role

| Block | Type | Purpose |
|-------|------|---------|
| Welcome Block | Welcome | Personalized greeting with name DDP |
| My Tasks Block | Business Ops | Shows pending onboarding/action items |
| My Invoices Block | Business Ops | Current invoices and payment status |
| Upload Block | Files | Easy file upload for profile assets |
| Download Block | Files | Access to resources and downloads |
| Announcements Block | Communication | Directory news and updates |
| Button Block | Content | Quick links: Profile, Support, Upgrade |
| Progress Bar Block | Data | Onboarding completion % |

**Create Dashboard: "Admin Command Center"**
Priority: Highest → Assign directly to Admin staff

| Block | Type | Purpose |
|-------|------|---------|
| Reporting Block | Admin | Key metrics overview |
| All Tasks Block | Business Ops | All outstanding tasks across projects |
| Activity Stream Block | Communication | Recent platform activity |
| Contacts Filter Block | CRM | At-risk members (Churn Risk = High) |
| Chart Block | Data | MRR trend visualization |
| Button Block | Content | Quick links: New Member, New Invoice, Reports |

### 1.12 Email Template Customization

**Navigate to:** Profile Avatar → Your Branding → Email Templates (`/emailTemplates/index`)

**Priority templates to customize immediately:**

| Template | Category | Customization |
|----------|----------|---------------|
| Portal Access Invitation - Externals | Account | Branded welcome, clear next steps |
| Kickoff Form Submission | Account | Confirmation + what happens next |
| On Create Invoice | Invoices | Professional branded invoice delivery |
| Payment Thank You | Invoices | Warm thank you + next steps |
| Payment Failed - Client | Invoices | Urgent but empathetic payment update |
| New Estimate Notification | Estimates | Clean proposal delivery |
| Proposal Signed | Proposals | Celebration + onboarding preview |
| On-Demand FLOW Assigned | FLOWs | Clear instructions to start FLOW |
| Appointment Booked (To Target) | Appointments | Confirmation with calendar add links |
| New Ticket Created | Support | Auto-reply confirming receipt + SLA |

### 1.13 Integrations

**Navigate to:** Profile Avatar → My Account → Integrations (`/integrations`)

| Integration | Action | Priority |
|-------------|--------|----------|
| Stripe | Connect for payment processing | 🔴 Critical |
| Google Calendar | 2-way sync for appointments | 🟡 High |
| Zoom | Connect for appointment video links | 🟡 High |
| Twilio | Connect for SMS notifications | 🟢 Medium |
| Zapier/Make | Connect for external automations | 🟢 Medium (Phase 3 uses n8n directly via API) |

**Navigate to:** Integrations → Secure API (`/integrations/publicApi`)
- Generate API Secret Key (needed for Phase 3 n8n packs)
- Note: Store key securely — used by all n8n workflows

### 1.14 Custom Menus

**Navigate to:** Profile Avatar → Your Branding → Custom Menus (`/company/customizeMenu/op/list`)

**Client Role Menu (simplify for members):**

| Visible | Hidden |
|---------|--------|
| Dashboard | CRM |
| Files | Projects (unless assigned) |
| Support | Automations |
| Messaging | LMS (unless enrolled) |
| Calendar | Settings |

**Admin Role Menu (full access):**
- All items visible
- Reorder: Dashboard → CRM → Office → Projects → Marketing → Content → Automations → Settings

---

# PHASE 2: 16 CRM NICHE TEMPLATES

Each template is a **ready-to-deploy configuration package** for a specific directory niche. Deploy by creating the custom fields, circles, pipeline stages, forms, and FLOWs specified.

## Template Structure (Applied per Niche)

```
Niche Template =
  Custom Fields (5-8 niche-specific)
  + Pipeline Stages (customized per niche sales cycle)
  + Circles (Free/Basic/Premium per niche)
  + Kickoff Form (niche-specific intake)
  + Onboarding FLOW (niche-specific steps)
  + Email Sequence Subjects (niche-specific copy angles)
```

## The 16 Niche Templates

### 1. Legal Services Directory
**Custom Fields:** Practice Areas (multi-select), Bar Number, Jurisdictions, Case Types, Languages Spoken, Pro Bono (checkbox)
**Pipeline:** Lead → Consultation → Retainer Sent → Retained → Completed
**Kickoff Fields:** Firm Name, Practice Areas, Years Licensed, Jurisdictions

### 2. Healthcare/Medical Directory
**Custom Fields:** Specialties (multi-select), License Number, Insurance Accepted (multi-select), Telehealth Available (checkbox), Hospital Affiliations, Board Certifications
**Pipeline:** Lead → Credentials Verified → Profile Live → Active Member → Renewal
**Kickoff Fields:** Practice Name, Specialties, NPI Number, Insurance Networks

### 3. Real Estate Professionals Directory
**Custom Fields:** License Type (Agent/Broker/Team), MLS ID, Service Areas, Transaction Volume, Designations (multi-select: CRS, ABR, GRI, etc.)
**Pipeline:** Lead → Trial → Basic Member → Premium Member → Team Account
**Kickoff Fields:** Brokerage, License Type, Service Areas, Average Price Range

### 4. Financial Advisors Directory
**Custom Fields:** Certifications (CFP/CFA/ChFC), SEC/FINRA Registration, AUM Range, Fee Structure (Fee-only/Commission/Hybrid), Specializations
**Pipeline:** Lead → Compliance Review → Profile Live → Active → Renewal
**Kickoff Fields:** Firm Name, Certifications, AUM Range, Client Minimum

### 5. Home Services Directory
**Custom Fields:** Service Type (Plumbing/HVAC/Electrical/etc.), License Number, Service Radius, Emergency Available (checkbox), Insurance Verified (checkbox)
**Pipeline:** Lead → Verification → Listed → Featured → Annual Partner
**Kickoff Fields:** Business Name, Services Offered, Service Area, Years in Business

### 6. IT/Tech Services Directory
**Custom Fields:** Specializations (Cloud/Security/Dev/etc.), Certifications (multi-select), Team Size, Industries Served, SLA Offered (checkbox)
**Pipeline:** Lead → Portfolio Review → Listed → Active → Enterprise Partner
**Kickoff Fields:** Company, Specializations, Team Size, Key Certifications

### 7. Wedding/Event Vendors Directory
**Custom Fields:** Vendor Type (Photographer/DJ/Florist/etc.), Price Range, Availability Calendar, Portfolio URL, Travel Radius
**Pipeline:** Lead → Portfolio Review → Listed → Featured → Preferred Vendor
**Kickoff Fields:** Business Name, Vendor Category, Price Range, Service Area

### 8. Fitness/Wellness Directory
**Custom Fields:** Modality (Personal Training/Yoga/Nutrition/etc.), Certifications, Virtual Available (checkbox), Specializations (Weight Loss/Sports/Rehab)
**Pipeline:** Lead → Credential Check → Listed → Active → Premium Partner
**Kickoff Fields:** Business/Name, Modality, Certifications, Location Type

### 9. Education/Tutoring Directory
**Custom Fields:** Subject Areas (multi-select), Grade Levels, Teaching Format (In-person/Online/Both), Credentials, Languages
**Pipeline:** Lead → Background Check → Listed → Active → Featured Educator
**Kickoff Fields:** Name, Subject Areas, Grade Levels, Teaching Experience

### 10. Construction/Contractors Directory
**Custom Fields:** Trade Type (General/Electrical/Plumbing/etc.), License Number, Bond Amount, Insurance Verified, Project Size Range
**Pipeline:** Lead → License Verification → Listed → Active → Preferred Contractor
**Kickoff Fields:** Company, Trade Types, License Number, Service Area

### 11. Pet Services Directory
**Custom Fields:** Service Type (Grooming/Boarding/Training/Vet/etc.), Certifications, Insurance, Species Handled, Facility Type
**Pipeline:** Lead → Verification → Listed → Active → Featured Provider
**Kickoff Fields:** Business Name, Services, Certifications, Location

### 12. Creative/Design Agency Directory
**Custom Fields:** Specialties (Branding/Web/UX/Video/etc.), Portfolio URL, Minimum Project Size, Team Size, Industries Served
**Pipeline:** Lead → Portfolio Review → Listed → Active → Agency Partner
**Kickoff Fields:** Agency Name, Specialties, Team Size, Portfolio URL

### 13. Consulting/Coaching Directory
**Custom Fields:** Niche (Business/Executive/Life/Career), Certifications (ICF/etc.), Format (1:1/Group/Corporate), Price Range, Published Author (checkbox)
**Pipeline:** Lead → Credential Review → Listed → Active → Featured Expert
**Kickoff Fields:** Name, Coaching Niche, Certifications, Years Experience

### 14. Manufacturing/Suppliers Directory
**Custom Fields:** Product Categories, MOQ, Lead Time, Certifications (ISO/etc.), Export Capable (checkbox), Capacity
**Pipeline:** Lead → Capability Review → Listed → Active → Verified Supplier
**Kickoff Fields:** Company, Product Categories, Certifications, Location

### 15. Nonprofit/Association Directory
**Custom Fields:** Mission Area, 501(c)(3) Status, Annual Budget Range, Service Area, Volunteer Needed (checkbox)
**Pipeline:** Lead → Verification → Listed → Active → Featured Organization
**Kickoff Fields:** Organization Name, Mission, EIN, Service Area

### 16. SaaS/Software Directory
**Custom Fields:** Category (CRM/Marketing/HR/etc.), Pricing Model, Free Trial (checkbox), API Available (checkbox), Integrations Count, G2/Capterra Rating
**Pipeline:** Lead → Product Review → Listed → Active → Featured Product
**Kickoff Fields:** Product Name, Category, Pricing Model, URL

---

# PHASE 3: n8n AUTOMATION PACKS

## Architecture

```
SuiteDash API ←→ n8n (Logic Layer) ←→ Data Store (AiTable/DB)
     ↑                    ↑                      ↑
  Portal Events      Retry Logic            Source of Truth
  Webhooks           Branching              Analytics
  Form Submissions   Error Handling         Engagement Scores
```

## API Connection Setup

**n8n HTTP Request Node — Base Configuration:**
```
Base URL: https://portal.yourdeputy.com/secure-api
Auth: Header → X-API-KEY: [your-secret-key]
Content-Type: application/json
```

## Pack 1: Onboarding Automation

**Trigger:** Webhook from SuiteDash (Kickoff Form submission)

```
[Webhook Receive]
  → [Create Contact via API: POST /contact]
  → [Add to Circle: "[Directory]-Free"]
  → [Generate Welcome Email: Send email to Target]
  → [Create Engagement Record in AiTable]
  → [Schedule Day 1 email (delay node)]
  → [Schedule Day 3 email]
  → [Schedule Day 7 email]
  → [Schedule Day 14 email]
  → [Schedule Day 21 email]
  → [Schedule Day 28 email]
  → [Schedule Day 30 email]
  → [IF onboarding FLOW not complete by Day 14 → Send reminder]
  → [IF onboarding FLOW complete → Update custom field via PUT /contact]
```

**Error Handling:**
- Each API call wrapped in Try/Catch
- Failed calls → retry 3x with exponential backoff (1min, 5min, 30min)
- After 3 failures → log to Dead Letter Queue (AiTable "Failed Actions" table)
- Send alert email to admin

## Pack 2: Engagement Scoring (Daily Cron)

**Trigger:** n8n Cron — runs daily at 2:00 AM

```
[Cron Trigger]
  → [GET /contacts — fetch all active contacts]
  → [For Each Contact:]
    → [Calculate: (Logins×2) + (Profile Updates×3) + (Features×1) + (Community Posts×2) + (Tickets×5) - (Days Since Login×1)]
    → [PUT /contact/{id} — update Engagement Score custom field]
    → [IF score <20 → Add to "All-At-Risk" Circle, Set Churn Risk = "High"]
    → [IF score >60 for 7+ days → Trigger Upgrade sequence]
    → [IF score dropped >20 points in 7 days → Alert admin]
  → [Update AiTable dashboard data]
  → [Send daily summary email to admin]
```

## Pack 3: Renewal Workflow

**Trigger:** n8n Cron — checks daily for upcoming renewals

```
[Cron Trigger]
  → [Query AiTable: Contacts where renewal_date - today = 90/60/30/14/7/0 days]
  → [For each match:]
    → [90 days: Send "Quick look ahead" email via SuiteDash API]
    → [60 days: Send "Value delivered" email]
    → [30 days: Send "Coming up" email]
    → [14 days: Send "Action needed" email]
    → [7 days: Send "Final reminder" email]
    → [0 days: Send "Renewing today" email]
    → [+1 day (if renewed): Send "Thanks for renewing" email]
    → [+1 day (if NOT renewed): Trigger Win-Back Pack]
```

## Pack 4: Win-Back Workflow

**Trigger:** Webhook from SuiteDash (subscription cancelled) OR Pack 3 non-renewal

```
[Webhook/Trigger]
  → [Move contact to "[Directory]-Churned" Circle]
  → [Set Lifecycle Stage = "Churned"]
  → [Day 7: Send "We miss you" email]
  → [Day 14: Send "Feedback request" email + survey link]
  → [Day 30: Send "Comeback offer" email (30% off)]
  → [Day 60: Send "Things have changed" email]
  → [Day 90: Send "Final offer" email (50% off, last chance)]
  → [IF re-activated at any point → Cancel remaining sequence, move to Active circle]
```

## Pack 5: Failure Recovery (Dead Letter Queue)

**Trigger:** Error handler from all other packs

```
[Error Received]
  → [Log to AiTable "DLQ" table: timestamp, workflow, error, contact_id, payload]
  → [Retry logic: attempt 1 (1 min), attempt 2 (5 min), attempt 3 (30 min)]
  → [IF all retries fail:]
    → [Send Slack/email alert to admin with full error context]
    → [Mark as "needs_manual_review" in AiTable]
  → [Daily summary: Count of DLQ items, oldest unresolved, auto-resolved count]
```

## Pack 6: Data Sync (SuiteDash ↔ AiTable)

**Trigger:** n8n Cron — every 6 hours

```
[Cron Trigger]
  → [GET /contacts — all contacts]
  → [GET /companies — all companies]
  → [GET /projects — all projects]
  → [Sync to AiTable (upsert by SuiteDash ID)]
  → [Calculate derived metrics in AiTable:]
    → LTV per contact
    → MRR per directory
    → Churn rate (rolling 30-day)
    → CAC by acquisition channel
  → [IF sync errors → log to DLQ]
```

---

# PHASE 4: MONITORING DASHBOARD

## Single Pane of Glass Architecture

```
Data Sources:
  SuiteDash API (contacts, invoices, projects)
  AiTable (engagement scores, derived metrics, DLQ)
  Stripe (revenue, subscriptions, failed payments)
  n8n (workflow execution logs)
         ↓
  Monitoring Dashboard (React app or AiTable Interface)
```

## Dashboard Views

### Daily 5-Min View
| Widget | Data Source | Metric |
|--------|-----------|--------|
| Total MRR | Stripe/AiTable | Sum of active subscription values |
| New Members Today | SuiteDash API | Contacts created today |
| Churn Alerts | AiTable | Contacts with Engagement Score <20 |
| Failed Payments | Stripe webhook | Count of failed charges in 24h |
| DLQ Items | AiTable DLQ table | Unresolved automation failures |
| Top Directory | AiTable | Highest growth directory this week |

### Weekly 15-Min View
| Widget | Data Source | Metric |
|--------|-----------|--------|
| Revenue vs Target | Stripe + AiTable | Actual MRR / Target MRR × 100% |
| New Acquisitions | SuiteDash | Count + CAC by channel |
| Churn Events | AiTable | Count + top reasons |
| Email Performance | SuiteDash/n8n | Open rates, click rates by sequence |
| Onboarding Completion | SuiteDash | % of new members completing FLOW |
| Support Ticket SLA | SuiteDash | % resolved within 72h |

### Monthly Deep Dive
| Widget | Data Source | Metric |
|--------|-----------|--------|
| Full P&L by Directory | Stripe + AiTable | Revenue - COGS - CAC per directory |
| LTV:CAC Ratio | AiTable | Per directory and blended |
| NPS Trend | SuiteDash (survey form) | Monthly NPS score |
| Automation Health | n8n logs | Success rate, avg execution time, DLQ volume |
| Directory Rankings | AiTable | All directories ranked by growth, MRR, churn |

## Alert Thresholds

| Alert | Condition | Channel | Priority |
|-------|-----------|---------|----------|
| High Churn | >5 churns in 7 days | Email + Slack | 🔴 Critical |
| Failed Payment Spike | >3 failed payments in 24h | Email | 🔴 Critical |
| DLQ Overflow | >10 unresolved items | Email | 🟡 High |
| Low Engagement | >20% of members at score <20 | Email | 🟡 High |
| Revenue Below Target | MRR <80% of monthly target | Weekly email | 🟢 Medium |
| Onboarding Stall | FLOW completion <40% | Weekly email | 🟢 Medium |

---

# DEPLOYMENT TIMELINE

| Week | Phase | Deliverables |
|------|-------|-------------|
| **1** | Phase 1a | Organization, Branding, Staff, CRM custom fields |
| **2** | Phase 1b | Pipelines, Circles, Office configuration, Payment gateway |
| **3** | Phase 1c | Forms, FLOWs, Support Tickets, Dashboards |
| **4** | Phase 1d | Email templates, Integrations, Custom menus, API key |
| **5** | Phase 2 | Deploy first 4 niche templates (highest priority directories) |
| **6** | Phase 2 | Deploy remaining 12 niche templates |
| **7** | Phase 3 | n8n Packs 1-3 (Onboarding, Engagement, Renewal) |
| **8** | Phase 3 | n8n Packs 4-6 (Win-back, DLQ, Data Sync) |
| **9** | Phase 4 | Monitoring dashboard build and configuration |
| **10** | Testing | End-to-end testing with test contacts through full lifecycle |

---

# SOURCE OF TRUTH MAP

| Data Type | Primary Owner | Secondary Sync |
|-----------|--------------|----------------|
| Contact Identity | SuiteDash CRM | → AiTable (read replica) |
| Engagement Score | AiTable (calculated by n8n) | → SuiteDash custom field |
| Financial Data | Stripe | → AiTable (analytics) |
| Workflow State | n8n | → AiTable (execution logs) |
| Automation Failures | AiTable DLQ | → Admin email alerts |
| Content/Portal | SuiteDash | (no sync needed) |
| Analytics/Reporting | AiTable | → Dashboard |

**Rule:** NEVER duplicate authority. SuiteDash = identity + portal. AiTable = intelligence + analytics. Stripe = money. n8n = logic.

---

*This system is designed to scale from 1 directory to 100+ directories using the same infrastructure. Each new directory is a niche template deployment (Phase 2) connected to the shared automation layer (Phase 3) and monitored through a single dashboard (Phase 4).*
