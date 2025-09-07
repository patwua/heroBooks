# Internal Nav & Dashboard Cleanup Spec (Inside UX) – Rev.9/7

## A) Cleanup Tasks (Inside / Logged‑in)

Remove from dashboard content and top bar (inside experience):

1. All in‑content marketing banners on dashboard pages (keep Assistance Sidebar banner logic only).
2. The button dashboard widget and any Upgrade buttons in the top nav (inside).
3. The in‑page "Try estimates → invoices workflow today." bar.
4. The secondary Upgrade promo in dashboard:
   "Upgrade to unlock VAT automation & Bank Reconcile. Business includes PAYE/NIS summaries, custom branding, and priority support."
5. Duplicate logos in the top bar—unify to one.

Result: inside views use a single, unified top bar distinct from the marketing header.

## B) Internal Top Bar (App Header) — Spec

Goal: an accounting‑first header for logged‑in users, distinct from the outside/marketing header.

### Composition (left → center → right)

* **Left:** Full‑color heroBooks logo (single), links to `/dashboard`, never the outside homepage.
* **Center:** Global org‑scoped Search (always visible, not click‑to‑expand).
* **Right:**
  1. Dark mode toggle (icon button)
  2. Notifications bell (billing + server broadcasts only)
  3. User / Org menu (avatar or business logo circle)

### Behaviors

* Sticky at top across inside routes; 64–72px height target.
* Responsive:
  * md+: 3‑column layout as above.
  * sm: Search shrinks to full‑width row; bell + avatar stay on right.
* Keyboard: `Ctrl/⌘+K` focuses Search; `?` opens shortcut help (optional).
* Accessibility: semantic `<header>`, skip‑to‑content link, proper aria labels.

### Search (Center) — Org‑Scoped

Scope: Queries only the current org’s data (and the user’s own files, as applicable). No marketing results.

Entities to index (prioritized): Invoices, Quotes/Estimates, Bills, Payments, Transactions, Customers, Vendors, Items/Products, Projects/Jobs, Bank Rules, Reports, Help articles (inside docs only).

UX Patterns:

* Inline input with pill filters: `All`, `Invoices`, `Customers`, `Vendors`, `Bills`, `Reports`, `Help`.
* Results panel shows type badge, title/number, amount/date, status chip; `Enter` opens primary result.
* Quick actions (when no query): New Invoice, Import Bank File, Add Customer, Add Vendor.
* Empty state: “Try invoice number, customer name, or ‘bank rules’.”
* Errors: “Can’t reach search. Please try again.”

Microcopy: Placeholder → “Search your invoices, customers, bills, or help…”

Analytics: `search_open`, `search_query`, `search_result_open` with entity type.

### Notifications Bell (Right)

Types shown:

* Billing: upcoming invoices, failed payments, plan notices.
* Server Broadcasts: maintenance windows, system status, feature rollouts.

Types not shown here: account workflow notifications (tasks, reminders, mentions)—those live in the dashboard panes.

Panel content: list with icon, title, short body, timestamp, link to detail (opens in new tab when leaving core workflows).

Microcopy:

* Empty: “No billing or system notices.”
* Section headings (if grouped): “Billing”, “System”

Analytics: `notif_view`, `notif_click` (type, id).

### User / Org Menu (Rightmost)

Top: current business name + small business logo (selected org).

List:

* Switch organization list (other orgs with logo + name). Click switches context immediately.
* Divider
* Logout (only account action here)

Rules:

* This is the only place a user can switch org/business.
* If many orgs: include a search inside the menu; show recently used first.
* (Optional) “Manage organizations” link opens in a new tab to avoid losing context.

Microcopy:

* Menu title (visually hidden for a11y): “Account & organizations”
* Switch label (tooltip): “Switch organization”
* Logout confirm (optional): “You’re about to log out of heroBooks.”

Analytics: `org_switch_open`, `org_switch_select` { org_id }, `logout_click`.

### Dark Mode Toggle

* Persists per user (profile setting), falls back to system preference on first run.
* Microcopy (tooltip): “Toggle dark mode”.
* Analytics: `theme_toggle` { mode }.

## C) Dashboard Content Rules (Inside)

* No marketing banners within main dashboard content.
* Assistance Sidebar on the right remains as the home for banners (encouragement), Help/AI, Tips, Announcements, Shortcuts.
* Account workflow notifications (reminders, suggestions) render in dashboard panes or widgets—not in the top bar bell.
* Breadcrumbs (optional): `Dashboard / {Section} / {Detail}` for deep pages.

## D) Footer Bar (Inside)

* Footer remains visible for logged‑in users.
* All links open in a new tab/window; do not navigate away from accounting screens.
* Suggest `rel="noopener noreferrer"` for external links.
* Optional guard: if a link would navigate away in the same tab, show a light confirm: “Open this in a new tab to keep your work?”

Analytics: `footer_link_click_inside` { href, section }.

## E) Microcopy (Inside)

* Search placeholder: “Search your invoices, customers, bills, or help…”
* Notifications empty: “No billing or system notices.”
* Org menu:
  * Section label (a11y): “Account & organizations”
  * Current org hint: “Current organization”
  * Logout label: “Log out”
  * Logout confirm (opt): “You’re about to log out of heroBooks.”
* Dark mode tooltip: “Toggle dark mode”
* Footer hint (optional tiny text): “Links open in a new tab to keep your work in view.”

## F) Analytics (Events to wire)

* `hero_impression` (already defined for outside; unaffected here)
* `search_open`, `search_query`, `search_result_open` { entity }
* `notif_view`, `notif_click` { type }
* `org_switch_open`, `org_switch_select` { org_id }
* `logout_click`
* `theme_toggle` { mode }
* `footer_link_click_inside` { href, section }

## G) Acceptance Criteria

1. Inside dashboard has no in‑content marketing banners, no “button dashboard,” no Upgrade buttons, and the estimates→invoices bar is removed.
2. Single logo in the unified internal top bar; logo links to `/dashboard`.
3. Internal top bar contains centered org‑scoped Search, dark mode toggle, notifications bell (billing + broadcasts only), and user/org menu with org switching + logout.
4. Assistance Sidebar remains; account workflow notifications stay within dashboard panes.
5. Footer is visible inside; all footer links open in a new tab; no navigation away from accounting screens in the same tab.
6. Analytics events fire per spec.
7. Responsive, accessible, keyboard shortcuts work; no regressions to outside (marketing) header.

## H) Suggestions / Improvements

* Shortcut palette (optional): `Ctrl/⌘+J` to open a quick actions menu (New Invoice, Import Bank, Add Customer, Invite Accountant).
* Recent search memory: show last 5 queries per org.
* Org badges: show role (Owner/Admin/Member) in org list; lock switching if permission is missing.
* Unsaved changes guard: if user tries to switch org with dirty forms, prompt to save/discard.
* Performance: cache common search entities; throttle typeahead; prefetch detail pages on hover.
* A11y: ensure focus management on menu open/close and search results navigation.

## I) Inside vs Outside Separation

Ensure marketing header/footer are not reused inside. Use a dedicated App Layout for inside routes so styles/slots don’t leak.
