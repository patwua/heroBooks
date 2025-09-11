---
id: till-variance-analytics-template-caribbean
slug: till-variance-analytics-template-caribbean
title: Till variance analytics — template & patterns (Caribbean)
summary: "CSV template to analyze till variances by cashier/day/time with patterns to watch (refund spikes, no-sales bursts, deposit mismatches)."
level: Beginner
audience: [Owner, Accountant, Controller]
format: Guide
category_id: cash
tags: [till variance, analytics, refunds, voids, deposits, CSV]
jurisdiction: [Caribbean]
last_reviewed: '2025-09-10'
sources:
  - title: "ACFE - Anti-fraud data analytics tests"
    url: https://www.acfe.com/fraud-resources/fraud-risk-tools---coso/anti-fraud-data-analytics-tests
    publisher: ACFE
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Where is the template?
    answer: "Download /kb/templates/till-variance-analytics.csv and pivot by cashier/day/hour and reason code."
    type: howto
---

This page provides analytics. For the daily reconciliation flow (G$), see `kb/articles/till-variance-reconciliation-gyd.md`.

## CSV columns
`date, shift, cashier, pos_id, reason_code, amount, direction (over/short), payment_type (cash/card), hour, customer_id, notes`

## Patterns to watch
Refund spikes; late‑night no‑sales; voids near shift end; deposit mismatches; repeated “change fund errors”.

## See also
– Reconciliation (G$): `kb/articles/till-variance-reconciliation-gyd.md`

