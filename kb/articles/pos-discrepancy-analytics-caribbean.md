---
id: pos-discrepancy-analytics-caribbean
slug: pos-discrepancy-analytics-caribbean
title: POS discrepancies — analytics & patterns (Caribbean)
summary: "Analyze recurring POS differences: late settlements, refund spikes, no-sales bursts, and fee mismatches. Includes a discrepancy log CSV."
level: Beginner
audience: [Owner, Accountant, Controller]
format: Guide
category_id: cash
tags: [POS, discrepancy, analytics, refunds, settlements]
jurisdiction: [Caribbean]
last_reviewed: '2025-09-10'
sources:
  - title: "ACFE - Anti-fraud data analytics tests"
    url: https://www.acfe.com/fraud-resources/fraud-risk-tools---coso/anti-fraud-data-analytics-tests
    publisher: ACFE
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Where is the log CSV?
    answer: "Use /kb/templates/pos-discrepancy-log.csv and pivot by reason_code and cashier/day to find patterns."
    type: howto
---

This page provides analytics. For G$ fixes, see `kb/articles/pos-discrepancy-root-cause-gyd.md`.

## Patterns
Late settlements on weekends/holidays; refunds concentrated by cashier; chargebacks cluster by SKU; missing fee postings at month-end.

## CSV
Columns: `date, pos_id, cashier, discrepancy_amount, reason_code, resolution, notes`  
[Click here to download the discrepancy log](/kb/templates/pos-discrepancy-log.csv)

## See also
– GY root‑cause and fixes — [click here](/kb/pos-discrepancy-root-cause-gyd)
