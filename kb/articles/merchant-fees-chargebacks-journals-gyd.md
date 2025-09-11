---
id: merchant-fees-chargebacks-journals-gyd
slug: merchant-fees-chargebacks-journals-gyd
title: Merchant fees & chargebacks — G$ journals and controls
summary: "Post monthly merchant fees, daily settlements, and chargebacks with G$ entries; reconcile to gateway reports and bank statements."
level: Beginner
audience: [Owner, Accountant, Clerk]
format: Guide
category_id: cash
tags: [merchant fees, chargebacks, settlements, bank reconciliation]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: "Gateway settlement reporting (overview)"
    url: https://stripe.com/docs/reports
    publisher: Stripe Docs
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Is there a CSV import for fees?
    answer: "Use /kb/templates/merchant-fees-import.csv to post fees/chargebacks against daily settlements."
    type: howto
---

This page covers G$ journals. For analytics/patterns, see `kb/articles/merchant-fees-chargebacks-analytics-caribbean.md`.

## G$ journals (examples)
Monthly fee: Dr Bank charges 18,000 / Cr Bank 18,000.  
Settlement net of fees: Dr Bank 96,000 / Dr Bank charges 4,000 / Cr Card clearing 100,000.  
Chargeback: Dr Chargebacks 20,000 / Cr Bank 20,000; pursue recovery if eligible.

## Controls
Reconcile gateway reports to bank, investigate repeated chargebacks, ensure refunds are matched to original transactions.

## See also
– Analytics & template (regional): `kb/articles/merchant-fees-chargebacks-analytics-caribbean.md`

