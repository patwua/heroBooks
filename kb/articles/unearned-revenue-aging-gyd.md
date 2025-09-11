---
id: unearned-revenue-aging-gyd
slug: unearned-revenue-aging-gyd
title: Unearned revenue aging — deposits and deferrals (G$)
summary: "Track and age customer deposits and unearned revenue, recognize to income on delivery, and reconcile monthly. Includes G$ journals and a CSV ledger."
level: Beginner
audience: [Owner, Accountant, Clerk]
format: Guide
category_id: vat
tags: [unearned revenue, deposits, deferrals, aging]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: "IFRS for SMEs — Section 23 Revenue"
    url: https://www.ifrs.org/content/dam/ifrs/supporting-implementation/smes/module-23.pdf
    publisher: IFRS Foundation
    date_accessed: '2025-09-10'
kb_snippets:
  - question: How do I age unearned revenue?
    answer: "Use a ledger with receipt date, expected recognition date, and balance; review overdue deferrals and recognize when performance occurs."
    type: howto
---

This page covers G$ journals and aging. For policy/disclosures and templates, see `kb/articles/unearned-revenue-policy-disclosures-caribbean.md`.

## G$ journals
- Deposit received: Dr Bank / Cr Unearned revenue.  
- Recognize on delivery: Dr Unearned revenue / Cr Revenue.  
- Refund: Dr Unearned revenue / Cr Bank (and reverse VAT if applicable per time of supply rules).

## Aging and reconciliation
Maintain an aging by bucket (Current / 1–30 / 31–60 / 61–90 / 90+). Investigate long‑outstanding deferrals; tie opening + receipts − recognitions − refunds = closing.

## CSV ledger
Columns: `date_received, customer, reference, description, amount, currency, expected_recognition, recognized_date, recognized_amount, balance, notes`.  
[Click here to download the ledger template](/kb/templates/unearned-revenue-ledger.csv).

## See also
– Deposits & advance invoices (GY) — [click here](/kb/customer-deposits-advance-invoices-guyana)  
– Policy & disclosures (regional practices) — [click here](/kb/unearned-revenue-policy-disclosures-caribbean)

## Illustration
![Deposit to deferred to revenue timeline](/kb/illustrations/unearned-revenue.svg)
