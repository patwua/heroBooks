---
id: till-variance-reconciliation-gyd
slug: till-variance-reconciliation-gyd
title: Till variance reconciliation — cash, cards and vouchers (G$)
summary: "Daily/shift reconciliation flow with G$ examples, from POS Z-report to bank deposit, including common variance codes and journal entries."
level: Beginner
audience: [Owner, Clerk, Accountant]
format: Guide
category_id: cash
tags: [till variance, POS, Z-report, bank deposit, reconciliation]
jurisdiction: [Guyana]
last_reviewed: '2025-09-10'
sources:
  - title: "POS end-of-day practices (overview)"
    url: https://squareup.com/help/
    publisher: Square
    date_accessed: '2025-09-10'
kb_snippets:
  - question: Is there a CSV to analyze variances?
    answer: "Use the regional analytics template at /kb/templates/till-variance-analytics.csv to trend issues by cashier/day."
    type: howto
---

This page covers the reconciliation flow. For analytics templates/patterns, see `kb/articles/till-variance-analytics-template-caribbean.md`.

## Flow (daily)
1) POS Z‑report: cash/cards/vouchers totals.  
2) Count cash: compare to POS; record over/short.  
3) Prepare deposit; match to next‑day bank.  
4) Investigate variances; code reasons; journal if needed.

## Common G$ journals
Cash short: Dr Cash over/short 1,200 / Cr Cash 1,200.  
Bank fee not recorded: Dr Bank charges 1,200 / Cr Bank 1,200.  
Card payout timing: no journal (timing difference) — verify settlement next day.

## Variance codes
Over/short; late deposit; change fund error; voids/returns; payout without voucher.

## See also
– Analytics template (regional): `kb/articles/till-variance-analytics-template-caribbean.md`

