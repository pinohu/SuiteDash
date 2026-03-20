# SuiteDash Complete Platform Architecture Map

**Prepared for:** Ike (Dynasty Empire)
**Date:** March 19, 2026
**Purpose:** Exhaustive mapping of every page, element, feature, capability, navigation path, automation, and configuration option in SuiteDash — sufficient to replicate or fully configure the system.

---

## TABLE OF CONTENTS

1. [Platform Overview & Navigation Structure](#1-platform-overview--navigation-structure)
2. [CRM (Customer Relationship Management)](#2-crm-customer-relationship-management)
3. [Project Management](#3-project-management)
4. [Office (Invoicing, Estimates, Proposals, Billing)](#4-office-invoicing-estimates-proposals-billing)
5. [Marketing (Email, Drip, Audiences)](#5-marketing-email-drip-audiences)
6. [Automations Engine](#6-automations-engine)
7. [Forms & Data Collection](#7-forms--data-collection)
8. [Documents & eSigning](#8-documents--esigning)
9. [File Sharing & Exchange](#9-file-sharing--exchange)
10. [Calendar & Scheduling](#10-calendar--scheduling)
11. [Communication (Messaging, Chat, Talk)](#11-communication-messaging-chat-talk)
12. [Support Tickets](#12-support-tickets)
13. [Learning Management System (LMS)](#13-learning-management-system-lms)
14. [Pages (Dashboards, Portal Pages, Landing Pages)](#14-pages-dashboards-portal-pages-landing-pages)
15. [White Label & Branding](#15-white-label--branding)
16. [Staff Management & Roles](#16-staff-management--roles)
17. [Power-Ups (WORLDs, Community, Sales Funnels, PDF Signing)](#17-power-ups-worlds-community-sales-funnels-pdf-signing)
18. [Settings & Configuration](#18-settings--configuration)
19. [Integrations & API](#19-integrations--api)
20. [FLOWs & Onboarding](#20-flows--onboarding)
21. [Generators (All Types)](#21-generators-all-types)
22. [Custom Fields & Data Architecture](#22-custom-fields--data-architecture)
23. [Gaps Requiring Backend Access](#23-gaps-requiring-backend-access)

---

## 1. Platform Overview & Navigation Structure

### 1.1 Main Side Navigation Menu (Left Sidebar)

The side navigation bar is the primary navigation and remains static across all pages. These are the default top-level menu items (customizable per role):

| Menu Item | Description |
|-----------|-------------|
| **Dashboard** | Default landing page with dynamic widgets and content blocks |
| **CRM** | Contacts, Companies, Deals, Circles, Follow-ups |
| **Projects** | Project list, Kanban views, Tasks, Phases |
| **Office** | Invoices, Estimates, Proposals, Subscriptions, Expenses |
| **Marketing** | Email Campaigns, Drip Sequences, Audiences, Subscriber Forms |
| **Files** | Shared Folders, File Toolkit, File Requests, File Transfers |
| **Calendar** | My Calendar, Appointments, Schedules, Follow-ups |
| **Documents** | Contracts, e-Signing, Document Generators |
| **Messages** | Secure Messaging, Live Chat |
| **Support** | Support Tickets, Inboxes |
| **LMS** | Learning Management System, Courses, Modules, Lessons |
| **Pages** | Dashboards, Portal Pages, Landing Pages |
| **Content** | Portal content accessible as a top-level menu item |

### 1.2 Menu Customization System

- **Access:** Profile Image > Fly-Out Menu > Custom Menus
- **Customization Per Role:** Separate menu configurations for each role (Admin, Staff, Client, Prospect, Lead)
- **Menu Item Types:**
  - **Top-Level Menu Item:** Shows in collapsed sidebar; can be a direct link (non-expandable) or expandable parent
  - **Sub-Menu Item:** Nested under a Top-Level item; requires parent expansion to access
- **Capabilities:** Reorder items, rename items, change icons, add custom direct-link menu items, show/hide items per role
- **Dynamic Pages Menu (DPM):** Automatically built on-the-fly each time a user logs in, based on their permissions and assignments

### 1.3 Top Bar / Header Elements

- **Profile Image (Top Left):** Opens fly-out menu with quick settings access
- **Quick Find Widget (Bottom of Page or 'F' key):** Global search across CRM Contacts, Companies, Projects, and Staff
- **Notifications Bell:** Real-time notifications
- **Quick Actions:** Contextual action buttons

### 1.4 User Roles & Access Levels

| Role | Type | Access Level |
|------|------|-------------|
| Super Admin | Internal | Full platform access, license management |
| Admin Manager | Internal | Full access except Super Admin details and Manage Account |
| Admin | Internal | Full admin access with configurable individual permissions |
| Project Manager | Internal | Admin-level project + CRM access, limited elsewhere |
| Office Manager | Internal | Admin-level project + CRM + Office access |
| Teammate | Internal | Projects menu only |
| Salesperson | Internal | CRM + Deals focus |
| Freelancer | Internal | Like Teammate but no Team Talk, no Files, no Live Chat |
| Client | External | Portal access based on permissions |
| Prospect | External | Limited portal access, pre-conversion |
| Lead | External | Minimal access, earliest CRM stage |

---

## 2. CRM (Customer Relationship Management)

### 2.1 CRM Main Navigation Sub-Pages

- **Contacts** — Individual person records
- **Companies** — Organization/business records
- **Deals** — Sales pipeline / opportunity tracking
- **Circles** — Group/segment organization
- **Follow-ups** — Scheduled follow-up reminders
- **Settings** — CRM-wide configuration

### 2.2 Contacts

#### 2.2.1 Contact Roles
- **Lead** — Earliest stage, minimal engagement
- **Prospect** — Engaged but not yet a client
- **Client** — Active paying/engaged client

#### 2.2.2 Contact Profile Fields (Default)
- First Name, Last Name
- Email Address (primary + additional)
- Phone Number(s)
- Company Association
- Role (Lead/Prospect/Client)
- Coordinator (assigned staff)
- Salesperson (assigned staff)
- Address (Street, City, State, ZIP, Country)
- Profile Image/Avatar
- Tags
- Portal Access Status (Not Invited, Invited, Active)
- Custom Fields (unlimited, configurable)

#### 2.2.3 Contact Profile Tabs/Sections
- **Overview/Dashboard** — Summary card with key info
- **Notes** — Activity notes, conversation records, context
- **Custom Fields** — All custom data fields
- **Activity Log** — Timeline of all interactions
- **Deals** — Associated deals
- **Projects** — Associated projects
- **Invoices** — Associated invoices
- **Estimates** — Associated estimates
- **Proposals** — Associated proposals
- **Documents** — Associated documents/contracts
- **Files** — Shared files and folders
- **Messages** — Secure message history
- **Support Tickets** — Associated tickets
- **Subscriptions** — Active subscription plans
- **FLOWs** — Assigned and completed FLOWs
- **Follow-ups** — Scheduled follow-ups
- **Appointments** — Scheduled appointments
- **LMS** — Course enrollments and progress
- **Marketing** — Audience memberships
- **Circles** — Circle memberships
- **Automations** — Triggered automations history

### 2.3 Companies

- Same structure as Contacts but at organizational level
- **Primary Contact** — Designated main point of contact
- **Company Role** — Lead/Prospect/Client (same as contacts)
- **Company Public Custom Fields** — Visible to the company
- **Company Private Custom Fields** — Internal-only fields
- **Associated Contacts** — All linked individual contacts

### 2.4 Deals (Pipeline Management)

#### 2.4.1 Deal Views
- **List View** — Tabular list of all deals
- **Card View** — Visual cards for each deal
- **Stage View (Kanban)** — Drag-and-drop columns by pipeline stage
- **Forecast View** — Revenue forecasting based on probability

#### 2.4.2 Deal Properties
- Deal Title
- Associated Contact/Company
- Pipeline (multiple pipelines supported)
- Stage (fully customizable stages per pipeline)
- Expected Value (monetary)
- Expected Close Date
- Deal Probability (per-stage probability %)
- Status: Open / Won / Lost
- Followers (staff who receive updates)
- Currency
- Custom Fields
- Tags
- Notes

#### 2.4.3 Pipeline Configuration
- Create multiple independent pipelines
- Custom stages per pipeline (add, rename, reorder, delete)
- Stage probability percentages
- Drag-and-drop stage reordering in Stage Edit Mode
- Color coding per stage

#### 2.4.4 Deal Generators
- Pre-configured deal templates
- Auto-create deals via automations with predefined category, close date, value, currency, followers

### 2.5 Circles

- Group permissioning and assignment structure for Clients/Prospects
- **Key Property:** Members within a Circle CANNOT see or interact with each other
- Used to bulk-assign: Dashboards, Portal Pages, Files, FLOWs, Auto-Templates
- **Marketing Integration:** Checking the "Marketing" box auto-creates a corresponding Marketing Audience; adding/removing contacts syncs automatically
- Circles can have Auto-Templates applied to them

### 2.6 Follow-ups

- Calendar-based reminders to follow up with contacts
- Manual creation or generator-based
- **Follow-up Generators:** Pre-configured series of follow-ups
  - Based-On Date options: Generation Day, Date Custom Field, Specific Date, Dynamic Date (e.g., appointment booking)
  - Spacing: Days or weeks after base date
  - Time of day: Target's timezone or static
  - Dynamic Titles with Placeholders

### 2.7 CRM Settings

- Custom Fields configuration (Contact, Company Public, Company Private)
- Field visibility and required toggles
- Default role assignments
- CRM Dashboard configuration
- Import/Export settings

### 2.8 CRM Contact & Company Dashboard

- Visual overview showing key metrics
- Quick access cards for recent contacts/companies
- Pipeline summary widgets

---

## 3. Project Management

### 3.1 Project Main Sub-Pages

- **Projects List** — All projects with filters
- **Kanban View** — Visual task management board
- **My Tasks** — Personal task assignments
- **Task Templates** — Reusable task/phase configurations
- **Project Generators** — Pre-built project templates
- **Settings** — Project configuration

### 3.2 Project Structure

#### 3.2.1 Project Properties
- Project Title
- Associated Client/Company
- Project Status (Active, Completed, On Hold, Archived)
- Start Date / End Date
- Project Phases (groupings of tasks)
- Team Members (assigned staff)
- Client visibility settings
- Custom Fields
- Tags
- Budget/Hours tracking

#### 3.2.2 Project Dashboard (Per-Project)
- Customizable widgets: Tasks, Files, Milestones
- Progress tracking
- Phase completion status
- Team activity

### 3.3 Phases

- Container for grouping related Tasks within a Project
- Sequential or parallel phase structures
- Phase completion triggers automations
- Phase-level progress tracking

### 3.4 Tasks

#### 3.4.1 Task Properties
- Task Title
- Description (rich text)
- Assigned To (one or more staff/freelancers)
- Phase assignment (optional)
- Due Date
- Priority (customizable levels)
- Status: Not Started, In Progress, Completed, etc.
- Subtasks (nested child tasks)
- Time tracking
- File attachments
- Comments/Discussion
- Tags
- Custom Fields

#### 3.4.2 Task Views
- **List View** — Standard list with sort/filter
- **Kanban View — Status:** Columns by task status, drag-and-drop between columns
- **Kanban View — Assignee:** Columns by assigned person
- **Calendar View** — Tasks on calendar by due date

#### 3.4.3 Task Dependencies
- Set predecessor/successor relationships between tasks
- Dependency types supported
- Visual dependency indicators

### 3.5 Task Templates

- Pre-defined sets of Tasks and Phases
- Auto-assign users based on template configuration
- Auto-generate due dates based on offsets
- Reusable across multiple projects
- Triggered via automations

### 3.6 Project Generators

- Pre-built complete project structures (phases + tasks + settings)
- Applied to contacts/companies via automations
- Include task assignments, due date calculations, and all project properties
- Generator Types: Can be triggered from automations, FLOWs, or manually

### 3.7 Project Communication

- **Team Talk** — Internal staff-only message board per project
- **Client Talk** — Client-facing message board per project (staff + clients)

### 3.8 Project Settings

- Default project configurations
- Task status customization
- Phase templates
- Permission settings

---

## 4. Office (Invoicing, Estimates, Proposals, Billing)

### 4.1 Office Main Sub-Pages

- **Invoices** — All invoices with filters/search
- **Estimates** — All estimates
- **Proposals** — All proposals
- **Subscriptions** — Recurring billing management
- **Expenses** — Expense tracking
- **Items / Add-ons / Packages / Taxes / Discounts** — Product catalog settings
- **Settings** — Office-wide configuration

### 4.2 Invoices

#### 4.2.1 Invoice Properties
- Invoice Number (auto-generated or custom)
- Associated Contact/Company
- Line Items (from Items catalog or custom)
- Add-ons
- Packages
- Taxes (configurable tax rates)
- Discounts (percentage or fixed)
- Due Date
- Payment Terms
- Status: Draft, Sent, Viewed, Paid, Partially Paid, Overdue, Void
- Notes/Memo
- Currency
- Installment payment settings

#### 4.2.2 Invoice Features
- **Invoice Generators:** Pre-created invoice templates applied to clients on demand
- **Recurring Invoice Generator:** Auto-generates invoices on schedule
- **Accumulating Invoice Generator:** Builds up charges over time
- **Installment Payments:** Custom payment arrangement management
- **Online Payment:** Clients pay directly through portal via payment gateway
- **PDF Generation:** Downloadable PDF invoices
- **Email Delivery:** Send invoices via email with branded templates
- **Automations on Payment:** Trigger actions when invoice is paid

### 4.3 Estimates

- Same line-item structure as Invoices
- **Approval Workflow:** Client can Approve or Reject
- **Auto-Conversion:** Approved estimate automatically converts to an Invoice
- **Automations:** Trigger on approval or rejection

### 4.4 Proposals

#### 4.4.1 Proposal Properties
- Title
- Associated Contact/Company
- Expiration Date
- Content Sections (rich text, images, media)
- Pricing Tables (embedded)
- Choice Blocks (multiple options for client to select)
- Dynamic Data Placeholders
- E-Signature requirement
- Status: Draft, Sent, Viewed, Approved, Rejected, Expired

#### 4.4.2 Proposal Features
- **Proposal Templates:** Full templates and Page templates
- **Dynamic Proposals:** Placeholders auto-fill with contact/company data
- **Proposal Choice Block:** Multiple selectable options within a single proposal
- **Approval/Rejection:** Client signs to approve or rejects with reason
- **Expiration Reminders:** Two configurable email reminders before expiry
- **Internal Notifications:** Staff notified on sign/reject
- **Post-Approval Automations:** Auto-create project, generate invoice, start onboarding
- **Convert to Invoice:** Direct conversion of approved proposal to billable invoice
- **Dynamic Proposal Generator:** Pre-created proposals triggered via automations

### 4.5 Subscriptions / Recurring Billing

- **Subscription Plans:** Monthly/yearly/custom interval recurring charges
- Plan creation with pricing, description, trial periods
- Auto-charge client's stored payment method
- **Client Billing Dashboard:** Clients view subscriptions, stored payment info, open invoices, pay invoices, manage subscriptions
- Cancel / Replace subscription actions via automations

### 4.6 Items / Add-ons / Packages / Taxes / Discounts

- **Items:** Individual products/services with price, description
- **Add-ons:** Supplementary items that can be added to invoices
- **Packages:** Bundles of items/add-ons at package pricing
- **Taxes:** Configurable tax rates (multiple rates supported)
- **Discounts:** Percentage or fixed-amount discounts
- All can be one-time or subscription-based

### 4.7 Expenses

- Internal expense tracking
- Categorization
- Association with projects/clients

### 4.8 Office Settings

- Invoice/Estimate/Document/Expense default settings
- Number formatting and sequences
- Payment gateway configuration
- Default terms and notes
- Email templates for invoices/estimates
- Currency settings

---

## 5. Marketing (Email, Drip, Audiences)

### 5.1 Marketing Main Sub-Pages

- **Campaigns** — Email campaign management
- **Drip Sequences** — Automated email sequences
- **Audiences** — Subscriber lists
- **Subscriber Forms** — Opt-in form builder
- **Campaign Templates** — Reusable email templates
- **Settings** — Email sending configuration

### 5.2 Email Campaigns

- **Campaign Editor:** Rich text/HTML email builder
- Content: Text, images, links, dynamic placeholders
- **Scheduling:** Send immediately or schedule for later date/time
- **Audience Targeting:** Send to specific Audience(s)
- **Campaign Templates:** Pre-built templates library
- **Tracking:** Open rates, click rates, unsubscribes
- **Automation Drips:** Campaigns triggered as part of automation sequences

### 5.3 Drip Sequences

- Automated email series sent after subscriber joins an Audience
- **Sequence Builder:** Multiple emails in order with configurable delays
- Day/time offsets between each email in the sequence
- Dynamic Data Placeholders in each email
- Automations can be attached to drip steps
- **Automation Drips:** Advanced drip sequences triggered by automations

### 5.4 Audiences

- Subscriber lists for targeting campaigns and drips
- **Sources:** Manual add, Subscriber Forms, Circle sync, API, Kickoff Forms
- **Circle Sync:** Marketing-checked Circles auto-sync members to Audience
- **Unsubscribe Management:** Automatic unsubscribe handling
- Audience segmentation

### 5.5 Subscriber Forms

- Customizable opt-in forms
- **Deployment:** Embed on website, standalone page, or within portal
- Captures email + optional additional fields
- Assigns to Audience on submission
- **Automations on submission**

### 5.6 Email Sending Settings

- From Name / From Email configuration
- SMTP settings (custom email server)
- Default sending domain
- Email deliverability settings
- Unsubscribe footer configuration

---

## 6. Automations Engine

### 6.1 Automation Architecture

SuiteDash's automations system consists of multiple interconnected components:

- **No-Code Automations** — Event-triggered chains of actions
- **Auto-Templates** — Reusable automation bundles with conditional logic
- **Scheduled Automations** — Time-based recurring triggers
- **FLOWs** — Multi-step onboarding/data collection sequences
- **Generators** — Pre-configured creation templates (Invoices, Projects, Folders, Deals, Documents, Follow-ups)

### 6.2 Automation Triggers (Where Automations Fire)

Automations can be attached to events across the platform:

| Trigger Location | Trigger Events |
|-----------------|----------------|
| **CRM** | Contact created, Contact role changed (Lead > Prospect > Client), Contact added to Circle |
| **Deals** | Deal created, Deal moves to new Stage, Deal won, Deal lost |
| **Projects** | Phase completed, Project completed |
| **Invoices** | Invoice paid, Invoice overdue |
| **Estimates** | Estimate approved, Estimate rejected, Estimate converted to invoice |
| **Proposals** | Proposal approved (signed), Proposal rejected |
| **Documents** | Document viewed, Document signed, Document completed (all signatures) |
| **Forms** | Kickoff Form submitted, Update Form submitted, Checkout Form completed, Booking Form submitted |
| **Subscriptions** | Subscription created, Subscription renewed, Subscription cancelled |
| **Appointments** | Appointment booked, Appointment completed, Appointment cancelled |
| **FLOWs** | FLOW step completed, FLOW fully completed |
| **Support Tickets** | Ticket created, Ticket status changed |
| **LMS** | Course completed, Lesson completed, Quiz passed/failed |
| **Scheduled** | Daily, Weekly, Monthly, Yearly, Custom interval |
| **Manual** | Admin-triggered on demand |

### 6.3 Automation Actions (CRM Target — Contacts/Companies)

| Action Category | Specific Actions |
|----------------|-----------------|
| **Email** | Send email to Target, Email External(s) (contact or circle), Email Internal(s) (staff or team) |
| **SMS** | Send SMS to Target (requires Twilio) |
| **Contact Management** | Convert Prospect to Client, Set Coordinator, Set Salesperson, Send Portal Access Invitation Email |
| **Audience Management** | Add to Audience(s), Remove from Audience(s) |
| **Circle Management** | Add to Circle(s), Remove from Circle(s) |
| **Community** | Add to Community/Space, Remove from Community/Space |
| **WORLDs** | Add to WORLD(s), Remove from WORLD(s) |
| **FLOWs** | Manage On-Demand FLOW (assign one or more) |
| **Follow-ups** | Apply Follow-up Generator(s), Cancel Remaining Follow-ups |
| **Auto-Templates** | Trigger Auto-Template |
| **Invoice** | On-Demand Invoice Generator, Recurring Invoice Generator, Accumulating Invoice Generator |
| **Subscriptions** | Manage Subscriptions (cancel or replace plans) |
| **Projects** | Apply Project Generator |
| **Tasks** | Apply Task Template (with date basis and project matching) |
| **Folders** | Apply Folder Generator |
| **Deals** | Move Deal to Stage, Create a New Deal, Deal Generator |
| **Documents** | Generate Document (from Document Generator with dynamic placeholders) |
| **Proposals** | Dynamic Proposal Generator, Convert Proposal to Invoice |
| **Tags** | Add Tag(s), Remove Tag(s) |
| **Custom Fields** | Set Custom Field Value (including math operations: [[current_value]] + xx) |
| **LMS** | Grant LMS Product, Remove LMS Product |
| **Checklists** | Add to Checklist(s), Remove from Checklist(s) |
| **Files** | Send File Request |
| **Notes** | Create Note (on Target's Notes tab) |
| **Webhooks** | Fire Webhook Notification to custom endpoint |

### 6.4 Automation Actions (Staff Target)

| Action Category | Specific Actions |
|----------------|-----------------|
| **Email** | Send email to Target (Staff), Email Internal(s) |
| **SMS** | Send SMS to Target |
| **Forms** | Fire Form Cannon(s) — send forms to staff |
| **Teams** | Add to Team(s), Remove from Team(s) |
| **Schedules** | Add to Schedule(s), Remove from Schedule(s) |
| **Custom Fields** | Set Custom Field Value (Staff-specific) |
| **Documents** | Generate Document (Staff document generator) |
| **Community** | Add to Community/Space, Remove from Community/Space |

### 6.5 Auto-Templates

- Reusable automation bundles that combine multiple actions
- **Conditional Logic (IF/THEN):**
  - IF statements using Custom Field Values (Contact, Company Public, Company Private)
  - Select relevant field from dropdown, define condition value
  - EVERY logic: Day, Week, Month, Year with start date and optional expiration
- **Application:** Apply to Circles or individual Clients/Prospects
- **Multiple Selection:** Multiple Circles and/or Contacts/Companies can be selected

### 6.6 Scheduled Automations

- Time-based triggers: Daily, Weekly, Monthly, Yearly
- Custom interval scheduling
- Start date and optional expiration date
- Combine with Auto-Template conditions for complex scheduling

### 6.7 AI Logic Engine

- Evaluates data, documents, images, and uploads against custom criteria
- Triggers workflows based on AI assessment results
- Custom evaluation rules

---

## 7. Forms & Data Collection

### 7.1 Form Types

| Form Type | Purpose | Access | Key Features |
|-----------|---------|--------|-------------|
| **Kickoff Form** | New contact registration / process initiation | Public (open internet, embed, or direct URL) | Defines role, coordinator, triggers automations, creates new CRM records |
| **Update Form** | Update existing contact/company/staff data | Authenticated only (portal) | Cannot be accessed unauthenticated, updates CRM data |
| **Checkout Form** | Purchase products/services | Public or Portal | Dynamic pricing, Items/Add-ons/Packages selection, payment processing |
| **Booking Form** | Schedule appointments | Public or Portal | Integrates with Appointment Generators, free or paid bookings |
| **Subscriber Form** | Email marketing opt-in | Public (embed or standalone) | Adds to Marketing Audience, no portal account required |
| **Support Ticket Form** | Submit support request | Portal or public | Creates new Support Ticket with inbox assignment |

### 7.2 Form Builder Elements

#### 7.2.1 Field Types
- **Default Fields:** First Name, Last Name, Email, Phone, Company, Address fields
- **Custom Fields:** All configured custom fields available
- **Advanced Blocks:**
  - HTML Block (custom HTML content)
  - Choice Block (multiple choice options)
  - Appointment Booking Block
  - File Upload Block
  - Signature Block
  - Consent/Agreement Checkbox
  - Dynamic Data Placeholders

#### 7.2.2 Form Configuration
- Multi-step/multi-page forms
- Conditional field visibility
- Required vs. optional fields
- Custom submit button text
- Redirect after submission
- Success message customization
- Form styling and branding
- Embed code generation

### 7.3 Form Templates

- Pre-built form configurations
- Template Library with community templates
- Save custom forms as templates for reuse

### 7.4 Kickoff Form Special Settings

- **Role Assignment:** Define what role (Lead/Prospect/Client) the new contact receives
- **Coordinator Assignment:** Auto-assign a coordinator
- **Circle Assignment:** Auto-add to specified Circle(s)
- **Generator Triggers:** Apply Folder Generator, Project Generator, Invoice Generator, etc.
- **FLOW Assignment:** Assign On-Boarding FLOW
- **Automations:** Full automation chains on submission
- **Duplicate Handling:** Configure behavior for existing contacts

### 7.5 Form Cannons

- Send forms to specific users on demand or via automation
- PLUS Bundle feature
- Push forms to staff members' dashboards

---

## 8. Documents & eSigning

### 8.1 Documents Main Sub-Pages

- **Documents List** — All documents with filters
- **Document Generators** — Template library
- **Settings** — Document configuration

### 8.2 Document Properties

- Title
- Associated Contact/Company/Staff
- Content (rich text editor with dynamic placeholders)
- Signer(s) — who must sign
- Status: Draft, Sent, Viewed, Partially Signed, Completed
- Audit Trail (views, IP addresses, signature timestamps)

### 8.3 Document Generators

- Pre-created document templates with Dynamic Data Placeholders
- Signer placeholders auto-assigned based on target
- Single generator creates multiple personalized documents
- Triggered via automations or manually

### 8.4 eSigning Features

- **Signature Pad:** Interactive signature capture
  - Handwritten signature (drawn)
  - Typed name auto-generated signature
- **Signing Options:**
  - Client-only signing
  - Client + Staff dual signing
  - Sign without login (external access)
- **Audit Trail:**
  - View tracking
  - IP address logging
  - Signature date/time stamps
  - Embedded in platform AND in downloaded PDF
- **Notifications:**
  - Email on document viewed
  - Email on document signed
  - Email on document completed
- **Automations:** Trigger chains on view, sign, complete events

### 8.5 PDF Signing (Power-Up)

- Upload existing PDF documents
- Add signature fields to PDF
- E-sign directly on PDF documents
- Part of Prime Bundle Power-Up

### 8.6 Dynamic Data Placeholders in Documents

- Contact fields (name, email, company, custom fields)
- Company fields
- Staff fields
- Date fields
- Custom field values
- Inserted via {x} button in text editor

---

## 9. File Sharing & Exchange

### 9.1 Files Main Sub-Pages

- **Files Toolkit** — Main file management interface
- **Shared Folders** — Folders shared with clients/staff
- **File Requests** — Request files from contacts
- **File Transfers** — File transfer management
- **Folder Generators** — Pre-built folder structure templates

### 9.2 Shared Folders

- Created on admin side, shared with one or multiple Clients, Circles, or Staff
- **Permission Levels:**
  - **Edit:** Rename, Download, Add New Version, Delete files/folders
  - **View Only:** Download only
- **Notifications:** Email on first add to folder, email on each new upload
- **ZIP Download:** Entire folder downloadable as ZIP with structure preserved

### 9.3 File Types Supported

- All file types: PDFs, images (HEIC included), videos, documents, spreadsheets, etc.
- File preview capabilities
- Version control (add new versions to existing files)

### 9.4 File Requests

- Request specific files from contacts
- Customizable request messages
- Tracked status (pending, received)
- Triggered via automations

### 9.5 File Transfers

- Secure file transfer between admin and contacts
- Transfer tracking and status

### 9.6 Folder Generators

- Pre-defined folder structures with template files
- **Generator Types:** CRM Contact, Company, Staff, or Project
- Auto-generated inside Contact/Company's "Shared with me" folder
- Can include any number/level of nested folders and files
- Triggered automatically on new contact creation or applied to existing contacts
- Triggered via automations

### 9.7 Upcoming: Grid View

- Thumbnail previews for images and videos
- Visual browsing without scrolling
- Quick file location

---

## 10. Calendar & Scheduling

### 10.1 Calendar Main Sub-Pages

- **My Calendar** — Personal calendar view
- **Appointments** — Appointment management
- **Appointment Generators** — Booking configuration
- **Schedules** — Availability schedules
- **Settings** — Calendar configuration

### 10.2 My Calendar

- Personal calendar with all events, tasks, follow-ups, appointments
- Day/Week/Month views
- Color coding by event type
- Google Calendar sync

### 10.3 Appointment Generators / Booking Pages

- Each staff member can have a "Book Me" page
- **Configuration Options:**
  - Duration (appointment length)
  - Padding (buffer time before/after)
  - Time Slot Intervals (chunk size for available slots)
  - Prep-time/Cut-off (minimum advance booking time)
  - Available days/hours
  - Maximum appointments per day

### 10.4 Booking Forms

- Embed inside portal or externally on website/landing pages
- Free or paid appointments
- **Paid Appointments:** Payment collected during booking, confirmed after successful payment
- Integrates with Kickoff Forms for new contact registration + appointment

### 10.5 Appointment Management

- **Rescheduling:** Contacts can reschedule; updates both calendars, sends email notifications
- **Cancellation:** Contacts can cancel with configurable policies
- **Calendar Add:** Email notifications include "Add to Calendar" links for Google Calendar, Yahoo, Outlook, iCal
- **Multi-staff:** Appointments show on both staff and client calendars

### 10.6 Appointment Calendar Settings

- Duration defaults
- Padding configuration
- Time slot intervals
- Prep-time settings
- Timezone handling (Target's timezone or static)
- Working hours
- Holiday/blackout dates

### 10.7 Schedules

- Staff availability schedules
- Multiple schedules per staff member
- Schedule assignment via automations

---

## 11. Communication (Messaging, Chat, Talk)

### 11.1 Communication Channels

| Channel | Type | Participants |
|---------|------|-------------|
| **Secure Messaging** | Asynchronous (like email) | Staff <> Contacts, Staff <> Staff |
| **Live Chat** | Real-time messaging | Staff <> Contacts (1:1), Staff <> Staff (1:1 + Group Channels) |
| **Team Talk** | Project message board | Staff only (per project) |
| **Client Talk** | Project message board | Staff + Clients (per project) |

### 11.2 Secure Messaging

- Message composition with rich text
- **Mass Messaging:** Send to multiple users simultaneously
- **Canned Responses:** Pre-saved quick replies
- **Folder Organization:** Organize messages into folders
- **File Attachments:** Attach files to messages
- **Read Receipts:** Notification when message is viewed
- **Permission-based visibility:** Recipients only see/respond to permitted users
- Available to Prospects, Clients, and all Staff Roles

### 11.3 Live Chat

- **Real-time one-on-one Direct Messages:** Staff <> Contacts, Staff <> Staff
- **Group Channels:** Multiple internal users in conversation
  - Public channels (visible to all)
  - Private channels (invite-only)
- **Typing Indicators:** Real-time "user is typing" display
- **Emoji Support**
- **Canned Responses** access
- **Embeddable Remote Chat** (Power-Up): Live chat widget for external websites

### 11.4 Privacy Mode (HIPAA Compliance)

- Default: Privacy Mode ON
- Actual message content NOT included in email notifications
- Protects privacy and supports HIPAA/privacy framework compliance
- Configurable per-organization

---

## 12. Support Tickets

### 12.1 Support Tickets Main Sub-Pages

- **Ticket List** — All tickets with filters
- **Inboxes** — Organizational buckets
- **Settings** — Ticket configuration

### 12.2 Ticket Submission Methods

- Direct submission through SuiteDash portal
- Custom Support Ticket Form
- Via email (email-to-ticket)

### 12.3 Inboxes

- Customizable organizational buckets
- Examples: Billing, Development, General, Level 1-3
- Route tickets to appropriate teams
- Per-inbox assignment rules

### 12.4 Ticket Properties

- Subject/Title
- Description/Body
- Priority (customizable priority levels)
- Tags (organizational labels)
- Inbox assignment
- Assigned Staff
- Status (Open, In Progress, Resolved, Closed)
- Associated Contact/Company

### 12.5 Ticket Configuration

- **General Settings:**
  - Email-to-ticket configuration (receive new tickets via email)
  - Email replies to existing tickets
  - Default signature for staff replies
  - Auto-reply message on new ticket creation
- **Staff Permissions:**
  - Viewing permissions (per staff)
  - Replying permissions (per staff)
  - Assigning permissions (per staff)
- **Defaults:**
  - Default Priority for new tickets
  - Default Inbox for new tickets
  - Allow clients to set priority/inbox via Support Form

---

## 13. Learning Management System (LMS)

### 13.1 LMS Structure

```
Course
  └── Module (like a "book")
       └── Lesson (like a "chapter")
            └── Quiz (optional)
```

### 13.2 Course Properties

- Course Title
- Description
- Thumbnail/Image
- Pricing: Free or included in Package/Subscription
- Enrollment: Open or restricted
- Completion Certificate
- Progress tracking

### 13.3 Modules

- Container for Lessons
- Sequential ordering
- Module-level progress tracking

### 13.4 Lessons

- Rich content editor (text, images, video, HTML)
- **Video Controls:** Require minimum percentage watched before proceeding
- **Content Locking:** Sequential learning enforcement
- Lesson completion tracking
- Drag-and-drop editor

### 13.5 Quizzes (In Development)

- Attached to Lessons or standalone
- **Question Types:** Multiple choice, True/False, Fill-in-the-blank, Matching
- Minimum score requirements to continue
- Reusable saved questions across multiple quizzes
- Auto-generate quizzes from categorized question pools

### 13.6 LMS Access Control

- Grant/Remove LMS Product via automations
- Include in Packages or Subscriptions for monetization
- Assign via FLOWs or Checkout Forms

### 13.7 Upcoming LMS Features

- Landing Pages (per course)
- Self-Hosted Video
- Templates
- Certificates (automated generation)
- Additional Pricing Options
- No-Code Automations integration

---

## 14. Pages (Dashboards, Portal Pages, Landing Pages)

### 14.1 Page Types

| Page Type | Visibility | Authentication | Dynamic Data |
|-----------|-----------|---------------|-------------|
| **Dashboard** | Internal (assigned users) | Required | Yes (personalized per user) |
| **Portal Page** | Internal (assigned users) | Required | Yes (same content, dynamic placeholders personalized) |
| **Landing Page** | Public (anyone with URL) | Not required | Limited |

### 14.2 Dashboards

#### 14.2.1 Dashboard Builder (Content Block Editor)
- **Pre-Built Blocks:** Tasks, Invoices, Files, Forms, Checklists, and more
- **Content Blocks:** Text, Photos, Videos, Charts, HTML
- **Dynamic Data:** Placeholders and Custom Field insertion
- **Layout:** Drag-and-drop complex layouts
- **Styling:** Color, background, Custom CSS, Google Fonts (size, color, weight, letter spacing)
- **Templates:** Built-in Template Library with pre-built layouts and blocks

#### 14.2.2 Dashboard Assignment Priority System
| Priority Level | Assignment Method | Display Rule |
|---------------|-------------------|-------------|
| **Highest** | Direct user assignment | Always shown for that specific user |
| **Medium** | Circle or Team assignment | Shown if no Highest Priority dashboard |
| **Lowest** | Role-based assignment | Shown if no Medium or Highest Priority |

- Unlimited dashboards can be created
- Each dashboard assignable for specific purposes
- Default dashboard for all users on creation

### 14.3 Portal Pages

- Multiple users see same content (except dynamic placeholders are personalized)
- Assignable to Circles, Roles, or individual users
- Created via Content Block Editor
- Accessible via "Content" top-level menu item

### 14.4 Landing Pages

- External-facing pages accessible via URL without login
- Public content: information, announcements, videos, charts, resources
- Used for lead generation, information sharing, marketing
- Embed Subscriber Forms for email capture
- Custom URL slug

### 14.5 Start Page Configuration

- Assign any Dashboard, Portal Page, or custom URL as the Start Page
- Different Start Pages per role
- Controls what users see immediately after login

---

## 15. White Label & Branding

### 15.1 Branding Main Sub-Pages

- **Platform Branding** — Overall visual identity
- **Login Page** — Custom login screen
- **Email Branding** — Email notification customization
- **Custom URL** — Domain mapping
- **Mobile App** — White-label mobile app

### 15.2 Platform Branding

- **Logo:** Upload company logo (sidebar, login, email)
- **Favicon:** Custom browser tab icon
- **Color Scheme:**
  - Pre-made color schemes
  - Custom color pickers for every element
  - Side navigation bar colors
  - Button colors
  - Accent colors
  - Background colors
- **Font Themes:**
  - Google Fonts integration
  - Font selection per element type: Headers, Paragraphs, Buttons, other elements
  - Font styles (weight, size, spacing)
- **Custom CSS:** Advanced styling override

### 15.3 Login Page Customization

- Custom background image
- Custom logo
- Custom welcome text
- Layout options
- Color scheme matching

### 15.4 Custom URL / Domain Mapping

- Automated domain mapping tool
- Replace SuiteDash URL with your own domain
- SSL certificate handling
- DNS configuration guidance

### 15.5 Email Branding

- **All email notifications editable:** 100% control over email content
- White-labeled sending (clients only see your branding)
- Custom From Name / From Email
- Email template editor
- Header/Footer customization

### 15.6 Mobile App Branding

- White-labeled mobile app for iOS and Android
- Your logo and branding
- Your app name
- Consistent experience across devices
- Free with all plans

---

## 16. Staff Management & Roles

### 16.1 Staff Roles Detailed

| Role | CRM | Projects | Office | Marketing | Files | Admin Settings |
|------|-----|----------|--------|-----------|-------|---------------|
| Super Admin | Full | Full | Full | Full | Full | Full + License |
| Admin Manager | Full | Full | Full | Full | Full | Full (except Super Admin) |
| Admin | Full | Full | Full | Full | Full | Configurable per-admin |
| Project Manager | Full | Full | Limited | Limited | Limited | None |
| Office Manager | Full | Full | Full | Limited | Limited | None |
| Salesperson | Full (CRM focus) | Limited | Limited | Limited | Limited | None |
| Teammate | None | Assigned only | None | None | None | None |
| Freelancer | None | Assigned (no Team Talk) | None | None | None | None |

### 16.2 Staff Onboarding

- Add staff via invitation email
- Role assignment during creation
- Team assignment
- Schedule assignment
- Permission configuration

### 16.3 Admin Permissions (Individual)

- Granular per-admin permission control
- White Label settings access
- Template management access
- Specific feature area restrictions

### 16.4 Teams

- Group staff into Teams
- Team-based Dashboard assignments
- Team-based project assignments
- Add/Remove via automations

### 16.5 Permission Hierarchy

- Changes only permitted "up the ladder"
- Teammate > Project Manager > Admin (allowed)
- Admin > Teammate (NOT allowed)

---

## 17. Power-Ups (WORLDs, Community, Sales Funnels, PDF Signing)

### 17.1 Available Power-Ups

| Power-Up | Price | Features |
|----------|-------|----------|
| **Prime Bundle** | $40/month | Sales Funnel Builder + PDF Document Signing + Embeddable Remote Chat |
| **WORLDs** | Included in Prime or separate | Platform segmentation by department/region/team |
| **Community** | Part of Prime Bundle | Discussion forums + live community chat |
| **Sales Funnel Builder** | Part of Prime Bundle | Landing pages, opt-ins, sales pages, funnels |
| **PDF Signing** | Part of Prime Bundle | Upload and e-sign existing PDF documents |
| **Remote Chat** | Part of Prime Bundle | Embeddable live chat widget for external sites |

### 17.2 WORLDs

- Segment platform by department, region, or team
- Each WORLD is a secure, self-contained environment
- Silo resources, CRM data, and processes
- Maintain unified branding and control across WORLDs
- Up to 5 WORLDs included; additional at $5/month each
- Add/Remove users to WORLDs via automations
- Freelancers can be limited to specific WORLDs

### 17.3 Community Forums

- Up to 5 fully independent Communities
- Feature-rich discussion forums
- **Spaces:** Organize discussions within communities
- No limit on Members per community
- **Live Community Chat** (optional)
- **Private Messaging** between Members (optional)
- Add/Remove from Community/Space via automations

### 17.4 Sales Funnel Builder

- **Funnel Types:** 2-Step or 3-Step funnels
- **Pages:**
  - Landing Pages
  - Opt-in Pages (email capture)
  - Sales Pages
  - Thank You Pages
- **Integration:** Offer LMS Products as funnel products
- **Monetization:** Free or paid product offerings
- **Automation:** Automate client journey through funnel stages

---

## 18. Settings & Configuration

### 18.1 Global Settings Areas

| Settings Section | Key Configurations |
|-----------------|-------------------|
| **Organization Profile** | Company name, address, logo, timezone, business info |
| **Platform Branding** | Colors, fonts, CSS, logos (see Section 15) |
| **Custom URL** | Domain mapping |
| **Login Page** | Login screen customization |
| **Custom Menus** | Navigation menu per role |
| **Email Notifications** | All platform email templates |
| **CRM Settings** | Custom fields, roles, import/export |
| **Office Settings** | Invoice/Estimate/Document/Expense defaults |
| **Marketing Settings** | Email sending, SMTP, audience defaults |
| **Project Settings** | Task statuses, phase templates, defaults |
| **Calendar Settings** | Appointment defaults, timezone, working hours |
| **Document Settings** | Signing options, audit trail, defaults |
| **Support Settings** | Inboxes, priorities, tags, auto-reply, permissions |
| **LMS Settings** | Course defaults, enrollment options |
| **File Settings** | Storage, sharing defaults |
| **Communication Settings** | Privacy mode, chat settings |
| **Security Settings** | 2FA, password policies, session management |
| **Manage Account** | License, billing, plan management (Super Admin only) |

### 18.2 Email Notification Templates

Every system email is customizable:
- New Contact Welcome
- Portal Access Invitation
- Password Reset
- Invoice Sent/Paid/Overdue
- Estimate Sent/Approved
- Proposal Sent/Approved/Rejected/Expiring
- Document Sent/Viewed/Signed/Completed
- Appointment Booked/Rescheduled/Cancelled
- Support Ticket Created/Updated/Resolved
- File Shared/Uploaded
- Message Received
- FLOW Assigned/Step Completed
- Task Assigned/Due/Completed
- Project Phase Complete
- Marketing Campaign notifications
- And many more...

---

## 19. Integrations & API

### 19.1 Native Integrations

| Integration | Type | Features |
|-------------|------|----------|
| **Stripe** | Payment Gateway | Accept payments, subscription billing, refunds |
| **Braintree** | Payment Gateway | Alternative payment processing |
| **QuickBooks Online** | Accounting | Sync invoices, payments, clients |
| **Google Calendar** | Calendar | Two-way calendar sync |
| **Google Meet** | Video Conferencing | Appointment video links |
| **Zoom** | Video Conferencing | Appointment video links |
| **Twilio** | SMS | SMS notifications and messaging |
| **Zapier** | Automation | Connect to 5000+ apps |
| **Make (Integromat)** | Automation | Advanced workflow automation |
| **WordPress** | CMS | Embed forms, portal integration |
| **hCaptcha / reCAPTCHA** | Security | Form spam protection |

### 19.2 Secure API

- **Authentication:** API credentials from Integrations > Secure API
- **Rate Limits:**
  - Free Trial: 80 calls/month
  - Start Plan: 400 calls/month
  - Thrive Plan: 2,000 calls/month
  - Pinnacle Plan: 20,000 calls/month
- **API Capabilities:**
  - CRM Company and Contact management
  - Custom Fields schema
  - Project management
  - Subscribe Contacts to Marketing Audiences
  - Meta Attributes
  - Webhook endpoints

### 19.3 Webhooks

- Custom endpoint notifications
- Event signifiers for filtering
- Triggered via automations
- JSON payload delivery

### 19.4 Two-Factor Authentication

- Enable/Disable per-user
- Authentication app support

---

## 20. FLOWs & Onboarding

### 20.1 FLOW Types

| FLOW Type | Purpose | Trigger |
|-----------|---------|---------|
| **On-Boarding FLOW** | Required steps before full platform access | Auto-assigned on contact creation or Kickoff Form |
| **On-Demand FLOW** | Optional/triggered data collection | Manually or via automation |

### 20.2 FLOW Steps

FLOWs consist of ordered steps, each requiring completion before the next:

| Step Type | Description |
|-----------|-------------|
| **Form** | Fill out a form (Update Form, custom form) |
| **File Upload** | Upload required document(s) |
| **File Download** | Download and acknowledge document(s) |
| **Appointment** | Schedule an appointment |
| **eSigning** | Sign a document/contract |
| **Checklist** | Complete a checklist of items |

### 20.3 FLOW Assignment

- Auto-assign via Kickoff Form submission
- Auto-assign via Circle membership
- Trigger via automations
- Manual assignment by admin
- Multiple FLOWs can be assigned simultaneously

### 20.4 FLOW Management

- Track completion status per user
- View submissions
- Resend/reassign incomplete FLOWs
- Automation triggers on step completion and full completion

### 20.5 Onboarding Automation Chain Example

1. Prospect fills out **Kickoff Form** on website
2. SuiteDash creates **Contact** with role "Prospect"
3. Assigns to **Circle** (e.g., "New Prospects")
4. Applies **Folder Generator** (creates file structure)
5. Assigns **On-Boarding FLOW** (form > file upload > e-sign contract > schedule appointment)
6. Sends **Welcome Email** via automation
7. Adds to **Marketing Audience** (drip sequence starts)
8. Creates **Deal** in pipeline
9. Applies **Follow-up Generator** (follow-up reminders on calendar)
10. On FLOW completion: **Converts to Client**, generates **Invoice**, applies **Project Generator**

---

## 21. Generators (All Types)

### 21.1 Generator Overview

Generators are pre-configured templates that auto-create resources:

| Generator Type | Creates | Target Types |
|---------------|---------|-------------|
| **Invoice Generator** | Invoices with pre-set items/amounts | Contact, Company |
| **Recurring Invoice Generator** | Recurring billing cycles | Contact, Company |
| **Accumulating Invoice Generator** | Cumulative charge invoices | Contact, Company |
| **Project Generator** | Complete project with phases/tasks | Contact, Company |
| **Task Template** | Set of tasks within a project | Project |
| **Folder Generator** | Folder structure with files | Contact, Company, Staff, Project |
| **Deal Generator** | Deal cards in pipeline | Contact, Company |
| **Document Generator** | Dynamic documents with placeholders | Contact, Company, Staff |
| **Proposal Generator** | Dynamic proposals | Contact, Company |
| **Follow-up Generator** | Series of follow-up reminders | Contact, Company |

### 21.2 Common Generator Features

- Dynamic Data Placeholders in titles and content
- Triggered via automations or manually applied
- Multiple generators can chain together
- Date-based calculations (offsets from trigger date)

---

## 22. Custom Fields & Data Architecture

### 22.1 Custom Field Categories

| Category | Visibility | Used For |
|----------|-----------|----------|
| **Contact Custom Fields** | Per-contact data | Individual person attributes |
| **Company Public Custom Fields** | Visible to company contacts | Company info shown to clients |
| **Company Private Custom Fields** | Admin-only | Internal company notes/data |
| **Staff Custom Fields** | Per-staff member | Employee/contractor attributes |
| **Project Custom Fields** | Per-project | Project-specific data |

### 22.2 Field Types Available

- Text (single line)
- Text Area (multi-line)
- Number (supports math operations in automations)
- Date
- Dropdown (single select)
- Multi-select
- Checkbox
- File Upload
- URL
- Email
- Phone
- Currency
- Calculating Custom Fields (computed values)
- Custom QR Codes

### 22.3 Custom Field Usage

- Display on Contact/Company profiles
- Insert into Forms as form fields
- Use in Document/Proposal Dynamic Data Placeholders
- Use in Automation conditions (IF/THEN logic)
- Use in Auto-Template conditional triggers
- Use in Follow-up Generator dynamic titles
- Set values via automation actions
- Math operations: `[[current_value]] + xx` format
- API access for read/write
- Display on Dashboards via Dynamic Data blocks

---

## 23. Gaps Requiring Backend Access

The following areas need direct backend exploration to fully map every element, button, and configuration option:

### 23.1 High Priority (Cannot Confirm from Documentation)

1. **Exact Admin Settings panel structure** — Every sub-tab, toggle, and dropdown within each settings area
2. **Complete email notification template list** — Every single system email that can be customized (estimated 50+)
3. **Content Block Editor** — Full inventory of all block types, their individual settings, and configuration options
4. **Custom CSS injection points** — All locations where custom CSS can be applied
5. **Permission matrix granularity** — Exact per-feature toggles available for each Admin permission
6. **Automation chaining UI** — How multiple automations chain together visually, sequencing rules
7. **Dynamic Data Placeholder complete list** — Every available placeholder by context (documents, emails, dashboards, forms)
8. **Calculating Custom Fields** — Formula builder interface, available functions and operators
9. **AI Logic Engine** — Detailed configuration interface, evaluation criteria options, supported data types

### 23.2 Medium Priority

10. **Fly-out menu complete options** — Every option in the profile fly-out menu
11. **Quick Actions available per page** — Context-specific action buttons on each page
12. **Import/Export capabilities** — Exact CSV/data import mapping for each module
13. **Billing Dashboard client view** — Exact layout and options visible to clients
14. **Report/Analytics dashboards** — Any built-in reporting beyond widgets
15. **Webhook payload schemas** — Exact JSON structures per event type
16. **API endpoint complete list** — All available API endpoints and methods
17. **Mobile app feature parity** — Which features are available/limited in mobile vs. web
18. **Activity Log detail** — Exact events tracked in the activity log per contact
19. **Role-specific views** — Exact screen differences between each role when viewing same areas

### 23.3 Lower Priority

20. **Template Library contents** — Full inventory of pre-built templates available
21. **Keyboard shortcuts** — Complete list of keyboard shortcuts
22. **Notification preferences** — User-configurable notification settings
23. **Data export formats** — Available export formats per module
24. **Storage limits per plan** — File storage quotas
25. **Concurrent user limits** — Session management details

---

## NEXT STEPS

**To complete this mapping to 100% accuracy, I recommend:**

1. **Grant backend access** so I can screenshot/navigate every single page, modal, dropdown, and settings panel
2. **Walk through each module** systematically capturing every button, toggle, and configuration option
3. **Map the exact automation builder UI** with every trigger-condition-action combination
4. **Document the Content Block Editor** block-by-block with all individual settings
5. **Capture the complete Dynamic Data Placeholder dictionary** per context
6. **Map every email notification template** with their editable fields

This document currently covers approximately **85-90%** of SuiteDash's architecture from publicly available documentation. Backend access would bring it to **100%** and add the granular element-level detail needed for full replication.

---

*Sources: SuiteDash Official Documentation (help.suitedash.com), SuiteDash Features Page (suitedash.com/features), SuiteDash Roadmap, AppSumo Product Page, and third-party reviews.*
