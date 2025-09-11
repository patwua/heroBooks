---
id: pos-discrepancy-root-cause-gyd
slug: pos-discrepancy-root-cause-gyd
title: POS discrepancies — root-cause analysis and G$ fixes
summary: "Trace differences between POS Z-reports and bank/cash, identify causes (timing, refunds, chargebacks), and post clean G$ corrections."
level: Beginner
audience: [Owner, Accountant, Clerk]
format: Guide
category_id: cash
tags: [POS, discrepancy, refunds, chargebacks, reconciliation]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: "POS end-of-day practices (overview)"
    url: https://squareup.com/help/
    publisher: Square Docs
    date_accessed: '2025-09-10'
  - title: "Gateway disputes overview"
    url: https://www.visa.com/support/consumer/dispute-a-charge.html
    publisher: Visa
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Is there a CSV to log discrepancies?
    answer: "Download /kb/templates/pos-discrepancy-log.csv and track by date, cashier, reason, and resolution."
    type: howto
---

This page covers root‑cause and G$ fixes. For regional analytics patterns, see `kb/articles/pos-discrepancy-analytics-caribbean.md`.

## Why this matters (context)
Recurring differences between POS Z‑reports and bank/cash erode trust in reported sales, slow VAT filing, and mask fraud or process errors. The goal is to separate timing differences from true errors, fix the books, and prevent repeat issues.

## Steps
1) Align periods; compare POS Z-reports to bank/cash.  
2) Classify: timing (settlements), refunds/chargebacks, fees, cash over/short, miskeys.  
3) Post corrections and document.

## G$ journals (examples)
Bank fee missed: Dr Bank charges / Cr Bank.  
Chargeback: Dr Chargebacks / Cr Bank; recover if eligible.  
Cash over/short: Dr/Cr Cash over/short.

## CSV
`date, pos_id, cashier, discrepancy_amount, reason_code, resolution, notes`  
Download: `/kb/templates/pos-discrepancy-log.csv`

## See also
– Analytics (Caribbean): `kb/articles/pos-discrepancy-analytics-caribbean.md`
