# SuiteDash 16 Niche Packs — Ready-to-Deploy Systems
## Dynasty Empire — portal.yourdeputy.com

**Date:** March 19, 2026
**Purpose:** 16 complete, ready-to-deploy CRM configurations. Same backbone, swapped copy, form fields, and service logic per niche.

---

# MASTER BACKBONE (Shared Across All 16 Niches)

Every niche pack uses the same infrastructure. Only the labeled components change.

## Shared Infrastructure

| Component | Standard for All |
|-----------|-----------------|
| Roles | Super Admin → Admin → PM → Salesperson → Teammate → Lead → Prospect → Client |
| Isolation | One Circle per tier per niche (e.g., `Plumbing-Free`, `Plumbing-Premium`) |
| Folder Structure | `/[ClientName]/Private/ + /Shared/ + /Deliverables/` via Folder Generator |
| Onboarding FLOW | Form → File Upload → File Download → eSigning → Appointment → Checklist |
| Engagement Scoring | (Logins×2) + (Profile Updates×3) + (Features×1) + (Community Posts×2) + (Tickets×5) - (Days Since Login×1) |
| Automation Layer | n8n Packs 1-6 (Onboarding, Engagement, Renewal, Win-back, DLQ, Data Sync) |
| Source of Truth | SuiteDash=identity, Stripe=money, AiTable=analytics, n8n=logic |

## What Changes Per Niche

| Component | What Changes |
|-----------|-------------|
| Custom Fields | Industry-specific fields (3-6 per niche) |
| Pipeline Stages | Labels and progression logic |
| Kickoff Form Fields | Industry-specific intake questions |
| Project Template Tasks | Service workflow steps |
| Circle Names | Niche prefix (e.g., `HVAC-Free`, `Legal-Premium`) |
| Email Copy | Industry-specific messaging angles |
| Offer Structure | Pricing and upsell packages |

---

# NICHE PACK TEMPLATE STRUCTURE

Each of the 16 packs below follows this exact format:

```
NICHE PACK =
  Offer Structure (pricing + upsells)
  + Custom Fields (3-6 niche-specific, added to CRM Target tab)
  + Sales Pipeline (5-7 stages)
  + Service Pipeline (5-6 stages)
  + Kickoff Form (Lead Capture — 5-8 fields)
  + Project Template (Service Delivery — 4-6 tasks)
  + Circles (Free / Basic / Premium / Churned / VIP)
  + Email Sequence Angles (onboarding copy hooks)
  + Automation Triggers (niche-specific events)
```

---

# PACK 1: PLUMBING SERVICES

## Offer Structure
| Package | Price | Includes |
|---------|-------|----------|
| Setup | $297 one-time | CRM config, portal setup, branding |
| Basic | $97/month | Directory listing, basic lead routing |
| Premium | $297/month | Featured listing, priority leads, analytics dashboard |
| Upsells | Variable | Lead generation ($197/mo), Website build ($497 one-time), Automation pack ($197/mo) |

## Custom Fields (CRM Target Tab)
| Field Name | Type | Options/Purpose |
|------------|------|-----------------|
| Service Specialties | Multi-select | Residential, Commercial, Emergency, Drain Cleaning, Water Heater, Repiping, Gas Lines |
| License Number | Text | State plumbing license verification |
| Service Radius | Dropdown | 10mi / 25mi / 50mi / Statewide |
| Emergency Available | Checkbox | 24/7 availability flag |
| Insurance Verified | Checkbox | Liability insurance confirmed |
| Average Job Size | Dropdown | Under $500 / $500-$2K / $2K-$10K / $10K+ |

## Sales Pipeline: "Plumbing Lead Acquisition"
| Stage | Probability | Auto-Action |
|-------|-------------|-------------|
| Lead Captured | 10% | Auto-assign coordinator |
| Contacted | 25% | Send service overview email |
| Demo Booked | 50% | Schedule portal walkthrough |
| Proposal Sent | 65% | Start follow-up sequence |
| Won | 100% | Trigger onboarding FLOW |
| Lost | 0% | Trigger win-back at Day 7 |

## Service Pipeline: "Plumbing Service Delivery"
| Stage | Action |
|-------|--------|
| Onboarding | Profile setup + license verification |
| Portal Setup | Listing configuration + photo upload |
| Active | Receiving leads, listed in directory |
| Review | Quarterly performance review |
| Retainer | Annual contract, premium support |

## Kickoff Form: "Plumbing Business Registration"
```json
{
  "type": "kickoff",
  "role_assignment": "Lead",
  "fields": [
    {"name": "Business Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Service Specialties", "type": "multi_select", "options": ["Residential", "Commercial", "Emergency", "Drain Cleaning", "Water Heater", "Repiping", "Gas Lines"]},
    {"name": "Service Area (ZIP Codes)", "type": "text"},
    {"name": "Years in Business", "type": "number"},
    {"name": "How Did You Find Us", "type": "dropdown", "options": ["Google", "Referral", "Social Media", "Trade Association", "Other"]}
  ],
  "automations": ["Add to Plumbing-Free Circle", "Apply Folder Generator", "Assign Onboarding FLOW", "Fire n8n webhook"]
}
```

## Project Template: "Plumbing Onboarding"
| Task | Assigned To | Duration |
|------|------------|----------|
| License & Insurance Verification | Staff | 2 days |
| Profile & Listing Setup | Client + Staff | 3 days |
| Photo Upload & Optimization | Client | 5 days |
| Portal Training Walkthrough | Staff | 1 day |
| Go-Live & First Lead Test | Staff | 1 day |

## Email Sequence Angles
- Day 0: "Welcome to [Directory] — plumbers in [Area] are getting X leads/month"
- Day 1: "Complete your profile — plumbers with photos get 3x more calls"
- Day 3: "5 ways to rank higher in local plumbing searches"
- Day 7: "How [Plumber Name] closed $12K from directory leads last month"

---

# PACK 2: HVAC SERVICES

## Offer Structure
| Package | Price | Includes |
|---------|-------|----------|
| Setup | $297 | CRM config, portal, branding |
| Basic | $97/month | Directory listing, seasonal lead routing |
| Premium | $297/month | Featured listing, priority leads, review management |
| Upsells | Variable | Lead gen ($197/mo), Emergency dispatch automation ($297/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| HVAC Specialties | Multi-select | Heating, Cooling, Ventilation, Ductwork, Heat Pumps, Geothermal, Commercial HVAC |
| EPA Certification | Dropdown | Type I / Type II / Universal / None |
| Brands Serviced | Multi-select | Carrier, Lennox, Trane, Rheem, Goodman, Other |
| Emergency Service | Checkbox | 24/7 availability |
| Service Radius | Dropdown | 10mi / 25mi / 50mi / Regional |
| Avg Ticket Size | Dropdown | Under $500 / $500-$2K / $2K-$10K / $10K+ |

## Sales Pipeline: "HVAC Lead Acquisition"
| Stage | Probability | Auto-Action |
|-------|-------------|-------------|
| Lead Captured | 10% | Assign coordinator |
| Contacted | 25% | Send seasonal offer overview |
| Demo Booked | 50% | Schedule walkthrough |
| Proposal Sent | 65% | Follow-up sequence |
| Won | 100% | Trigger onboarding |
| Lost | 0% | Win-back sequence |

## Service Pipeline: "HVAC Service Delivery"
| Stage | Action |
|-------|--------|
| Onboarding | Certification verification + profile setup |
| Portal Setup | Listing + seasonal service configuration |
| Active | Listed, receiving leads |
| Seasonal Review | Pre-summer/pre-winter optimization |
| Retainer | Annual partnership |

## Kickoff Form: "HVAC Business Registration"
```json
{
  "fields": [
    {"name": "Business Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "HVAC Specialties", "type": "multi_select", "options": ["Heating", "Cooling", "Ventilation", "Ductwork", "Heat Pumps", "Geothermal", "Commercial"]},
    {"name": "EPA Certification Level", "type": "dropdown", "options": ["Type I", "Type II", "Universal"]},
    {"name": "Service Area", "type": "text"},
    {"name": "Years in Business", "type": "number"}
  ]
}
```

## Project Template: "HVAC Onboarding"
| Task | Duration |
|------|----------|
| EPA Certification Verification | 2 days |
| Profile & Seasonal Service Setup | 3 days |
| Photo/Equipment Gallery Upload | 5 days |
| Portal Training | 1 day |
| Go-Live & Lead Test | 1 day |

---

# PACK 3: PEST CONTROL

## Offer Structure
| Package | Price | Includes |
|---------|-------|----------|
| Setup | $297 | CRM config, portal, branding |
| Basic | $97/month | Directory listing, basic leads |
| Premium | $247/month | Featured listing, emergency leads, review management |
| Upsells | Variable | Lead gen ($197/mo), Seasonal campaign automation ($147/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Pest Types | Multi-select | Termites, Rodents, Insects, Wildlife, Bed Bugs, Mosquitoes, Commercial |
| License Type | Dropdown | Certified Applicator / Registered Technician / QualifiedApplicator |
| Treatment Methods | Multi-select | Chemical, Organic/Green, IPM, Heat Treatment, Fumigation |
| Emergency Service | Checkbox | Same-day availability |
| Service Radius | Dropdown | 10mi / 25mi / 50mi |
| Residential/Commercial | Dropdown | Residential Only / Commercial Only / Both |

## Sales Pipeline: "Pest Control Lead Acquisition"
| Stage | Probability |
|-------|-------------|
| Lead Captured | 10% |
| Contacted | 25% |
| Inspection Scheduled | 50% |
| Proposal Sent | 65% |
| Won | 100% |
| Lost | 0% |

## Service Pipeline
| Stage | Action |
|-------|--------|
| Onboarding | License verification + profile |
| Setup | Listing + treatment method showcase |
| Active | Listed, receiving leads |
| Seasonal Review | Pre-spring/pre-fall optimization |
| Retainer | Annual partnership |

## Kickoff Form
```json
{
  "fields": [
    {"name": "Business Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Pest Types Serviced", "type": "multi_select"},
    {"name": "Treatment Methods", "type": "multi_select"},
    {"name": "License Number", "type": "text"},
    {"name": "Service Area", "type": "text"}
  ]
}
```

## Project Template: "Pest Control Onboarding"
| Task | Duration |
|------|----------|
| License & Insurance Verification | 2 days |
| Profile & Treatment Method Setup | 3 days |
| Before/After Photo Gallery | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 4: ROOFING CONTRACTORS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $397 |
| Basic | $147/month |
| Premium | $347/month |
| Upsells | Storm damage lead routing ($297/mo), Website ($597) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Roofing Types | Multi-select | Asphalt Shingle, Metal, Tile, Flat/Commercial, Slate, Cedar Shake |
| License Number | Text | State contractor license |
| Insurance Coverage | Dropdown | $1M / $2M / $5M+ |
| Storm Damage Certified | Checkbox | Insurance restoration qualified |
| Avg Project Size | Dropdown | Under $5K / $5K-$15K / $15K-$50K / $50K+ |
| Manufacturer Certifications | Multi-select | GAF, Owens Corning, CertainTeed, TAMKO |

## Sales Pipeline: "Roofing Lead Acquisition"
| Stage | Probability |
|-------|-------------|
| Lead Captured | 10% |
| Contacted | 25% |
| Estimate Scheduled | 50% |
| Proposal Sent | 65% |
| Won | 100% |
| Lost | 0% |

## Service Pipeline
| Stage |
|-------|
| Onboarding |
| License Verification |
| Active Listing |
| Storm Season Priority |
| Annual Partner |

## Kickoff Form
```json
{
  "fields": [
    {"name": "Company Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Roofing Types", "type": "multi_select"},
    {"name": "License Number", "type": "text"},
    {"name": "Service Area", "type": "text"},
    {"name": "Storm Damage Certified", "type": "checkbox"}
  ]
}
```

## Project Template: "Roofing Onboarding"
| Task | Duration |
|------|----------|
| License, Bond & Insurance Verification | 3 days |
| Profile & Portfolio Setup | 3 days |
| Project Photo Gallery (before/after) | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 5: REAL ESTATE AGENTS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $297 |
| Basic | $97/month |
| Premium | $297/month |
| Upsells | Lead gen ($247/mo), IDX website integration ($497), Social media automation ($197/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| License Type | Dropdown | Agent / Broker / Team Lead |
| MLS ID | Text | MLS identification |
| Service Areas | Multi-select | Zip codes or neighborhoods |
| Specialties | Multi-select | Residential, Commercial, Luxury, First-Time Buyers, Investment, Relocation |
| Transaction Volume (Annual) | Dropdown | 1-10 / 11-25 / 26-50 / 50+ |
| Designations | Multi-select | CRS, ABR, GRI, SRES, SFR |

## Pipelines
**Sales:** Lead → Contacted → Meeting Scheduled → Proposal Sent → Won → Lost
**Service:** Onboarding → Profile Live → Active Agent → Top Producer → Renewal

## Kickoff Form
```json
{
  "fields": [
    {"name": "Agent/Broker Name", "type": "text", "required": true},
    {"name": "Brokerage", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "License Type", "type": "dropdown", "options": ["Agent", "Broker", "Team Lead"]},
    {"name": "Service Areas", "type": "text"},
    {"name": "Specialties", "type": "multi_select"},
    {"name": "Annual Transaction Volume", "type": "dropdown"}
  ]
}
```

## Project Template: "Real Estate Agent Onboarding"
| Task | Duration |
|------|----------|
| License Verification | 2 days |
| Profile & Headshot Setup | 3 days |
| Listing Showcase Configuration | 3 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 6: PROPERTY MANAGEMENT

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $397 |
| Basic | $147/month |
| Premium | $347/month |
| Upsells | Tenant screening integration ($197/mo), Maintenance dispatch ($247/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Property Types | Multi-select | Single Family, Multi-Family, Commercial, HOA, Vacation/Short-Term |
| Units Under Management | Dropdown | 1-10 / 11-50 / 51-200 / 200+ |
| License Number | Text | Property management license |
| Services Offered | Multi-select | Tenant Placement, Maintenance, Accounting, Eviction, Marketing |
| Management Fee Structure | Dropdown | Flat Fee / % of Rent / Hybrid |
| Software Used | Multi-select | AppFolio, Buildium, Rent Manager, Other |

## Pipelines
**Sales:** Lead → Contacted → Property Assessment → Proposal → Won → Lost
**Service:** Onboarding → Portfolio Setup → Active Management → Review → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Company Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Property Types Managed", "type": "multi_select"},
    {"name": "Total Units Under Management", "type": "dropdown"},
    {"name": "Service Area", "type": "text"},
    {"name": "Management Fee Structure", "type": "dropdown"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| License & Insurance Verification | 2 days |
| Portfolio & Property Type Setup | 3 days |
| Property Photo Gallery | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 7: IMMIGRATION LEGAL SERVICES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $497 |
| Basic | $197/month |
| Premium | $497/month |
| Upsells | Lead gen ($297/mo), Multi-language portal ($297), Case status automation ($197/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Practice Areas | Multi-select | Family-Based, Employment-Based, Asylum/Refugee, Deportation Defense, Naturalization, Business Immigration, Student Visas |
| Bar Admissions | Multi-select | State(s) of admission |
| Languages Spoken | Multi-select | English, Spanish, Mandarin, Hindi, Arabic, Portuguese, French, Other |
| AILA Member | Checkbox | American Immigration Lawyers Association |
| Case Types | Multi-select | Green Cards, H-1B, L-1, O-1, EB-5, DACA, TPS |
| Consultation Fee | Dropdown | Free / $50-$100 / $100-$250 / $250+ |

## Pipelines
**Sales:** Lead → Consultation Booked → Consultation Complete → Retainer Sent → Retained → Lost
**Service:** Onboarding → Profile Setup → Active Listing → Premium Partner → Renewal

## Kickoff Form
```json
{
  "fields": [
    {"name": "Firm Name", "type": "text", "required": true},
    {"name": "Attorney Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Practice Areas", "type": "multi_select"},
    {"name": "Languages Spoken", "type": "multi_select"},
    {"name": "Bar Number", "type": "text"},
    {"name": "Consultation Fee", "type": "dropdown"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Bar Admission Verification | 3 days |
| Profile & Practice Area Setup | 3 days |
| Client Testimonial Collection | 7 days |
| Multi-Language Configuration | 2 days |
| Go-Live | 1 day |

---

# PACK 8: TAX & ACCOUNTING FIRMS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $397 |
| Basic | $147/month |
| Premium | $397/month |
| Upsells | Lead gen ($247/mo), Tax season surge ads ($497/season), Client portal ($297) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Services | Multi-select | Tax Preparation, Bookkeeping, Payroll, Audit, Advisory, Estate Planning, Business Formation |
| Certifications | Multi-select | CPA, EA, CMA, CFP, CGMA |
| Client Types | Multi-select | Individual, Small Business, Corporation, Nonprofit, High Net Worth |
| Software Platforms | Multi-select | QuickBooks, Xero, FreshBooks, Sage, TaxSlayer, Drake |
| Firm Size | Dropdown | Solo / 2-5 / 6-20 / 20+ |
| Tax Season Availability | Checkbox | Extended hours Jan-Apr |

## Pipelines
**Sales:** Lead → Contacted → Consultation → Proposal → Won → Lost
**Service:** Onboarding → Credential Verification → Active Listing → Tax Season Featured → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Firm Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Services Offered", "type": "multi_select"},
    {"name": "Certifications", "type": "multi_select"},
    {"name": "Client Types Served", "type": "multi_select"},
    {"name": "PTIN Number", "type": "text"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Credential & PTIN Verification | 3 days |
| Profile & Service Setup | 3 days |
| Client Review Collection | 7 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 9: MEDICAL BILLING SERVICES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $497 |
| Basic | $197/month |
| Premium | $497/month |
| Upsells | Practice management integration ($297/mo), Compliance audit automation ($197/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Specialties Served | Multi-select | Family Practice, Dental, Mental Health, Chiropractic, Dermatology, Orthopedics, Multi-Specialty |
| Certifications | Multi-select | CPC, CCS, CMRS, RHIT, AAPC Member |
| EHR/PM Systems | Multi-select | Epic, Cerner, athenahealth, AdvancedMD, Kareo, DrChrono |
| Services | Multi-select | Claims Submission, Denial Management, Credentialing, AR Recovery, Coding, Compliance |
| Clients Under Management | Dropdown | 1-5 / 6-20 / 21-50 / 50+ |
| HIPAA Compliant | Checkbox | Required — verified compliance |

## Pipelines
**Sales:** Lead → Contacted → Needs Assessment → Proposal → Won → Lost
**Service:** Onboarding → Compliance Check → Active Listing → Verified Partner → Annual Review

## Kickoff Form
```json
{
  "fields": [
    {"name": "Company Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Specialties Served", "type": "multi_select"},
    {"name": "Certifications", "type": "multi_select"},
    {"name": "EHR/PM Systems", "type": "multi_select"},
    {"name": "HIPAA Compliant", "type": "checkbox"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Certification & HIPAA Verification | 3 days |
| Profile & Specialty Setup | 3 days |
| Case Study / Testimonial Collection | 7 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 10: HOME CLEANING SERVICES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $197 |
| Basic | $67/month |
| Premium | $197/month |
| Upsells | Lead gen ($147/mo), Booking automation ($97/mo), Review management ($67/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Service Types | Multi-select | Regular Cleaning, Deep Cleaning, Move-In/Out, Post-Construction, Commercial, Green/Eco |
| Insurance Verified | Checkbox | Bonded and insured |
| Team Size | Dropdown | Solo / 2-5 / 6-10 / 10+ |
| Service Radius | Dropdown | 10mi / 25mi / 50mi |
| Supplies Provided | Checkbox | Brings own cleaning supplies |
| Background Checked | Checkbox | All staff background checked |

## Pipelines
**Sales:** Lead → Contacted → Estimate Scheduled → Proposal → Won → Lost
**Service:** Onboarding → Verification → Active Listing → Featured Cleaner → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Business Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Service Types", "type": "multi_select"},
    {"name": "Service Area (ZIP Codes)", "type": "text"},
    {"name": "Team Size", "type": "dropdown"},
    {"name": "Insurance & Bonding", "type": "checkbox"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Insurance & Background Verification | 2 days |
| Profile & Service Setup | 2 days |
| Photo Gallery (clean results) | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 11: LANDSCAPING SERVICES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $247 |
| Basic | $97/month |
| Premium | $247/month |
| Upsells | Seasonal campaign automation ($147/mo), Lead gen ($197/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Services | Multi-select | Lawn Care, Hardscaping, Irrigation, Tree Service, Snow Removal, Design, Commercial Maintenance |
| License Number | Text | Landscaping/pesticide applicator license |
| Equipment Owned | Multi-select | Commercial Mowers, Excavators, Trucks, Trailers |
| Service Radius | Dropdown | 10mi / 25mi / 50mi |
| Seasonal Services | Multi-select | Spring Cleanup, Summer Maintenance, Fall Leaf Removal, Winter Snow |
| Insurance Verified | Checkbox | |

## Pipelines
**Sales:** Lead → Contacted → Site Visit → Estimate Sent → Won → Lost
**Service:** Onboarding → Setup → Active → Seasonal Featured → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Business Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Services Offered", "type": "multi_select"},
    {"name": "Service Area", "type": "text"},
    {"name": "Years in Business", "type": "number"},
    {"name": "Residential or Commercial", "type": "dropdown", "options": ["Residential", "Commercial", "Both"]}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Insurance & License Verification | 2 days |
| Profile & Service Setup | 3 days |
| Before/After Project Gallery | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 12: AUTO REPAIR SHOPS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $297 |
| Basic | $97/month |
| Premium | $297/month |
| Upsells | Lead gen ($197/mo), Appointment booking automation ($147/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Services | Multi-select | General Repair, Transmission, Brakes, Engine, Electrical, Body Work, Tires, Oil Change, Diagnostics |
| Certifications | Multi-select | ASE Certified, AAA Approved, Manufacturer Certified, I-CAR |
| Makes Serviced | Multi-select | All Makes, Domestic, Import, European, Luxury, Diesel, Hybrid/EV |
| Warranty Offered | Checkbox | Parts and labor warranty |
| Bays/Lifts | Dropdown | 1-3 / 4-8 / 9-15 / 15+ |
| Towing Available | Checkbox | |

## Pipelines
**Sales:** Lead → Contacted → Shop Visit → Proposal → Won → Lost
**Service:** Onboarding → Certification Verification → Active → Featured Shop → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Shop Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Services Offered", "type": "multi_select"},
    {"name": "Certifications", "type": "multi_select"},
    {"name": "Makes Serviced", "type": "multi_select"},
    {"name": "Years in Business", "type": "number"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| ASE/Certification Verification | 2 days |
| Profile & Service Menu Setup | 3 days |
| Shop Photo Gallery | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 13: CHILDCARE PROVIDERS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $297 |
| Basic | $97/month |
| Premium | $247/month |
| Upsells | Parent review management ($97/mo), Enrollment automation ($147/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Care Type | Multi-select | Daycare Center, Home Daycare, Preschool, After School, Nanny Agency, Special Needs |
| Age Groups | Multi-select | Infant (0-1), Toddler (1-3), Preschool (3-5), School Age (5-12) |
| License Number | Text | State childcare license |
| Capacity | Number | Maximum children |
| Curriculum | Multi-select | Montessori, Reggio Emilia, Play-Based, STEM, Religious, Waldorf |
| Subsidy Accepted | Checkbox | Accepts government childcare assistance |

## Pipelines
**Sales:** Lead → Contacted → Tour Scheduled → Application → Enrolled → Lost
**Service:** Onboarding → License Verification → Active Listing → Featured Provider → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Center/Provider Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Care Type", "type": "multi_select"},
    {"name": "Age Groups Served", "type": "multi_select"},
    {"name": "License Number", "type": "text"},
    {"name": "Capacity", "type": "number"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| License & Background Check Verification | 3 days |
| Profile & Curriculum Setup | 3 days |
| Facility Photo Tour | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 14: FITNESS COACHES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $197 |
| Basic | $67/month |
| Premium | $197/month |
| Upsells | Lead gen ($147/mo), Booking automation ($97/mo), Content repurposing ($147/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Modality | Multi-select | Personal Training, Group Fitness, Yoga, Pilates, CrossFit, Nutrition Coaching, Sports Performance |
| Certifications | Multi-select | NASM, ACE, ISSA, NSCA, CSCS, RYT-200, Precision Nutrition |
| Training Format | Dropdown | In-Person / Online / Both |
| Specializations | Multi-select | Weight Loss, Muscle Building, Rehab/Injury Recovery, Pre/Post-Natal, Senior Fitness, Youth |
| Experience Level | Dropdown | 1-3 years / 3-5 years / 5-10 years / 10+ years |
| Virtual Available | Checkbox | |

## Pipelines
**Sales:** Lead → Contacted → Free Consultation → Proposal → Won → Lost
**Service:** Onboarding → Credential Check → Active Listing → Featured Coach → Premium Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Name/Business Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Modality", "type": "multi_select"},
    {"name": "Certifications", "type": "multi_select"},
    {"name": "Training Format", "type": "dropdown"},
    {"name": "Specializations", "type": "multi_select"},
    {"name": "Location/Service Area", "type": "text"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Certification Verification | 2 days |
| Profile & Transformation Gallery | 3 days |
| Video Introduction Upload | 5 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 15: DIGITAL MARKETING AGENCIES

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $497 |
| Basic | $197/month |
| Premium | $497/month |
| Upsells | Lead gen ($297/mo), White-label client portal ($497), Case study production ($247) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Services | Multi-select | SEO, PPC, Social Media, Content Marketing, Email Marketing, Web Design, Branding, Video |
| Industries Served | Multi-select | E-commerce, SaaS, Healthcare, Real Estate, Legal, Local Business |
| Team Size | Dropdown | Solo / 2-5 / 6-15 / 15-50 / 50+ |
| Minimum Retainer | Dropdown | Under $1K / $1K-$3K / $3K-$10K / $10K+ |
| Google Partner | Checkbox | |
| Case Studies Available | Number | Count of published case studies |

## Pipelines
**Sales:** Lead → Contacted → Portfolio Review → Proposal → Won → Lost
**Service:** Onboarding → Portfolio Setup → Active Listing → Verified Agency → Agency Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Agency Name", "type": "text", "required": true},
    {"name": "Contact Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Services Offered", "type": "multi_select"},
    {"name": "Industries Served", "type": "multi_select"},
    {"name": "Team Size", "type": "dropdown"},
    {"name": "Portfolio/Website URL", "type": "url"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| Portfolio & Credential Review | 3 days |
| Profile & Case Study Setup | 3 days |
| Client Testimonial Collection | 7 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# PACK 16: CONSTRUCTION CONTRACTORS

## Offer Structure
| Package | Price |
|---------|-------|
| Setup | $397 |
| Basic | $147/month |
| Premium | $397/month |
| Upsells | Project showcase ($197/mo), Lead gen ($297/mo), Bid management ($247/mo) |

## Custom Fields
| Field Name | Type | Options |
|------------|------|---------|
| Trade Type | Multi-select | General Contractor, Electrical, Plumbing, HVAC, Framing, Concrete, Demolition, Excavation |
| License Number | Text | Contractor license |
| Bond Amount | Dropdown | $25K / $50K / $100K / $250K / $500K+ |
| Insurance Verified | Checkbox | General liability + workers comp |
| Project Size Range | Dropdown | Under $25K / $25K-$100K / $100K-$500K / $500K-$1M / $1M+ |
| OSHA Certified | Checkbox | |

## Pipelines
**Sales:** Lead → Contacted → Site Visit → Bid Submitted → Won → Lost
**Service:** Onboarding → License/Bond Verification → Active Listing → Preferred Contractor → Annual Partner

## Kickoff Form
```json
{
  "fields": [
    {"name": "Company Name", "type": "text", "required": true},
    {"name": "Owner Name", "type": "text", "required": true},
    {"name": "Email", "type": "email", "required": true},
    {"name": "Phone", "type": "phone", "required": true},
    {"name": "Trade Types", "type": "multi_select"},
    {"name": "License Number", "type": "text"},
    {"name": "Bond Amount", "type": "dropdown"},
    {"name": "Typical Project Size", "type": "dropdown"}
  ]
}
```

## Project Template
| Task | Duration |
|------|----------|
| License, Bond & Insurance Verification | 3 days |
| Profile & Trade Setup | 3 days |
| Project Portfolio (photos + descriptions) | 7 days |
| Portal Training | 1 day |
| Go-Live | 1 day |

---

# REPLICATION GUIDE

## How to Deploy a New Niche

1. **Create Custom Fields** → Settings → CRM → Custom Fields > Target → Add niche-specific fields from pack
2. **Create Pipelines** → CRM → Deals → New Pipeline → Add stages from pack
3. **Create Circles** → CRM → Circles → Create `[Niche]-Free`, `[Niche]-Basic`, `[Niche]-Premium`, `[Niche]-Churned`, `[Niche]-VIP`
4. **Create Kickoff Form** → Forms → New Kickoff Form → Add fields from pack → Set role=Lead, Circle=`[Niche]-Free`, trigger Folder Generator + FLOW
5. **Create Project Template** → Projects → Templates → Add tasks from pack
6. **Create Onboarding FLOW** → Onboarding → FLOWs → New → 6-step standard FLOW with niche-specific form
7. **Configure n8n** → Update webhook to include niche identifier → Route to correct Circle/Pipeline
8. **Customize Emails** → Update email templates with niche-specific copy angles
9. **Test** → Submit test lead through Kickoff Form → Verify full lifecycle

## Time per Niche Deployment: 2-4 hours (after first niche is fully built)

---

# DEPLOYMENT ORDER (RECOMMENDED)

| Priority | Niches | Rationale |
|----------|--------|-----------|
| Week 1 | Plumbing (Pack 1) | First niche — build and perfect the full stack |
| Week 2 | HVAC, Pest Control, Roofing (Packs 2-4) | Home services cluster — similar structure, fast replication |
| Week 3 | Real Estate, Property Mgmt (Packs 5-6) | Real estate cluster |
| Week 4 | Immigration, Tax/Accounting (Packs 7-8) | Professional services cluster |
| Week 5 | Medical Billing, Cleaning, Landscaping (Packs 9-11) | Mixed services |
| Week 6 | Auto Repair, Childcare, Fitness (Packs 12-14) | Consumer services |
| Week 7 | Digital Marketing, Construction (Packs 15-16) | Final niches + refinement |

---

*Each niche pack uses the same backbone infrastructure from the Full Deployment System. The backbone is built once (Phase 1). These packs are the niche-specific overlays deployed in Phase 2.*
