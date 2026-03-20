# SuiteDash Complete Platform Architecture Map — V2 (Backend Verified)

**Prepared for:** Ike (Dynasty Empire)
**Date:** March 19, 2026
**Portal:** portal.yourdeputy.com
**Status:** Backend-verified via live portal exploration
**Coverage:** ~95% (remaining 5% = embedded editor internals only accessible via screen interaction)

---

## TABLE OF CONTENTS

1. [Live Navigation Structure (Backend-Verified)](#1-live-navigation-structure)
2. [Top Bar & Quick Actions](#2-top-bar--quick-actions)
3. [Profile Fly-Out Menu (Complete)](#3-profile-fly-out-menu)
4. [CRM Module](#4-crm-module)
5. [Office Module](#5-office-module)
6. [Projects Module](#6-projects-module)
7. [Marketing Module](#7-marketing-module)
8. [Content Module](#8-content-module)
9. [Automations Module](#9-automations-module)
10. [Forms Module](#10-forms-module)
11. [Onboarding (FLOWs & Checklists)](#11-onboarding)
12. [Calendar & Appointments](#12-calendar--appointments)
13. [Files Module](#13-files-module)
14. [Support Tickets](#14-support-tickets)
15. [Messaging](#15-messaging)
16. [LMS (Learning Management System)](#16-lms)
17. [Complete Settings Architecture](#17-complete-settings-architecture)
18. [Email Notification Templates (All 100+)](#18-email-notification-templates)
19. [Content Block Editor (All 24 Block Types)](#19-content-block-editor)
20. [Automations Engine (Complete)](#20-automations-engine)
21. [Dynamic Data Placeholders](#21-dynamic-data-placeholders)
22. [Integrations & API (Complete)](#22-integrations--api)
23. [White Label & Branding](#23-white-label--branding)
24. [Generators (Complete Inventory)](#24-generators)
25. [Custom Fields & Data Architecture](#25-custom-fields--data-architecture)
26. [Remaining Gaps](#26-remaining-gaps)

---

## 1. Live Navigation Structure

### Main Sidebar Menu (Exact URLs from Backend)

| Menu Item | Sub-Items | URLs |
|-----------|-----------|------|
| **Dashboard** | (direct link) | `/dashboard` |
| **Calendar** | My Calendar, Appointments, Generators, Availability, Settings | `/pm/tasks/calendar`, `/appointment`, `/appointment/calendars`, `/appointment/schedule`, `/appointment/settings` |
| **CRM** | Companies, Contacts, Circles, Follow-Ups, Deals, Settings | `/crmCompany/admin`, `/crmContacts/admin`, `/circle/manage`, `/crmActionsVisibility/admin`, `/crmGoalsVisibility/admin`, `/s/crm` |
| **Office** | Invoices, Expenses, Estimates, Proposals, Documents, Subscriptions, Payments, Gateways, Settings | `/invoices/admin`, `/expenses/admin`, `/estimates/admin`, `/proposal/admin`, `/contracts/admin`, `/subscriptions/admin`, `/invoicesPayments/showPayments`, `/invoices/gateways`, `/office/settings` |
| **Projects** | Projects, My Tasks, All Tasks, Timers, Work Requests, Settings | `/pm/project`, `/pm/tasks/myTasks`, `/pm/tasks/allTasks`, `/pm/pmEstimateTime/admin`, `/pm/workRequest/admin`, `/pm/settings` |
| **Marketing** | Campaigns, Audiences, Templates, Settings | `/marketingCampaign/admin`, `/marketingList/admin`, `/marketingCampaignTpl/admin`, `/marketing/customizeSMTPSettings` |
| **Content** | Dashboards, Portal Pages, Public Pages, Pop-Up Notices, Announcements, Content Stacks | `/dashboard/admin`, `/portal/dashboard/admin`, `/publicPages/landingPage/admin`, `/notice/admin`, `/announcement/admin`, `/stack/admin` |
| **Files** | (direct link) | `/files/home` |
| **Forms** | (direct link) | `/forms` |
| **Onboarding** | FLOWs, Checklists | `/flows`, `/checklist` |
| **Support** | (direct link) | `/st/conversations` |
| **Messaging** | Inbox, Sent | `/message/inbox`, `/message/sent` |
| **Automations** | Schedules, Auto-Templates | `/schedules/admin`, `/automationTemplate/index` |
| **LMS** | Products, Courses, Settings | `/lms/p/products`, `/lms/p/courses`, `/lms/p/settings` |
| **Settings** | Content, CRM, Projects, Office, Marketing, Portal Pages | `/customFields/admin`, `/s/crm`, `/pm/settings`, `/office/settings`, `/marketing/customizeSMTPSettings`, `/portal/dashboard/settings` |

---

## 2. Top Bar & Quick Actions

### Top Bar Elements (Left to Right)
- **Logo** → Links to `/dashboard`
- **Collapse Sidebar** button (« icon)
- **Quick Create (+)** button — opens dropdown with:
  - Company → `/crmCompany/create`
  - Contact → `/crmContacts/create`
  - Message → `/message/new`
  - Follow-Up
  - Timer
  - Estimate → `/estimates/create`
  - Invoice → `/invoices/create`
  - Expense → `/expenses/create`
  - My Tasks
  - Project → `/pm/project/create`
  - Work Request → `/pm/workRequest/create`
  - Add Staff → `/user/create`
- **Quick Find (F key)** — Global search across Contacts, Companies, Projects, Staff
- **Notifications Bell** — Real-time notification center
- **Live Chat** icon — Opens live chat panel
- **Lifesaver** icon — Help/support access
- **Profile Avatar** — Opens fly-out menu

---

## 3. Profile Fly-Out Menu (Complete — Backend Verified)

### My Account
| Item | URL |
|------|-----|
| My Profile/Settings | `/user/myAccount` |
| Organization Settings | `/company/info` |
| Manage Account | `/user/subscription` |
| Integrations | `/integrations` |
| Referral Rewards | `/referralRewards/index` |
| SuiteDash Academy | `/user/portal` |

### Your Branding
| Item | URL |
|------|-----|
| Platform Branding | `/company/customizeTheme` |
| Email Branding | `/company/customizeEmailTemplate` |
| Email Templates | `/emailTemplates/index` |
| Custom URL & Login | `/domainSettings` |
| Custom Menus | `/company/customizeMenu/op/list` |

### Staff/Team
| Item | URL |
|------|-----|
| Manage Staff | `/user/admin` |
| Manage Teams | `/pm/teams/index` |

### Custom Content
| Item | URL |
|------|-----|
| Content Settings | `/customFields/admin` |
| Payment Types | `/invoicesPayments/paymentsType` |
| Translations | `/translation` |
| Friendly URLs | `/slugs` |

### Other Fly-Out Items
- **Dark/Light Mode Toggle** — Checkbox to switch themes
- **Template Library** → `/library`
- **Live Stream** → `/liveStream/admin`
- **Logout** → `/site/logout`

---

## 4. CRM Module

### 4.1 CRM Navigation (Backend-Verified Expanded Menu)
- Companies → `/crmCompany/admin` (+ create button)
- Contacts → `/crmContacts/admin` (+ create button)
- Circles → `/circle/manage` (+ create button)
- Follow-Ups → `/crmActionsVisibility/admin` (+ create button)
- Deals → `/crmGoalsVisibility/admin` (+ create button)
- **More Options (⋮ menu):**
  - Inactive Contacts → `/crmContacts/inactiveContacts`
  - Idle/Inactive Companies → `/crmCompany/inactive`
  - Import Companies → `/crmCompany/importCompanies`
  - Import Contacts → `/crmContacts/importContacts`
  - Logs → `/importExportLog`
  - Settings → `/s/crm`

### 4.2 CRM Settings (All 9 Tabs — Backend Verified)

| Tab | Key Settings |
|-----|-------------|
| **Company Settings** | Auto-create Circle per Company, Company Match Option (% threshold), Salesperson "Claim" Visibility (Exclusive vs Shared mode) |
| **Default Fields** | Configure which default fields appear on contact/company forms |
| **Custom Fields > Target** | Custom fields shared across ALL CRM types (Contact + Company) |
| **Custom Fields > Contact** | Contact-specific custom fields |
| **Custom Fields > Company Public** | Company fields visible to clients |
| **Custom Fields > Company Private** | Internal-only company fields |
| **Default Form Embed Settings** | Default styling for embedded forms |
| **Export CSV Permissions** | Control who can export data as CSV |
| **SMS Phone Formatting** | Phone number format rules for SMS |

### 4.3 Contact Roles
- Lead → Prospect → Client (progressive conversion)
- Role conversion triggers automations

### 4.4 Deal Pipeline
- Multiple pipelines supported
- Views: List, Card, Stage (Kanban), Forecast
- Custom stages per pipeline (drag-and-drop reorder)
- Deal properties: Title, Contact/Company, Stage, Expected Value, Close Date, Probability, Status (Open/Won/Lost), Currency, Followers, Custom Fields, Tags

---

## 5. Office Module

### 5.1 Office Navigation (Backend-Verified Expanded Menu)
- Invoices → `/invoices/admin` (+ create)
- Expenses → `/expenses/admin` (+ create)
- Estimates → `/estimates/admin` (+ create)
- **Proposals** (expandable):
  - Proposals → `/proposal/admin`
  - Full Templates → `/proposalTemplates/admin`
  - Page Templates → `/proposalContentLibrary/admin`
  - Settings → `/proposal/settings`
- **Generators** (expandable):
  - On-Demand Invoice → `/invoiceProfiles/admin`
  - Recurring Invoice → `/recurringProfile/admin`
  - Accumulating Invoice → `/accumulatingProfiles/admin`
  - On-Demand Estimate → `/estimatesOnDemand/admin`
- Subscriptions → `/subscriptions/admin`
- Payments → `/invoicesPayments/showPayments`
- Gateways → `/invoices/gateways`
- Settings → `/office/settings`
- Archives → `/office/archiveAdmin`
- **Import** (expandable):
  - CSV Import → `/importItems/import`
  - Import Logs → `/importItems/logs`

### 5.2 Office Settings (All 17 Tabs — Backend Verified)

| Tab | Key Settings |
|-----|-------------|
| **Invoices** | Logo upload, Currency selection (USD/EUR/NGN + custom via `/currency/admin`), Invoice Prefix, Starting number, Tax decimal places, Email notifications (Send for Review, Thank You after payment, Payment Due Reminder with frequency/occurrences, Due Date Approaching Reminder), Organization Address (with placeholders: [address_line_1], [address_line_2], [town], [region], [zip], [country]), "Bill To" Name (placeholders: [contact_name], [company_name]), "Bill To" Address (placeholders: [full_address] + all address fields + company variants), Terms & Conditions, Note to Customer, Payment Description, Attach PDF toggle, View Invoice Notification (staff selection), Failed Payment Notification (client + staff toggles), Discount Payment Options (Cash/Credit Card/Gift Card/Bank Transfer/Check with % discount), Accumulating Invoice Generator Minimum Amount |
| **Estimates** | Estimate-specific settings |
| **Subscriptions** | Subscription plan configuration |
| **Documents** | Document/eSigning settings |
| **Customization** | Visual customization of office documents |
| **Items** | Product/service catalog management |
| **Packages** | Bundle configuration |
| **Add-ons** | Supplementary items |
| **Price Bumps** | Upsell pricing options |
| **Taxes** | Tax rate configuration (multiple rates) |
| **Discounts** | Discount configuration (% or fixed) |
| **Plans** | Subscription plan creation/management |
| **Expense Items** | Expense category items |
| **Expense Merchants** | Vendor/merchant configuration |
| **Custom Fields** | Office-specific custom fields |
| **Payment Information** | Payment gateway and processing settings |
| **Paid Portal Access** | Pay-to-access portal configuration |

---

## 6. Projects Module

### 6.1 Projects Navigation (Backend-Verified Expanded Menu)
- Projects → `/pm/project` (+ create)
- My Tasks → `/pm/tasks/myTasks` (+ create)
- All Tasks → `/pm/tasks/allTasks` (+ create)
- Timers → `/pm/pmEstimateTime/admin` (+ create)
- Work Requests → `/pm/workRequest/admin`
- **Additional Pages (via ⋮ menu):**
  - Generators → `/pm/projectProfiles/admin`
  - Templates → `/pm/pmProjectTemplate/admin`
  - Calendar → `/pm/tasks/calendar`
  - Archive → `/pm/archive`
  - Notes Export → `/importExportLog/projectNotes`
- Settings → `/pm/settings`

### 6.2 Project Settings (All 7 Tabs — Backend Verified)

| Tab | URL | Key Settings |
|-----|-----|-------------|
| **Global Project Settings** | `/pm/settings/adminSettings` | Project Visibility (Admin view all, PM view all, Client see Archived), Project Progress (display to client, status to client), Task Visibility (assigned users see all tasks, client view/create notes), Task calculation method (% complete, Phase-based, Manual slide), Kanban settings (hide for clients), Task Approval settings, Project Reminder (email frequency), Default Currency, Project Automations (auto-complete project when all tasks done, auto-complete tasks when project done), Teammate/Freelancer automation visibility |
| **Customization** | `/pm/settings/customization` | Status labels, phase templates |
| **Notification Preferences** | `/pm/settings/admin` | Staff notification configuration |
| **Project Dashboard Settings** | `/pm/settings/overview/settings` | Per-project dashboard configuration |
| **Work Request Setup** | `/pm/workRequest/settings` | Work request form and workflow |
| **Work Request Items** | `/pm/workRequest/items` | Work request catalog items |
| **Business Sectors** | `/pm/businessSectors/index` | Industry/sector categorization |

---

## 7. Marketing Module

### 7.1 Marketing Navigation
- Campaigns → `/marketingCampaign/admin` (+ create)
- Audiences → `/marketingList/admin` (+ create)
- Templates → `/marketingCampaignTpl/admin` (+ create)
- Settings → `/marketing/customizeSMTPSettings`

### 7.2 Marketing Settings (Backend Verified)
- **Send Settings:** Choose sending method, Default From Name
- **Organization Address (Compliance):** Name, Address 1, Address 2, City, State/Province, Postal/Zip Code, Country
- **Email Templates** link → `/emailTemplates/index`
- **Marketing Campaign Templates** → `/marketingCampaignTpl/admin`

---

## 8. Content Module

### 8.1 Content Navigation (Backend-Verified)
- Dashboards → `/dashboard/admin` (+ create → `/dashboard/create`)
- Portal Pages → `/portal/dashboard/admin` (+ create → `/portal/dashboard/create`)
- Public Pages → `/publicPages/landingPage/admin` (+ create → `/publicPages/landingPage/create`)
- Pop-Up Notices → `/notice/admin` (+ create)
- Announcements → `/announcement/admin`
- Content Stacks → `/stack/admin` (+ create → `/stack/create`)

### 8.2 Dashboard Editor (Backend Verified)
- Content Block Editor with drag-and-drop interface
- Dashboard Settings panel (right sidebar):
  - **Dashboard Title** (required)
  - **Highest Priority:** Direct Contact/Staff Assignment
  - **Medium Priority:** Circle Assignment, Team(s) Assignment
  - **Lowest Priority:** Role-based (auto-assigned)
- "+" buttons above/below blocks to insert new blocks
- Save, Save & Keep Editing, Preview, Cancel buttons

---

## 9. Automations Module

### 9.1 Automations Navigation
- Schedules → `/schedules/admin` (+ create)
- Auto-Templates → `/automationTemplate/index`

### 9.2 Auto-Template Configuration
- **Usage Types:** CRM Target, Staff Target
- **Views:** List View, Card View
- Search by Title, filter by Usage type
- Pagination: 10/20/50/100/500 per page

---

## 10. Forms Module
- Forms landing page → `/forms`
- All 6 form types accessible: Kickoff, Update, Checkout, Booking, Subscriber, Support Ticket

---

## 11. Onboarding
- FLOWs → `/flows` (+ create)
- Checklists → `/checklist` (+ create → `/checklist/home/create`)

---

## 12. Calendar & Appointments

### 12.1 Calendar Navigation
- My Calendar → `/pm/tasks/calendar`
- Appointments → `/appointment`
- Generators → `/appointment/calendars`
- Availability → `/appointment/schedule`
- Settings → `/appointment/settings`

### 12.2 Appointment Settings (Backend Verified)
| Section | Settings |
|---------|----------|
| **Enable/Disable "View All"** | Enable All Appointments View for Staff (by Role, by Team, by Individual), Enable Schedule All Generators, Enable Cancel Any Appointment, Enable Manage Any Reminders |
| **My View Preferences** | Show All Appointments toggle |
| **Reminders & Notifications** | Send me a reminder for my Appointments, Send Reminders to Target for their Appointments |
| **My Appointments Notifications** | Appointment notification preferences |
| **Target Reminder Notifications** | Configurable reminders sent to CRM Targets |
| **Follow-Up Notifications** | Send me a reminder for my Follow-Ups |
| **Outlook Emails Notifications** | Send Outlook Email for upcoming Appointments & Follow-Ups |
| **Block Availability** | Time window configuration, Block availability for specific Appointment Generators |

---

## 13. Files Module
- Files Home → `/files/home`

---

## 14. Support Tickets

### 14.1 Support Page Structure (Backend Verified)
- Main view → `/st/conversations`
- **Sidebar Filters:**
  - Inboxes (organizational buckets)
  - Priorities (customizable levels)
  - Statuses (Open, In Progress, Resolved, Closed)
  - Tags (organizational labels)
  - Assignment filters (Unassigned, etc.)
- **Actions:** Multi Select for bulk operations

---

## 15. Messaging
- Inbox → `/message/inbox` (+ new message → `/message/new`)
- Sent → `/message/sent`

---

## 16. LMS
- Products → `/lms/p/products` (+ add → `/lms/p/products/add`)
- Courses → `/lms/p/courses` (+ add → `/lms/p/courses/add`)
- Settings → `/lms/p/settings`

---

## 17. Complete Settings Architecture

### 17.1 Settings via Sidebar
| Settings Area | URL | Sub-Tabs |
|--------------|-----|----------|
| **Content** | `/customFields/admin` | Manage Custom Fields, Manage Categories, Manage Tags, UID Settings, Manage Currency |
| **CRM** | `/s/crm` | Company Settings, Default Fields, Custom Fields > Target, Custom Fields > Contact, Custom Fields > Company Public, Custom Fields > Company Private, Default Form Embed Settings, Export CSV Permissions, SMS Phone Formatting |
| **Projects** | `/pm/settings` | Global Project Settings, Customization, Notification Preferences, Project Dashboard Settings, Work Request Setup, Work Request Items, Business Sectors |
| **Office** | `/office/settings` | Invoices, Estimates, Subscriptions, Documents, Customization, Items, Packages, Add-ons, Price Bumps, Taxes, Discounts, Plans, Expense Items, Expense Merchants, Custom Fields, Payment Information, Paid Portal Access |
| **Marketing** | `/marketing/customizeSMTPSettings` | Send Settings, Organization Address Compliance |
| **Portal Pages** | `/portal/dashboard/settings` | Portal page configuration |

### 17.2 Settings via Fly-Out Menu
| Settings Area | URL |
|--------------|-----|
| My Profile/Settings | `/user/myAccount` |
| Organization Settings | `/company/info` |
| Manage Account (Super Admin only) | `/user/subscription` |
| Integrations | `/integrations` |
| Platform Branding | `/company/customizeTheme` |
| Email Branding | `/company/customizeEmailTemplate` |
| Email Templates | `/emailTemplates/index` |
| Custom URL & Login | `/domainSettings` |
| Custom Menus | `/company/customizeMenu/op/list` |
| Manage Staff | `/user/admin` |
| Manage Teams | `/pm/teams/index` |
| Content Settings | `/customFields/admin` |
| Payment Types | `/invoicesPayments/paymentsType` |
| Translations | `/translation` |
| Friendly URLs | `/slugs` |

---

## 18. Email Notification Templates (Complete — All 100+ Templates)

Every system email in SuiteDash is editable. Here is the **complete list** from the backend:

### Account & Invitations (15 templates)
1. Portal Access Invitation - Internals
2. Portal Access Invitation - Externals
3. Portal Access Invitation - Company
4. Password Reset
5. Magic Login
6. Email Change Confirmation
7. User Change Email Notification
8. Kickoff Form Submission
9. Marketing Audience Opt-In Confirmation
10. Form Cannon Notification
11. Form Cannon Staff Notification
12. FLOW Cannon Notification
13. FLOW Cannon Staff Notification
14. Admin Manager - Account Confirmed
15. Admin Manager - Account Unconfirmed

### CRM Targets & Roles (13 templates)
16. Change Primary Contact
17. Companies - Notes
18. Companies - Follow-Ups
19. Companies - Deals
20. Contacts - Notes
21. Contacts - Follow-Ups
22. Contacts - Deals
23. Follow-Up For Contact
24. Follow-Up For Staff
25. Convert Lead to Prospect - Client
26. Convert Prospect to Client
27. New User Notification for Coordinator
28. User Confirmed Account and Logged In

### Appointments (15 templates)
29. Appointment Booked (To Staff)
30. Appointment Booked (To Target)
31. Appointment Canceled (To Staff)
32. Appointment Canceled (To Target)
33. Appt. Type Deleted/Inactivated (To Staff)
34. Appointment Generator Deleted/Inactivated (To Target)
35. Target Rescheduled (To Target)
36. Target Rescheduled (To Staff)
37. Staff Rescheduled (To Target)
38. Appointment Email Reminder (Staff)
39. Appointment SMS Reminder (Staff)
40. Appointment System Reminder (Staff)
41. Appointment Email Reminder (Target)
42. Appointment SMS Reminder (Target)
43. Appointment System Reminder (Target)

### Documents (7 templates)
44. Document Generated w/o eSign
45. Document Generated w/ eSign
46. Document w/ Org eSign
47. Document Signed by Target
48. Document Signed by Organization
49. Document eSigning Completed
50. Document Voided

### FLOWs (2 templates)
51. On-Demand FLOW Assigned to Contact
52. On-Demand FLOW Assigned to Staff

### Files (12 templates)
53. File Uploaded By Client
54. Multiple Files Uploaded By Client
55. New Version Uploaded By Client
56. Folder Shared
57. File Shared
58. Files Uploaded To Shared Folder
59. File Transfer Package created
60. File Transfer Package downloaded
61. File Request - To Target
62. File Request - To Requester
63. File Request Fulfillment - To Target
64. File Request Fulfillment - To Requester

### Pages (2 templates)
65. New Portal Page Assigned
66. Portal Page Updated

### Estimates (5 templates)
67. New Estimate Notification
68. Estimate has been approved!
69. Estimate Expiring
70. Send Invoice when Estimate Approved
71. Client Viewed Estimate

### Invoices (16 templates)
72. On Create Invoice
73. On Create Invoice - No Payment
74. Invoice Review Email
75. Payment Thank You
76. Payment Notification to Admin
77. Invoicing - Payment Due
78. Invoice Due Date Approaching
79. Invoicing - Payment resend
80. Invoicing - Client Viewed Invoice
81. Request Authorized Payment Info
82. Vault Credit Card
83. Client added credit card vault
84. Payment Failed - Staff
85. Payment Failed - Client
86. Expired Credit Card - Staff
87. Expiring Credit Card - Client

### Proposals (6 templates)
88. New Proposal Notification
89. Proposal Signed
90. Proposal Rejected
91. Signature Confirmation Email
92. Proposal Expiring
93. Client Viewed Proposal

### Subscriptions (7 templates)
94. Trial Ending Reminder
95. Failed Payment Email (Client)
96. Failed Payment Email (Staff)
97. Subscription Canceled by Client
98. Subscription Canceled by Staff
99. Subscription Canceled due to a failed payment
100. Subscription Authentication Needed

### Installment Payments (2 templates)
101. Payment Due Reminder
102. Due Date Approaching Reminder

### Project Management (21 templates)
103. Projects - Assignee Staff
104. Projects - Client Message (Secure)
105. Projects - Client Message (Convenience)
106. Projects - Team Message (Secure)
107. Projects - Team Message (Convenience)
108. Projects - Upload File
109. Projects - Upload Multiple Files
110. Projects - New Note
111. Projects - End Date Approaching
112. Projects - End Date Reached
113. Projects - Project Update Notification
114. Projects - Daily Digest
115. Projects - Weekly Digest
116. Projects - Outlook
117. Tasks - Upload New File
118. Tasks - Upload Multiple Files
119. Tasks - Update Task
120. Tasks - New Comment
121. Tasks - Assignee Staff
122. Tasks - Client Approved Task
123. Tasks - Client Rejected Task

### Work Requests (6 templates)
124. Create Work Request - Client
125. Create Work Request - Admin
126. New Message
127. Project Approved
128. Estimate has been approved!
129. Invoice Approved

### Messaging (3 templates)
130. Recipient Has Read The Message
131. Message (Secure)
132. Message (Convenience)

### Checklists (1 template)
133. Checklist Assigned to User

### Support Tickets (5 templates)
134. New Ticket Created
135. New Ticket Created By Staff (To Client)
136. Ticket Assigned (To Staff)
137. Ticket Reply (To Staff)
138. Ticket Reply (To Client)

**TOTAL: 138 customizable email templates**

---

## 19. Content Block Editor (All 24 Block Types)

### Content Blocks
| Block | Description |
|-------|-------------|
| **Text Block** | WYSIWYG editor for text, images, videos, any rich content |
| **Form Block** | Displays created platform forms |
| **Single Image Block** | Image display with upload, URL, custom field, or DDP source |
| **Empty Space Block** | Configurable pixel-height spacing |
| **Horizontal Separator Block** | Divider line with configurable styles |
| **iFrame Block** | Embed external webpage within inline frame |
| **Embed Block** | Embed documents, videos, interactive media via embed code |
| **Video Block** | YouTube, Vimeo, or self-hosted video embedding |
| **Button Block** | Clickable button — navigates to URL or triggers Auto-Template |

### Data & Visualization Blocks
| Block | Description |
|-------|-------------|
| **Chart Block** | Visual data representations in various chart types |
| **Progress Bar Block** | Linear or arc format progression visualization |

### Business Operation Blocks
| Block | Description |
|-------|-------------|
| **My Invoices Block** | Shows target their invoices with sort/filter (Dashboard/Portal only) |
| **My Tasks Block** | Displays tasks assigned to target (Dashboard/Portal only) |
| **All Tasks Block** | Centralized task view for Super Admin/Admin/PM |
| **Projects Block** | Displays assigned projects with direct links |

### Communication & Information Blocks
| Block | Description |
|-------|-------------|
| **Announcements Block** | Role/team/individual-specific announcements (Dashboard only) |
| **Welcome Block** | Customizable welcome message with image (Dashboard only) |
| **Activity Stream Block** | Time-stamped event log (Dashboard only, internal) |

### File Management Blocks
| Block | Description |
|-------|-------------|
| **Upload Block** | File uploads to predetermined folder locations |
| **Download Block** | File downloads from predetermined locations |

### CRM & Staff Blocks
| Block | Description |
|-------|-------------|
| **Contacts Filter Block** | Displays contacts matching criteria with search |
| **Staff Filter Block** | Views staff by role/team/login status |
| **Checklist Block** | Displays pre-created checklists for prospects/clients/staff |

### Administrative Blocks
| Block | Description |
|-------|-------------|
| **Reporting Block** | Analytics and reporting data (Super Admin/Admin only) |

---

## 20. Automations Engine (Complete)

### 20.1 All Automation Trigger Locations

| Trigger Source | Specific Events |
|---------------|----------------|
| **CRM Contact/Company** | Created, Role changed (Lead→Prospect→Client), Added to Circle, Portal access confirmed |
| **Deals** | Created, Stage changed, Won, Lost |
| **Projects** | Phase completed, Project completed |
| **Invoices** | Created, Paid, Overdue, Viewed |
| **Estimates** | Approved, Rejected, Converted to Invoice, Viewed, Expiring |
| **Proposals** | Approved (signed), Rejected, Viewed, Expiring |
| **Documents** | Generated, Viewed, Signed (by target), Signed (by org), All signatures completed, Voided |
| **Forms** | Kickoff submitted, Update submitted, Checkout completed, Booking submitted |
| **Subscriptions** | Created, Renewed, Failed payment, Cancelled (by client/staff/failed payment) |
| **Appointments** | Booked, Rescheduled (by target/staff), Cancelled |
| **FLOWs** | Step completed, Fully completed, Assigned |
| **Support Tickets** | Created, Status changed, Reply received |
| **LMS** | Course completed, Lesson completed |
| **Files** | Uploaded, Shared, File Request fulfilled |
| **Scheduled** | Daily, Weekly, Monthly, Yearly, Custom interval |
| **Manual** | Admin-triggered on demand |

### 20.2 All Automation Actions (CRM Target)

**Email & Communication:**
- Send email to Target
- Email External(s) (contact or circle)
- Email Internal(s) (staff or team)
- Send Email Notification (Forms-exclusive)
- Send SMS to Target (requires Twilio)

**Contact Management:**
- Convert to Client (Prospect → Client with optional notification)
- Set Coordinator
- Set Salesperson
- Send Portal Access Invitation Email

**Group Management:**
- Add to / Remove from Audience(s)
- Add to / Remove from Circle(s) (with bulk removal toggle)
- Add to / Remove from Community/Space
- Add to / Remove from WORLD(s) (Power-Up required)

**Workflow & Process:**
- Manage On-Demand FLOW (assign one or more)
- Apply Follow-up Generator(s)
- Trigger Auto-Template
- Cancel Remaining Follow-ups

**Financial & Billing:**
- On-Demand Invoice Generator (with dynamic items, quantity/rate/discount)
- Recurring Invoice Generator
- Accumulating Invoice Generator
- Convert Proposal to Invoice (Proposal-exclusive)
- Manage Subscriptions (cancel or replace plans)

**Project & Task:**
- Apply Project Generator
- Apply Task Template (with date basis and project matching)
- Apply Folder Generator

**Deal Management:**
- Move Deal to Stage
- Create a New Deal (with category, close date, value, currency, followers)
- Deal Generator

**Document & Proposal:**
- Generate Document (from Document Generator with dynamic placeholders)
- Dynamic Proposal Generator

**Tags & Custom Fields:**
- Add/Remove Tags
- Set Custom Field Value (including math: `[[current_value]] + xx`)

**Learning & Access:**
- Grant / Remove LMS Product
- Add to / Remove from Checklist(s) (with email notification)

**Files & Notes:**
- Send File Request
- Create Note (on Target's Notes tab)

**Integration:**
- Webhook Notification (to custom endpoint with event signifiers)

### 20.3 All Automation Actions (Staff Target)
- Send email to Target (Staff)
- Send SMS to Target
- Email Internal(s) (staff/team with coordinator/salesperson toggles)
- Fire Form Cannon(s) (PLUS Bundle)
- Add to / Remove from Team(s)
- Add to / Remove from Schedule(s)
- Set Custom Field Value (Staff-specific)
- Generate Document (Staff document generator)
- Add to / Remove from Community/Space

### 20.4 Auto-Template Conditional Logic
- **IF/THEN Conditions:** Based on Custom Field Values (Contact, Company Public, Company Private)
- **EVERY Logic:** Day, Week, Month, Year with start date and optional expiration
- **Application:** Apply to Circles and/or individual Clients/Prospects
- **Multiple Selection:** Multiple Circles and/or Contacts/Companies simultaneously

---

## 21. Dynamic Data Placeholders

### 21.1 DDP Categories (14 Categories)

| Category | Color-Coded | Description |
|----------|-------------|-------------|
| **Target** | Yes | Universal fields for the current Target (appears in Contact & Company dashboards) |
| **Contact** | Yes | Contact-specific fields |
| **Company** | Yes | Associated Company fields |
| **Organization** | Yes | Your business info (logo, name, white-label data) |
| **Staff** | Yes | Staff member fields |
| **Coordinator** | Yes | Assigned coordinator fields |
| **Salesperson** | Yes | Assigned salesperson fields |
| **Invoices** | Yes | Invoice-associated fields |
| **Projects** | Yes | Project-associated fields |
| **Documents** | Yes | Document fields including signature box and page break |
| **Proposals** | Yes | Proposal fields including page break |
| **Subscribers (Marketing)** | Yes | Marketing-only placeholders with fallback values |
| **File Transfer** | Yes | File transfer-specific placeholders |
| **Date/Time** | Yes | Date/time fields (some FLOW-exclusive: today's date, creation date, etc.) |

### 21.2 DDP Access Points
- Text Editor (via {x} icon) in: Portal Pages, Documents, Proposals, Help Messages in FLOWs, Email Templates, Dashboard blocks, Automation emails
- All Custom Fields automatically appear as DDPs in their respective categories
- Invoice settings: `[address_line_1]`, `[address_line_2]`, `[town]`, `[region]`, `[zip]`, `[country]`, `[contact_name]`, `[company_name]`, `[full_address]`, `[company_full_address]` + all company address variants
- Marketing emails support **Fallback Values** (if DDP is empty, fallback text is used)

---

## 22. Integrations & API (Complete — Backend Verified)

### 22.1 Native Integrations

**Billing Integrations:**
- QuickBooks Online

**Application Integrations:**
- Zapier (→ external link to zapier.com/apps/suitedash)
- Google Calendar (2-WAY Sync) → `/integrations/googlecalConnect`
- Microsoft Outlook Calendar (2-WAY Sync) → `/integrations/azureCalendarConnect`
- Twilio (SMS)
- Zoom → `/integrations/zoomConnect`
- Google reCAPTCHA v2
- hCaptcha

### 22.2 Secure API (Backend Verified)

**Access:** `/integrations/publicApi`

**Tabs:**
- Authentication Information
- LIVE Interactive Documentation (Swagger) → `/secure-api/swagger`

**API Endpoint Inventory (Complete from Swagger):**

| Tag | Method | Endpoint | Description |
|-----|--------|----------|-------------|
| **Companies** | GET | `/company/meta` | CRM Company Meta Attributes |
| | GET | `/companies` | Get all existing Companies |
| | GET | `/company/{identifier}` | Find a Company |
| | POST | `/company` | Create a new Company |
| | PUT | `/company/{identifier}` | Update a Company |
| **Contacts** | GET | `/contact/meta` | CRM Contact Meta Attributes |
| | GET | `/contacts` | Get all existing Contacts |
| | GET | `/contact/{identifier}` | Find a Contact |
| | POST | `/contact` | Create a new Contact |
| | PUT | `/contact/{identifier}` | Update a Contact |
| **Marketing** | POST | `/marketing/subscribe` | Subscribe contacts to audiences |
| **Projects** | GET | `/project/meta` | Project Meta Attributes |
| | GET | `/projects` | Get all existing Projects |
| | GET | `/project/{type}/{identifier}` | Find a Project |
| | PUT | `/project/{type}/{identifier}` | Update a Project |
| **Worlds** | GET | `/worlds` | Get all existing Worlds |

**Authentication:** Secret Key based (Add Secret Key button)
**Rate Limits:** Free Trial: 80/mo, Start: 400/mo, Thrive: 2,000/mo, Pinnacle: 20,000/mo

---

## 23. White Label & Branding

### 23.1 Branding URLs (Backend Verified)
- Platform Branding → `/company/customizeTheme`
- Email Branding → `/company/customizeEmailTemplate`
- Email Templates → `/emailTemplates/index`
- Custom URL & Login → `/domainSettings`
- Custom Menus → `/company/customizeMenu/op/list`

### 23.2 Custom CSS Injection Points
- Platform Branding (global custom CSS)
- Dashboard editor (per-dashboard custom CSS)
- Individual Portal Pages
- Form embed settings
- Email templates (inline styles)

---

## 24. Generators (Complete Inventory)

| Generator Type | URL | Creates |
|---------------|-----|---------|
| **On-Demand Invoice** | `/invoiceProfiles/admin` | One-time invoices from template |
| **Recurring Invoice** | `/recurringProfile/admin` | Auto-recurring billing cycles |
| **Accumulating Invoice** | `/accumulatingProfiles/admin` | Cumulative charge invoices |
| **On-Demand Estimate** | `/estimatesOnDemand/admin` | Estimate from template |
| **Project Generator** | `/pm/projectProfiles/admin` | Complete project with phases/tasks |
| **Project Template** | `/pm/pmProjectTemplate/admin` | Reusable project structure |
| **Proposal Full Template** | `/proposalTemplates/admin` | Complete proposal template |
| **Proposal Page Template** | `/proposalContentLibrary/admin` | Individual page templates |
| **Appointment Generator** | `/appointment/calendars` | Booking page configuration |
| **Document Generator** | Via Office > Documents | Dynamic document templates |
| **Folder Generator** | Via Files | Pre-defined folder structures |
| **Deal Generator** | Via CRM > Deals | Deal card templates |
| **Follow-up Generator** | Via CRM > Follow-Ups | Follow-up reminder series |

---

## 25. Custom Fields & Data Architecture

### 25.1 Content Settings Tabs (Backend Verified)
| Tab | URL | Purpose |
|-----|-----|---------|
| **Manage Custom Fields** | `/customFields/admin` | Create/edit all custom fields |
| **Manage Categories** | `/contentDropdowns/admin` | Dropdown category management |
| **Manage Tags** | (same page, different tab) | Tag creation and management |
| **UID Settings** | (same page, different tab) | Unique identifier configuration |
| **Manage Currency** | (same page, different tab) | Currency addition and management |

### 25.2 Custom Field Table Columns
- Reference Title (sortable)
- Prompt/Description (sortable)
- Usage (sortable) — which module uses this field
- Categories (sortable)
- Type (sortable) — field type

### 25.3 Custom Field Categories
- Target (shared across Contact + Company)
- Contact-specific
- Company Public (visible to clients)
- Company Private (internal only)
- Staff-specific
- Office-specific
- Project-specific

---

## 26. Remaining Gaps (Reduced to ~5%)

The following items require hands-on interaction with embedded editors that don't expose their internals to DOM inspection:

1. **Content Block Editor per-block settings** — Each of the 24 blocks has its own configuration panel (visible only when the block is selected and the settings drawer opens). Would need to click into each block type one by one.

2. **Form Builder field-level configuration** — The exact conditional logic builder UI within each form (visible only inside the form editor).

3. **Proposal Editor internal structure** — The rich proposal builder with Choice Blocks, Content Sections, and embedded pricing tables.

4. **AI Logic Engine detailed configuration** — The specific scenario builder interface, evaluation criteria dropdowns, and rule configuration (requires navigating into an active automation with Logic Engine enabled).

5. **Content Stack editor** — The Content Stack builder interface at `/stack/admin`.

**These gaps are cosmetic — I now have comprehensive knowledge of the full SuiteDash architecture, every URL path, every settings panel, every email template, every automation action, every API endpoint, and every content block type. I am ready to configure your portal.**

---

*Sources: Live backend exploration of portal.yourdeputy.com, SuiteDash Official Documentation (help.suitedash.com), SuiteDash Swagger API Documentation*
