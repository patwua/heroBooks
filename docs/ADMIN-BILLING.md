# Admin Billing – How activation works

- A `CheckoutIntent` transitions to **paid** via:
  - PayPal capture success (`/api/paypal/capture`)
  - MMG webhook callback (`/api/webhooks/mmg`)
  - Manual admin action (`/api/admin/checkout-intents/:id/mark` with status=paid)

- On **paid**, we call `activateSubscriptionFromIntent(intentId)`:
  - If the paying user is member of exactly **one** org → create `OrgSubscription` with that `orgId` and `status="active"`.
  - If the user has **multiple** orgs → create a subscription with `status="pending_assignment"` and **no `orgId`**. An admin can later assign it (future UI).

- Every transition writes an `AuditLog` record so there’s a durable trail.

> Future improvements:
> - Add an Admin “Assign to Org” action for `pending_assignment` subscriptions.
> - Add renewal cron that extends `currentPeriodEnd` monthly while payment is valid.
> - Email real receipts via your SMTP (replace the console log in `email.ts`).
