# Assistance Sidebar Content Spec

## 1) Tips & Nudges

### Format

- **id**: stable string
- **title**: short, action-oriented
- **body**: one sentence max
- **cta_label**
- **cta_href**
- **audience**: tags (e.g., "retail" | "salon" | "logistics" | "dealership" | "real_estate" | "school" | "general")
- **triggers**: array of simple conditions Codex can map to existing analytics/state (examples below)
- **priority**: 1–5 (1 highest)
- **cooldown_days**: don’t re-show within N days after user closes
- **expires_at** (optional): ISO string

### Trigger examples

- `first_login=true`
- `invoices.count_last_30=0`
- `vat.rate_configured=false`
- `paye.enabled=false`
- `nis.enabled=false`
- `bank.connections=0`
- `vendors.count=0`
- `customers.count=0`
- `inventory.module_enabled=true && items.count=0`
- `role=admin`
- `role=member`
- `org.age_days<14`
- `org.industry in [...]`

### Seed tips

- **tip_setup_vat**
  - Title: Set up VAT for Guyana
  - Body: Add your VAT rate and tax codes so invoices are compliant from day one.
  - CTA: Configure VAT → /dashboard/settings/taxes
  - Audience: general
  - Triggers: `vat.rate_configured=false`
  - Priority: 1
  - Cooldown: 7

- **tip_import_bank**
  - Title: Import your first bank file
  - Body: Bring in CSV/OFX to reconcile sales and expenses in minutes.
  - CTA: Import now → /dashboard/import
  - Audience: general
  - Triggers: `bank.connections=0`
  - Priority: 1
  - Cooldown: 7

- **tip_new_invoice**
  - Title: Create your first invoice
  - Body: Send a VAT-ready invoice and track payment status automatically.
  - CTA: New invoice → /dashboard/invoices/new
  - Audience: general
  - Triggers: `invoices.count_last_30=0`
  - Priority: 2
  - Cooldown: 5

- **tip_add_customer**
  - Title: Add your first customer
  - Body: Save customer details once—use them on quotes and invoices.
  - CTA: Add customer → /dashboard/customers/new
  - Audience: general
  - Triggers: `customers.count=0`
  - Priority: 2
  - Cooldown: 5

- **tip_invite_accountant**
  - Title: Invite your accountant
  - Body: Share read-only access and get expert eyes on your books.
  - CTA: Send invite → /dashboard/settings/team
  - Audience: general
  - Triggers: `role=admin`
  - Priority: 2
  - Cooldown: 14

- **tip_enable_paye**
  - Title: Turn on PAYE
  - Body: Calculate PAYE on payroll with correct thresholds and remittances.
  - CTA: Enable PAYE → /dashboard/settings/payroll
  - Audience: general
  - Triggers: `paye.enabled=false`
  - Priority: 2
  - Cooldown: 7

- **tip_enable_nis**
  - Title: Turn on NIS
  - Body: Set NIS contributions so monthly deductions are always accurate.
  - CTA: Enable NIS → /dashboard/settings/payroll
  - Audience: general
  - Triggers: `nis.enabled=false`
  - Priority: 2
  - Cooldown: 7

- **tip_add_vendor**
  - Title: Add your first vendor
  - Body: Track bills and credit terms cleanly from the start.
  - CTA: Add vendor → /dashboard/vendors/new
  - Audience: general
  - Triggers: `vendors.count=0`
  - Priority: 3
  - Cooldown: 5

- **tip_setup_items**
  - Title: Set up products & services
  - Body: Predefine items to speed up quoting and invoicing.
  - CTA: Add item → /dashboard/items/new
  - Audience: retail | salon | dealership | logistics
  - Triggers: `inventory.module_enabled=true && items.count=0`
  - Priority: 3
  - Cooldown: 7

- **tip_recurring_invoices**
  - Title: Automate recurring invoices
  - Body: Schedule invoices for subscriptions or rentals to save time.
  - CTA: Create schedule → /dashboard/invoices/recurring/new
  - Audience: real_estate | school | general
  - Triggers: `invoices.count>=1 && recurring.count=0`
  - Priority: 3
  - Cooldown: 14

- **tip_quote_to_invoice**
  - Title: Convert quotes to invoices
  - Body: Win the job, click once, and bill it—no retyping.
  - CTA: See quotes → /dashboard/quotes
  - Audience: construction | logistics | dealership
  - Triggers: `quotes.count>=1 && invoices.from_quotes_ratio<0.2`
  - Priority: 3
  - Cooldown: 10

- **tip_file_reminder_vat**
  - Title: VAT return reminder
  - Body: Set a monthly reminder so VAT filings never slip.
  - CTA: Add reminder → /dashboard/settings/notifications
  - Audience: general
  - Triggers: `vat.enabled=true && reminders.vat=false`
  - Priority: 4
  - Cooldown: 30

- **tip_bank_rules**
  - Title: Create bank rules
  - Body: Auto-categorize frequent transactions to reconcile faster.
  - CTA: Set rules → /dashboard/banking/rules
  - Audience: general
  - Triggers: `bank.connections>=1 && bank.rules=0`
  - Priority: 4
  - Cooldown: 14

- **tip_purchase_cogs**
  - Title: Track vehicle COGS (dealers)
  - Body: Attach purchase, duty, and reconditioning to each unit.
  - CTA: Add vehicle costs → /dashboard/inventory
  - Audience: dealership
  - Triggers: `org.industry=dealership && inventory.items_with_costs_ratio<0.8`
  - Priority: 2
  - Cooldown: 10

- **tip_projects_jobs**
  - Title: Use projects for jobs
  - Body: Track construction job costs and billing in one view.
  - CTA: Start a project → /dashboard/projects/new
  - Audience: construction
  - Triggers: `org.industry=construction && projects.count=0`
  - Priority: 3
  - Cooldown: 14


## 2) Announcements

### Format

- **id**
- **title**
- **body**
- **cta_label**
- **cta_href**
- **severity**: `info | success | warning | critical`
- **audience**
- **starts_at**
- **ends_at**
- **dismissible** (bool)

### Templates

- **Release Note (info/success)**
  - Title: New: Bank rules and recurring invoices
  - Body: Speed up reconciliation and automate billing with two fresh tools.
  - CTA: Learn more → /changelog/bank-rules-recurring
  - Audience: general
  - Window: this week
  - Dismissible: true

- **Maintenance (warning)**
  - Title: Scheduled maintenance — Sunday 2:00–3:00 AM
  - Body: heroBooks may be briefly unavailable during upgrades.
  - CTA: View status → /status
  - Audience: general
  - Dismissible: false (auto-hides after end)

- **Compliance Reminder (info)**
  - Title: Month-end VAT prep
  - Body: Reconcile bank feeds and review sales before filing.
  - CTA: Go to VAT → /dashboard/taxes/vat
  - Audience: general
  - Dismissible: true

- **Onboarding Nudge (success)**
  - Title: Finish setup in 3 steps
  - Body: Add VAT rate, import bank file, invite your accountant.
  - CTA: Continue setup → /dashboard/getting-started
  - Audience: `org.age_days<14`
  - Dismissible: true


## 3) Help/AI — Prompt Scaffold

- Assistant name: **heroBooks Assist (HBA)**
- System prompt: “You are heroBooks Assist (HBA), a concise, friendly accounting guide for small businesses in Guyana.
Your goal is to help users complete tasks in heroBooks and understand local compliance (VAT, PAYE, NIS).
Important: Provide practical steps and link to in-app locations. Be specific to heroBooks UI and Guyana rules.
You are not a lawyer or tax advisor. Include a short disclaimer when advice could be interpreted as legal/tax advice.
Prefer action over theory. If the user intent is an action (e.g., “make invoice”), surface a numbered checklist and a direct link.
Keep answers under 180 words unless the user asks for details.
If uncertain, say what you know, then propose next steps or where to check in heroBooks.
Use the user’s organization context to personalize suggestions.
Avoid admin-only routes unless the user has admin role.”

### Context injection (example keys)

```
org: { id, name, industry, age_days, country: "GY", vat_enabled, paye_enabled, nis_enabled }
user: { id, email, role }
metrics: {
  invoices_last_30, quotes_last_30, bank_connections,
  items_count, vendors_count, customers_count
}
reminders: { vat: bool, payroll: bool }
nav: {
  new_invoice: "/dashboard/invoices/new",
  taxes: "/dashboard/settings/taxes",
  import: "/dashboard/import",
  team: "/dashboard/settings/team",
  vendors: "/dashboard/vendors/new"
}
```

### Intent detection

- **ASK** (explain a concept): e.g., “How does VAT work in Guyana?”
- **DO** (guide to complete a task): e.g., “Create salary with PAYE”
- **FIX** (troubleshoot an error/state): e.g., “Invoice won’t send”

### Response pattern

- Title line (bold)
- 3–5 bullets or short steps
- One CTA link
- Add a one-liner disclaimer where relevant: “This is general information, not tax advice.”

### Tone & style

- Clear, local, respectful; no jargon unless necessary; use plain English.
- Avoid emojis; keep it professional but warm.

### Action suggestions

- Create invoice → /dashboard/invoices/new
- Configure VAT → /dashboard/settings/taxes
- Import bank file → /dashboard/import
- Invite accountant → /dashboard/settings/team
- Open payroll → /dashboard/settings/payroll

### Guardrails

- Don’t expose internal/admin endpoints to non-admins.
- For compliance questions, cite “Guyana” explicitly and remind about filing deadlines only if known/accurate.
- If data is missing (e.g., VAT not enabled), suggest enabling and link to settings.

### Example prompts → expected shape

- “Set up VAT for the first time” → short steps + link to /dashboard/settings/taxes
- “PAYE percentage for GY?” → brief explainer + “Enable PAYE” link; disclaimer
- “How do I track COGS for vehicles?” → steps + link to /dashboard/inventory


## 4) Hero & Testimonial Copy

### Hero themes

Use one CTA consistently: **Get started → /get-started** (Codex can override if needed).

- **Construction**
  - A Headline: Built for builders
  - A Subhead: Track jobs, invoices, and VAT with zero stress.
  - B Headline: From site to statement
  - B Subhead: Quote, bill, and reconcile every job—fast.

- **Salon**
  - A: Cuts, color—clean books
  - A Subhead: Stay on top of bookings, receipts, and PAYE.
  - B: Beauty in your books
  - B Subhead: Simple sales, staff, and payroll—done right.

- **Barbershop**
  - A: Sharp fades. Sharper books.
  - A Subhead: Simple invoicing, NIS, and cash-flow clarity.
  - B: Keep every cut accounted
  - B Subhead: Cash or card—balance it in minutes.

- **Logistics**
  - A: Move cargo, not spreadsheets
  - A Subhead: Quotes, deliveries, and compliance—one dashboard.
  - B: Keep wheels and books rolling
  - B Subhead: Price jobs, bill fast, reconcile quicker.

- **Dealership**
  - A: Sell cars, not chaos
  - A Subhead: Inventory, COGS, invoices, and VAT built-in.
  - B: Your DMS, simplified
  - B Subhead: Units, reconditioning, and margins in one view.

- **Accounting**
  - A: Guyana-ready accounting
  - A Subhead: VAT, PAYE, and NIS—done right for local rules.
  - B: Books that match GY reality
  - B Subhead: From tax codes to reports—clean and compliant.

- **Real estate**
  - A: Track rent the right way
  - A Subhead: Receipts, deposits, and owner reports—no fuss.
  - B: Property income, organized
  - B Subhead: Automate recurring bills and stay audit-ready.

- **School-board**
  - A: Simple books for schools
  - A Subhead: Grants, fees, and audits made transparent.
  - B: Accountability for every dollar
  - B Subhead: Track fees, expenses, and reports with ease.

- **Carwash**
  - A: Wash more, worry less
  - A Subhead: Daily sales, expenses, and VAT—tidy and clear.
  - B: Shine in your finances
  - B Subhead: Fast entries, faster insights, fewer errors.

### Testimonial cards

- **Format**: `name`, `role_location`, `quote` (≤160 chars), tone: authentic, concise.

- **shop-owner.webp**
  - Name: Sasha — Retail, Georgetown
  - Quote A: “heroBooks keeps my sales and VAT tidy—I finally know where I stand.”
  - Quote B: “Month-end used to scare me. Now I just reconcile and file.”

- **salon-owner.webp**
  - Name: Maya — Beauty, East Bank
  - Quote A: “I send invoices from my phone, and PAYE is no longer scary.”
  - Quote B: “Bookings and payroll in one place—clean, simple, done.”

- **transport-owner.webp**
  - Name: Devon — Logistics, Bartica Road
  - Quote A: “From quotes to delivery receipts—it’s all in one dashboard.”
  - Quote B: “Fewer spreadsheets, faster jobs, better cash flow.”

### Placement reminders

- Hero split layout at top of landing (image contained, copy column to the side; on mobile, stack).
- Testimonials below hero, randomized (1 or 2–3 cards).
- Right Assistance Sidebar on dashboard only (logged-in), top section is the randomized banner; beneath it: Help/AI box, Tips & Nudges, Announcements, Shortcuts. Sticky on desktop.

